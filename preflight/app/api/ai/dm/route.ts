import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { dmAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  pasted_chat_thread: z.string(),
  conversation_goal: z.enum(["understand_fit", "continue_conversation", "move_to_dm", "propose_call", "follow_up"]),
  prospect_profile_text: z.string().optional().default(""),
  prospect_linkedin_url: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dm input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { pasted_chat_thread, conversation_goal, prospect_profile_text, prospect_linkedin_url } = parsed.data;

  const taskPrompt = `COMPITO: Analizza questa conversazione DM su LinkedIn e suggerisci la risposta migliore.

USA il contesto commerciale dell'utente per:
- Capire se il prospect è in target
- Adattare il tono e l'approccio al modello di vendita dell'utente
- Suggerire domande qualificanti specifiche per l'offerta dell'utente

Restituisci JSON:
{
  "best_reply": "<migliore risposta da inviare>",
  "client_heat_level": "<Cold | Warm | Hot>",
  "message_risk_warning": "<rischio, o 'nessuno'>",
  "alternatives": { "short": "<versione breve>", "assertive": "<versione diretta>" },
  "qualifying_questions": ["<domanda 1>", "<domanda 2>", "<domanda 3>"],
  "followups": { "48h": "<follow-up 48h>", "5d": "<follow-up 5 giorni>", "10d": "<follow-up 10 giorni>" },
  "next_action": "<prossimo passo concreto>"
}`;

  const userInput = [
    `Thread conversazione: ${pasted_chat_thread}`,
    `Obiettivo: ${conversation_goal}`,
    prospect_profile_text ? `Profilo prospect: ${prospect_profile_text}` : "",
    prospect_linkedin_url ? `LinkedIn prospect: ${prospect_linkedin_url}` : "",
  ].filter(Boolean).join("\n");

  return callAI({
    taskType: "dm_assistant",
    schema: dmAssistantSchema,
    taskPrompt,
    userInput,
    contextOptions: prospect_linkedin_url ? { prospectLinkedinUrl: prospect_linkedin_url } : undefined,
  });
}
