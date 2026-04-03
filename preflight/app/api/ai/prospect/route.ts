import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  linkedin_url: z.string().min(1),
  website_url: z.string().optional().default(""),
  context: z.string().optional().default(""),
  pdf_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prospect input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { linkedin_url, website_url, context, pdf_text } = parsed.data;
  const inputParts: string[] = [`Profilo LinkedIn: ${linkedin_url}`];
  if (pdf_text) inputParts.push(`Informazioni extra dal PDF: ${pdf_text}`);
  if (website_url) inputParts.push(`Sito web: ${website_url}`);
  if (context) inputParts.push(`Contesto fornito: ${context}`);

  const taskPrompt = `COMPITO: Analizza il profilo di un potenziale cliente LinkedIn.

IMPORTANTE: Basa l'analisi ESCLUSIVAMENTE sulle informazioni fornite dall'utente (URL LinkedIn, testo PDF del profilo, sito web, contesto aggiuntivo). NON inventare dettagli che non sono presenti nell'input. Se le informazioni sono limitate (es. solo un URL senza PDF), dillo esplicitamente nella sintesi e abbassa la confidenza.

Se l'utente ha fornito il TESTO del profilo (PDF), analizzalo in profondità:
- Leggi ogni sezione: headline, about, esperienze, competenze, post recenti
- Identifica segnali commerciali concreti (assunzioni, crescita, cambi ruolo, post su temi specifici)
- Estrai il tono comunicativo e il posizionamento reale della persona

USA il contesto commerciale dell'utente per:
- Determinare il FIT tra il prospect e l'offerta dell'utente
- Personalizzare i messaggi in base al servizio e differenziatore dell'utente
- Valutare il prospect rispetto al cliente ideale dell'utente
- Suggerire un angolo di attacco basato sul problema che l'utente risolve

REGOLE per i messaggi:
- Devono essere PRONTI DA COPIARE su LinkedIn
- Personalizzati sul profilo analizzato E sull'offerta dell'utente
- Tono professionale ma umano, MAI commerciale o insistente
- Nota di connessione: max 300 caratteri
- Se non hai abbastanza info sul prospect, i messaggi devono essere generici ma intelligenti

Score: 0-30 freddo, 31-60 potenziale, 61-80 buon match, 81-100 eccellente.
Se hai poche info, lo score non può essere sopra 60 e la confidenza deve essere "Bassa".

Restituisci JSON:
{
  "score": <0-100>,
  "chi_e": "<ruolo, settore, posizionamento>",
  "ruolo_contesto": "<ruolo dettagliato, contesto aziendale>",
  "verdetto": {
    "vale_la_pena": "<Sì | No | Debole>",
    "priorita": "<Alta | Media | Bassa>",
    "confidenza": "<Alta | Media | Bassa>",
    "sintesi": "<1 frase secca>"
  },
  "segnali": [
    { "tipo": "<tipo>", "significato": "<significato>", "implicazione_commerciale": "<implicazione>" }
  ],
  "perche": {
    "fit_con_target": "<perché in target, in relazione all'offerta utente>",
    "timing": "<perché è il momento giusto>",
    "potenziale": "<potenziale commerciale>"
  },
  "angolo_attacco": {
    "tema": "<tema specifico>",
    "leva": "<leva commerciale>",
    "cosa_evitare": "<cosa NON fare>"
  },
  "nota_connessione": "<max 300 char>",
  "primo_messaggio": "<primo DM contestuale>",
  "followup": {
    "quando": "<dopo quanti giorni>",
    "cosa_citare": "<elemento da citare>",
    "obiettivo": "<obiettivo>",
    "messaggio": "<testo follow-up>"
  },
  "errori_da_evitare": ["<errore 1>", "<errore 2>", "<errore 3>"],
  "prossimo_step": "<azione concreta>",
  "client_heat_level": "<Cold | Warm | Hot>",
  "priority_signal": "<high | medium | low>"
}`;

  return callAI({
    taskType: "analyze_profile",
    schema: prospectAnalyzerSchema,
    taskPrompt,
    userInput: inputParts.join("\n"),
    contextOptions: { prospectLinkedinUrl: linkedin_url },
    extractProspect: (output) => ({
      linkedinUrl: linkedin_url,
      name: String(output.chi_e || "").slice(0, 100),
      heatLevel: String(output.client_heat_level || "Cold"),
      priority: String(output.priority_signal || "low"),
      summary: String(output.verdetto?.sintesi || output.chi_e || ""),
    }),
  });
}
