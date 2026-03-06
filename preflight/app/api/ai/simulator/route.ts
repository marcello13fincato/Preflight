import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
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

  try {
    const { prospect_type, scenario, user_answer } = parsed.data;
    const prompt = `${salesRules}

You are a LinkedIn sales conversation simulator. Act as a ${prospect_type} in the scenario: "${scenario}".
The user answered: "${user_answer}"

Return ONLY a JSON object with exactly this structure (no extra fields):
{
  "prospect_reply": "<string: the prospect's realistic reply to the user's message>",
  "feedback": [
    "<string: feedback point 1>",
    "<string: feedback point 2>",
    "<string: feedback point 3>"
  ],
  "message_risk_warning": "<string: what could go wrong with this approach>",
  "next_action": "<string: what the user should do next>"
}`;
    const output = await generateStructured({ prompt, schema: simulatorSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[simulator] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
