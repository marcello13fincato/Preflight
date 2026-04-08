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

PERSONALIZZAZIONE OBBLIGATORIA:
- Il post deve parlare AL CLIENTE IDEALE dell'utente, non a un pubblico generico
- L'hook deve catturare l'attenzione del TARGET SPECIFICO dell'utente
- Il contenuto deve dimostrare l'expertise dell'utente nel suo SERVIZIO specifico
- La CTA deve essere coerente con il MODELLO DI VENDITA dell'utente
- Il tono deve corrispondere ai tone samples dell'utente (se disponibili)
- Se la bozza dell'utente è generica, rendila specifica per il suo contesto

ANTI-GENERICITÀ:
- Se il post potesse essere firmato da chiunque nel settore, è sbagliato
- Almeno un hook deve contenere un riferimento al settore/target dell'utente
- Il "comment_starter" deve stimolare una reazione dal TIPO di persona che l'utente vuole come cliente

Restituisci JSON:
{
  "hooks": ["<hook specifico per il target>", "<hook con dato/caso>", "<hook provocatorio>", "<hook domanda>", "<hook storytelling>"],
  "post_versions": { "clean": "<versione scorrevole, coerente con il posizionamento>", "direct": "<versione diretta, tono da esperto>", "authority": "<versione autorevole, con case/dati>" },
  "cta": "<call to action coerente con il modello di vendita dell'utente>",
  "comment_starter": "<commento per stimolare engagement dal target specifico>",
  "next_step": "<prossima azione dopo pubblicazione>",
  "suggerimento_immagine": { "tipo": "<foto reale o grafica semplice>", "perche_funziona": "<perché funziona per questo target>" }
}`;

  return callAI({
    taskType: "post_builder",
    schema: postBuilderSchema,
    taskPrompt,
    userInput: `Bozza/idea: ${draft_post}\nObiettivo: ${objective}\nParola chiave DM: ${dm_keyword}`,
  });
}
