import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { postBuilderSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  draft_post: z.string(),
  objective: z.string(),
  dm_keyword: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { draft_post, objective, dm_keyword } = parsed.data;

  const taskPrompt = `COMPITO: Scrivi un post LinkedIn ottimizzato.

USA il contesto commerciale dell'utente per:
- Allineare il post al suo posizionamento e differenziatore
- Parlare al suo cliente ideale
- Usare il tono coerente con il suo modello di vendita

Restituisci JSON:
{
  "hooks": ["<hook 1>", "<hook 2>", "<hook 3>", "<hook 4>", "<hook 5>"],
  "post_versions": { "clean": "<versione pulita>", "direct": "<versione diretta>", "authority": "<versione autorevole>" },
  "cta": "<call to action>",
  "comment_starter": "<commento per stimolare engagement>",
  "next_step": "<prossima azione dopo pubblicazione>",
  "suggerimento_immagine": { "tipo": "<foto reale o grafica semplice>", "perche_funziona": "<perché funziona>" }
}`;

  return callAI({
    taskType: "post_builder",
    schema: postBuilderSchema,
    taskPrompt,
    userInput: `Bozza/idea: ${draft_post}\nObiettivo: ${objective}\nParola chiave DM: ${dm_keyword}`,
  });
}
