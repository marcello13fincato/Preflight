import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
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

  try {
    const { draft_post, objective, dm_keyword, profile } = parsed.data;
    const prompt = `${salesRules}

You are writing a LinkedIn post. Return ONLY a JSON object with exactly this structure (no extra fields):
{
  "hooks": [
    "<string: hook 1>",
    "<string: hook 2>",
    "<string: hook 3>",
    "<string: hook 4>",
    "<string: hook 5>"
  ],
  "post_versions": {
    "clean": "<string: clean, readable version of the post>",
    "direct": "<string: direct, punchy version>",
    "authority": "<string: authoritative, expert version>"
  },
  "cta": "<string: call to action for the post>",
  "comment_starter": "<string: example comment to seed engagement>",
  "next_step": "<string: concrete next action after publishing>"
}

Context:
- Draft/idea: ${draft_post}
- Objective: ${objective}
- DM keyword: ${dm_keyword}
- User profile: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: postBuilderSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[post] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
