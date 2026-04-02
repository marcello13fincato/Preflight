import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { opportunityFinderSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  ideal_client_description: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid opportunity input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { ideal_client_description } = parsed.data;

  const taskPrompt = `COMPITO: Trova opportunità di conversazione su LinkedIn per il cliente ideale.

USA il contesto commerciale dell'utente per:
- Cercare opportunità coerenti con il suo servizio e posizionamento
- Suggerire keywords e profili rilevanti per il suo settore target
- Proporre approcci conversazionali coerenti con il suo modello di vendita

IMPORTANTE: ideal_profiles deve contenere ARCHETIPI GENERICI (non persone reali).

Restituisci JSON:
{
  "keywords_to_monitor": ["<keyword>", "<keyword>", "<keyword>", "<keyword>", "<keyword>"],
  "post_types_to_search": ["<tipo post>", "<tipo post>", "<tipo post>"],
  "ideal_profiles": [
    { "role": "", "sector": "", "company_size": "", "why": "" },
    { "role": "", "sector": "", "company_size": "", "why": "" },
    { "role": "", "sector": "", "company_size": "", "why": "" }
  ],
  "useful_signals": ["<segnale>", "<segnale>", "<segnale>", "<segnale>"],
  "linkedin_search_queries": ["<query>", "<query>", "<query>"],
  "conversation_opportunities": ["<opportunità>", "<opportunità>", "<opportunità>"],
  "next_action": "<primo passo concreto da fare oggi>"
}`;

  return callAI({
    taskType: "opportunity_finder",
    schema: opportunityFinderSchema,
    taskPrompt,
    userInput: `Descrizione cliente ideale: ${ideal_client_description}`,
  });
}
