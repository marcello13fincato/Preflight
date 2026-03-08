import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { opportunityFinderSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  ideal_client_description: z.string(),
  profile: z.unknown().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[opportunity] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid opportunity input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { ideal_client_description, profile } = parsed.data;
    const prompt = `${salesRules}

Stai cercando opportunità di conversazione su LinkedIn per un cliente ideale. Rispondi ESCLUSIVAMENTE in italiano. Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "keywords_to_monitor": [
    "<stringa: keyword da monitorare>",
    "<stringa: keyword da monitorare>",
    "<stringa: keyword da monitorare>",
    "<stringa: keyword da monitorare>",
    "<stringa: keyword da monitorare>"
  ],
  "post_types_to_search": [
    "<stringa: tipo di post da cercare>",
    "<stringa: tipo di post da cercare>",
    "<stringa: tipo di post da cercare>"
  ],
  "ideal_profiles": [
    {
      "role": "<stringa: ruolo o titolo professionale>",
      "sector": "<stringa: settore di appartenenza>",
      "company_size": "<stringa: dimensione azienda, es. '5-20 persone'>",
      "why": "<stringa: 1 frase che spiega perché questo profilo è rilevante>"
    },
    {
      "role": "<stringa: ruolo o titolo professionale>",
      "sector": "<stringa: settore di appartenenza>",
      "company_size": "<stringa: dimensione azienda>",
      "why": "<stringa: 1 frase che spiega la rilevanza>"
    },
    {
      "role": "<stringa: ruolo o titolo professionale>",
      "sector": "<stringa: settore di appartenenza>",
      "company_size": "<stringa: dimensione azienda>",
      "why": "<stringa: 1 frase che spiega la rilevanza>"
    }
  ],
  "useful_signals": [
    "<stringa: segnale che indica interesse del profilo>",
    "<stringa: segnale>",
    "<stringa: segnale>",
    "<stringa: segnale>"
  ],
  "linkedin_search_queries": [
    "<stringa: query di ricerca LinkedIn pronta all'uso>",
    "<stringa: query di ricerca LinkedIn pronta all'uso>",
    "<stringa: query di ricerca LinkedIn pronta all'uso>"
  ],
  "conversation_opportunities": [
    "<stringa: opportunità specifica per iniziare una conversazione>",
    "<stringa: opportunità specifica>",
    "<stringa: opportunità specifica>"
  ],
  "next_action": "<stringa: primo passo concreto da fare oggi>"
}

IMPORTANTE: ideal_profiles deve contenere ARCHETIPI GENERICI (non persone reali, nessun nome o azienda reale). Ogni profilo è un archetipo fittizio di cliente ideale.

Descrizione cliente ideale: ${ideal_client_description}
Profilo utente: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: opportunityFinderSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[opportunity] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
