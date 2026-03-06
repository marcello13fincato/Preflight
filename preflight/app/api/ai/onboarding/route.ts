import { NextResponse } from "next/server";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { onboardingInputSchema, planSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[onboarding] Received payload:", JSON.stringify(body));
  const parsed = onboardingInputSchema.safeParse(body?.onboarding);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid onboarding input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const prompt = `${salesRules}\nBuild a 14-day LinkedIn Sales OS plan for this profile:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
    const output = await generateStructured({ prompt, schema: planSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[onboarding] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
