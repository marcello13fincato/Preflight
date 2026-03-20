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

Sei l'Assistente Preflight — motore di selezione prospect su LinkedIn.

COMPITO: identifica le CATEGORIE di persone più utili da contattare ORA su LinkedIn. Per ciascuna categoria genera messaggi PRONTI DA COPIARE e una checklist operativa. NON collegarti a LinkedIn, NON inventare contatti reali. Il tuo output deve essere 100% azionabile.

DATI FORNITI DALL'UTENTE:
- Chi vuole contattare: ${ruolo_target}
${settore ? `- Settore: ${settore}` : ""}
${area_geografica ? `- Area geografica: ${area_geografica}` : ""}
${citta ? `- Città / area locale: ${citta}` : ""}
${dimensione ? `- Dimensione azienda: ${dimensione}` : ""}
${fase_azienda ? `- Fase azienda: ${faseLabels[fase_azienda] || fase_azienda}` : ""}
${problema_cliente ? `- Problema del cliente: ${problema_cliente}` : ""}
${formatProfileContext(profile) || ""}

REGOLE:
- Sii preciso, strategico, naturale — MAI motivazionale o generico
- Ogni messaggio: max 300 caratteri, NO pitch, NO link, tono umano e personale
- I messaggi devono sembrare scritti da una persona vera, non da un bot
- Rispondi SOLO in italiano
- Link LinkedIn: https://www.linkedin.com/search/results/people/?keywords=... (usa %20, max ruolo + 1-2 qualificatori + geografia)
- Se il targeting è troppo stretto, allarga: sinonimo ruolo, espandi da città a regione

STRUTTURA JSON DA RESTITUIRE:
{
  "riepilogo_strategia": "<2-3 frasi di sintesi: chi contattare, perché, e con quale angolo>",
  "categoria_prioritaria": {
    "titolo": "<nome breve — es: CEO di agenzie marketing a Milano>",
    "descrizione": "<chi sono, che ruolo hanno, che contesto — 2-3 frasi>",
    "perche_ora": "<perché sono la scelta #1 da contattare adesso — 2-3 frasi>",
    "segnali_profilo": "<cosa cercare nel loro profilo LinkedIn per capire se sono un buon contatto — 2-3 segnali concreti>",
    "link_ricerca_linkedin": "<URL LinkedIn>",
    "messaggio_connessione": "<nota di connessione breve, max 300char, naturale, senza pitch>",
    "messaggio_dopo_accettazione": "<primo DM dopo l'accettazione, max 300char, domanda intelligente legata al loro profilo>"
  },
  "categorie_alternative": [
    {
      "titolo": "<nome breve>",
      "descrizione": "<1-2 frasi>",
      "perche_ora": "<1-2 frasi>",
      "segnali_profilo": "<segnali da cercare nel profilo>",
      "link_ricerca_linkedin": "<URL>",
      "messaggio_connessione": "<nota connessione max 300char>"
    },
    { "...stessa struttura..." }
  ],
  "checklist_azioni": [
    "<Azione 1 precisa — es: Apri il link LinkedIn e filtra per 'Persone'>",
    "<Azione 2 — es: Seleziona i primi 10 profili con foto e headline chiara>",
    "<Azione 3 — es: Invia richiesta con la nota di connessione suggerita>",
    "<Azione 4 — es: Dopo l'accettazione, invia il primo DM entro 24h>",
    "<Azione 5 — es: Se non rispondono entro 48h, invia il follow-up>"
  ],
  "criteri_selezione": {
    "segnali_positivi": "<3-4 segnali concreti che indicano un buon prospect — es: pubblica regolarmente, headline con ruolo decisionale, azienda in crescita>",
    "red_flags": "<3-4 segnali che indicano chi NON contattare — es: profilo incompleto, ultimo post > 6 mesi fa, ruolo junior>",
    "attivita_recente": "<come valutare se la persona è attiva: pubblica, commenta, cambia ruolo, fa hiring>"
  },
  "strategia_contatto": {
    "approccio_step": "<sequenza in 4-5 step: visita profilo → leggi post → commenta con valore → invia richiesta → dopo accettazione manda DM>",
    "primo_messaggio": "<messaggio breve, naturale, max 300char — domanda intelligente o riferimento al profilo>",
    "followup_48h": "<messaggio follow-up 48h dopo, max 300char, gentile ma non insistente>",
    "followup_5g": "<ultimo follow-up 5 giorni dopo, max 300char, proponi valore concreto>"
  },
  "prossimo_step": "<cosa fare dopo aver completato la checklist>"
}`;

    const output = await generateStructured({ prompt, schema: findClientsSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[find-clients] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
