import { NextResponse } from "next/server";
import { z } from "zod";
import { generateWithLLM } from "@/lib/ai/structured";
import { loadUserAIContext, buildSystemPrompt } from "@/lib/ai/aiEngine";
import getServerAuthSession from "@/lib/getServerAuthSession";

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
  systemPrompt: string,
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

  return `${systemPrompt}

---

CONTESTO della richiesta:
- Tipo di contenuto: ${ctx.contentType}
- Il testo è stato: ${originLabel}
${ctx.personProfile ? `- Profilo della persona coinvolta: ${ctx.personProfile}` : ""}

Il tuo compito:
Analizza il ${ctx.contentType} ${originLabel} e fornisci una risposta strutturata.
USA il contesto commerciale dell'utente per personalizzare ogni suggerimento: il messaggio deve riflettere il servizio, il target e il posizionamento dell'utente.
${analysisInstruction}

Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "risposta": "<risposta consigliata o suggerimento principale — specifica per il contesto dell'utente>",
  "perche": "<perché questa risposta funziona per QUESTO utente con QUESTO servizio>",
  "prossima_mossa": "<cosa fare dopo, concretamente>"${ctx.origin === "scritto" ? ',\n  "analisi": "<micro-analisi del testo scritto>"' : ""}
}

Testo da analizzare:
${message}`;
}

function buildProfileAnalysisPrompt(
  message: string,
  systemPrompt: string,
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

  return `${systemPrompt}

---

COMPITO: Analizza questo profilo LinkedIn per l'utente.

${depth}

${extraContext ? `CONTESTO aggiuntivo:\n${extraContext}` : ""}

IMPORTANTE: Ogni suggerimento deve essere specifico per il servizio e il target dell'utente. Il primo messaggio deve riflettere il suo posizionamento. La strategia di contatto deve considerare il suo modello di vendita.

Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "nome_contatto": "<nome della persona analizzata, se desumibile>",
  "ruolo_contatto": "<ruolo o titolo professionale della persona, se desumibile>",
  "azienda_contatto": "<azienda della persona, se desumibile>",
  "chi_e": "<chi è questa persona: breve lettura del profilo, cosa fa, che tipo di figura è>",
  "ruolo_e_contesto": "<ruolo nella sua azienda, dimensione azienda, settore, fase in cui si trova>",
  "perche_buon_contatto": "<motivi concreti basati su profilo e sul SERVIZIO SPECIFICO dell'utente per cui è un buon contatto>",
  "strategia_contatto": "<strategia di contatto consigliata, coerente con il modello di vendita dell'utente>",
  "primo_messaggio": "<primo messaggio consigliato, che rifletta il posizionamento e il tono dell'utente>",
  "followup_consigliato": "<messaggio follow-up naturale da inviare se non risponde entro 3-5 giorni>",
  "step_successivi": "<sequenza chiara di passi: Step 1, Step 2, Step 3, Step 4 — fino alla proposta di call>",
  "segnali_da_osservare": "<segnali concreti nel profilo o nel comportamento da osservare>",
  "errori_da_evitare": "<cosa NON fare con questa persona e perché>"
}

Richiesta dell'utente:
${message}`;
}

function buildAdviceOnlyPrompt(
  message: string,
  systemPrompt: string,
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

  return `${systemPrompt}

---

COMPITO: L'utente ti descrive una situazione reale su LinkedIn e vuole capire come muoversi.

${depth}

${extraContext ? `CONTESTO aggiuntivo:\n${extraContext}` : ""}

IMPORTANTE: La strategia deve essere coerente con il servizio, il target e il modello di vendita dell'utente. Non dare consigli generici che funzionerebbero per chiunque.

Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "lettura_situazione": "<cosa sta succedendo — collegato al contesto commerciale dell'utente>",
  "strategia": "<direzione strategica chiara, specifica per il servizio e target dell'utente>",
  "risposta_consigliata": "<testo pronto da usare, che rifletta il posizionamento dell'utente>",
  "followup_consigliato": "<messaggio o azione di follow-up coerente con il modello di vendita>",
  "step_successivi": "<sequenza di passi precisi: Step 1, Step 2, Step 3, Step 4 — fino alla proposta di call>",
  "errori_da_evitare": "<cosa NON fare in questa situazione specifica e perché>"
}

Situazione descritta dall'utente:
${message}`;
}

function buildAdvicePrompt(
  message: string,
  systemPrompt: string,
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

  return `${systemPrompt}

---

COMPITO: L'utente ti descrive una situazione reale su LinkedIn e/o ti chiede di analizzare un profilo per capire come iniziare o continuare una conversazione.

${depth}

${extraContext ? `CONTESTO aggiuntivo:\n${extraContext}` : ""}

IMPORTANTE: Ogni valutazione deve essere fatta attraverso la lente del servizio specifico dell'utente. "Perché parlargli" deve spiegare il collegamento tra il prospect e l'offerta dell'utente. Il primo messaggio deve riflettere il posizionamento dell'utente, non essere generico.

Rispondi SOLO con un oggetto JSON con questa struttura:
{
  "valutazione": {
    "qualita": <numero da 1 a 10>,
    "probabilita": "<percentuale indicativa di arrivare a una call>"
  },
  "temperatura": {
    "stato": "<Fredda | Neutra | Calda | Troppo presto per proporre una call>",
    "spiegazione": "<spiegazione collegata al contesto commerciale dell'utente>"
  },
  "chi_e": "<analisi del profilo della persona>",
  "interessi": "<temi e problemi rilevanti PER IL SERVIZIO DELL'UTENTE>",
  "perche_parlargli": "<collegamento esplicito tra il prospect e il servizio/problema che l'utente risolve>",
  "strategia_contatto": "<metodo coerente con il modello di vendita dell'utente>",
  "primo_messaggio": "<messaggio che rifletta il tono e il posizionamento dell'utente>",
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
    const { message, history, context, advice, demo, linkedinUrl, profileInfo, interactionType, whoWrote } = parsed.data;

    // Load full user context from DB (not from client-sent profile)
    let systemPrompt = "";
    const session = await getServerAuthSession();
    if (session?.user?.id) {
      const ctx = await loadUserAIContext(session.user.id);
      systemPrompt = buildSystemPrompt(ctx);
    } else {
      // Fallback for unauthenticated/demo: minimal system prompt
      systemPrompt = `Sei l'assistente AI strategico di Preflight — una piattaforma di vendita B2B su LinkedIn.
Rispondi ESCLUSIVAMENTE in italiano. Output sempre in JSON valido.
Scrivi come un consulente commerciale esperto. Mai tono da AI. Mai cliché. Mai frasi generiche.`;
    }

    /* ── Advice mode ("Chiedi un consiglio" / "Analizza profilo") ── */
    if (advice) {
      const assistantMode = parsed.data.assistantMode;
      let prompt: string;
      if (assistantMode === "profile") {
        prompt = buildProfileAnalysisPrompt(message, systemPrompt, !!demo, { linkedinUrl, profileInfo });
      } else if (assistantMode === "advice") {
        prompt = buildAdviceOnlyPrompt(message, systemPrompt, !!demo, { interactionType, personProfile: profileInfo });
      } else {
        prompt = buildAdvicePrompt(message, systemPrompt, !!demo, {
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
      const prompt = buildStructuredPrompt(message, context, systemPrompt);
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

    const prompt = `${systemPrompt}

---

COMPITO: Rispondi alla domanda dell'utente come assistente Preflight.

Puoi:
- Rispondere a domande sulla strategia LinkedIn
- Spiegare come usare Preflight per trovare clienti
- Suggerire come usare LinkedIn in modo più commerciale
- Se l'utente incolla un commento o messaggio LinkedIn, suggerisci una risposta contestuale

USA SEMPRE il contesto commerciale dell'utente per personalizzare ogni risposta.

Rispondi SOLO con un oggetto JSON: { "reply": "<la tua risposta — specifica per questo utente>" }

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
    if (process.env.NODE_ENV !== "production") {
      console.error("[chat] AI error:", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
