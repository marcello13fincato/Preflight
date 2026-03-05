import { z } from "zod";

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
  priority_signal: z.enum(["high", "medium", "low"]),
});

export const onboardingInputSchema = z.object({
  offer_one_liner: z.string(),
  offer_price_range: z.string(),
  offer_delivery_time: z.enum(["1w", "2w", "1m", "3m"]),
  offer_outcome: z.string(),
  icp_role: z.string(),
  icp_industry: z.string(),
  icp_company_size: z.string(),
  icp_main_problem: z.string(),
  icp_top_objections: z.array(z.string()).max(3),
  proof_case_study: z.string(),
  proof_testimonial: z.string().optional().default(""),
  proof_links: z.string().optional().default(""),
  weekly_time_minutes: z.enum(["15", "30", "60", "120"]),
  comfort_post: z.enum(["1", "2", "3", "4", "5"]),
  comfort_comments: z.enum(["1", "2", "3", "4", "5"]),
  comfort_dm: z.enum(["1", "2", "3", "4", "5"]),
  goal_primary: z.enum(["prime conversazioni", "più call", "più inbound"]),
});

export type PlanJson = z.infer<typeof planSchema>;
export type PostBuilderJson = z.infer<typeof postBuilderSchema>;
export type CommentAssistantJson = z.infer<typeof commentAssistantSchema>;
export type DmAssistantJson = z.infer<typeof dmAssistantSchema>;
export type ProspectAnalyzerJson = z.infer<typeof prospectAnalyzerSchema>;
export type OnboardingInput = z.infer<typeof onboardingInputSchema>;

export type InteractionType = "post" | "comments" | "dm" | "prospect" | "onboarding";

export type UserProfileData = {
  onboarding: OnboardingInput | null;
  plan: PlanJson | null;
  onboarding_complete: boolean;
};

export type LeadStatus = "New" | "In chat" | "Interested" | "Call proposed" | "Call booked" | "Client";

export type Lead = {
  id: string;
  name: string;
  linkedin_url?: string;
  status: LeadStatus;
  notes: string;
  next_action_at?: string;
  created_at: string;
  updated_at: string;
};
