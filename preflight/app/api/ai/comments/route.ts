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
  objective: z.enum(["conversation", "DM", "call"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comments input", details: parsed.error.flatten() }, { status: 400 });
  }

  const prompt = `${salesRules}\nGenerate comment assistant output. Input:\n${JSON.stringify(parsed.data)}\nMust include soft/authority/dm_pivot and next action.`;
  const output = await generateStructured({
    prompt,
    schema: commentAssistantSchema,
    fallback: defaultCommentAssistant,
  });

  return NextResponse.json(output);
}
