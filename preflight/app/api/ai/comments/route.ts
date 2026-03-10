import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { commentAssistantSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  profile: z.unknown().optional(),
  original_post: z.string(),
  received_comment: z.string(),
  commenter_profile_text: z.string().optional().default(""),
  commenter_linkedin_url: z.string().max(500).optional(),
  conversation_goal: z.enum(["understand_fit", "continue_conversation", "move_to_dm", "propose_call", "follow_up"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("[comments] Received payload:", JSON.stringify(body));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comments input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { original_post, received_comment, commenter_profile_text, commenter_linkedin_url, conversation_goal, profile } = parsed.data;
    const prompt = `${salesRules}

Stai analizzando un commento LinkedIn. Rispondi ESCLUSIVAMENTE in italiano. Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "comment_type": "<uno tra: lead | curious | support | objection | negative | peer>",
  "strategy": "<stringa: strategia di risposta in 1-2 frasi, in italiano>",
  "client_heat_level": "<uno tra: Cold | Warm | Hot>",
  "message_risk_warning": "<stringa: rischio in questa risposta, o 'nessuno' se non c'è>",
  "replies": {
    "soft": "<stringa: risposta calda ed empatica, in italiano>",
    "authority": "<stringa: risposta autorevole ed esperta, in italiano>",
    "dm_pivot": "<stringa: risposta che porta la conversazione in DM, in italiano>"
  },
  "suggested_dm": "<stringa: messaggio DM esatto da inviare dopo la risposta, in italiano>",
  "next_action": "<stringa: prossimo passo concreto, in italiano>"
}

Contesto:
- Post originale: ${original_post}
- Commento ricevuto: ${received_comment}
- Profilo autore commento: ${commenter_profile_text || "non fornito"}
${commenter_linkedin_url ? `- LinkedIn autore commento: ${commenter_linkedin_url}` : ""}
- Obiettivo conversazione: ${conversation_goal}
${formatProfileContext(profile) || "- Profilo utente: non configurato"}`;
    const output = await generateStructured({ prompt, schema: commentAssistantSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[comments] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
