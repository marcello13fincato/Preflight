import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
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
    const { ruolo_target, settore, area_geografica, citta, dimensione, fase_azienda, problema_cliente, profile } = parsed.data;

    const faseLabels: Record<string, string> = {
      early_stage: "early stage",
      crescita: "in fase di crescita",
      strutturata: "strutturata",
      non_so: "fase non specificata",
    };

    const prompt = `${salesRules}

Sei l'Assistente Preflight — motore strategico di targeting LinkedIn.

Il tuo compito: costruire una strategia di targeting LinkedIn precisa, analitica e immediatamente azionabile basata sui dati forniti dall'utente. NON collegarti a LinkedIn, NON inventare contatti, NON simulare scraping. Il tuo output guida l'utente a trovare e contattare le persone giuste.

DATI DI TARGETING FORNITI DALL'UTENTE:
- Ruolo target: ${ruolo_target}
${settore ? `- Settore: ${settore}` : ""}
${area_geografica ? `- Area geografica: ${area_geografica}` : ""}
${citta ? `- Città o area locale: ${citta}` : ""}
${dimensione ? `- Dimensione azienda: ${dimensione}` : ""}
${fase_azienda ? `- Fase azienda: ${faseLabels[fase_azienda] || fase_azienda}` : ""}
${problema_cliente ? `- Problema principale del cliente: ${problema_cliente}` : ""}
${formatProfileContext(profile) || ""}

REGOLE DI COMPORTAMENTO:
- Sii preciso, analitico, strategico, naturale
- NON essere motivazionale, generico o aggressivo
- NON inventare contatti o profili specifici
- NON fingere di accedere a LinkedIn
- Ogni suggerimento deve essere azionabile e concreto
- Rispondi ESCLUSIVAMENTE in italiano

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "profilo_ideale": "<descrizione precisa e analitica di chi contattare: chi è questa persona, che ruolo ha, in che tipo di azienda lavora, perché è il target giusto — 3-5 frasi>",
  "ruoli_da_cercare": {
    "principali": ["<ruolo 1>", "<ruolo 2>", "<ruolo 3>"],
    "alternativi": ["<ruolo alternativo 1>", "<ruolo alternativo 2>", "<ruolo alternativo 3>"]
  },
  "keyword_consigliate": ["<combinazione keyword 1>", "<combinazione keyword 2>", "<combinazione keyword 3>", "<combinazione keyword 4>", "<combinazione keyword 5>"],
  "filtri_linkedin": {
    "settore": "<settori consigliati da selezionare nella ricerca LinkedIn>",
    "geografia": "<filtri geografici consigliati, inclusa la città se specificata>",
    "dimensione_azienda": "<filtro dimensione aziendale da selezionare>",
    "segnali": "<segnali da osservare: pubblicazioni recenti, cambi di ruolo, crescita aziendale, ecc.>"
  },
  "ricerca_linkedin_pronta": "<query di ricerca leggibile e comprensibile da un umano — es: Founder SaaS B2B a Milano con focus su marketing automation>",
  "link_ricerca_linkedin": "<URL di ricerca LinkedIn pronto — formato: https://www.linkedin.com/search/results/people/?keywords=... — usa %20 per gli spazi nelle keyword>",
  "come_scegliere_profili": {
    "ruolo_decisionale": "<come capire se la persona ha potere decisionale — segnali da cercare nel profilo>",
    "segnali_attivita": "<segnali di attività recente: pubblica, commenta, cambia ruolo, fa hiring>",
    "allineamento_tematico": "<come capire se i contenuti del profilo si allineano al servizio dell'utente>",
    "fit_servizio": "<come valutare se questa persona ha effettivamente il problema che l'utente risolve>"
  },
  "strategia_contatto": "<strategia in 4-5 step concreti: 1. visita il profilo 2. leggi gli ultimi post 3. commenta con valore 4. invia richiesta di connessione 5. dopo l'accettazione manda il primo messaggio>",
  "primo_messaggio": "<messaggio breve (max 300 caratteri), naturale, non aggressivo, senza pitch — una domanda intelligente o un riferimento a qualcosa del profilo>",
  "prossimo_step": "<cosa fare dopo aver ottenuto questo targeting: analizzare un profilo trovato con Preflight, inserirlo nella pipeline, preparare follow-up>"
}`;

    const output = await generateStructured({ prompt, schema: findClientsSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[find-clients] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
