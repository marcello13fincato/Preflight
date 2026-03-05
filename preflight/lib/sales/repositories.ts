"use client";

import type {
  InteractionType,
  Lead,
  LeadStatus,
  OnboardingInput,
  PlanJson,
  UserProfileData,
} from "./schemas";

type InteractionRecord = {
  id: string;
  type: InteractionType;
  inputText: string;
  outputJson: unknown;
  createdAt: string;
};

export interface ProfileRepository {
  getProfile(userId: string): UserProfileData;
  saveOnboarding(userId: string, data: OnboardingInput): void;
  savePlan(userId: string, planJson: PlanJson): void;
  setOnboardingComplete(userId: string): void;
}

export interface InteractionRepository {
  addInteraction(userId: string, type: InteractionType, inputText: string, outputJson: unknown): void;
  listInteractions(userId: string, type?: InteractionType): InteractionRecord[];
}

export interface LeadRepository {
  createLead(userId: string, lead: Omit<Lead, "id" | "created_at" | "updated_at">): Lead;
  updateLead(userId: string, leadId: string, updates: Partial<Lead>): Lead | null;
  deleteLead(userId: string, leadId: string): void;
  listLeads(userId: string): Lead[];
  listByStatus(userId: string): Record<LeadStatus, Lead[]>;
}

function key(userId: string, suffix: string) {
  return `preflight:${userId}:${suffix}`;
}

function safeRead<T>(storageKey: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(storageKey: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(value));
}

function normalizeStatus(status: string): LeadStatus {
  const map: Record<string, LeadStatus> = {
    "New": "Nuovo",
    "In chat": "In conversazione",
    "Interested": "Interessato",
    "Call proposed": "Call proposta",
    "Call booked": "Call fissata",
    "Client": "Cliente",
    "Nuovo": "Nuovo",
    "In conversazione": "In conversazione",
    "Interessato": "Interessato",
    "Call proposta": "Call proposta",
    "Call fissata": "Call fissata",
    "Cliente": "Cliente",
  };
  return map[status] || "Nuovo";
}

export const localProfileRepository: ProfileRepository = {
  getProfile(userId) {
    return safeRead<UserProfileData>(key(userId, "profile"), {
      onboarding: null,
      plan: null,
      onboarding_complete: false,
    });
  },
  saveOnboarding(userId, data) {
    const current = localProfileRepository.getProfile(userId);
    safeWrite(key(userId, "profile"), { ...current, onboarding: data });
  },
  savePlan(userId, planJson) {
    const current = localProfileRepository.getProfile(userId);
    safeWrite(key(userId, "profile"), { ...current, plan: planJson });
  },
  setOnboardingComplete(userId) {
    const current = localProfileRepository.getProfile(userId);
    safeWrite(key(userId, "profile"), { ...current, onboarding_complete: true });
  },
};

export const localInteractionRepository: InteractionRepository = {
  addInteraction(userId, type, inputText, outputJson) {
    const current = safeRead<InteractionRecord[]>(key(userId, "interactions"), []);
    current.unshift({
      id: crypto.randomUUID(),
      type,
      inputText,
      outputJson,
      createdAt: new Date().toISOString(),
    });
    safeWrite(key(userId, "interactions"), current.slice(0, 100));
  },
  listInteractions(userId, type) {
    const current = safeRead<InteractionRecord[]>(key(userId, "interactions"), []);
    if (!type) return current;
    return current.filter((x) => x.type === type);
  },
};

export const localLeadRepository: LeadRepository = {
  createLead(userId, lead) {
    const current = safeRead<Lead[]>(key(userId, "leads"), []);
    const now = new Date().toISOString();
    const created: Lead = {
      ...lead,
      status: normalizeStatus(String(lead.status)),
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      notes: lead.notes || "",
    };
    current.unshift(created);
    safeWrite(key(userId, "leads"), current);
    return created;
  },
  updateLead(userId, leadId, updates) {
    const current = safeRead<Lead[]>(key(userId, "leads"), []);
    const idx = current.findIndex((l) => l.id === leadId);
    if (idx === -1) return null;
    current[idx] = {
      ...current[idx],
      ...updates,
      status: updates.status ? normalizeStatus(String(updates.status)) : current[idx].status,
      updated_at: new Date().toISOString(),
    };
    safeWrite(key(userId, "leads"), current);
    return current[idx];
  },
  deleteLead(userId, leadId) {
    const current = safeRead<Lead[]>(key(userId, "leads"), []);
    safeWrite(
      key(userId, "leads"),
      current.filter((l) => l.id !== leadId)
    );
  },
  listLeads(userId) {
    return safeRead<Lead[]>(key(userId, "leads"), []).map((lead) => ({
      ...lead,
      status: normalizeStatus(String(lead.status)),
    }));
  },
  listByStatus(userId) {
    const statuses: LeadStatus[] = ["Nuovo", "In conversazione", "Interessato", "Call proposta", "Call fissata", "Cliente"];
    const leads = localLeadRepository.listLeads(userId);
    return statuses.reduce(
      (acc, status) => {
        acc[status] = leads.filter((lead) => lead.status === status);
        return acc;
      },
      {
        "Nuovo": [],
        "In conversazione": [],
        "Interessato": [],
        "Call proposta": [],
        "Call fissata": [],
        "Cliente": [],
      } as Record<LeadStatus, Lead[]>
    );
  },
};

export function getRepositoryBundle() {
  // MVP fallback: local repositories are always available and require no external service.
  return {
    profile: localProfileRepository,
    interaction: localInteractionRepository,
    lead: localLeadRepository,
  };
}

export type { InteractionRecord };
