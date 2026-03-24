import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { dailyPlanSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  targeting: z.unknown().optional(),
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
    const { profile, targeting } = parsed.data;
    const profileCtx = formatProfileContext(profile);

    let targetingCtx = "";
    if (targeting && typeof targeting === "object") {
      const t = targeting as Record<string, unknown>;
      const lines: string[] = [];
      // New find_clients structure
      const cat = t.categoria_prioritaria as Record<string, unknown> | undefined;
      if (cat?.titolo) lines.push(`- Categoria prospect prioritaria: ${cat.titolo}`);
      if (cat?.descrizione) lines.push(`  Descrizione: ${cat.descrizione}`);
      if (cat?.link_ricerca_linkedin) lines.push(`  Link ricerca: ${cat.link_ricerca_linkedin}`);
      const alts = t.categorie_alternative as Record<string, unknown>[] | undefined;
      if (Array.isArray(alts)) {
        alts.forEach((a, i) => {
          if (a.titolo) lines.push(`- Categoria alternativa ${i + 1}: ${a.titolo}`);
        });
      }
      const strategia = t.strategia_contatto as Record<string, unknown> | undefined;
      if (strategia?.primo_messaggio) lines.push(`- Primo messaggio suggerito: ${strategia.primo_messaggio}`);
      if (strategia?.approccio) lines.push(`- Strategia contatto: ${strategia.approccio}`);
      // Backward compat: old structure
      if (!cat && t.profilo_ideale) lines.push(`- Profilo ideale identificato: ${t.profilo_ideale}`);
      if (!cat && t.ricerca_linkedin_pronta) lines.push(`- Ricerca LinkedIn pronta: ${t.ricerca_linkedin_pronta}`);
      if (!cat && t.link_ricerca_linkedin) lines.push(`- Link ricerca: ${t.link_ricerca_linkedin}`);
      if (!strategia && t.primo_messaggio) lines.push(`- Primo messaggio suggerito: ${t.primo_messaggio}`);
      if (!strategia && t.strategia_contatto && typeof t.strategia_contatto === "string") lines.push(`- Strategia contatto: ${t.strategia_contatto}`);
      if (lines.length > 0) {
        targetingCtx = `\n\nTARGETING RECENTE (generato da Trova Clienti):\n${lines.join("\n")}\nUsa queste informazioni per personalizzare il piano di oggi. Integra il targeting nelle azioni prioritarie e nei contatti da fare. Indica quale categoria di prospect lavorare per prima oggi e che azione di outreach fare.`;
      }
    }

    const prompt = `${salesRules}

Sei l'Assistente Preflight. L'utente ti chiede di generare il suo piano giornaliero per oggi su LinkedIn per trovare clienti.

${profileCtx || "NOTA: L'utente non ha ancora configurato il suo profilo. Genera suggerimenti generici ma utili."}${targetingCtx}

Il tuo compito è generare un piano concreto per oggi con le priorità e 3 blocchi operativi. Sii chiaro, concreto, naturale. Non essere aggressivo e non fare marketing.

Rispondi ESCLUSIVAMENTE in italiano.

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "priorita_oggi": {
    "azione_1": "<prima azione più importante di oggi — concisa, tipo: Trova 3 profili adatti nel tuo settore>",
    "azione_2": "<seconda azione — tipo: Scrivi a 2 contatti ad alto potenziale>",
    "azione_3": "<terza azione — tipo: Fai 1 follow-up su una conversazione recente>"
  },
  "persone_da_contattare": {
    "tipo_profili": "<descrivi che tipo di profili contattare oggi, sii specifico>",
    "link_ricerca": "<genera un URL di ricerca LinkedIn pronto, formato: https://www.linkedin.com/search/results/people/?keywords=... — usa %20 per gli spazi>",
    "criteri_scelta": "<criteri per scegliere i profili migliori tra quelli trovati>",
    "primo_messaggio": "<scrivi un primo messaggio da inviare, breve e naturale>",
    "strategia": "<strategia semplice in 3 step: 1. guarda il profilo 2. se ha pubblicato qualcosa commenta 3. poi invia il messaggio>",
    "perche_oggi": "<spiega brevemente perché oggi ha senso contattare questi profili>"
  },
  "contenuto_consigliato": {
    "idea_post": "<idea concreta per un post da pubblicare oggi>",
    "angolo_post": "<angolo/prospettiva da usare per il post>",
    "struttura": "<struttura del contenuto: hook, corpo, CTA>",
    "esempio_testo": "<esempio completo del testo del post>",
    "cta_post": "<call to action specifica per il post>",
    "suggerimento_immagine": "<suggerisci il tipo di immagine da usare — preferisci sempre foto reali: foto mentre lavori, del tuo ambiente di lavoro, screenshot di un progetto reale. Evita immagini stock.>"
  },
  "conversazioni_da_seguire": {
    "followup_da_fare": "<descrivi che tipo di follow-up fare oggi>",
    "quando_scrivere": "<suggerisci quando scrivere>",
    "cosa_chiedere": "<cosa chiedere nel follow-up>",
    "esempio_followup": "<scrivi un esempio di messaggio di follow-up naturale>",
    "segnali_da_osservare": "<segnali positivi o negativi da osservare nella conversazione>",
    "errori_da_evitare": "<errori comuni da evitare nelle conversazioni di oggi>"
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
