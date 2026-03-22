import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { adviceSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  situation: z.string().min(1),
  linkedin_url: z.string().optional().default(""),
  website_url: z.string().optional().default(""),
  pdf_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  if (process.env.NODE_ENV !== "production") {
    console.log("[advice] Received payload:", JSON.stringify(body));
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid advice input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { situation, linkedin_url, website_url, pdf_text, profile } = parsed.data;
    const extraParts: string[] = [];
    if (linkedin_url) extraParts.push(`Profilo LinkedIn della persona coinvolta: ${linkedin_url}`);
    if (pdf_text) extraParts.push(`Informazioni extra dal PDF del profilo: ${pdf_text}`);
    if (website_url) extraParts.push(`Sito web azienda: ${website_url}`);

    const prompt = `${salesRules}

L'utente ti chiede un consiglio su una situazione reale su LinkedIn. Rispondi ESCLUSIVAMENTE in italiano. Devi essere strategico, pratico e preciso.

Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "lettura_situazione": "<stringa: analisi di cosa sta succedendo, interpretazione della dinamica>",
  "strategia_consigliata": "<stringa: strategia dettagliata su come muoversi>",
  "risposta_suggerita": "<stringa: risposta o messaggio concreto pronto da usare>",
  "followup_consigliato": "<stringa: messaggio di follow-up consigliato con tempistica>",
  "step_successivi": "<stringa: passi concreti da fare dopo>",
  "errori_da_evitare": "<stringa: errori comuni da evitare in questa situazione>",
  "client_heat_level": "<uno tra: Cold | Warm | Hot>"
}

Situazione descritta dall'utente:
${situation}
${extraParts.length ? "\nContesto aggiuntivo:\n" + extraParts.join("\n") : ""}
${formatProfileContext(profile) || "Profilo utente: non configurato"}`;
    const output = await generateStructured({ prompt, schema: adviceSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    if (process.env.NODE_ENV !== "production") {
      console.error("[advice] AI error:", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
