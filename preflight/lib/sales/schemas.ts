import { z } from "zod";

export const conversationGoalSchema = z.enum([
  "understand_fit",
  "continue_conversation",
  "move_to_dm",
  "propose_call",
  "follow_up",
]);

export const heatLevelSchema = z.enum(["Cold", "Warm", "Hot"]);

export const planSchema = z.object({
  positioning: z.object({
    one_liner: z.string(),
    ideal_customer: z.string(),
    problem: z.string(),
    promise: z.string(),
  }),
  linkedin_profile: z.object({
    headline: z.string(),
    about: z.string(),
    cta: z.string(),
  }),
  plan_14_days: z.array(
    z.object({
      day: z.number(),
      inbound: z.string(),
      outbound: z.string(),
      followup: z.string(),
    })
  ),
  content_plan: z.array(
    z.object({
      week: z.number(),
      post_type: z.enum(["educational", "case-study", "opinion"]),
      topic: z.string(),
      hook: z.string(),
      cta: z.string(),
    })
  ),
  outbound_plan: z.object({
    weekly_targets: z.object({
      connections: z.number(),
      dms: z.number(),
      followups: z.number(),
    }),
    linkedin_search_queries: z.array(z.string()),
    connection_message_templates: z.array(z.string()),
  }),
  dm_templates: z.object({
    connect: z.string(),
    dm1: z.string(),
    followup48h: z.string(),
    followup5d: z.string(),
    followup10d: z.string(),
  }),
  comment_playbook: z.object({
    lead_comment_reply: z.string(),
    curious_comment_reply: z.string(),
    objection_reply: z.string(),
    pivot_to_dm: z.string(),
  }),
});

export const postBuilderSchema = z.object({
  hooks: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  post_versions: z.object({
    clean: z.string(),
    direct: z.string(),
    authority: z.string(),
  }),
  cta: z.string(),
  comment_starter: z.string(),
  next_step: z.string(),
  suggerimento_immagine: z.object({
    tipo: z.string(),
    perche_funziona: z.string(),
  }),
});

export const commentAssistantSchema = z.object({
  comment_type: z.enum(["lead", "curious", "support", "objection", "negative", "peer"]),
  strategy: z.string(),
  client_heat_level: heatLevelSchema,
  message_risk_warning: z.string(),
  replies: z.object({
    soft: z.string(),
    authority: z.string(),
    dm_pivot: z.string(),
  }),
  suggested_dm: z.string(),
  next_action: z.string(),
});

export const dmAssistantSchema = z.object({
  best_reply: z.string(),
  client_heat_level: heatLevelSchema,
  message_risk_warning: z.string(),
  alternatives: z.object({
    short: z.string(),
    assertive: z.string(),
  }),
  qualifying_questions: z.tuple([z.string(), z.string(), z.string()]),
  followups: z.object({
    "48h": z.string(),
    "5d": z.string(),
    "10d": z.string(),
  }),
  next_action: z.string(),
});

export const adviceSchema = z.object({
  lettura_situazione: z.string(),
  strategia_consigliata: z.string(),
  risposta_suggerita: z.string(),
  followup_consigliato: z.string(),
  step_successivi: z.string(),
  errori_da_evitare: z.string(),
  client_heat_level: heatLevelSchema,
});

export const prospectAnalyzerSchema = z.object({
  chi_e: z.string(),
  ruolo_contesto: z.string(),
  perche_buon_contatto: z.string(),
  strategia_contatto: z.string(),
  primo_messaggio: z.string(),
  followup_consigliato: z.string(),
  step_successivi: z.string(),
  segnali_da_osservare: z.string(),
  errori_da_evitare: z.string(),
  client_heat_level: heatLevelSchema,
  priority_signal: z.enum(["high", "medium", "low"]),
});

export const idealProfileSchema = z.object({
  role: z.string(),
  sector: z.string(),
  company_size: z.string(),
  why: z.string(),
});

export const opportunityFinderSchema = z.object({
  keywords_to_monitor: z.array(z.string()),
  post_types_to_search: z.array(z.string()),
  ideal_profiles: z.array(idealProfileSchema),
  useful_signals: z.array(z.string()),
  linkedin_search_queries: z.array(z.string()),
  conversation_opportunities: z.array(z.string()),
  next_action: z.string(),
});

export const simulatorSchema = z.object({
  prospect_reply: z.string(),
  feedback: z.array(z.string()),
  message_risk_warning: z.string(),
  next_action: z.string(),
});

export const findClientsCategorySchema = z.object({
  titolo: z.string(),
  descrizione: z.string(),
  perche_ora: z.string(),
  link_ricerca_linkedin: z.string(),
});

export const findClientsSchema = z.object({
  categoria_prioritaria: findClientsCategorySchema,
  categorie_alternative: z.tuple([findClientsCategorySchema, findClientsCategorySchema]),
  come_scegliere_profili: z.object({
    ruolo_decisionale: z.string(),
    chiarezza_profilo: z.string(),
    attivita_recente: z.string(),
    rilevanza_problema: z.string(),
    contesto_aziendale: z.string(),
    chi_evitare: z.string(),
  }),
  strategia_contatto: z.object({
    approccio: z.string(),
    primo_messaggio: z.string(),
    angolo_followup: z.string(),
  }),
  prossimo_step: z.string(),
});

export const dailyPlanSchema = z.object({
  priorita_oggi: z.object({
    azione_1: z.string(),
    azione_2: z.string(),
    azione_3: z.string(),
  }),
  persone_da_contattare: z.object({
    tipo_profili: z.string(),
    link_ricerca: z.string(),
    criteri_scelta: z.string(),
    primo_messaggio: z.string(),
    strategia: z.string(),
    perche_oggi: z.string(),
  }),
  contenuto_consigliato: z.object({
    idea_post: z.string(),
    angolo_post: z.string(),
    struttura: z.string(),
    esempio_testo: z.string(),
    cta_post: z.string(),
    suggerimento_immagine: z.string(),
  }),
  conversazioni_da_seguire: z.object({
    followup_da_fare: z.string(),
    quando_scrivere: z.string(),
    cosa_chiedere: z.string(),
    esempio_followup: z.string(),
    segnali_da_osservare: z.string(),
    errori_da_evitare: z.string(),
  }),
});

export const followupSchema = z.object({
  analisi_situazione: z.string(),
  messaggio_followup: z.string(),
  variante_breve: z.string(),
  variante_diretta: z.string(),
  tempistica: z.string(),
  prossimi_passi: z.string(),
});

export const onboardingInputSchema = z.object({
  servizio: z.string().min(1),
  cliente_ideale: z.string().min(1),
  problema_cliente: z.string().min(1),
  risultato_cliente: z.string().min(1),
  linkedin_search_links: z.array(z.string()).default([]),
  materiali_nomi: z.array(z.string()).default([]),
  social_links: z.array(z.string()).default([]),
  tempo_settimanale: z.enum(["meno_1h", "1_3h", "3_5h", "piu_5h"]),
});

export type PlanJson = z.infer<typeof planSchema>;
export type PostBuilderJson = z.infer<typeof postBuilderSchema>;
export type CommentAssistantJson = z.infer<typeof commentAssistantSchema>;
export type DmAssistantJson = z.infer<typeof dmAssistantSchema>;
export type AdviceJson = z.infer<typeof adviceSchema>;
export type ProspectAnalyzerJson = z.infer<typeof prospectAnalyzerSchema>;
export type IdealProfileJson = z.infer<typeof idealProfileSchema>;
export type OpportunityFinderJson = z.infer<typeof opportunityFinderSchema>;
export type SimulatorJson = z.infer<typeof simulatorSchema>;
export type FindClientsJson = z.infer<typeof findClientsSchema>;
export type DailyPlanJson = z.infer<typeof dailyPlanSchema>;
export type FollowupJson = z.infer<typeof followupSchema>;
export type OnboardingInput = z.infer<typeof onboardingInputSchema>;
export type ConversationGoal = z.infer<typeof conversationGoalSchema>;

export type InteractionType = "post" | "comments" | "dm" | "prospect" | "onboarding" | "followup";

export type AnalyzedContact = {
  id: string;
  linkedin_url: string;
  nome: string;
  ruolo: string;
  azienda: string;
  analyzed_at: string;
  result: Record<string, string>;
};

export type UserProfileData = {
  onboarding: OnboardingInput | null;
  plan: PlanJson | null;
  onboarding_complete: boolean;
};

export type LeadStatus = "Nuovo" | "In conversazione" | "Interessato" | "Call proposta" | "Call fissata" | "Cliente";

export type Lead = {
  id: string;
  name: string;
  company?: string;
  linkedin_url?: string;
  status: LeadStatus;
  notes: string;
  last_conversation?: string;
  next_action_at?: string;
  created_at: string;
  updated_at: string;
};
