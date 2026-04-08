import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { articoloSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  topic: z.string(),
  angle: z.string().optional().default(""),
  target_audience: z.string().optional().default(""),
  tone: z.string().optional().default("professionale"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { topic, angle, target_audience, tone } = parsed.data;

  const taskPrompt = `COMPITO: Scrivi un articolo LinkedIn (LinkedIn Article / Newsletter) completo e ottimizzato.

REGOLE LINKEDIN ARTICLES:
- Lunghezza ideale: 1000-2000 parole
- Struttura con titoli H2 chiari e scannable
- Primo paragrafo deve catturare l'attenzione (hook forte)
- Ogni sezione deve portare valore concreto, non filler
- Usa elenchi puntati dove serve per rendere il testo scannable
- Conclusione con CTA chiaro che inviti all'azione
- Meta description ottimizzata per SEO LinkedIn (max 160 caratteri)
- Tono: autorevole ma accessibile, da esperto del settore

PERSONALIZZAZIONE OBBLIGATORIA:
- L'articolo deve essere scritto DAL PUNTO DI VISTA dell'utente, come esperto del suo servizio specifico
- Il target reader è il CLIENTE IDEALE dell'utente — scrivi per lui
- Gli esempi e i casi devono essere coerenti con il SETTORE dell'utente
- La CTA finale deve portare verso il SERVIZIO dell'utente in modo naturale
- Il tono deve corrispondere ai tone samples dell'utente (se disponibili)
- L'articolo deve dimostrare l'expertise dell'utente nel suo campo specifico, non competenze generiche

ANTI-GENERICITÀ:
- Se il topic è generico ("leadership", "innovazione"), angolalo sul settore e servizio dell'utente
- Ogni sezione deve contenere almeno un riferimento specifico al contesto dell'utente
- Se l'articolo potesse essere firmato da chiunque, è sbagliato — deve essere riconoscibile come scritto da QUESTA persona

Restituisci JSON:
{
  "titolo": "<titolo articolo ottimizzato SEO — deve riflettere l'expertise dell'utente>",
  "sottotitolo": "<sottotitolo che espande il titolo>",
  "sezioni": [
    { "titolo_sezione": "<H2>", "contenuto": "<testo della sezione, 150-400 parole>" }
  ],
  "conclusione": "<paragrafo conclusivo con sintesi e visione — collegato al servizio dell'utente>",
  "cta_finale": "<call to action naturale verso il servizio dell'utente>",
  "meta_description": "<max 160 caratteri, ottimizzata SEO>",
  "suggerimento_immagine": { "tipo": "<tipo immagine>", "descrizione": "<descrizione per generazione>" }
}

Genera almeno 4-6 sezioni sostanziose.`;

  return callAI({
    taskType: "articolo",
    schema: articoloSchema,
    taskPrompt,
    userInput: `Argomento: ${topic}${angle ? `\nAngolo/prospettiva: ${angle}` : ""}${target_audience ? `\nTarget audience: ${target_audience}` : ""}\nTono: ${tone}`,
  });
}
