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

You are finding LinkedIn conversation opportunities for an ideal client. Respond ONLY in Italian. Return ONLY a JSON object with exactly this structure (no extra fields):
{
  "keywords_to_monitor": [
    "<string: keyword in Italian>",
    "<string: keyword in Italian>",
    "<string: keyword in Italian>",
    "<string: keyword in Italian>",
    "<string: keyword in Italian>"
  ],
  "post_types_to_search": [
    "<string: type of post to look for, in Italian>",
    "<string: type of post to look for, in Italian>",
    "<string: type of post to look for, in Italian>"
  ],
  "ideal_profiles": [
    {
      "role": "<string: job title or role, in Italian>",
      "sector": "<string: industry sector, in Italian>",
      "company_size": "<string: company size range, in Italian e.g. '5-20 persone'>",
      "why": "<string: 1 sentence explaining why this profile is relevant to the ideal client, in Italian>"
    },
    {
      "role": "<string: job title or role, in Italian>",
      "sector": "<string: industry sector, in Italian>",
      "company_size": "<string: company size range, in Italian>",
      "why": "<string: 1 sentence explaining relevance, in Italian>"
    },
    {
      "role": "<string: job title or role, in Italian>",
      "sector": "<string: industry sector, in Italian>",
      "company_size": "<string: company size range, in Italian>",
      "why": "<string: 1 sentence explaining relevance, in Italian>"
    }
  ],
  "useful_signals": [
    "<string: signal that indicates the profile may be interested, in Italian>",
    "<string: signal, in Italian>",
    "<string: signal, in Italian>",
    "<string: signal, in Italian>"
  ],
  "linkedin_search_queries": [
    "<string: ready-to-use LinkedIn search query in Italian>",
    "<string: ready-to-use LinkedIn search query in Italian>",
    "<string: ready-to-use LinkedIn search query in Italian>"
  ],
  "conversation_opportunities": [
    "<string: specific opportunity to start a conversation, in Italian>",
    "<string: specific opportunity, in Italian>",
    "<string: specific opportunity, in Italian>"
  ],
  "next_action": "<string: concrete first step to take today, in Italian>"
}

IMPORTANT: ideal_profiles must contain GENERIC ARCHETYPES (not real people, no real names or companies). Each profile is a fictional ideal-customer archetype.

Ideal client description: ${ideal_client_description}`;
    const output = await generateStructured({ prompt, schema: opportunityFinderSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[opportunity] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
