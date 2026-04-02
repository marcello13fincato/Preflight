import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { commentAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  original_post: z.string(),
  received_comment: z.string(),
  commenter_profile_text: z.string().optional().default(""),
  commenter_linkedin_url: z.string().max(500).optional(),
  conversation_goal: z.enum(["understand_fit", "continue_conversation", "move_to_dm", "propose_call", "follow_up"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comments input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { original_post, received_comment, commenter_profile_text, commenter_linkedin_url, conversation_goal } = parsed.data;

  const taskPrompt = `COMPITO: Analizza un commento LinkedIn e suggerisci come rispondere.

USA il contesto commerciale dell'utente per capire se il commentatore è in target e adattare la strategia di risposta al servizio e posizionamento dell'utente.

Restituisci JSON:
{
  "comment_type": "<lead | curious | support | objection | negative | peer>",
  "strategy": "<strategia di risposta>",
  "client_heat_level": "<Cold | Warm | Hot>",
  "message_risk_warning": "<rischio, o 'nessuno'>",
  "replies": { "soft": "<risposta empatica>", "authority": "<risposta autorevole>", "dm_pivot": "<risposta per portare in DM>" },
  "suggested_dm": "<messaggio DM da inviare dopo>",
  "next_action": "<prossimo passo>"
}`;

  const userInput = [
    `Post originale: ${original_post}`,
    `Commento ricevuto: ${received_comment}`,
    commenter_profile_text ? `Profilo commentatore: ${commenter_profile_text}` : "",
    commenter_linkedin_url ? `LinkedIn commentatore: ${commenter_linkedin_url}` : "",
    `Obiettivo: ${conversation_goal}`,
  ].filter(Boolean).join("\n");

  return callAI({
    taskType: "comment_assistant",
    schema: commentAssistantSchema,
    taskPrompt,
    userInput,
    contextOptions: commenter_linkedin_url ? { prospectLinkedinUrl: commenter_linkedin_url } : undefined,
  });
}
