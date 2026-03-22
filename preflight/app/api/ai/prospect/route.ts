import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  linkedin_url: z.string().min(1),
  website_url: z.string().optional().default(""),
  context: z.string().optional().default(""),
  pdf_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  if (process.env.NODE_ENV !== "production") {
    console.log("[prospect] Received payload:", JSON.stringify(body));
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid prospect input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { linkedin_url, website_url, context, pdf_text, profile } = parsed.data;
    const inputParts: string[] = [`Profilo LinkedIn: ${linkedin_url}`];
    if (pdf_text) inputParts.push(`Informazioni extra dal PDF del profilo: ${pdf_text}`);
    if (website_url) inputParts.push(`Sito web: ${website_url}`);
    if (context) inputParts.push(`Contesto fornito dall'utente: ${context}`);

    const prompt = `${salesRules}

Sei un analista commerciale esperto di LinkedIn B2B. Stai analizzando il profilo di un potenziale cliente.
Rispondi ESCLUSIVAMENTE in italiano. Sii strategico, pratico e preciso.

REGOLE per i messaggi (nota_connessione, primo_messaggio, followup_3g, followup_7g):
- Devono essere PRONTI DA COPIARE e incollare su LinkedIn
- Personalizzati sul profilo analizzato
- Tono professionale ma umano, MAI commerciale o insistente
- La nota di connessione deve essere max 300 caratteri
- Il primo messaggio deve avere un hook preciso legato al loro profilo
- I follow-up devono essere naturali, non "hai visto il mio messaggio?"

REGOLE per punteggio (score):
- 0-30: Contatto freddo, poco allineato
- 31-60: Potenziale ma serve lavoro
- 61-80: Buon match, vale la pena investire tempo
- 81-100: Match eccellente, priorità assoluta

Restituisci SOLO un oggetto JSON con questa struttura:
{
  "score": <numero 0-100: punteggio compatibilità>,
  "chi_e": "<chi è, ruolo, settore, posizionamento — max 2 frasi>",
  "ruolo_contesto": "<ruolo nel dettaglio, cosa fa, contesto aziendale>",
  "punti_forza": ["<forza 1>", "<forza 2>", "<forza 3>"],
  "punti_deboli": ["<rischio/debolezza 1>", "<rischio/debolezza 2>"],
  "perche_buon_contatto": "<perché vale la pena contattarlo>",
  "strategia_contatto": "<strategia dettagliata step-by-step>",
  "nota_connessione": "<nota di connessione LinkedIn pronta, max 300 char>",
  "primo_messaggio": "<primo DM dopo accettazione, pronto da copiare>",
  "followup_3g": "<follow-up dopo 3 giorni se non risponde>",
  "followup_7g": "<follow-up dopo 7 giorni, ultimo tentativo>",
  "step_successivi": ["<step 1>", "<step 2>", "<step 3>"],
  "segnali_da_osservare": "<segnali positivi e negativi nella risposta>",
  "errori_da_evitare": "<errori comuni da evitare con questo tipo di contatto>",
  "client_heat_level": "<Cold | Warm | Hot>",
  "priority_signal": "<high | medium | low>"
}

Dati del prospect:
${inputParts.join("\n")}

${formatProfileContext(profile) || "Profilo utente: non configurato"}`;
    const output = await generateStructured({ prompt, schema: prospectAnalyzerSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    if (process.env.NODE_ENV !== "production") {
      console.error("[prospect] AI error:", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
