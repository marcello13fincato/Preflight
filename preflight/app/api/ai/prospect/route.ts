import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  pasted_profile_text: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[prospect] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prospect input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { pasted_profile_text, profile } = parsed.data;
    const prompt = `${salesRules}

Stai analizzando il profilo LinkedIn di un potenziale cliente. Rispondi ESCLUSIVAMENTE in italiano. Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "likely_pains": [
    "<stringa: problema probabile 1, in italiano>",
    "<stringa: problema probabile 2, in italiano>",
    "<stringa: problema probabile 3, in italiano>"
  ],
  "angles": [
    "<stringa: angolo di conversazione 1, in italiano>",
    "<stringa: angolo di conversazione 2, in italiano>",
    "<stringa: angolo di conversazione 3, in italiano>"
  ],
  "connection_opener": "<stringa: messaggio personalizzato di richiesta connessione, in italiano>",
  "dm1": "<stringa: primo messaggio DM dopo la connessione, in italiano>",
  "smart_questions": [
    "<stringa: domanda qualificante 1, in italiano>",
    "<stringa: domanda qualificante 2, in italiano>",
    "<stringa: domanda qualificante 3, in italiano>",
    "<stringa: domanda qualificante 4, in italiano>",
    "<stringa: domanda qualificante 5, in italiano>"
  ],
  "client_heat_level": "<uno tra: Cold | Warm | Hot>",
  "priority_signal": "<uno tra: high | medium | low>",
  "next_action": "<stringa: prossimo passo concreto, in italiano>"
}

Profilo prospect:
${pasted_profile_text}

Profilo utente: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: prospectAnalyzerSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[prospect] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
