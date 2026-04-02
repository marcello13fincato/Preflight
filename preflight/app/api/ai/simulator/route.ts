import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { simulatorSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  prospect_type: z.enum(["Founder", "HR", "CEO", "Marketing"]),
  scenario: z.enum(["Prima risposta dopo connessione", "Prospect interessato", "Prospect scettico", "Nessuna risposta", "Obiezione"]),
  user_answer: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulator input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { prospect_type, scenario, user_answer } = parsed.data;

  const taskPrompt = `COMPITO: Simula una conversazione commerciale su LinkedIn.

Agisci come un ${prospect_type} nello scenario: "${scenario}".
USA il contesto commerciale dell'utente per rendere la simulazione realistica: il prospect deve reagire come se l'utente vendesse davvero il proprio servizio al proprio cliente ideale.

Restituisci JSON:
{
  "prospect_reply": "<risposta realistica del prospect>",
  "feedback": ["<punto 1>", "<punto 2>", "<punto 3>"],
  "message_risk_warning": "<cosa potrebbe andare storto>",
  "next_action": "<cosa fare dopo>"
}`;

  return callAI({
    taskType: "simulator",
    schema: simulatorSchema,
    taskPrompt,
    userInput: `L'utente ha scritto: "${user_answer}"`,
  });
}
