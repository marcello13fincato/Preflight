import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { defaultDmAssistant } from "@/lib/sales/defaults";
import { dmAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  pasted_chat_thread: z.string(),
  objective: z.enum(["qualify", "propose call", "follow-up"]),
  prospect_profile_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dm input", details: parsed.error.flatten() }, { status: 400 });
  }

  const prompt = `${salesRules}\nGenerate DM assistant output with 48h/5d/10d followups. Input:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({
    prompt,
    schema: dmAssistantSchema,
    fallback: defaultDmAssistant,
  });

  return NextResponse.json(output);
}
