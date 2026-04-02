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
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input non valido", details: parsed.error.flatten() }, { status: 400 });
  }

  const { ruolo_target, settore, area_geografica, citta, dimensione, fase_azienda, problema_cliente } = parsed.data;

  const faseLabels: Record<string, string> = {
    early_stage: "early stage", crescita: "in fase di crescita",
    strutturata: "strutturata", non_so: "fase non specificata",
  };

  const userInput = [
    `Chi vuole contattare: ${ruolo_target}`,
    settore ? `Settore: ${settore}` : "",
    area_geografica ? `Area geografica: ${area_geografica}` : "",
    citta ? `Città: ${citta}` : "",
    dimensione ? `Dimensione azienda: ${dimensione}` : "",
    fase_azienda ? `Fase azienda: ${faseLabels[fase_azienda] || fase_azienda}` : "",
    problema_cliente ? `Problema del cliente: ${problema_cliente}` : "",
  ].filter(Boolean).join("\n");

  const taskPrompt = `COMPITO: Identifica le CATEGORIE di persone più utili da contattare ORA su LinkedIn.

Per ciascuna categoria genera messaggi PRONTI DA COPIARE e una checklist operativa. NON collegarti a LinkedIn, NON inventare contatti reali.
IMPORTANTE: Usa il contesto commerciale dell'utente (servizio, cliente ideale, problema, differenziatore) per personalizzare ogni suggerimento.

REGOLE:
- Sii preciso, strategico, naturale — MAI motivazionale o generico
- Ogni messaggio: max 300 caratteri, NO pitch, NO link, tono umano e personale
- Link LinkedIn: https://www.linkedin.com/search/results/people/?keywords=... (usa %20)
- Se il targeting è troppo stretto, allarga: sinonimo ruolo, espandi da città a regione
- Rispondi SOLO in italiano

STRUTTURA JSON:
{
  "riepilogo_strategia": "<2-3 frasi su chi contattare e perché>",
  "categoria_prioritaria": {
    "titolo": "<nome breve>", "descrizione": "<2-3 frasi>", "perche_ora": "<2-3 frasi>",
    "segnali_profilo": "<segnali da cercare>", "link_ricerca_linkedin": "<URL>",
    "messaggio_connessione": "<max 300char>", "messaggio_dopo_accettazione": "<max 300char>"
  },
  "categorie_alternative": [
    { "titolo": "", "descrizione": "", "perche_ora": "", "segnali_profilo": "", "link_ricerca_linkedin": "", "messaggio_connessione": "" },
    { "...stessa struttura..." }
  ],
  "checklist_azioni": ["<Azione 1>", "<Azione 2>", "<Azione 3>", "<Azione 4>", "<Azione 5>"],
  "criteri_selezione": { "segnali_positivi": "", "red_flags": "", "attivita_recente": "" },
  "strategia_contatto": { "approccio_step": "", "primo_messaggio": "", "followup_48h": "", "followup_5g": "" },
  "prossimo_step": "<cosa fare dopo>"
}`;

  return callAI({
    taskType: "find_clients",
    schema: findClientsSchema,
    taskPrompt,
    userInput,
  });
}
