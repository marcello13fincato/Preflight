
import { z } from "zod";

// Logger controllato: silenzia i log in produzione
const isProd = process.env.NODE_ENV === "production";
const logger = {
  log: (...args: any[]) => { if (!isProd) console.log(...args); },
  warn: (...args: any[]) => { if (!isProd) console.warn(...args); },
  error: (...args: any[]) => { if (!isProd) console.error(...args); }
};

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export async function generateWithLLM(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const msg = "OPENAI_API_KEY non configurata. Aggiungi la variabile d'ambiente per attivare l'AI.";
    logger.error("[AI]", msg);
    throw new Error(msg);
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  logger.log(`[AI] → OpenAI (model: ${model}) | prompt: ${prompt.length} chars`);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    const msg = `OpenAI HTTP ${res.status}: ${errText.slice(0, 300)}`;
    logger.error("[AI]", msg);
    throw new Error(msg);
  }

  const data = (await res.json()) as OpenAIResponse;
  const content = data.choices?.[0]?.message?.content ?? "";

  if (!content) {
    const msg = "OpenAI ha restituito una risposta vuota";
    console.error("[AI]", msg);
    throw new Error(msg);
  }

  logger.log("[AI] ← OpenAI response (first 300 chars):", content.slice(0, 300));
  return content;
}

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

export async function generateStructured<T>(params: {
  prompt: string;
  schema: z.ZodType<T>;
}): Promise<T> {
  logger.log("[AI] generateStructured — full prompt:\n", params.prompt);

  const first = await generateWithLLM(params.prompt);
  const firstParsed = safeJsonParse(first);
  const firstValid = params.schema.safeParse(firstParsed);
  if (firstValid.success) {
    logger.log("[AI] Schema validation: OK (attempt 1)");
    return firstValid.data;
  }

  logger.warn("[AI] Schema validation failed (attempt 1):", JSON.stringify(firstValid.error.flatten()));

  const retryPrompt = `${params.prompt}\n\nReturn valid JSON matching schema exactly.`;
  const second = await generateWithLLM(retryPrompt);
  const secondParsed = safeJsonParse(second);
  const secondValid = params.schema.safeParse(secondParsed);
  if (secondValid.success) {
    logger.log("[AI] Schema validation: OK (attempt 2)");
    return secondValid.data;
  }

  const validationErr = JSON.stringify(secondValid.error.flatten());
  logger.error("[AI] Schema validation failed (attempt 2):", validationErr);
  throw new Error(`La risposta dell'AI non corrisponde allo schema atteso: ${validationErr}`);
}

export const salesRules = [
  "Sei un consulente commerciale esperto di LinkedIn che aiuta a capire chi contattare, come iniziare conversazioni e come portarle avanti fino a una call.",
  "Il tuo tono è professionale, naturale, concreto e realistico. NON sembrare aggressivo, NON sembrare un marketer, NON sembrare un guru.",
  "I messaggi devono essere brevi (max 500 caratteri quando possibile).",
  "Nessun pitch diretto al primo contatto. Fai una domanda intelligente.",
  "Includi sempre una prossima azione con progressione chiara verso la call.",
  "Per le obiezioni, rispondi con calma e invita alla discussione.",
  "Allinea ogni output con offerta, ICP e obiezioni conosciute.",
  "Se il profilo utente è incompleto o mancano informazioni chiave (offerta, cliente ideale, contesto professionale, obiettivi), includi nel campo next_action una domanda naturale e breve per ottenere le informazioni mancanti.",
  "Usa sempre offerta, cliente ideale, contesto professionale e obiettivi dell'utente per personalizzare ogni suggerimento.",
  "Evita frasi cringe, motivazionali o aggressive come 'devi assolutamente', 'strategia definitiva', 'chiudi subito la call'.",
  "IMPORTANTE: Rispondi ESCLUSIVAMENTE in italiano. Ogni campo del JSON deve essere scritto in italiano.",
].join(" ");

export function formatProfileContext(profile: unknown): string {
  if (!profile || typeof profile !== "object") return "";
  const p = profile as Record<string, unknown>;
  const lines: string[] = [];
  if (p.servizio) lines.push(`- Servizio offerto: ${p.servizio}`);
  if (p.elevator_pitch) lines.push(`- Elevator pitch: ${p.elevator_pitch}`);
  if (p.settore) lines.push(`- Settore: ${p.settore}`);
  if (p.differenziatore) lines.push(`- Differenziatore unico: ${p.differenziatore}`);
  if (p.cliente_ideale) lines.push(`- Cliente ideale: ${p.cliente_ideale}`);
  if (p.dimensione_azienda) lines.push(`- Dimensione azienda target: ${p.dimensione_azienda}`);
  if (p.problema_cliente) lines.push(`- Problema del cliente: ${p.problema_cliente}`);
  if (p.risultato_cliente) lines.push(`- Risultato promesso: ${p.risultato_cliente}`);
  if (p.segnali_interesse) lines.push(`- Segnali di interesse: ${p.segnali_interesse}`);
  if (p.obiezione_frequente) lines.push(`- Obiezione più frequente: ${p.obiezione_frequente}`);
  if (p.modello_vendita) lines.push(`- Modello di vendita: ${p.modello_vendita}`);
  if (p.ticket_medio) lines.push(`- Ticket medio: ${p.ticket_medio}`);
  if (p.ciclo_vendita) lines.push(`- Ciclo di vendita: ${p.ciclo_vendita}`);
  if (p.tempo_settimanale) lines.push(`- Tempo settimanale su LinkedIn: ${p.tempo_settimanale}`);
  if (p.cta_preferita) lines.push(`- CTA preferita: ${p.cta_preferita}`);
  if (p.linkedin_url) lines.push(`- Profilo LinkedIn: ${p.linkedin_url}`);
  if (p.sito_web) lines.push(`- Sito web: ${p.sito_web}`);
  const links = p.linkedin_search_links;
  if (Array.isArray(links) && links.filter(Boolean).length > 0) {
    lines.push(`- Ricerche LinkedIn target: ${links.filter(Boolean).join(", ")}`);
  }
  const materiali = p.materiali_nomi;
  if (Array.isArray(materiali) && materiali.filter(Boolean).length > 0) {
    lines.push(`- Materiali caricati: ${materiali.filter(Boolean).join(", ")}`);
  }
  // Backward compat: old schema fields
  if (!p.servizio && p.offer_one_liner) lines.push(`- Servizio: ${p.offer_one_liner}`);
  if (!p.cliente_ideale && p.icp_role) lines.push(`- Cliente ideale: ${p.icp_role}`);
  if (!p.problema_cliente && p.icp_main_problem) lines.push(`- Problema cliente: ${p.icp_main_problem}`);
  if (!p.risultato_cliente && p.offer_outcome) lines.push(`- Risultato: ${p.offer_outcome}`);
  return lines.length > 0 ? `PROFILO UTENTE (chi chiede il consiglio):\n${lines.join("\n")}` : "";
}
