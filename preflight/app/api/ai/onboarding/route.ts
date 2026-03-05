import { NextResponse } from "next/server";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { createDefaultPlan } from "@/lib/sales/defaults";
import { onboardingInputSchema, planSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = onboardingInputSchema.safeParse(body?.onboarding);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid onboarding input", details: parsed.error.flatten() }, { status: 400 });
  }

  const fallback = createDefaultPlan(parsed.data);
  const prompt = `${salesRules}\nBuild a 14-day LinkedIn Sales OS plan for this profile:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({ prompt, schema: planSchema, fallback });

  return NextResponse.json(output);
}
