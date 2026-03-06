import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  pasted_profile_text: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[prospect] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prospect input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { pasted_profile_text, profile } = parsed.data;
    const prompt = `${salesRules}

You are analyzing a LinkedIn prospect profile. Return ONLY a JSON object with exactly this structure (no extra fields):
{
  "likely_pains": [
    "<string: pain point 1>",
    "<string: pain point 2>",
    "<string: pain point 3>"
  ],
  "angles": [
    "<string: conversation angle 1>",
    "<string: conversation angle 2>",
    "<string: conversation angle 3>"
  ],
  "connection_opener": "<string: personalized connection request message>",
  "dm1": "<string: first DM message after connecting>",
  "smart_questions": [
    "<string: qualifying question 1>",
    "<string: qualifying question 2>",
    "<string: qualifying question 3>",
    "<string: qualifying question 4>",
    "<string: qualifying question 5>"
  ],
  "client_heat_level": "<one of: Cold | Warm | Hot>",
  "priority_signal": "<one of: high | medium | low>",
  "next_action": "<string: concrete next step>"
}

Prospect profile:
${pasted_profile_text}

User profile: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: prospectAnalyzerSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[prospect] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
