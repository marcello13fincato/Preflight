import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { dailyPlanSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
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
    const { profile } = parsed.data;
    const profileCtx = formatProfileContext(profile);

    const prompt = `${salesRules}

Sei l'Assistente Preflight. L'utente ti chiede di generare il suo piano giornaliero per oggi su LinkedIn per trovare clienti.

${profileCtx || "NOTA: L'utente non ha ancora configurato il suo profilo. Genera suggerimenti generici ma utili."}

Il tuo compito è generare un piano concreto per oggi con 3 blocchi. Sii chiaro, concreto, naturale. Non essere aggressivo e non fare marketing.

Rispondi ESCLUSIVAMENTE in italiano.

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "persone_da_contattare": {
    "tipo_profili": "<descrivi che tipo di profili contattare oggi, sii specifico>",
    "link_ricerca": "<genera un URL di ricerca LinkedIn pronto, formato: https://www.linkedin.com/search/results/people/?keywords=... — usa %20 per gli spazi>",
    "criteri_scelta": "<criteri per scegliere i profili migliori tra quelli trovati>",
    "primo_messaggio": "<scrivi un primo messaggio da inviare, breve e naturale>",
    "strategia": "<strategia semplice in 3 step: 1. guarda il profilo 2. se ha pubblicato qualcosa commenta 3. poi invia il messaggio>"
  },
  "contenuto_consigliato": {
    "idea_post": "<idea concreta per un post da pubblicare oggi>",
    "struttura": "<struttura del contenuto: hook, corpo, CTA>",
    "esempio_testo": "<esempio completo del testo del post>",
    "suggerimento_immagine": "<suggerisci il tipo di immagine da usare — preferisci sempre foto reali: foto mentre lavori, del tuo ambiente di lavoro, screenshot di un progetto reale. Evita immagini stock.>"
  },
  "conversazioni_da_seguire": {
    "followup_da_fare": "<descrivi che tipo di follow-up fare oggi>",
    "quando_scrivere": "<suggerisci quando scrivere>",
    "cosa_chiedere": "<cosa chiedere nel follow-up>",
    "esempio_followup": "<scrivi un esempio di messaggio di follow-up naturale>"
  }
}`;

    const output = await generateStructured({ prompt, schema: dailyPlanSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[daily-plan] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
