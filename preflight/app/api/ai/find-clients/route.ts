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

Il tuo compito: identificare le CATEGORIE di persone più utili da contattare adesso su LinkedIn, basandoti sul posizionamento e sul servizio dell'utente. NON collegarti a LinkedIn, NON inventare contatti reali, NON simulare scraping. Il tuo output guida l'utente a capire CHI contattare e PERCHÉ.

DATI FORNITI DALL'UTENTE:
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
- NON presentare questo come "una ricerca" — presentalo come categorie di persone da contattare
- Il tono deve essere: professionale, preciso, strategico, onesto, senza hype

REGOLE PER I LINK DI RICERCA LINKEDIN:
- Formato: https://www.linkedin.com/search/results/people/?keywords=...
- Usa %20 per gli spazi
- Usa SOLO ruolo + 1-2 qualificatori forti + città/geografia se rilevante
- NON concatenare tutti i dati dell'utente nella query — la ricerca deve restituire risultati reali
- Se il targeting rischia di essere troppo stretto, allarga automaticamente: rimuovi un qualificatore, espandi da città a regione, usa un sinonimo di ruolo più ampio
- Preferisci risultati utili a ricerche troppo precise ma vuote

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "categoria_prioritaria": {
    "titolo": "<nome breve della categoria — es: Proprietari di studi dentistici a Milano>",
    "descrizione": "<descrizione concisa di chi sono queste persone, che ruolo hanno, in che contesto operano — 2-3 frasi>",
    "perche_ora": "<perché questa categoria è la più rilevante da contattare adesso, basandoti sul servizio e sul posizionamento dell'utente — 2-3 frasi>",
    "link_ricerca_linkedin": "<URL LinkedIn pronto — solo ruolo + 1-2 qualificatori + geografia>"
  },
  "categorie_alternative": [
    {
      "titolo": "<nome breve della seconda categoria>",
      "descrizione": "<descrizione concisa — 1-2 frasi>",
      "perche_ora": "<perché vale la pena considerarla — 1-2 frasi>",
      "link_ricerca_linkedin": "<URL LinkedIn pronto>"
    },
    {
      "titolo": "<nome breve della terza categoria>",
      "descrizione": "<descrizione concisa — 1-2 frasi>",
      "perche_ora": "<perché vale la pena considerarla — 1-2 frasi>",
      "link_ricerca_linkedin": "<URL LinkedIn pronto>"
    }
  ],
  "come_scegliere_profili": {
    "ruolo_decisionale": "<come capire se la persona ha potere decisionale — segnali concreti da cercare nel profilo>",
    "chiarezza_profilo": "<come valutare se il profilo è completo e la persona è attiva e raggiungibile>",
    "attivita_recente": "<segnali di attività recente: pubblica, commenta, cambia ruolo, fa hiring>",
    "rilevanza_problema": "<come capire dal profilo se questa persona ha il problema che l'utente risolve>",
    "contesto_aziendale": "<come valutare l'azienda: dimensione, fase, settore, fit con l'offerta>",
    "chi_evitare": "<chi NON contattare per primo e perché — profili che sembrano adatti ma non lo sono>"
  },
  "strategia_contatto": {
    "approccio": "<strategia raccomandata in 4-5 step concreti: visita il profilo, leggi i post, commenta con valore, invia richiesta, dopo l'accettazione manda il primo messaggio>",
    "primo_messaggio": "<messaggio breve (max 300 caratteri), naturale, senza pitch — una domanda intelligente o un riferimento a qualcosa del profilo>",
    "angolo_followup": "<dopo il primo messaggio, qual è l'angolo per il follow-up — cosa chiedere, come proseguire>"
  },
  "prossimo_step": "<suggerimento chiaro su cosa fare dopo: aprire una lista, analizzare i profili trovati, iniziare una conversazione>"
}`;

    const output = await generateStructured({ prompt, schema: findClientsSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[find-clients] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
