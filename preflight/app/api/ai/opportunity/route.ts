import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { defaultOpportunityFinder } from "@/lib/sales/defaults";
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

  const prompt = `${salesRules}\nFind LinkedIn conversation opportunities for this ideal client:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({
    prompt,
    schema: opportunityFinderSchema,
    fallback: defaultOpportunityFinder,
  });

  return NextResponse.json(output);
}
