import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { defaultSimulator } from "@/lib/sales/defaults";
import { simulatorSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  prospect_type: z.enum(["Founder", "HR", "CEO", "Marketing"]),
  scenario: z.enum(["First connection reply", "Interested prospect", "Skeptical prospect", "No response", "Objection"]),
  user_answer: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[simulator] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulator input", details: parsed.error.flatten() }, { status: 400 });
  }

  const prompt = `${salesRules}\nAct as the selected prospect and evaluate user's answer for moving toward call. Input:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({
    prompt,
    schema: simulatorSchema,
    fallback: defaultSimulator,
  });

  return NextResponse.json(output);
}
