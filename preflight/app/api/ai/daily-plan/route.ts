import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { dailyPlanSchema } from "@/lib/sales/schemas";

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

  const today = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const taskPrompt = `COMPITO: Genera il piano operativo di OGGI (${today}) per LinkedIn.

LA DATA DI OGGI È: ${today}. Il piano DEVE cambiare ogni giorno — mai ripetere le stesse azioni.
${targetingCtx}

REGOLE FONDAMENTALI:
- Ogni azione deve contenere: tipo, priorità, contesto (chi + situazione specifica), perché agire ORA, azione concreta, messaggio suggerito, outcome atteso, prossimo step
- OGNI AZIONE deve avere un link_ricerca_linkedin: un URL reale di LinkedIn Search funzionante
  Formato: https://www.linkedin.com/search/results/people/?keywords=PAROLE%20CHIAVE&origin=GLOBAL_SEARCH_HEADER
  Esempio: https://www.linkedin.com/search/results/people/?keywords=CEO%20SaaS%20B2B%20Italia&origin=GLOBAL_SEARCH_HEADER
  Le keywords devono essere specifiche per il SETTORE e TARGET dell'utente, non generiche
- Non usare placeholder come [nome], [azienda] — inventa nomi e situazioni realistiche e credibili basati sul SETTORE e TARGET dell'utente
- Il valore NON è il messaggio → è il RAGIONAMENTO dietro l'azione
- Il campo "perche_ora" è il cuore di ogni azione — deve spiegare una ragione commerciale CONCRETA e legata al timing
- Ogni azione deve sembrare pensata da un consulente, non da un tool
- Il tipo di ogni azione deve essere UNO tra: outreach, contenuto, followup, ricerca, commento, connessione
- Per il post: testo COMPLETO e pubblicabile, coerente con l'offerta e il cliente ideale dell'utente
- Rispondi ESCLUSIVAMENTE in italiano

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "focus_giornata": "<una frase di max 15 parole che cattura il tema di oggi>",
  "azioni": {
    "azione_1": {
      "tipo": "outreach|contenuto|followup|ricerca|commento|connessione",
      "priorita": "alta|media|bassa",
      "contesto": { "chi": "<persona specifica con nome, ruolo, azienda>", "situazione": "<cosa rende questa persona strategica oggi>" },
      "perche_ora": "<ragione commerciale concreta per agire oggi — NON frasi generiche>",
      "azione_concreta": "<cosa fare esattamente, step by step>",
      "messaggio_suggerito": "<testo da copiare su LinkedIn, max 500 caratteri>",
      "outcome_atteso": "<reazione specifica che ti aspetti>",
      "prossimo_step": "<cosa fare dopo questa azione>",
      "link_ricerca_linkedin": "<URL LinkedIn Search reale e funzionante con keywords specifiche per questa azione>"
    },
    "azione_2": { "...stessa struttura..." },
    "azione_3": { "...stessa struttura..." },
    "azione_4": { "...stessa struttura..." },
    "azione_5": { "...stessa struttura..." }
  },
  "messaggi_pronti": {
    "primo_contatto": "<max 300 caratteri, personalizzato sul target dell'utente>",
    "primo_contatto_variante": "<variante con angolo diverso>",
    "followup": "<max 200 caratteri>",
    "followup_variante": "<variante>",
    "commento_post": "<commento intelligente e specifico>"
  },
  "post_del_giorno": {
    "hook": "<prima riga che cattura l'attenzione del TARGET specifico>",
    "corpo": "<4-6 frasi che dimostrano competenza nel SERVIZIO dell'utente>",
    "chiusura": "<CTA morbida coerente con il modello di vendita>",
    "testo_completo": "<post COMPLETO pronto da pubblicare, inclusi hook+corpo+chiusura>",
    "tipo_immagine": "<suggerimento specifico per immagine>"
  },
  "link_ricerca_linkedin": "<URL LinkedIn Search principale per il piano di oggi>"
}`;

  return callAI({
    taskType: "daily_plan",
    schema: dailyPlanSchema,
    taskPrompt,
    userInput: targetingCtx
      ? `Genera piano di oggi ${today} basato sul targeting recente.`
      : `Genera il piano operativo per oggi ${today}. Deve essere diverso da qualsiasi piano precedente.`,
  });
}
