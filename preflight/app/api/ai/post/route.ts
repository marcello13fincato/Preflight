import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { defaultPostBuilder } from "@/lib/sales/defaults";
import { postBuilderSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  draft_post: z.string(),
  objective: z.string(),
  dm_keyword: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[post] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post input", details: parsed.error.flatten() }, { status: 400 });
  }

  const fallback = defaultPostBuilder(parsed.data.objective || "inbound", parsed.data.dm_keyword || "audit");
  const prompt = `${salesRules}\nCreate Post Builder output from:\n${JSON.stringify(parsed.data)}\nReturn strict JSON only.`;
  const output = await generateStructured({ prompt, schema: postBuilderSchema, fallback });

  return NextResponse.json(output);
}
