import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { defaultProspectAnalyzer } from "@/lib/sales/defaults";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  pasted_profile_text: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prospect input", details: parsed.error.flatten() }, { status: 400 });
  }

  const prompt = `${salesRules}\nAnalyze prospect profile and return pains/angles/opener/dm1/questions/priority. Input:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({
    prompt,
    schema: prospectAnalyzerSchema,
    fallback: defaultProspectAnalyzer,
  });

  return NextResponse.json(output);
}
