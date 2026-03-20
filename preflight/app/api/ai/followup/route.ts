import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { followupSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  contesto: z.string().min(1).max(4000),
  tempo_passato: z.string().max(200).optional(),
  profile: z.unknown().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { contesto, tempo_passato, profile } = parsed.data;
    const prompt = `${salesRules}

Sei l'Assistente Preflight. L'utente deve scrivere un follow-up su LinkedIn.

Il tono deve essere: naturale, umano, concreto. Non aggressivo, non da marketer, non cringe.
Deve sembrare un consulente esperto che suggerisce come riprendere una conversazione.

CONTESTO della conversazione precedente:
${contesto}
${tempo_passato ? `\nTempo trascorso dall'ultimo messaggio: ${tempo_passato}` : ""}
${formatProfileContext(profile) || "\nProfilo utente: non configurato"}

Rispondi ESCLUSIVAMENTE in italiano.
Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "analisi_situazione": "<analisi breve della situazione e del momento migliore per scrivere>",
  "messaggio_followup": "<messaggio di follow-up completo, naturale e non aggressivo>",
  "variante_breve": "<versione più breve del follow-up>",
  "variante_diretta": "<versione più diretta, adatta se c'è già stata una buona interazione>",
  "tempistica": "<quando inviare il messaggio e perché>",
  "prossimi_passi": "<cosa fare dopo aver inviato il follow-up>"
}`;

    const output = await generateStructured({ prompt, schema: followupSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[followup] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
