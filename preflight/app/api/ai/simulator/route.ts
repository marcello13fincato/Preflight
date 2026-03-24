import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { simulatorSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  prospect_type: z.enum(["Founder", "HR", "CEO", "Marketing"]),
  scenario: z.enum(["Prima risposta dopo connessione", "Prospect interessato", "Prospect scettico", "Nessuna risposta", "Obiezione"]),
  user_answer: z.string(),
  profile: z.unknown().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[simulator] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulator input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { prospect_type, scenario, user_answer, profile } = parsed.data;
    const prompt = `${salesRules}

Sei un simulatore di conversazioni commerciali su LinkedIn. Rispondi ESCLUSIVAMENTE in italiano. Agisci come un ${prospect_type} nello scenario: "${scenario}".
L'utente ha risposto: "${user_answer}"
${formatProfileContext(profile) || "Profilo utente: non configurato"}

Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "prospect_reply": "<stringa: risposta realistica del prospect al messaggio dell'utente, in italiano>",
  "feedback": [
    "<stringa: punto di feedback 1, in italiano>",
    "<stringa: punto di feedback 2, in italiano>",
    "<stringa: punto di feedback 3, in italiano>"
  ],
  "message_risk_warning": "<stringa: cosa potrebbe andare storto con questo approccio, in italiano>",
  "next_action": "<stringa: cosa dovrebbe fare l'utente dopo, in italiano>"
}`;
    const output = await generateStructured({ prompt, schema: simulatorSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[simulator] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
