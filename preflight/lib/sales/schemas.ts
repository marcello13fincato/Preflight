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

export const segnaleSchema = z.object({
  tipo: z.string(),
  significato: z.string(),
  implicazione_commerciale: z.string(),
});

export const prospectAnalyzerSchema = z.object({
  score: z.number().min(0).max(100),
  chi_e: z.string(),
  ruolo_contesto: z.string(),
  // Verdetto rafforzato
  verdetto: z.object({
    vale_la_pena: z.enum(["Sì", "No", "Debole"]),
    priorita: z.enum(["Alta", "Media", "Bassa"]),
    confidenza: z.enum(["Alta", "Media", "Bassa"]),
    sintesi: z.string(),
  }),
  // Segnali strutturati
  segnali: z.array(segnaleSchema).min(2).max(5),
  // Perché strutturato
  perche: z.object({
    fit_con_target: z.string(),
    timing: z.string(),
    potenziale: z.string(),
  }),
  // Angolo di attacco
  angolo_attacco: z.object({
    tema: z.string(),
    leva: z.string(),
    cosa_evitare: z.string(),
  }),
  // Messaggi (ridimensionati)
  nota_connessione: z.string(),
  primo_messaggio: z.string(),
  // Follow-up strutturato
  followup: z.object({
    quando: z.string(),
    cosa_citare: z.string(),
    obiettivo: z.string(),
    messaggio: z.string(),
  }),
  // Errori specifici
  errori_da_evitare: z.tuple([z.string(), z.string(), z.string()]),
  // Prossimo step
  prossimo_step: z.string(),
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
  segnali_profilo: z.string(),
  link_ricerca_linkedin: z.string(),
});

export const findClientsSchema = z.object({
  riepilogo_strategia: z.string(),
  categoria_prioritaria: findClientsCategorySchema.extend({
    messaggio_connessione: z.string(),
    messaggio_dopo_accettazione: z.string(),
  }),
  categorie_alternative: z.tuple([
    findClientsCategorySchema.extend({ messaggio_connessione: z.string() }),
    findClientsCategorySchema.extend({ messaggio_connessione: z.string() }),
  ]),
  checklist_azioni: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  criteri_selezione: z.object({
    segnali_positivi: z.string(),
    red_flags: z.string(),
    attivita_recente: z.string(),
  }),
  strategia_contatto: z.object({
    approccio_step: z.string(),
    primo_messaggio: z.string(),
    followup_48h: z.string(),
    followup_5g: z.string(),
  }),
  prossimo_step: z.string(),
});

export const dailyActionSchema = z.object({
  tipo: z.string(),
  priorita: z.enum(["alta", "media", "bassa"]),
  contesto: z.object({
    chi: z.string(),
    situazione: z.string(),
  }),
  perche_ora: z.string(),
  azione_concreta: z.string(),
  messaggio_suggerito: z.string(),
  outcome_atteso: z.string(),
  prossimo_step: z.string(),
});

export const dailyPlanSchema = z.object({
  focus_giornata: z.string(),
  azioni: z.object({
    azione_1: dailyActionSchema,
    azione_2: dailyActionSchema,
    azione_3: dailyActionSchema,
    azione_4: dailyActionSchema,
    azione_5: dailyActionSchema,
  }),
  messaggi_pronti: z.object({
    primo_contatto: z.string(),
    primo_contatto_variante: z.string(),
    followup: z.string(),
    followup_variante: z.string(),
    commento_post: z.string(),
  }),
  post_del_giorno: z.object({
    hook: z.string(),
    corpo: z.string(),
    chiusura: z.string(),
    testo_completo: z.string(),
    tipo_immagine: z.string(),
  }),
  link_ricerca_linkedin: z.string(),
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
  /* Step 1 — Cosa vendi */
  servizio: z.string().min(1),
  tipo_servizio: z.enum(["consulenza", "servizio", "coaching", "agenzia", "altro"]).default("consulenza"),

  /* Step 2 — Chi è il tuo cliente */
  cliente_ideale: z.string().min(1),
  settore: z.string().default(""),
  dimensione_azienda: z.enum(["freelance", "startup", "pmi", "enterprise"]).default("pmi"),

  /* Step 3 — Problema che risolvi */
  problema_cliente: z.string().min(1),
  risultato_cliente: z.string().default(""),

  /* Step 4 — Segnali */
  segnali_interesse: z.string().min(1),

  /* Step 5 — Come comunichi */
  tone_samples: z.array(z.string()).optional().default([]),

  /* Step 6 — Stato attuale */
  stato_linkedin: z.enum(["non_uso", "pubblico_no_risultati", "scrivo_no_risposta", "conversazioni_no_call"]).default("non_uso"),

  /* Legacy fields — kept optional for backward compatibility */
  elevator_pitch: z.string().optional().default(""),
  differenziatore: z.string().optional().default(""),
  obiezione_frequente: z.string().optional().default(""),
  modello_vendita: z.enum(["fast", "consultative", "relationship"]).optional().default("consultative"),
  ticket_medio: z.enum(["under_1k", "1k_5k", "5k_15k", "15k_50k", "over_50k"]).optional().default("5k_15k"),
  ciclo_vendita: z.enum(["under_1w", "1_4w", "1_3m", "over_3m"]).optional().default("1_4w"),
  tempo_settimanale: z.enum(["meno_1h", "1_3h", "3_5h", "piu_5h"]).optional().default("1_3h"),
  cta_preferita: z.enum(["call", "demo", "audit", "preventivo", "altro"]).optional().default("call"),
  linkedin_url: z.string().optional().default(""),
  sito_web: z.string().optional().default(""),
  linkedin_search_links: z.array(z.string()).optional().default([]),
  materiali_nomi: z.array(z.string()).optional().default([]),
});

export const articoloSchema = z.object({
  titolo: z.string(),
  sottotitolo: z.string(),
  sezioni: z.array(z.object({
    titolo_sezione: z.string(),
    contenuto: z.string(),
  })),
  conclusione: z.string(),
  cta_finale: z.string(),
  meta_description: z.string(),
  suggerimento_immagine: z.object({
    tipo: z.string(),
    descrizione: z.string(),
  }),
});

export const suggestArticlesSchema = z.object({
  articles: z.array(z.object({
    titolo: z.string(),
    tipo: z.string(),
    descrizione: z.string(),
    search_query: z.string(),
  })),
});

export type PlanJson = z.infer<typeof planSchema>;
export type PostBuilderJson = z.infer<typeof postBuilderSchema>;
export type ArticoloJson = z.infer<typeof articoloSchema>;
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
export type SuggestArticlesJson = z.infer<typeof suggestArticlesSchema>;
export type OnboardingInput = z.infer<typeof onboardingInputSchema>;
export type ConversationGoal = z.infer<typeof conversationGoalSchema>;

export type InteractionType = "post" | "comments" | "dm" | "prospect" | "onboarding" | "followup" | "articolo";

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
