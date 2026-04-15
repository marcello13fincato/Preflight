import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { findClientsSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  ruolo_target: z.string().min(1).max(2000),
  settore: z.string().max(500).optional(),
  area_geografica: z.string().max(500).optional(),
  citta: z.string().max(500).optional(),
  dimensione: z.enum(["", "freelance", "startup", "PMI", "enterprise"]).optional(),
  fase_azienda: z.enum(["", "early_stage", "crescita", "strutturata", "non_so"]).optional(),
  problema_cliente: z.string().max(2000).optional(),
  linkedin_profile_url: z.string().url().max(500).optional(),
  pdf_text: z.string().max(5000).optional(),
  profile: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input non valido", details: parsed.error.flatten() }, { status: 400 });
  }

  const { ruolo_target, settore, area_geografica, citta, dimensione, fase_azienda, problema_cliente, linkedin_profile_url, pdf_text, profile } = parsed.data;

  const faseLabels: Record<string, string> = {
    early_stage: "early stage", crescita: "in fase di crescita",
    strutturata: "strutturata", non_so: "fase non specificata",
  };

  // Build profile context from onboarding data
  const profileLines: string[] = [];
  if (profile) {
    const p = profile as Record<string, unknown>;
    if (p.cosa_vendi) profileLines.push(`Cosa vende: ${p.cosa_vendi}`);
    if (p.cliente_ideale) profileLines.push(`Cliente ideale: ${p.cliente_ideale}`);
    if (p.problema_cliente) profileLines.push(`Problema che risolve: ${p.problema_cliente}`);
    if (p.proposta_valore) profileLines.push(`Proposta di valore: ${p.proposta_valore}`);
    if (p.settore) profileLines.push(`Settore dell'utente: ${p.settore}`);
    if (p.tono_voce) profileLines.push(`Tono di voce preferito: ${p.tono_voce}`);
  }

  const userInput = [
    `Chi vuole contattare: ${ruolo_target}`,
    settore ? `Settore: ${settore}` : "",
    area_geografica ? `Area geografica: ${area_geografica}` : "",
    citta ? `Città: ${citta}` : "",
    dimensione ? `Dimensione azienda: ${dimensione}` : "",
    fase_azienda ? `Fase azienda: ${faseLabels[fase_azienda] || fase_azienda}` : "",
    problema_cliente ? `Problema del cliente: ${problema_cliente}` : "",
    linkedin_profile_url ? `Profilo LinkedIn di riferimento: ${linkedin_profile_url}` : "",
    pdf_text ? `Contenuto PDF profilo: ${pdf_text}` : "",
    profileLines.length > 0 ? `\nPROFILO COMMERCIALE DELL'UTENTE (usa per personalizzare messaggi e strategie):\n${profileLines.join("\n")}` : "",
  ].filter(Boolean).join("\n");

  const taskPrompt = `COMPITO: Identifica CATEGORIE SPECIFICHE di persone da contattare ORA su LinkedIn basandoti ESCLUSIVAMENTE sui filtri forniti dall'utente.

REGOLE FONDAMENTALI:
1. OGNI risultato DEVE derivare direttamente dai filtri inseriti dall'utente — nessun suggerimento inventato o generico
2. Le categorie devono essere DIVERSE tra loro: ruoli, settori o livelli diversi
3. I segnali_profilo devono essere OSSERVABILI su LinkedIn (headline, post recenti, job title, attività)
4. Messaggi: max 300 caratteri, ZERO pitch, ZERO link, tono conversazionale e diretto come tra colleghi
5. Ogni azione della checklist deve essere CONCRETA (es: "Cerca 5 profili con keyword X" — non "Fai networking")
6. Link LinkedIn: https://www.linkedin.com/search/results/people/?keywords=... (usa %20 per spazi)
7. Se il targeting è troppo stretto, allarga con sinonimi di ruolo o area geografica più ampia
8. Rispondi SOLO in italiano
9. NON usare frasi motivazionali, cliché da business coach, o espressioni come "scalare", "game changer", "leverage"
10. Il riepilogo_strategia deve spiegare il RAGIONAMENTO: perché queste categorie per questo utente specifico

PERSONALIZZAZIONE (se disponibile il profilo commerciale dell'utente):
- Usa cosa vende l'utente per formulare messaggi pertinenti (non generici)
- Usa il problema che risolve per evidenziare segnali di fit nei profili target
- Adatta il tono dei messaggi al tono di voce preferito dall'utente
- Se l'utente ha un profilo LinkedIn di riferimento, cerca categorie SIMILI per ruolo/settore/seniority

ANTI-ALLUCINAZIONI:
- NON inventare nomi di persone reali o aziende reali
- NON suggerire categorie non collegate ai filtri dell'utente
- criteri_selezione deve contenere segnali CONCRETI visibili su un profilo LinkedIn, non concetti astratti
- Se l'utente non specifica settore/area, usa il contesto dal suo profilo commerciale
- Ogni messaggio deve essere SPECIFICO per la categoria target — mai riutilizzare lo stesso messaggio

QUALITÀ OUTPUT:
- riepilogo_strategia: 2-3 frasi che collegano i filtri utente → categorie scelte (es: "Dato che cerchi X nel settore Y, le categorie più efficaci sono...")
- perche_ora di ogni categoria: motivazione temporale specifica (trend di mercato, ciclo budget, hiring season)
- approccio_step: sequenza concreta in 2-3 frasi (non ripetere i messaggi)
- checklist_azioni: 5 azioni OPERATIVE e SEQUENZIALI, ognuna completabile in 10-15 minuti
- prossimo_step: 1 frase con azione specifica e tempistica

FORMATO JSON:
{
  "riepilogo_strategia": "<2-3 frasi: perché queste categorie per questi filtri>",
  "categoria_prioritaria": {
    "titolo": "<ruolo + contesto, max 8 parole>",
    "descrizione": "<2-3 frasi specifiche>",
    "perche_ora": "<motivazione temporale concreta>",
    "segnali_profilo": "<3-5 segnali osservabili su LinkedIn>",
    "link_ricerca_linkedin": "<URL con keywords pertinenti>",
    "messaggio_connessione": "<max 300 char, naturale>",
    "messaggio_dopo_accettazione": "<max 300 char, domanda specifica>"
  },
  "categorie_alternative": [
    { "titolo": "", "descrizione": "", "perche_ora": "", "segnali_profilo": "", "link_ricerca_linkedin": "", "messaggio_connessione": "" },
    { "titolo": "", "descrizione": "", "perche_ora": "", "segnali_profilo": "", "link_ricerca_linkedin": "", "messaggio_connessione": "" }
  ],
  "checklist_azioni": ["<Azione 1 concreta>", "<Azione 2>", "<Azione 3>", "<Azione 4>", "<Azione 5>"],
  "criteri_selezione": {
    "segnali_positivi": "<3-4 segnali concreti che indicano fit>",
    "red_flags": "<3-4 segnali che indicano di evitare il profilo>",
    "attivita_recente": "<cosa cercare nei post/attività recenti>"
  },
  "strategia_contatto": {
    "approccio_step": "<sequenza in 2-3 frasi>",
    "primo_messaggio": "<max 300 char>",
    "followup_48h": "<max 300 char>",
    "followup_5g": "<max 300 char>"
  },
  "prossimo_step": "<1 azione specifica con tempistica>"
}`;

  return callAI({
    taskType: "find_clients",
    schema: findClientsSchema,
    taskPrompt,
    userInput,
  });
}
