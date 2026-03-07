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

Stai scrivendo un post LinkedIn. Rispondi ESCLUSIVAMENTE in italiano. Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "hooks": [
    "<stringa: hook accattivante 1>",
    "<stringa: hook accattivante 2>",
    "<stringa: hook accattivante 3>",
    "<stringa: hook accattivante 4>",
    "<stringa: hook accattivante 5>"
  ],
  "post_versions": {
    "clean": "<stringa: versione pulita e leggibile del post>",
    "direct": "<stringa: versione diretta e incisiva>",
    "authority": "<stringa: versione autorevole ed esperta>"
  },
  "cta": "<stringa: call to action per il post>",
  "comment_starter": "<stringa: commento esempio per stimolare engagement>",
  "next_step": "<stringa: prossima azione concreta dopo la pubblicazione>"
}

Contesto:
- Bozza/idea: ${draft_post}
- Obiettivo: ${objective}
- Parola chiave DM: ${dm_keyword}
- Profilo utente: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: postBuilderSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[post] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
