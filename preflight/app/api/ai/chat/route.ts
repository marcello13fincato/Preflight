import { NextResponse } from "next/server";
import { z } from "zod";
import { generateWithLLM, salesRules } from "@/lib/ai/structured";

export const runtime = "nodejs";

const requestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional()
    .default([]),
  profile: z.unknown().optional(),
});

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
    const { message, history, profile } = parsed.data;

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
