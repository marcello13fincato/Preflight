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
  const ruoli = raw.ruoli_da_cercare as Record<string, unknown> | undefined;
  const filtri = raw.filtri_linkedin as Record<string, unknown> | undefined;
  return {
    summary: String(raw.profilo_ideale || "Targeting completato"),
    sections: [
      { title: "Profilo ideale", content: String(raw.profilo_ideale || "") },
      { title: "Ruoli da cercare", content: ruoli ? `Principali: ${String(ruoli.principali || "")}. Alternativi: ${String(ruoli.alternativi || "")}` : "" },
      { title: "Keyword consigliate", content: Array.isArray(raw.keyword_consigliate) ? raw.keyword_consigliate.join(", ") : "" },
      { title: "Filtri LinkedIn", content: filtri ? `Settore: ${filtri.settore || ""}. Geografia: ${filtri.geografia || ""}. Dimensione: ${filtri.dimensione_azienda || ""}` : "" },
      { title: "Ricerca LinkedIn pronta", content: String(raw.ricerca_linkedin_pronta || "") },
      { title: "Link ricerca LinkedIn", content: String(raw.link_ricerca_linkedin || "") },
      { title: "Strategia di contatto", content: String(raw.strategia_contatto || "") },
      { title: "Primo messaggio", content: String(raw.primo_messaggio || "") },
      { title: "Prossimo step", content: String(raw.prossimo_step || "") },
    ],
    suggested_actions: [
      "Apri il link di ricerca LinkedIn",
      String(raw.prossimo_step || "Analizza i profili trovati"),
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
