import { z } from "zod";

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export async function generateWithLLM(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const msg = "OPENAI_API_KEY non configurata. Aggiungi la variabile d'ambiente per attivare l'AI.";
    console.error("[AI]", msg);
    throw new Error(msg);
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  console.log(`[AI] → OpenAI (model: ${model}) | prompt: ${prompt.length} chars`);

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
    console.error("[AI]", msg);
    throw new Error(msg);
  }

  const data = (await res.json()) as OpenAIResponse;
  const content = data.choices?.[0]?.message?.content ?? "";

  if (!content) {
    const msg = "OpenAI ha restituito una risposta vuota";
    console.error("[AI]", msg);
    throw new Error(msg);
  }

  console.log("[AI] ← OpenAI response (first 300 chars):", content.slice(0, 300));
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
  console.log("[AI] generateStructured — full prompt:\n", params.prompt);

  const first = await generateWithLLM(params.prompt);
  const firstParsed = safeJsonParse(first);
  const firstValid = params.schema.safeParse(firstParsed);
  if (firstValid.success) {
    console.log("[AI] Schema validation: OK (attempt 1)");
    return firstValid.data;
  }

  console.warn("[AI] Schema validation failed (attempt 1):", JSON.stringify(firstValid.error.flatten()));

  const retryPrompt = `${params.prompt}\n\nReturn valid JSON matching schema exactly.`;
  const second = await generateWithLLM(retryPrompt);
  const secondParsed = safeJsonParse(second);
  const secondValid = params.schema.safeParse(secondParsed);
  if (secondValid.success) {
    console.log("[AI] Schema validation: OK (attempt 2)");
    return secondValid.data;
  }

  const validationErr = JSON.stringify(secondValid.error.flatten());
  console.error("[AI] Schema validation failed (attempt 2):", validationErr);
  throw new Error(`La risposta dell'AI non corrisponde allo schema atteso: ${validationErr}`);
}

export const salesRules = [
  "Sei un LinkedIn Sales Strategist specializzato nell'acquisizione clienti per freelance e consulenti.",
  "I messaggi devono essere brevi (max 500 caratteri quando possibile).",
  "Nessun pitch diretto al primo contatto. Fai una domanda intelligente.",
  "Includi sempre una prossima azione con progressione commento→DM→call.",
  "Per le obiezioni, rispondi con calma e invita alla discussione.",
  "Allinea ogni output con offerta, ICP e obiezioni conosciute.",
  "Se il profilo utente è incompleto o mancano informazioni chiave (offerta, cliente ideale, contesto professionale, obiettivi), includi nel campo next_action una domanda naturale e breve per ottenere le informazioni mancanti. Esempio: 'Per aiutarti meglio, potrei sapere che tipo di clienti cerchi?' oppure 'Questo post è pensato per founder o per consulenti?'.",
  "Usa sempre offerta, cliente ideale, contesto professionale e obiettivi dell'utente per personalizzare ogni suggerimento.",
  "IMPORTANTE: Rispondi ESCLUSIVAMENTE in italiano. Ogni campo del JSON deve essere scritto in italiano.",
].join(" ");
