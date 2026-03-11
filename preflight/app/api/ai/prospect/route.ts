import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  linkedin_url: z.string().min(1),
  website_url: z.string().optional().default(""),
  context: z.string().optional().default(""),
  pdf_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[prospect] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prospect input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { linkedin_url, website_url, context, pdf_text, profile } = parsed.data;
    const inputParts: string[] = [`Profilo LinkedIn: ${linkedin_url}`];
    if (pdf_text) inputParts.push(`Informazioni extra dal PDF del profilo: ${pdf_text}`);
    if (website_url) inputParts.push(`Sito web: ${website_url}`);
    if (context) inputParts.push(`Contesto fornito dall'utente: ${context}`);

    const prompt = `${salesRules}

Stai analizzando il profilo LinkedIn di un potenziale cliente. Rispondi ESCLUSIVAMENTE in italiano. Devi essere strategico, pratico e preciso.

Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "chi_e": "<stringa: chi è questa persona o azienda, ruolo, settore, posizionamento>",
  "ruolo_contesto": "<stringa: il ruolo nel dettaglio, contesto aziendale, cosa fa concretamente>",
  "perche_buon_contatto": "<stringa: perché potrebbe essere un buon contatto per l'utente, punti di allineamento>",
  "strategia_contatto": "<stringa: strategia dettagliata per avvicinare questa persona, approccio consigliato>",
  "primo_messaggio": "<stringa: primo messaggio di contatto personalizzato, pronto da usare>",
  "followup_consigliato": "<stringa: messaggio di follow-up se non risponde, con tempistica>",
  "step_successivi": "<stringa: passi concreti da fare dopo il primo contatto>",
  "segnali_da_osservare": "<stringa: segnali positivi e negativi da osservare nella risposta>",
  "errori_da_evitare": "<stringa: errori comuni da evitare con questo tipo di contatto>",
  "client_heat_level": "<uno tra: Cold | Warm | Hot>",
  "priority_signal": "<uno tra: high | medium | low>"
}

Dati del prospect:
${inputParts.join("\n")}

${formatProfileContext(profile) || "Profilo utente: non configurato"}`;
    const output = await generateStructured({ prompt, schema: prospectAnalyzerSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[prospect] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
