import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { dailyPlanSchema } from "@/lib/sales/schemas";
import { demoDailyPlan } from "@/lib/mock/demoDailyPlan";

export const runtime = "nodejs";

const requestSchema = z.object({
  targeting: z.unknown().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input non valido", details: parsed.error.flatten() }, { status: 400 });
  }

  const { targeting } = parsed.data;

  let targetingCtx = "";
  if (targeting && typeof targeting === "object") {
    const t = targeting as Record<string, unknown>;
    const lines: string[] = [];
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
    if (lines.length > 0) {
      targetingCtx = `\n\nTARGETING RECENTE (generato da Trova Clienti):\n${lines.join("\n")}\nUsa queste informazioni per personalizzare il piano di oggi.`;
    }
  }

  const taskPrompt = `COMPITO: Genera il piano operativo di oggi per LinkedIn.

NON generare azioni generiche tipo "commenta 3 post" — ogni azione deve sembrare pensata da un consulente strategico per QUESTA persona, usando il suo contesto commerciale specifico.
${targetingCtx}

REGOLE FONDAMENTALI:
- Ogni azione deve contenere: tipo, priorità, contesto (chi + situazione specifica), perché agire ora, azione concreta, messaggio suggerito, outcome atteso, prossimo step
- Non usare placeholder come [nome], [azienda] — inventa nomi e situazioni realistiche e credibili basati sul SETTORE e TARGET dell'utente
- Il valore NON è il messaggio → è il RAGIONAMENTO dietro l'azione
- Ogni azione deve sembrare pensata da un consulente, non da un tool
- Il tipo di ogni azione deve essere UNO tra: outreach, contenuto, followup, ricerca, commento, connessione
- Per il post: testo COMPLETO e pubblicabile, coerente con l'offerta e il cliente ideale dell'utente
- Rispondi ESCLUSIVAMENTE in italiano

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "focus_giornata": "<una frase di max 15 parole>",
  "azioni": {
    "azione_1": {
      "tipo": "outreach|contenuto|followup|ricerca|commento|connessione",
      "priorita": "alta|media|bassa",
      "contesto": { "chi": "<persona specifica>", "situazione": "<cosa rende strategica>" },
      "perche_ora": "<perché agire oggi>",
      "azione_concreta": "<cosa fare esattamente>",
      "messaggio_suggerito": "<testo da copiare su LinkedIn>",
      "outcome_atteso": "<cosa aspettarsi>",
      "prossimo_step": "<cosa fare dopo>"
    },
    "azione_2": { "...stessa struttura..." },
    "azione_3": { "...stessa struttura..." },
    "azione_4": { "...stessa struttura..." },
    "azione_5": { "...stessa struttura..." }
  },
  "messaggi_pronti": {
    "primo_contatto": "<max 300 caratteri>",
    "primo_contatto_variante": "<variante diversa>",
    "followup": "<max 200 caratteri>",
    "followup_variante": "<variante>",
    "commento_post": "<commento intelligente>"
  },
  "post_del_giorno": {
    "hook": "<prima riga>",
    "corpo": "<4-6 frasi>",
    "chiusura": "<CTA morbida>",
    "testo_completo": "<post COMPLETO>",
    "tipo_immagine": "<foto specifica>"
  },
  "link_ricerca_linkedin": "<URL LinkedIn>"
}`;

  // If no OPENAI_API_KEY, return demo plan instead of crashing
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      ...demoDailyPlan,
      _meta: { demo: true, contextComplete: false, contextScore: 0, missingFields: [] },
    });
  }

  return callAI({
    taskType: "daily_plan",
    schema: dailyPlanSchema,
    taskPrompt,
    userInput: targetingCtx ? "Genera piano basato sul targeting recente." : "Genera il piano di oggi.",
  });
}
