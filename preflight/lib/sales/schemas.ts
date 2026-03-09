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

export const prospectAnalyzerSchema = z.object({
  likely_pains: z.tuple([z.string(), z.string(), z.string()]),
  angles: z.tuple([z.string(), z.string(), z.string()]),
  connection_opener: z.string(),
  dm1: z.string(),
  smart_questions: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
  client_heat_level: heatLevelSchema,
  priority_signal: z.enum(["high", "medium", "low"]),
  next_action: z.string(),
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

export const onboardingInputSchema = z.object({
  servizio: z.string().min(1),
  cliente_ideale: z.string().min(1),
  problema_cliente: z.string().min(1),
  risultato_cliente: z.string().min(1),
  linkedin_search_links: z.array(z.string()).default([]),
  tempo_settimanale: z.enum(["meno_1h", "1_3h", "3_5h", "piu_5h"]),
});

export type PlanJson = z.infer<typeof planSchema>;
export type PostBuilderJson = z.infer<typeof postBuilderSchema>;
export type CommentAssistantJson = z.infer<typeof commentAssistantSchema>;
export type DmAssistantJson = z.infer<typeof dmAssistantSchema>;
export type ProspectAnalyzerJson = z.infer<typeof prospectAnalyzerSchema>;
export type IdealProfileJson = z.infer<typeof idealProfileSchema>;
export type OpportunityFinderJson = z.infer<typeof opportunityFinderSchema>;
export type SimulatorJson = z.infer<typeof simulatorSchema>;
export type OnboardingInput = z.infer<typeof onboardingInputSchema>;
export type ConversationGoal = z.infer<typeof conversationGoalSchema>;

export type InteractionType = "post" | "comments" | "dm" | "prospect" | "onboarding";

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
