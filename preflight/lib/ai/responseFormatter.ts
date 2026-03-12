import { z } from "zod";

/**
 * Normalized AI response format sent to frontend.
 * Frontend renders UI based on this structure.
 */
export const aiResponseSchema = z.object({
  summary: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ),
  suggested_actions: z.array(z.string()),
  metadata: z
    .object({
      heat_level: z.string().optional(),
      priority: z.string().optional(),
      task_type: z.string().optional(),
    })
    .optional(),
  raw: z.record(z.string(), z.unknown()).optional(),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

/**
 * Converts a raw AI output (task-specific JSON) into the normalized AIResponse format.
 * Preserves the raw output for backward compatibility.
 */
export function formatAIResponse(
  taskType: string,
  rawOutput: Record<string, unknown>,
): AIResponse {
  switch (taskType) {
    case "analyze_profile":
      return formatAnalyzeProfile(rawOutput);
    case "find_clients":
      return formatFindClients(rawOutput);
    case "ask_advice":
      return formatAskAdvice(rawOutput);
    default:
      return formatGeneric(taskType, rawOutput);
  }
}

function formatAnalyzeProfile(raw: Record<string, unknown>): AIResponse {
  return {
    summary: String(raw.chi_e || "Analisi profilo completata"),
    sections: [
      { title: "Chi è", content: String(raw.chi_e || "") },
      { title: "Ruolo e contesto", content: String(raw.ruolo_contesto || "") },
      { title: "Perché è un buon contatto", content: String(raw.perche_buon_contatto || "") },
      { title: "Strategia di contatto", content: String(raw.strategia_contatto || "") },
      { title: "Primo messaggio", content: String(raw.primo_messaggio || "") },
      { title: "Follow-up consigliato", content: String(raw.followup_consigliato || "") },
      { title: "Prossimi passi", content: String(raw.step_successivi || "") },
      { title: "Segnali da osservare", content: String(raw.segnali_da_osservare || "") },
      { title: "Errori da evitare", content: String(raw.errori_da_evitare || "") },
    ],
    suggested_actions: [
      String(raw.step_successivi || "Analizza altri profili"),
    ],
    metadata: {
      heat_level: String(raw.client_heat_level || "Cold"),
      priority: String(raw.priority_signal || "low"),
      task_type: "analyze_profile",
    },
    raw,
  };
}

function formatFindClients(raw: Record<string, unknown>): AIResponse {
  const cat = raw.categoria_prioritaria as Record<string, unknown> | undefined;
  const alts = raw.categorie_alternative as Record<string, unknown>[] | undefined;
  const strategia = raw.strategia_contatto as Record<string, unknown> | undefined;
  const sections: { title: string; content: string }[] = [
    { title: "Categoria prioritaria", content: cat ? `${cat.titolo}: ${cat.descrizione}` : "" },
    { title: "Perché ora", content: String(cat?.perche_ora || "") },
  ];
  if (alts && Array.isArray(alts)) {
    alts.forEach((a, i) => {
      sections.push({ title: `Alternativa ${i + 1}`, content: `${a.titolo}: ${a.descrizione}` });
    });
  }
  if (strategia) {
    sections.push({ title: "Approccio consigliato", content: String(strategia.approccio || "") });
    sections.push({ title: "Primo messaggio", content: String(strategia.primo_messaggio || "") });
    sections.push({ title: "Angolo follow-up", content: String(strategia.angolo_followup || "") });
  }
  if (raw.prossimo_step) {
    sections.push({ title: "Prossimo step", content: String(raw.prossimo_step) });
  }
  return {
    summary: String(cat?.titolo || "Categorie prospect identificate"),
    sections,
    suggested_actions: [
      "Apri la lista su LinkedIn",
      "Analizza uno di questi profili",
      "Vai al piano di oggi",
    ],
    metadata: { task_type: "find_clients" },
    raw,
  };
}

function formatAskAdvice(raw: Record<string, unknown>): AIResponse {
  return {
    summary: String(raw.lettura_situazione || "Consiglio strategico pronto"),
    sections: [
      { title: "Lettura situazione", content: String(raw.lettura_situazione || "") },
      { title: "Strategia consigliata", content: String(raw.strategia_consigliata || "") },
      { title: "Risposta suggerita", content: String(raw.risposta_suggerita || "") },
      { title: "Follow-up consigliato", content: String(raw.followup_consigliato || "") },
      { title: "Prossimi passi", content: String(raw.step_successivi || "") },
      { title: "Errori da evitare", content: String(raw.errori_da_evitare || "") },
    ],
    suggested_actions: [
      String(raw.step_successivi || "Applica il consiglio"),
    ],
    metadata: {
      heat_level: String(raw.client_heat_level || "Cold"),
      task_type: "ask_advice",
    },
    raw,
  };
}

function formatGeneric(taskType: string, raw: Record<string, unknown>): AIResponse {
  const sections = Object.entries(raw)
    .filter(([, v]) => typeof v === "string")
    .map(([k, v]) => ({ title: k.replace(/_/g, " "), content: String(v) }));

  return {
    summary: String(sections[0]?.content || `Risultato ${taskType}`),
    sections,
    suggested_actions: [],
    metadata: { task_type: taskType },
    raw,
  };
}
