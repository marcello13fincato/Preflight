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

Sei l'Assistente Preflight. Genera il piano operativo di oggi per LinkedIn. L'utente deve poter COPIARE e INCOLLARE ogni messaggio direttamente su LinkedIn senza modifiche.

${profileCtx || "NOTA: L'utente non ha ancora configurato il suo profilo. Genera suggerimenti generici ma utili per un consulente/freelance B2B."}${targetingCtx}

REGOLE FONDAMENTALI:
- Ogni messaggio deve essere PRONTO DA COPIARE: realistico, personale, naturale
- Non usare placeholder come [nome], [azienda] — scrivi messaggi generici ma credibili
- Il tipo di ogni azione deve essere UNO tra: outreach, contenuto, followup, ricerca
- Per "istruzioni": scrivi esattamente cosa fare, passo per passo
- Per "messaggio_pronto": scrivi il testo completo da copiare/incollare su LinkedIn
- Il post deve essere COMPLETO e pubblicabile così com'è
- Rispondi ESCLUSIVAMENTE in italiano

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "focus_giornata": "<una frase motivante di max 15 parole che riassume la giornata, es: Oggi costruiamo 3 nuove relazioni e rafforziamo la tua autorevolezza>",
  "azioni": {
    "azione_1": {
      "titolo": "<azione concisa di max 8 parole, es: Commenta 3 post di decision-maker>",
      "tipo": "outreach|contenuto|followup|ricerca",
      "istruzioni": "<3-4 step precisi su cosa fare, separati da \\n>",
      "messaggio_pronto": "<il commento o messaggio completo da copiare, pronto all'uso>"
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
