import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { followupSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  contesto: z.string().min(1).max(4000),
  tempo_passato: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input non valido", details: parsed.error.flatten() }, { status: 400 });
  }

  const { contesto, tempo_passato } = parsed.data;

  const taskPrompt = `COMPITO: L'utente deve scrivere un follow-up su LinkedIn.

USA il contesto commerciale dell'utente per personalizzare il follow-up: il tono deve riflettere il modello di vendita dell'utente, e il contenuto deve essere coerente con la sua offerta.

Restituisci JSON:
{
  "analisi_situazione": "<analisi breve della situazione>",
  "messaggio_followup": "<messaggio completo, naturale>",
  "variante_breve": "<versione più breve>",
  "variante_diretta": "<versione più diretta>",
  "tempistica": "<quando inviare e perché>",
  "prossimi_passi": "<cosa fare dopo>"
}`;

  const userInput = [
    `Contesto conversazione: ${contesto}`,
    tempo_passato ? `Tempo trascorso: ${tempo_passato}` : "",
  ].filter(Boolean).join("\n");

  return callAI({
    taskType: "followup",
    schema: followupSchema,
    taskPrompt,
    userInput,
  });
}
