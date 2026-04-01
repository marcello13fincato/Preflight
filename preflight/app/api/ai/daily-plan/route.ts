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

Sei l'Assistente Preflight. Genera il piano operativo di oggi per LinkedIn. NON generare azioni generiche tipo "commenta 3 post" — ogni azione deve sembrare pensata da un consulente strategico per QUESTA persona.

${profileCtx || "NOTA: L'utente non ha ancora configurato il suo profilo. Genera suggerimenti realistici per un consulente/freelance B2B che vende servizi ad aziende."}${targetingCtx}

REGOLE FONDAMENTALI:
- Ogni azione deve contenere: tipo, priorità, contesto (chi + situazione specifica), perché agire ora, azione concreta, messaggio suggerito, outcome atteso, prossimo step
- Non usare placeholder come [nome], [azienda] — inventa nomi e situazioni realistiche e credibili
- Il valore NON è il messaggio → è il RAGIONAMENTO dietro l'azione
- Ogni azione deve sembrare pensata da un consulente, non da un tool
- Il tipo di ogni azione deve essere UNO tra: outreach, contenuto, followup, ricerca, commento, connessione
- La priorità deve essere UNA tra: alta, media, bassa
- Il contesto deve avere "chi" (persona specifica con ruolo, azienda, dettagli) e "situazione" (cosa sta succedendo che rende l'azione rilevante)
- "perche_ora" spiega il timing: perché agire OGGI e non domani
- "azione_concreta" descrive ESATTAMENTE cosa fare, passo per passo
- "messaggio_suggerito" è il testo da copiare/incollare su LinkedIn
- "outcome_atteso" spiega cosa aspettarsi realisticamente
- "prossimo_step" dice cosa fare DOPO in base alla risposta
- Per il post: testo COMPLETO e pubblicabile così com'è
- Rispondi ESCLUSIVAMENTE in italiano

ESEMPI DI TRASFORMAZIONE:
PRIMA (generico): "Commenta 3 post di decision-maker"
DOPO (intelligente): contesto = "Marco Rossi, founder SaaS CRM, ha pubblicato ieri su espansione team sales" + perché ora = "Se assume sales, ha bisogno di pipeline. Commentare oggi ti posiziona prima che cerchi soluzioni" + azione = "Commenta aggiungendo esperienza su ramp-up sales" + outcome = "Ti nota come esperto, visita il tuo profilo"

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "focus_giornata": "<una frase di max 15 parole che riassume la strategia di oggi>",
  "azioni": {
    "azione_1": {
      "tipo": "outreach|contenuto|followup|ricerca|commento|connessione",
      "priorita": "alta|media|bassa",
      "contesto": {
        "chi": "<persona specifica con nome, ruolo, azienda, dettagli rilevanti>",
        "situazione": "<cosa sta succedendo che rende questa azione strategica>"
      },
      "perche_ora": "<perché agire oggi, quale segnale o timing rende urgente>",
      "azione_concreta": "<cosa fare esattamente, passo per passo>",
      "messaggio_suggerito": "<testo completo da copiare/incollare su LinkedIn>",
      "outcome_atteso": "<cosa aspettarsi realisticamente da questa azione>",
      "prossimo_step": "<cosa fare dopo in base alla risposta o non-risposta>"
    },
    "azione_2": { ... stessa struttura ... },
    "azione_3": { ... stessa struttura ... },
    "azione_4": { ... stessa struttura ... },
    "azione_5": { ... stessa struttura ... }
  },
  "messaggi_pronti": {
    "primo_contatto": "<messaggio completo per un primo contatto LinkedIn, max 300 caratteri, naturale e non commerciale>",
    "primo_contatto_variante": "<variante diversa del primo contatto, tono leggermente diverso>",
    "followup": "<messaggio di follow-up per chi non ha risposto dopo 4-5 giorni, max 200 caratteri>",
    "followup_variante": "<variante del follow-up, approccio diverso>",
    "commento_post": "<esempio di commento intelligente da lasciare sotto un post di un prospect>"
  },
  "post_del_giorno": {
    "hook": "<prima riga del post che cattura l'attenzione, max 20 parole>",
    "corpo": "<corpo del post, 4-6 frasi>",
    "chiusura": "<chiusura con CTA morbida, 1-2 frasi>",
    "testo_completo": "<il post COMPLETO pronto da pubblicare: hook + \\n\\n + corpo + \\n\\n + chiusura>",
    "tipo_immagine": "<suggerisci UNA foto specifica da scattare/usare — sempre foto reali, mai stock>"
  },
  "link_ricerca_linkedin": "<URL di ricerca LinkedIn pronto, formato: https://www.linkedin.com/search/results/people/?keywords=...&origin=GLOBAL_SEARCH_HEADER — usa %20 per gli spazi>"
}`;

    const output = await generateStructured({ prompt, schema: dailyPlanSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    if (process.env.NODE_ENV !== "production") {
      console.error("[daily-plan] AI error:", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
