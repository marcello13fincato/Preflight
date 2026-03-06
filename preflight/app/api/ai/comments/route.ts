import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { commentAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  original_post: z.string(),
  received_comment: z.string(),
  commenter_profile_text: z.string().optional().default(""),
  conversation_goal: z.enum(["understand_fit", "continue_conversation", "move_to_dm", "propose_call", "follow_up"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[comments] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comments input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { original_post, received_comment, commenter_profile_text, conversation_goal, profile } = parsed.data;
    const prompt = `${salesRules}

You are analyzing a LinkedIn comment. Return ONLY a JSON object with exactly this structure (no extra fields):
{
  "comment_type": "<one of: lead | curious | support | objection | negative | peer>",
  "strategy": "<string: 1-2 sentence strategy for responding>",
  "client_heat_level": "<one of: Cold | Warm | Hot>",
  "message_risk_warning": "<string: risk in this response, or 'nessuno' if none>",
  "replies": {
    "soft": "<string: warm, empathetic reply>",
    "authority": "<string: authoritative, expert reply>",
    "dm_pivot": "<string: reply that pivots to direct message>"
  },
  "suggested_dm": "<string: the exact DM message to send after the reply>",
  "next_action": "<string: concrete next step to take>"
}

Context:
- Original post: ${original_post}
- Comment received: ${received_comment}
- Commenter profile: ${commenter_profile_text || "not provided"}
- Conversation goal: ${conversation_goal}
- User profile: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: commentAssistantSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[comments] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
