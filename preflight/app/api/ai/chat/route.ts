import { NextResponse } from "next/server";
import { z } from "zod";
import { generateWithLLM, salesRules } from "@/lib/ai/structured";

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

Sei l'Assistente Preflight, un assistente AI integrato nella piattaforma Preflight — LinkedIn Sales OS per freelance e consulenti.

CONTESTO della richiesta:
- Tipo di contenuto: ${ctx.contentType}
- Il testo è stato: ${originLabel}
${ctx.personProfile ? `- Profilo della persona coinvolta: ${ctx.personProfile}` : "- Profilo persona: non specificato"}
${profile ? `- Profilo utente Preflight: ${JSON.stringify(profile)}` : ""}

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
    const { message, history, profile, context } = parsed.data;

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

Sei l'Assistente Preflight, un assistente AI integrato nella piattaforma Preflight — LinkedIn Sales OS per freelance e consulenti.

Il tuo compito è:
- Rispondere a domande sul prodotto Preflight
- Spiegare come usare Preflight per trovare clienti su LinkedIn
- Suggerire come usare LinkedIn in modo più commerciale
- Aiutare l'utente a usare gli strumenti del sito (post, commenti, DM, prospect, pipeline, opportunità, simulatore)
- Se l'utente incolla un commento o messaggio LinkedIn, suggerisci una risposta naturale e orientata alla conversazione

Rispondi SEMPRE in italiano. Sii breve, concreto e utile. Non fare pitch.
Rispondi SOLO con un oggetto JSON: { "reply": "<la tua risposta>" }

${profile ? `Profilo utente: ${JSON.stringify(profile)}` : "Profilo utente: non configurato"}

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
