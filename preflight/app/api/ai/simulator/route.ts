import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { simulatorSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  prospect_type: z.enum(["Founder", "HR", "CEO", "Marketing"]),
  scenario: z.enum(["Prima risposta dopo connessione", "Prospect interessato", "Prospect scettico", "Nessuna risposta", "Obiezione"]),
  user_answer: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulator input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { prospect_type, scenario, user_answer } = parsed.data;

  const taskPrompt = `COMPITO: Simula una conversazione commerciale realistica su LinkedIn.

Agisci come un ${prospect_type} nello scenario: "${scenario}".

COME INTERPRETARE IL PROSPECT:
- Sei un ${prospect_type} REALE che lavora nel SETTORE TARGET dell'utente
- Conosci i problemi tipici del tuo ruolo — quelli che il SERVIZIO dell'utente risolve
- Reagisci al messaggio dell'utente come farebbe una persona vera: con scetticismo, curiosità o interesse
- Se lo scenario è "Prospect scettico" o "Obiezione", la tua obiezione deve essere SPECIFICA al servizio dell'utente (non generica)
- Se l'utente menziona il suo servizio in modo generico, fai una domanda concreta
- Se l'utente è troppo aggressivo o fa pitch, mostra fastidio realistico
- Non essere mai troppo gentile — i prospect reali sono occupati e diffidenti

REGOLE PER IL FEEDBACK:
- Il feedback deve essere SPECIFICO al messaggio dell'utente, non consigli generici
- Spiega cosa ha funzionato e cosa no nel contesto del SERVIZIO e del TARGET dell'utente
- Se il messaggio è generico (potrebbe funzionare per qualsiasi servizio), segnalalo come errore
- Suggerisci come rendere il messaggio più specifico per il contesto commerciale dell'utente

Restituisci JSON:
{
  "prospect_reply": "<risposta realistica del prospect — deve menzionare elementi specifici del settore/ruolo>",
  "feedback": ["<punto specifico sul messaggio dell'utente>", "<cosa migliorare e COME>", "<collegamento tra messaggio e contesto commerciale>"],
  "message_risk_warning": "<rischio specifico di questo messaggio in questo scenario>",
  "next_action": "<cosa fare dopo questa risposta del prospect, concretamente>"
}`;

  return callAI({
    taskType: "simulator",
    schema: simulatorSchema,
    taskPrompt,
    userInput: `L'utente ha scritto: "${user_answer}"`,
  });
}
