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

Il piano deve coprire 5 blocchi, ognuno basato sulla configurazione dell'utente (servizio, target, settore, cliente ideale).

═══ BLOCCO 1 — RICERCA LINKEDIN DEL GIORNO ═══
Genera UNA query di ricerca avanzata LinkedIn specifica, diversa ogni giorno: ruoli, settori, keyword, area geografica.
Non generica — pronta da incollare su LinkedIn. Basata sul focus di oggi: ${dayFocus}.
Fornisci:
- "query": la stringa di ricerca avanzata LinkedIn
- "spiegazione": 2 righe max su perché oggi cerchiamo questo tipo di profilo
- "url": URL LinkedIn Search funzionante (formato: https://www.linkedin.com/search/results/people/?keywords=PAROLE%20CHIAVE&origin=GLOBAL_SEARCH_HEADER)

═══ BLOCCO 2 — 5 PROFILI DA ANALIZZARE OGGI ═══
Partendo dalla ricerca del giorno, indica 5 TIPOLOGIE REALI E CREDIBILI di profilo da cercare (NON profili inventati — tipologie).
Per ognuno:
- "ruolo": ruolo specifico (es. "VP Sales in SaaS B2B da 50-200 dipendenti")
- "settore": settore di appartenenza
- "segnali": segnali da cercare nel profilo (es. "sta assumendo", "ha pubblicato di recente")
- "perche_interessante": perché questa persona è interessante ADESSO (segnale concreto)
- "tono_contatto": tono consigliato per l'approccio
- "prima_frase": prima frase suggerita per il contatto (max 200 char, naturale, non robotica)
- "priorita": "alta" o "media"
- "motivazione_priorita": una riga che motiva la priorità

═══ BLOCCO 4 — CONTENUTO DEL GIORNO (${contentType.toUpperCase()}) ═══
Oggi è giorno da ${contentType}.
${
  contentType === "post"
    ? `Genera un POST LinkedIn completo con:
- "tipo": "post"
- "hook": prima riga potente (quella che ferma lo scroll)
- "corpo": 3-5 frasi scorrevoli, tono umano, NO elenchi puntati, NO frasi da AI
- "cta": call-to-action finale morbida
- "testo_completo": post INTERO pronto da pubblicare (hook+corpo+cta)
NON usare MAI: "In un mondo in cui...", elenchi numerati, "Ecco 5 consigli..."
Il post deve sembrare scritto da una persona VERA, non da un'AI.`
    : `Genera un ARTICOLO LinkedIn con:
- "tipo": "articolo"
- "titolo": titolo concreto e specifico (no clickbait)
- "angolo_editoriale": perché questo tema oggi, perché lo scrive questa persona
- "intro": introduzione (3-4 righe)
- "sezione_1", "sezione_2", "sezione_3": oggetti con "titolo" e "contenuto"
- "conclusione": punto di vista personale
Tono umano, specifico, originale. NO frasi da AI.`
}

═══ BLOCCO 5 — SPUNTI DAL WEB ═══
Genera 2-3 spunti che SEMBRINO notizie/articoli recenti (ultimi 7 giorni) rilevanti per il settore dell'utente.
Per ogni spunto:
- "titolo": titolo dell'articolo
- "fonte": nome della fonte (es. "Il Sole 24 Ore", "TechCrunch", "Harvard Business Review")
- "url": URL credibile della fonte (NON inventare URL inesistenti — usa l'homepage della fonte se non hai l'URL esatto, es. "https://www.ilsole24ore.com")
- "rilevanza": una riga su perché è rilevante per l'utente
- "angolo_post": suggerimento di angolo per scrivere un post da questo spunto
- "angolo_articolo": suggerimento di angolo per scrivere un articolo da questo spunto

═══ REGOLE FONDAMENTALI ═══
- Rispondi ESCLUSIVAMENTE in italiano
- OGNI elemento deve essere personalizzato sul servizio, target, settore e posizionamento dell'utente
- Non usare MAI placeholder come [nome], [azienda] — scrivi tipologie concrete e realistiche
- Tono: consulente esperto seduto al tavolo col cliente. Diretto, pragmatico, zero fuffa.
- NESSUNA frase motivazionale vuota, nessun cliché da guru.

Rispondi SOLO con un oggetto JSON con questa struttura esatta:
{
  "ricerca_linkedin": { "query": "...", "spiegazione": "...", "url": "..." },
  "profili_da_analizzare": [ { "ruolo": "...", "settore": "...", "segnali": "...", "perche_interessante": "...", "tono_contatto": "...", "prima_frase": "...", "priorita": "alta|media", "motivazione_priorita": "..." }, ... ],
  "contenuto_del_giorno": { ${contentType === "post" ? '"tipo":"post","hook":"...","corpo":"...","cta":"...","testo_completo":"..."' : '"tipo":"articolo","titolo":"...","angolo_editoriale":"...","intro":"...","sezione_1":{"titolo":"...","contenuto":"..."},"sezione_2":{"titolo":"...","contenuto":"..."},"sezione_3":{"titolo":"...","contenuto":"..."},"conclusione":"..."'} },
  "spunti_web": [ { "titolo": "...", "fonte": "...", "url": "...", "rilevanza": "...", "angolo_post": "...", "angolo_articolo": "..." }, ... ]
}`;

  return callAI({
    taskType: "daily_plan",
    schema: dailyPlanV2Schema,
    taskPrompt,
    userInput: `Genera il piano operativo completo per oggi ${today}. Focus: ${dayFocus}. Tipo contenuto: ${contentType}.`,
  });
}
