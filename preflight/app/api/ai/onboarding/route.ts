import { NextResponse } from "next/server";
import { generateStructured, salesRules } from "@/lib/ai/structured";
import { onboardingInputSchema, planSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  if (process.env.NODE_ENV !== "production") {
    console.log("[onboarding] Received payload:", JSON.stringify(body));
  }
  const parsed = onboardingInputSchema.safeParse(body?.onboarding);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid onboarding input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const d = parsed.data;
    const prompt = `${salesRules}

Stai costruendo un piano LinkedIn Sales OS di 14 giorni. Rispondi ESCLUSIVAMENTE in italiano. Restituisci SOLO un oggetto JSON con esattamente questa struttura (nessun campo extra):
{
  "positioning": {
    "one_liner": "<string: one-sentence positioning>",
    "ideal_customer": "<string: who the ideal customer is>",
    "problem": "<string: main problem solved>",
    "promise": "<string: promise/transformation offered>"
  },
  "linkedin_profile": {
    "headline": "<string: optimized LinkedIn headline>",
    "about": "<string: optimized LinkedIn about section>",
    "cta": "<string: call to action in profile>"
  },
  "plan_14_days": [
    {"day": 1, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 2, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 3, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 4, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 5, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 6, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 7, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 8, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 9, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 10, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 11, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 12, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 13, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"},
    {"day": 14, "inbound": "<string>", "outbound": "<string>", "followup": "<string>"}
  ],
  "content_plan": [
    {"week": 1, "post_type": "<one of: educational | case-study | opinion>", "topic": "<string>", "hook": "<string>", "cta": "<string>"},
    {"week": 2, "post_type": "<one of: educational | case-study | opinion>", "topic": "<string>", "hook": "<string>", "cta": "<string>"},
    {"week": 3, "post_type": "<one of: educational | case-study | opinion>", "topic": "<string>", "hook": "<string>", "cta": "<string>"},
    {"week": 4, "post_type": "<one of: educational | case-study | opinion>", "topic": "<string>", "hook": "<string>", "cta": "<string>"}
  ],
  "outbound_plan": {
    "weekly_targets": {
      "connections": <number>,
      "dms": <number>,
      "followups": <number>
    },
    "linkedin_search_queries": ["<string>", "<string>", "<string>"],
    "connection_message_templates": ["<string>", "<string>", "<string>"]
  },
  "dm_templates": {
    "connect": "<string: connection request message>",
    "dm1": "<string: first DM after connecting>",
    "followup48h": "<string: follow-up after 48h>",
    "followup5d": "<string: follow-up after 5 days>",
    "followup10d": "<string: follow-up after 10 days>"
  },
  "comment_playbook": {
    "lead_comment_reply": "<string>",
    "curious_comment_reply": "<string>",
    "objection_reply": "<string>",
    "pivot_to_dm": "<string>"
  }
}

Profilo utente:
- Servizio: ${d.servizio}
- Elevator pitch: ${d.elevator_pitch}
- Settore: ${d.settore}
- Differenziatore unico: ${d.differenziatore}
- Cliente ideale: ${d.cliente_ideale}
- Dimensione azienda target: ${d.dimensione_azienda}
- Problema del cliente: ${d.problema_cliente}
- Risultato che porta: ${d.risultato_cliente}
- Segnali di interesse: ${d.segnali_interesse}
- Obiezione più frequente: ${d.obiezione_frequente}
- Modello di vendita: ${d.modello_vendita}
- Ticket medio: ${d.ticket_medio}
- Ciclo di vendita: ${d.ciclo_vendita}
- Tempo settimanale: ${d.tempo_settimanale}
- CTA preferita: ${d.cta_preferita}
- Profilo LinkedIn: ${d.linkedin_url}
- Sito web: ${d.sito_web || "non specificato"}
- Ricerche LinkedIn: ${d.linkedin_search_links.filter(Boolean).join(", ") || "non specificato"}
- Materiali caricati: ${d.materiali_nomi?.filter(Boolean).join(", ") || "nessuno"}`;
    const output = await generateStructured({ prompt, schema: planSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    if (process.env.NODE_ENV !== "production") {
      console.error("[onboarding] AI error:", message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
