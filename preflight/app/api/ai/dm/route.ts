import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { dmAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  pasted_chat_thread: z.string(),
  conversation_goal: z.enum(["understand_fit", "continue_conversation", "move_to_dm", "propose_call", "follow_up"]),
  prospect_profile_text: z.string().optional().default(""),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[dm] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid dm input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { pasted_chat_thread, conversation_goal, prospect_profile_text, profile } = parsed.data;
    const prompt = `${salesRules}

Stai analizzando una conversazione DM su LinkedIn. Rispondi ESCLUSIVAMENTE in italiano. Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "best_reply": "<stringa: la migliore risposta da inviare adesso, in italiano>",
  "client_heat_level": "<uno tra: Cold | Warm | Hot>",
  "message_risk_warning": "<stringa: rischio nell'invio di questo messaggio, o 'nessuno'>",
  "alternatives": {
    "short": "<stringa: versione più breve della risposta, in italiano>",
    "assertive": "<stringa: versione più diretta e assertiva, in italiano>"
  },
  "qualifying_questions": [
    "<stringa: domanda qualificante 1, in italiano>",
    "<stringa: domanda qualificante 2, in italiano>",
    "<stringa: domanda qualificante 3, in italiano>"
  ],
  "followups": {
    "48h": "<stringa: messaggio follow-up dopo 48 ore, in italiano>",
    "5d": "<stringa: messaggio follow-up dopo 5 giorni, in italiano>",
    "10d": "<stringa: messaggio follow-up dopo 10 giorni, in italiano>"
  },
  "next_action": "<stringa: prossimo passo concreto, in italiano>"
}

Contesto:
- Thread conversazione: ${pasted_chat_thread}
- Obiettivo: ${conversation_goal}
- Profilo prospect: ${prospect_profile_text || "non fornito"}
- Profilo utente: ${JSON.stringify(profile)}`;
    const output = await generateStructured({ prompt, schema: dmAssistantSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[dm] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
