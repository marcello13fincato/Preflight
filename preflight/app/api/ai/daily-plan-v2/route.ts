import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { dailyPlanV2Schema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  targeting: z.unknown().optional(),
  /** Prospects already analyzed — used to generate follow-up block */
  analyzedProspects: z
    .array(
      z.object({
        nome_ruolo: z.string(),
        giorni_fa: z.number(),
        contesto: z.string().optional(),
      }),
    )
    .optional(),
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

  const { targeting, analyzedProspects } = parsed.data;

  /* ── Build targeting context from "Trova Clienti" ── */
  let targetingCtx = "";
  if (targeting && typeof targeting === "object") {
    const t = targeting as Record<string, unknown>;
    const lines: string[] = [];
    const cat = t.categoria_prioritaria as Record<string, unknown> | undefined;
    if (cat?.titolo) lines.push(`- Categoria prospect prioritaria: ${cat.titolo}`);
    if (cat?.descrizione) lines.push(`  Descrizione: ${cat.descrizione}`);
    if (cat?.link_ricerca_linkedin)
      lines.push(`  Link ricerca: ${cat.link_ricerca_linkedin}`);
    const alts = t.categorie_alternative as Record<string, unknown>[] | undefined;
    if (Array.isArray(alts)) {
      alts.forEach((a, i) => {
        if (a.titolo) lines.push(`- Categoria alternativa ${i + 1}: ${a.titolo}`);
      });
    }
    const strategia = t.strategia_contatto as Record<string, unknown> | undefined;
    if (strategia?.primo_messaggio)
      lines.push(`- Primo messaggio suggerito: ${strategia.primo_messaggio}`);
    if (strategia?.approccio) lines.push(`- Strategia contatto: ${strategia.approccio}`);
    if (lines.length > 0) {
      targetingCtx = `\n\nTARGETING RECENTE (generato da Trova Clienti):\n${lines.join("\n")}\nUsa queste informazioni per personalizzare il piano di oggi.`;
    }
  }

  /* ── Determine content type based on day of week ── */
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
  // Lun/Mer/Ven → post | Mar/Gio → articolo | Sab/Dom → post
  const isArticleDay = dayOfWeek === 2 || dayOfWeek === 4;
  const contentType = isArticleDay ? "articolo" : "post";

  /* ── Day-specific search focus ── */
  const dayFocusMap: Record<number, string> = {
    0: "decision-maker che hanno pubblicato nel weekend",
    1: "Founder e CEO nel settore target",
    2: "VP Sales, Head of Sales, CRO",
    3: "aziende in fase di hiring (segnali di crescita)",
    4: "professionisti che hanno cambiato ruolo di recente",
    5: "C-level che pubblicano contenuti (thought leader)",
    6: "profili attivi che commentano nel settore",
  };
  const dayFocus = dayFocusMap[dayOfWeek] || dayFocusMap[1];

  /* ── Prospect context for follow-up ── */
  let prospectCtx = "";
  if (analyzedProspects && analyzedProspects.length > 0) {
    prospectCtx =
      "\n\nPROSPECT GIÀ ANALIZZATI (storico utente):\n" +
      analyzedProspects
        .map(
          (p) =>
            `- ${p.nome_ruolo} (analizzato ${p.giorni_fa} giorni fa)${p.contesto ? `: ${p.contesto}` : ""}`,
        )
        .join("\n") +
      "\nGenera follow-up MIRATI per quelli che meritano un'azione adesso.";
  }

  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ── Main prompt — generates all blocks in a single call ── */
  // NOTE: AI context (user's config: servizio, settore, clienteIdeale, etc.)
  // is automatically injected by callAI() from the DB system profile.
  const taskPrompt = `COMPITO: Genera il piano operativo COMPLETO di OGGI (${today}) per LinkedIn.

LA DATA DI OGGI È: ${today}. Il piano DEVE cambiare ogni giorno — mai ripetere le stesse cose.
FOCUS DELLA GIORNATA: oggi il focus sulle ricerche è su ${dayFocus}.
${targetingCtx}${prospectCtx}

Il piano deve coprire 3 blocchi, ognuno basato sulla configurazione dell'utente (servizio, target, settore, cliente ideale).

═══ BLOCCO 1 — LISTA DELLE PERSONE DA CONTATTARE ═══
Genera UNA query di ricerca avanzata LinkedIn specifica, diversa ogni giorno: ruoli, settori, keyword, area geografica.
Non generica — pronta da incollare su LinkedIn. Basata sul focus di oggi: ${dayFocus}.
Fornisci:
- "query": la stringa di ricerca avanzata LinkedIn (NON mostrare nell'UI — serve solo per costruire l'URL)
- "spiegazione": 3-4 righe che spieghino PERCHÉ oggi si contattano queste persone, quali segnali cercare nei loro profili, e come approcciare. Sii specifico e concreto — l'utente deve capire esattamente cosa fare.
- "url": URL LinkedIn Search funzionante (formato: https://www.linkedin.com/search/results/people/?keywords=PAROLE%20CHIAVE&origin=GLOBAL_SEARCH_HEADER)

═══ BLOCCO 4 — CONTENUTO DEL GIORNO (${contentType.toUpperCase()}) ═══
Oggi è giorno da ${contentType}.
${
  contentType === "post"
    ? `Genera un POST LinkedIn COMPLETO, lungo e articolato, pronto da copiare e incollare su LinkedIn.
- "tipo": "post"
- "hook": prima riga potente (quella che ferma lo scroll). DEVE essere provocatoria o counter-intuitive.
- "corpo": MINIMO 8-12 frasi scorrevoli. Tono conversazionale, umano, come se stessi parlando a un collega.
  NO elenchi puntati. NO elenchi numerati. NO frasi da AI come "In un mondo in cui...", "Ecco 5 consigli...", "Permettimi di condividere...".
  Usa paragrafi brevi (2-3 righe). Inserisci almeno un aneddoto o esempio concreto.
  Il post deve sembrare scritto da una persona VERA che condivide un'esperienza reale.
- "cta": call-to-action finale morbida, non commerciale
- "testo_completo": post INTERO pronto da pubblicare. DEVE essere identico a hook + \\n\\n + corpo + \\n\\n + cta.
  Il testo completo DEVE avere almeno 800 caratteri. Se è più corto, allungalo.`
    : `Genera un ARTICOLO LinkedIn COMPLETO, lungo e dettagliato, pronto da copiare e incollare.
- "tipo": "articolo"
- "titolo": titolo concreto e specifico (no clickbait)
- "angolo_editoriale": perché questo tema oggi, perché lo scrive questa persona (2-3 righe)
- "intro": introduzione coinvolgente (5-6 righe minimo)
- "sezione_1", "sezione_2", "sezione_3": oggetti con "titolo" e "contenuto".
  Ogni sezione DEVE avere un contenuto di almeno 5-8 righe. Scrivi in modo approfondito, con esempi concreti.
- "conclusione": punto di vista personale forte (3-4 righe minimo)
Tono umano, specifico, originale. NO frasi da AI. L'articolo completo deve superare i 2000 caratteri.`
}

═══ BLOCCO 5 — SPUNTI DAL WEB ═══
Genera 2-3 spunti REALMENTE utili e specifici per il settore dell'utente. NON generici.
Ogni spunto deve essere un tema/trend concreto e attuale nel settore del target dell'utente.
Per ogni spunto:
- "titolo": titolo concreto e specifico dell'argomento/trend (NON generico come "L'AI sta cambiando tutto")
- "fonte": nome di una fonte credibile e reale nel settore (es. "Il Sole 24 Ore", "TechCrunch", "Harvard Business Review", "McKinsey Quarterly", riviste di settore specifiche)
- "url": URL dell'homepage della fonte (es. "https://www.ilsole24ore.com", "https://techcrunch.com"). NON inventare articoli specifici.
- "rilevanza": 2-3 righe su perché QUESTO spunto è rilevante per QUESTO utente, collegandolo al suo servizio e al suo cliente ideale. Sii specifico.
- "angolo_post": suggerimento concreto di angolo per un post LinkedIn — NON generico, deve includere il tema specifico e il punto di vista da adottare
- "angolo_articolo": suggerimento concreto di angolo per un articolo LinkedIn — con struttura suggerita e domanda centrale

═══ REGOLE FONDAMENTALI ═══
- Rispondi ESCLUSIVAMENTE in italiano
- OGNI elemento deve essere personalizzato sul servizio, target, settore e posizionamento dell'utente
- Non usare MAI placeholder come [nome], [azienda] — scrivi tipologie concrete e realistiche
- Tono: consulente esperto seduto al tavolo col cliente. Diretto, pragmatico, zero fuffa.
- NESSUNA frase motivazionale vuota, nessun cliché da guru.
- Contenuti LUNGHI e completi — l'utente deve poter copiare e incollare senza modifiche.

Rispondi SOLO con un oggetto JSON con questa struttura esatta:
{
  "ricerca_linkedin": { "query": "...", "spiegazione": "...", "url": "..." },
  "contenuto_del_giorno": { ${contentType === "post" ? '"tipo":"post","hook":"...","corpo":"...","cta":"...","testo_completo":"..."' : '"tipo":"articolo","titolo":"...","angolo_editoriale":"...","intro":"...","sezione_1":{"titolo":"...","contenuto":"..."},"sezione_2":{"titolo":"...","contenuto":"..."},"sezione_3":{"titolo":"...","contenuto":"..."},"conclusione":"..."'} },
  "spunti_web": [ { "titolo": "...", "fonte": "...", "url": "...", "rilevanza": "...", "angolo_post": "...", "angolo_articolo": "..." }, ... ]
}`;

  return callAI({
    taskType: "daily_plan",
    schema: dailyPlanV2Schema,
    taskPrompt,
    userInput: `Genera il piano operativo completo per oggi ${today}. Focus contatti: ${dayFocus}. Tipo contenuto: ${contentType}. Contenuti LUNGHI e completi.`,
  });
}
