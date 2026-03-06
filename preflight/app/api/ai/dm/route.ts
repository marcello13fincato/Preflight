import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { dmAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  pasted_chat_thread: z.string(),
  conversation_goal: z.enum(["understand_fit", "continue_conversation", "move_to_dm", "propose_call", "follow_up"]),
  prospect_profile_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[dm] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dm input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const prompt = `${salesRules}\nGenerate DM assistant output with 48h/5d/10d followups. Include client heat level (Cold/Warm/Hot), message risk warning, and clear next action. Input:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
    const output = await generateStructured({ prompt, schema: dmAssistantSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[dm] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
