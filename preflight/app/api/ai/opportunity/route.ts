import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { opportunityFinderSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  ideal_client_description: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[opportunity] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid opportunity input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { ideal_client_description } = parsed.data;
    const prompt = `${salesRules}

You are finding LinkedIn conversation opportunities. Return ONLY a JSON object with exactly this structure (no extra fields):
{
  "post_types_to_search": [
    "<string: type of post to search for>",
    "<string: type of post to search for>",
    "<string: type of post to search for>"
  ],
  "keywords_to_monitor": [
    "<string: keyword>",
    "<string: keyword>",
    "<string: keyword>",
    "<string: keyword>",
    "<string: keyword>"
  ],
  "conversation_opportunities": [
    "<string: specific opportunity description>",
    "<string: specific opportunity description>",
    "<string: specific opportunity description>"
  ],
  "next_action": "<string: concrete first step to take today>"
}

Ideal client description: ${ideal_client_description}`;
    const output = await generateStructured({ prompt, schema: opportunityFinderSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[opportunity] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
