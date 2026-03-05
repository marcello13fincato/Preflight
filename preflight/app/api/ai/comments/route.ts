import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { commentAssistantSchema } from "@/lib/sales/schemas";
import { defaultCommentAssistant } from "@/lib/sales/defaults";

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
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comments input", details: parsed.error.flatten() }, { status: 400 });
  }

  const prompt = `${salesRules}\nGenerate comment assistant output focused on moving from post to conversation. Include client heat level (Cold/Warm/Hot), message risk warning, and a clear next action. Input:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({
    prompt,
    schema: commentAssistantSchema,
    fallback: defaultCommentAssistant,
  });

  return NextResponse.json(output);
}
