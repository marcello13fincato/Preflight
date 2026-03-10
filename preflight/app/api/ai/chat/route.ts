import { NextResponse } from "next/server";
import { z } from "zod";
import { generateWithLLM, salesRules, formatProfileContext } from "@/lib/ai/structured";

export const runtime = "nodejs";

const contextSchema = z.object({
  contentType: z.enum(["post", "commento", "messaggio"]),
  origin: z.enum(["scritto", "ricevuto"]),
  personProfile: z.string().max(1000).optional(),
});

const requestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional()
    .default([]),
  profile: z.unknown().optional(),
  context: contextSchema.optional(),
  advice: z.boolean().optional(),
  demo: z.boolean().optional(),
  linkedinUrl: z.string().max(500).optional(),
  profileInfo: z.string().max(2000).optional(),
  interactionType: z.string().max(100).optional(),
  whoWrote: z.string().max(100).optional(),
  assistantMode: z.enum(["profile", "advice"]).optional(),
});

function buildStructuredPrompt(
  message: string,
  ctx: z.infer<typeof contextSchema>,
  profile: unknown,
): string {
  const originLabel = ctx.origin === "scritto" ? "scritto dall'utente" : "ricevuto dall'utente";

  let analysisInstruction = "";
  if (ctx.origin === "scritto") {
    analysisInstruction = `
Dato che il testo è stato scritto dall'utente, includi anche un campo "analisi" con una micro-analisi del testo:
- Se è chiaro, troppo generico, troppo diretto, o se può funzionare meglio
- Suggerisci come migliorarlo se necessario`;
  } else {
    analysisInstruction = `
Dato che il testo è stato ricevuto, concentra la risposta su:
- Come rispondere in modo strategico
- Se conviene continuare la conversazione
- Se è il caso di spostarsi in DM
- Se è il momento di proporre una call
NON includere il campo "analisi" nel JSON.`;
  }

  return `${salesRules}

Sei l'Assistente Preflight, un assistente AI integrato nella piattaforma Preflight — un assistente che aiuta a capire chi contattare su LinkedIn, come iniziare una conversazione e come portarla avanti fino a una call.

CONTESTO della richiesta:
- Tipo di contenuto: ${ctx.contentType}
- Il testo è stato: ${originLabel}
${ctx.personProfile ? `- Profilo della persona coinvolta: ${ctx.personProfile}` : "- Profilo persona: non specificato"}
${formatProfileContext(profile)}

Il tuo compito:
Analizza il ${ctx.contentType} ${originLabel} e fornisci una risposta strutturata.
${analysisInstruction}

Rispondi SEMPRE in italiano. Sii breve, concreto e utile. Non fare pitch.
Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "risposta": "<risposta consigliata o suggerimento principale>",
  "perche": "<perché questa risposta può funzionare>",
  "prossima_mossa": "<cosa fare dopo>"${ctx.origin === "scritto" ? ',\n  "analisi": "<micro-analisi del testo scritto>"' : ""}
}

Testo da analizzare:
${message}`;
}

function buildProfileAnalysisPrompt(
  message: string,
  profile: unknown,
  demo: boolean,
  extra: { linkedinUrl?: string; profileInfo?: string },
): string {
  const depth = demo
    ? "Rispondi in modo sintetico ma completo. Massimo 2-3 frasi per sezione."
    : "Rispondi in modo approfondito e dettagliato. Fornisci analisi completa e suggerimenti concreti.";

  const extraContext = [
    extra.linkedinUrl ? `- Profilo LinkedIn della persona: ${extra.linkedinUrl}` : "",
    extra.profileInfo ? `- Informazioni sul profilo della persona: ${extra.profileInfo}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${salesRules}

Sei un consulente commerciale esperto di LinkedIn, integrato nella piattaforma Preflight — un assistente che aiuta a capire chi contattare su LinkedIn, come iniziare una conversazione e come portarla avanti fino a una call.

Il tuo approccio:
- Ragiona come un venditore esperto ma riflessivo
- Spiega il perché delle tue scelte
- Suggerisci approcci naturali, mai aggressivi
- L'obiettivo NON è vendere subito, ma portare la conversazione un passo più avanti
- Il contesto è SEMPRE LinkedIn: conversazioni brevi, tono naturale, niente pitch aggressivi

NON fare:
- Non sembrare aggressivo o da marketer
- Non sembrare un guru
- Non usare frasi cringe o motivazionali
- Evita "devi assolutamente", "strategia definitiva", "chiudi subito la call"

Il tono deve essere: professionale, calmo, realistico, concreto, naturale.

${depth}

${extraContext ? `CONTESTO aggiuntivo:\n${extraContext}` : ""}
${formatProfileContext(profile)}

Rispondi SEMPRE in italiano.
Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "nome_contatto": "<nome della persona analizzata, se desumibile>",
  "ruolo_contatto": "<ruolo o titolo professionale della persona, se desumibile>",
  "azienda_contatto": "<azienda della persona, se desumibile>",
  "chi_e": "<chi è questa persona: breve lettura del profilo, cosa fa, che tipo di figura è>",
  "ruolo_e_contesto": "<ruolo nella sua azienda, dimensione azienda, settore, fase in cui si trova>",
  "perche_buon_contatto": "<motivi concreti basati su profilo e contesto per cui potrebbe essere un buon contatto per te>",
  "strategia_contatto": "<strategia di contatto consigliata: commentare un suo post, scrivere in DM, interagire prima in modo leggero, aspettare una sua pubblicazione>",
  "primo_messaggio": "<primo messaggio consigliato, naturale e non aggressivo>",
  "followup_consigliato": "<messaggio follow-up naturale da inviare se non risponde entro 3-5 giorni>",
  "step_successivi": "<sequenza chiara di passi: Step 1, Step 2, Step 3, Step 4 — fino alla proposta di call>",
  "segnali_da_osservare": "<segnali concreti nel profilo o nel comportamento da osservare: segnali positivi, segnali deboli, cosa monitorare>"
}

Richiesta dell'utente:
${message}`;
}

function buildAdviceOnlyPrompt(
  message: string,
  profile: unknown,
  demo: boolean,
  extra?: { interactionType?: string; personProfile?: string },
): string {
  const depth = demo
    ? "Rispondi in modo sintetico ma completo. Massimo 2-3 frasi per sezione."
    : "Rispondi in modo approfondito e dettagliato. Fornisci analisi completa e suggerimenti concreti.";

  const extraContext = [
    extra?.interactionType ? `- Tipo di situazione: ${extra.interactionType}` : "",
    extra?.personProfile ? `- Profilo della persona coinvolta: ${extra.personProfile}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${salesRules}

Sei un consulente commerciale esperto di LinkedIn, integrato nella piattaforma Preflight — un assistente che aiuta a capire chi contattare su LinkedIn, come iniziare una conversazione e come portarla avanti fino a una call.

L'utente ti descrive una situazione reale su LinkedIn e vuole capire come muoversi.

Il tuo approccio:
- Ragiona come un venditore esperto ma riflessivo
- Spiega il perché delle tue scelte
- Suggerisci approcci naturali, mai aggressivi
- L'obiettivo NON è vendere subito, ma portare la conversazione un passo più avanti
- Il contesto è SEMPRE LinkedIn: conversazioni brevi, tono naturale, niente pitch aggressivi

NON fare:
- Non sembrare aggressivo o da marketer
- Non sembrare un guru
- Non usare frasi cringe o motivazionali
- Evita "devi assolutamente", "strategia definitiva", "chiudi subito la call"

Il tono deve essere: professionale, calmo, realistico, concreto, naturale.

${depth}

${extraContext ? `CONTESTO aggiuntivo:\n${extraContext}` : ""}
${formatProfileContext(profile)}

Rispondi SEMPRE in italiano.
Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "lettura_situazione": "<spiegazione breve di ciò che sta succedendo>",
  "strategia": "<direzione strategica chiara su cosa conviene fare adesso>",
  "risposta_consigliata": "<testo pronto da usare se serve, oppure indicazione concreta>",
  "followup_consigliato": "<messaggio o azione di follow-up da fare tra qualche giorno se non c'è risposta>",
  "step_successivi": "<sequenza di passi precisi: Step 1, Step 2, Step 3, Step 4 — fino alla proposta di call>",
  "errori_da_evitare": "<cosa NON fare in questa situazione e perché, errori comuni>"
}

Situazione descritta dall'utente:
${message}`;
}

function buildAdvicePrompt(
  message: string,
  profile: unknown,
  demo: boolean,
  extra: { linkedinUrl?: string; profileInfo?: string; interactionType?: string; whoWrote?: string },
): string {
  const depth = demo
    ? "Rispondi in modo sintetico ma completo. Massimo 2-3 frasi per sezione."
    : "Rispondi in modo approfondito e dettagliato. Fornisci analisi completa e suggerimenti concreti.";

  const extraContext = [
    extra.interactionType ? `- Tipo di interazione: ${extra.interactionType}` : "",
    extra.whoWrote ? `- Chi ha scritto: ${extra.whoWrote}` : "",
    extra.linkedinUrl ? `- Profilo LinkedIn della persona: ${extra.linkedinUrl}` : "",
    extra.profileInfo ? `- Informazioni sul profilo della persona: ${extra.profileInfo}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `${salesRules}

Sei un consulente commerciale esperto di LinkedIn, integrato nella piattaforma Preflight — un assistente che aiuta a capire chi contattare su LinkedIn, come iniziare una conversazione e come portarla avanti fino a una call.

L'utente ti descrive una situazione reale su LinkedIn e/o ti chiede di analizzare un profilo LinkedIn per capire come iniziare o continuare una conversazione.

Il tuo approccio:
- Ragiona come un venditore esperto e riflessivo
- Spiega il perché delle tue scelte
- Suggerisci approcci naturali, mai aggressivi
- L'obiettivo NON è vendere subito, ma portare la conversazione un passo più avanti
- Il contesto è SEMPRE LinkedIn: conversazioni brevi, tono naturale, niente pitch aggressivi

NON fare:
- Non sembrare aggressivo o da marketer
- Non sembrare un guru
- Non usare frasi cringe o motivazionali
- Evita "devi assolutamente", "strategia definitiva", "chiudi subito la call"

Il tono deve essere: professionale, calmo, realistico, concreto, naturale.

${depth}

${extraContext ? `CONTESTO aggiuntivo:\n${extraContext}` : ""}
${formatProfileContext(profile)}

Rispondi SEMPRE in italiano.
Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "valutazione": {
    "qualita": <numero da 1 a 10 che indica la qualità della conversazione>,
    "probabilita": "<percentuale indicativa di arrivare a una call, es. '35%'>"
  },
  "temperatura": {
    "stato": "<uno tra: Fredda, Neutra, Calda, Troppo presto per proporre una call>",
    "spiegazione": "<breve spiegazione della temperatura>"
  },
  "chi_e": "<analisi breve del profilo della persona: chi è, cosa fa, che ruolo ha>",
  "interessi": "<temi e problemi che potrebbero essere rilevanti per questa persona>",
  "perche_parlargli": "<spiegazione basata sul profilo e sul contesto del perché ha senso avviare una conversazione>",
  "strategia_contatto": "<metodo migliore per contattarlo: commentare un post, scrivere in DM, interagire prima con contenuti, aspettare un contenuto>",
  "primo_messaggio": "<primo messaggio consigliato, naturale e non aggressivo>",
  "prossima_mossa": "<come portare la conversazione verso una call>"
}

Situazione descritta dall'utente:
${message}`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { message, history, profile, context, advice, demo, linkedinUrl, profileInfo, interactionType, whoWrote } = parsed.data;

    /* ── Advice mode ("Chiedi un consiglio" / "Analizza profilo") ── */
    if (advice) {
      const assistantMode = parsed.data.assistantMode;
      let prompt: string;
      if (assistantMode === "profile") {
        prompt = buildProfileAnalysisPrompt(message, profile, !!demo, { linkedinUrl, profileInfo });
      } else if (assistantMode === "advice") {
        prompt = buildAdviceOnlyPrompt(message, profile, !!demo, { interactionType, personProfile: profileInfo });
      } else {
        prompt = buildAdvicePrompt(message, profile, !!demo, {
          linkedinUrl, profileInfo, interactionType, whoWrote,
        });
      }
      const raw = await generateWithLLM(prompt);
      try {
        const structured = JSON.parse(raw);
        return NextResponse.json({ reply: structured.chi_e || structured.lettura_situazione || structured.lettura, structured });
      } catch {
        return NextResponse.json({ reply: raw });
      }
    }

    /* ── Structured assistant mode (with context) ── */
    if (context) {
      const prompt = buildStructuredPrompt(message, context, profile);
      const raw = await generateWithLLM(prompt);
      try {
        const structured = JSON.parse(raw);
        return NextResponse.json({ reply: structured.risposta, structured });
      } catch {
        return NextResponse.json({ reply: raw });
      }
    }

    /* ── Legacy / chatbox mode ── */
    const historyBlock = history
      .map((m) => `${m.role === "user" ? "Utente" : "Assistente"}: ${m.content}`)
      .join("\n");

    const prompt = `${salesRules}

Sei l'Assistente Preflight, un assistente AI integrato nella piattaforma Preflight — un assistente che aiuta a capire chi contattare su LinkedIn, come iniziare una conversazione e come portarla avanti fino a una call.

Il tuo compito è:
- Rispondere a domande sul prodotto Preflight
- Spiegare come usare Preflight per trovare clienti su LinkedIn
- Suggerire come usare LinkedIn in modo più commerciale
- Aiutare l'utente a usare gli strumenti del sito (post, commenti, DM, prospect, pipeline, opportunità, simulatore)
- Se l'utente incolla un commento o messaggio LinkedIn, suggerisci una risposta naturale e orientata alla conversazione

Rispondi SEMPRE in italiano. Sii breve, concreto e utile. Non fare pitch.
Rispondi SOLO con un oggetto JSON: { "reply": "<la tua risposta>" }

${formatProfileContext(profile) || "Profilo utente: non configurato"}

${historyBlock ? `Storico conversazione:\n${historyBlock}\n` : ""}
Utente: ${message}`;

    const raw = await generateWithLLM(prompt);
    let reply: string;
    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply || raw;
    } catch {
      reply = raw;
    }

    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[chat] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
