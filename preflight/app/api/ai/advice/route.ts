import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { adviceSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  situation: z.string().min(1),
  linkedin_url: z.string().optional().default(""),
  website_url: z.string().optional().default(""),
  pdf_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid advice input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { situation, linkedin_url, website_url, pdf_text } = parsed.data;
  const extraParts: string[] = [situation];
  if (linkedin_url) extraParts.push(`Profilo LinkedIn: ${linkedin_url}`);
  if (pdf_text) extraParts.push(`Informazioni dal PDF: ${pdf_text}`);
  if (website_url) extraParts.push(`Sito web: ${website_url}`);

  const taskPrompt = `COMPITO: L'utente chiede un consiglio su una situazione reale su LinkedIn.

USA il contesto commerciale dell'utente per personalizzare il consiglio: considera il suo servizio, il suo cliente ideale, il suo modello di vendita e il suo differenziatore.

Restituisci JSON:
{
  "lettura_situazione": "<analisi della dinamica>",
  "strategia_consigliata": "<strategia dettagliata>",
  "risposta_suggerita": "<risposta/messaggio pronto da usare>",
  "followup_consigliato": "<follow-up con tempistica>",
  "step_successivi": "<passi concreti>",
  "errori_da_evitare": "<errori comuni>",
  "client_heat_level": "<Cold | Warm | Hot>"
}`;

  return callAI({
    taskType: "ask_advice",
    schema: adviceSchema,
    taskPrompt,
    userInput: extraParts.join("\n"),
    contextOptions: linkedin_url ? { prospectLinkedinUrl: linkedin_url } : undefined,
  });
}
