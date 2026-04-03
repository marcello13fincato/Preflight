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
- Evita: linguaggio generico, frasi vuote, clickbait

USA il contesto commerciale dell'utente per:
- Allineare l'articolo al suo posizionamento e expertise
- Parlare al suo cliente ideale
- Dimostrare autorevolezza nel suo campo specifico

Restituisci JSON:
{
  "titolo": "<titolo articolo ottimizzato SEO>",
  "sottotitolo": "<sottotitolo che espande il titolo>",
  "sezioni": [
    { "titolo_sezione": "<H2>", "contenuto": "<testo della sezione, 150-400 parole>" }
  ],
  "conclusione": "<paragrafo conclusivo con sintesi e visione>",
  "cta_finale": "<call to action finale>",
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
