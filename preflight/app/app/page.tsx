"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { DailyPlanV2Json, FollowUpItem } from "@/lib/sales/schemas";
import { isAdminEmail } from "@/lib/admin";

/* ── Block components ── */
import LinkedInSearchCard from "@/components/app/oggi/LinkedInSearchCard";
import FollowUpCard from "@/components/app/oggi/FollowUpCard";
import DailyContentCard from "@/components/app/oggi/DailyContentCard";
import WebInsightCard from "@/components/app/oggi/WebInsightCard";

/* ── Constants ── */
const DAILY_PLAN_STORAGE_KEY = "preflight:daily-plan-v2";
const DAILY_PLAN_DATE_KEY = "preflight:daily-plan-v2-date";
const TARGETING_STORAGE_KEY = "preflight:last-targeting";
const FREE_TRIAL_KEY = "preflight:daily-plan-trial-count";
const MAX_FREE_TRIALS = 3;

/* ── Helpers ── */

function getTrialCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(FREE_TRIAL_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

function incrementTrialCount(): number {
  const current = getTrialCount();
  const next = current + 1;
  localStorage.setItem(FREE_TRIAL_KEY, String(next));
  return next;
}

function loadLastTargeting(userId: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${TARGETING_STORAGE_KEY}:${userId}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { result: Record<string, unknown> };
    return parsed.result || null;
  } catch {
    return null;
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadCachedPlan(): DailyPlanV2Json | null {
  if (typeof window === "undefined") return null;
  const date = localStorage.getItem(DAILY_PLAN_DATE_KEY);
  if (date !== todayKey()) return null;
  const raw = localStorage.getItem(DAILY_PLAN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyPlanV2Json;
  } catch {
    return null;
  }
}

function cachePlan(plan: DailyPlanV2Json) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_PLAN_STORAGE_KEY, JSON.stringify(plan));
  localStorage.setItem(DAILY_PLAN_DATE_KEY, todayKey());
}

/* ── Quick tool links ── */
const QUICK_TOOLS = [
  {
    href: "/app/find-clients",
    title: "Trova clienti",
    desc: "Scopri profili da attivare oggi.",
    color: "blue" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    href: "/app/prospect",
    title: "Analizza profilo",
    desc: "Valuta fit e angolo di attacco.",
    color: "green" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/app/post",
    title: "Scrivi un post",
    desc: "Post con hook, CTA e immagine.",
    color: "amber" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/app/articolo",
    title: "Scrivi un articolo",
    desc: "Articolo autorevole con SEO.",
    color: "purple" as const,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

/* ── Gate steps ── */
const GATE_STEPS = [
  {
    key: "onboarding",
    num: "1",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    ),
    title: "Configura il tuo sistema",
    desc: "Inserisci cosa vendi, a chi e come — l'AI userà queste info in ogni risposta. Include 3 prove gratuite!",
    ctaLabel: "Configura ora →",
    ctaHref: "/app/onboarding",
    checkField: "onboarding" as const,
  },
  {
    key: "premium",
    num: "2",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" /></svg>
    ),
    title: "Attiva il Piano Premium",
    desc: "Per un piano quotidiano illimitato, attiva il piano Premium.",
    ctaLabel: "Vedi i piani →",
    ctaHref: "/pricing",
    checkField: "plan" as const,
  },
];

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT — "Cosa fare oggi" (V2 redesign)
   ══════════════════════════════════════════════════════════════════ */

export default function CosaFareOggiPage() {
  const { userId, status, session } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = userId
    ? repo.profile.getProfile(userId)
    : { plan: null, onboarding_complete: false, onboarding: null };
  const contacts = useMemo(
    () => (userId ? repo.contact.listContacts(userId) : []),
    [userId, repo],
  );

  const isAdmin = isAdminEmail(session?.user?.email);
  const isPremium = profile.plan !== null || isAdmin;
  const isConfigured = profile.onboarding_complete || isAdmin;

  const [trialCount, setTrialCount] = useState(0);
  const hasTrialsLeft = isConfigured && !isPremium && trialCount < MAX_FREE_TRIALS;
  const isReady = (isPremium && isConfigured) || hasTrialsLeft;

  /* ── V2 Plan state ── */
  const [plan, setPlan] = useState<DailyPlanV2Json | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [hasProspects, setHasProspects] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrialCount(getTrialCount());
  }, []);

  /* ── Load cached plan ── */
  useEffect(() => {
    if (!isReady) return;
    const cached = loadCachedPlan();
    if (cached) {
      setPlan(cached);
      setAutoLoaded(true);
    }
  }, [isReady]);

  /* ── Fetch prospect history for follow-up block ── */
  useEffect(() => {
    if (!isReady) return;
    fetch("/api/ai/prospects")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.prospects?.length) return;
        setHasProspects(true);
        // Build follow-up items from prospects analyzed > 1 day ago
        const items: FollowUpItem[] = data.prospects
          .filter((p: { giorni_fa: number }) => p.giorni_fa >= 1)
          .slice(0, 5)
          .map((p: { nome_ruolo: string; giorni_fa: number; contesto: string }) => ({
            nome_ruolo: p.nome_ruolo,
            giorni_fa: p.giorni_fa,
            azione_consigliata: generateFollowUpAction(p.giorni_fa),
            testo_suggerito: generateFollowUpText(p.nome_ruolo, p.giorni_fa),
          }));
        setFollowUps(items);
      })
      .catch(() => {});
  }, [isReady]);

  /* ── Generate plan ── */
  const generatePlan = useCallback(async () => {
    if (loading || !isReady) return;
    setLoading(true);
    setPlan(null);
    setLoadingStep(0);
    const stepTimer = setInterval(
      () => setLoadingStep((s) => Math.min(s + 1, 4)),
      2500,
    );
    setError(null);
    try {
      // AI hook: loads user's targeting config from "Trova Clienti" (localStorage)
      // This data personalizes LinkedIn search, profile types, and content generation
      const lastTargeting = loadLastTargeting(userId!);

      // AI hook: fetches analyzed prospect history for follow-up block
      let analyzedProspects: Array<{ nome_ruolo: string; giorni_fa: number; contesto?: string }> = [];
      try {
        const prospectRes = await fetch("/api/ai/prospects");
        if (prospectRes.ok) {
          const prospectData = await prospectRes.json();
          if (prospectData?.prospects) {
            analyzedProspects = prospectData.prospects.slice(0, 10);
          }
        }
      } catch {
        /* ignore — prospects are optional */
      }

      const res = await fetch("/api/ai/daily-plan-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // AI hook: sends user config (onboarding profile), targeting data,
        // and prospect history — the API uses all three for personalization
        body: JSON.stringify({
          profile: profile.onboarding || undefined,
          targeting: lastTargeting || undefined,
          analyzedProspects: analyzedProspects.length > 0 ? analyzedProspects : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Errore ${res.status}`);
      }
      const data = (await res.json()) as DailyPlanV2Json;
      setPlan(data);
      cachePlan(data);
      if (hasTrialsLeft && !isPremium) {
        const newCount = incrementTrialCount();
        setTrialCount(newCount);
      }
    } catch (err) {
      setPlan(null);
      setError(
        err instanceof Error
          ? err.message
          : "Errore nella generazione del piano. Riprova.",
      );
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  }, [loading, isReady, profile.onboarding, userId, hasTrialsLeft, isPremium]);

  /* ── Auto-generate on first load ── */
  useEffect(() => {
    if (isReady && !autoLoaded && !plan && !loading) {
      generatePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, autoLoaded]);

  /* ── Date / greeting ── */
  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const todayFull = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dateLabel =
    today.charAt(0).toUpperCase() + today.slice(1); // capitalize first letter
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buongiorno";
    if (h < 18) return "Buon pomeriggio";
    return "Buonasera";
  })();
  const firstName = session?.user?.name?.split(" ")[0] || "";

  /* ═══════════════════════════════════════════
     LOADING — wait for auth
     ═══════════════════════════════════════════ */
  if (status === "loading" || !userId) {
    return (
      <div className="tool-page">
        <div className="tool-page-hero">
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     GATE — Setup required (with demo + trial info)
     ═══════════════════════════════════════════ */
  if (!isReady) {
    const trialsExhausted = isConfigured && !isPremium && trialCount >= MAX_FREE_TRIALS;
    const completedSteps = [isPremium, isConfigured].filter(Boolean).length;
    const toolColors: Record<
      string,
      { iconBg: string; stroke: string; badgeBg: string; badgeText: string; badgeLabel: string; glow: string }
    > = {
      blue: {
        iconBg: "bg-blue-50",
        stroke: "#2563EB",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-600",
        badgeLabel: "Prospecting",
        glow: "bg-[radial-gradient(circle,rgba(37,99,235,0.04),transparent_70%)]",
      },
      green: {
        iconBg: "bg-green-50",
        stroke: "#16A34A",
        badgeBg: "bg-green-50",
        badgeText: "text-green-700",
        badgeLabel: "Analisi",
        glow: "bg-[radial-gradient(circle,rgba(22,163,74,0.04),transparent_70%)]",
      },
      amber: {
        iconBg: "bg-amber-50",
        stroke: "#D97706",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-600",
        badgeLabel: "Contenuto",
        glow: "bg-[radial-gradient(circle,rgba(217,119,6,0.04),transparent_70%)]",
      },
      purple: {
        iconBg: "bg-purple-50",
        stroke: "#7C3AED",
        badgeBg: "bg-purple-50",
        badgeText: "text-purple-600",
        badgeLabel: "Editoriale",
        glow: "bg-[radial-gradient(circle,rgba(124,58,237,0.04),transparent_70%)]",
      },
    };

    return (
      <div className="pt-6 fade-in">
        {/* ── HERO CARD SCURO ── */}
        <div className="relative overflow-hidden rounded-2xl p-7 mb-6 bg-gradient-to-br from-[#1E3A6E] via-[#1E4A8A] to-[#162F5C]">
          <div className="pointer-events-none">
            <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_65%)]" />
            <div className="absolute -bottom-16 left-2 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)]" />
            <div className="absolute top-4 left-44 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.13),transparent_70%)]" />
          </div>
          <div className="relative z-10">
            <div className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
              {today}
            </div>
            <h1 className="text-[27px] font-extrabold text-white tracking-tight leading-tight mb-1">
              {greeting}
              {firstName ? ", " : ""}
              {firstName ? <span className="text-blue-200">{firstName}</span> : ""}
            </h1>
            <p className="text-[13.5px] text-white/50 mb-5">
              {trialsExhausted
                ? "Hai usato le 3 prove gratuite. Attiva il Piano Premium per continuare."
                : "Completa i passaggi per attivare il piano quotidiano AI."}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-[5px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-[5px] bg-gradient-to-r from-green-400 to-green-300 rounded-full transition-all"
                  style={{ width: `${completedSteps * 50}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold text-white/40 whitespace-nowrap">
                Setup {completedSteps}/2
              </span>
            </div>
            <div className="flex items-center border-t border-white/10 mt-5 pt-5">
              <div className="flex-1">
                <div className="text-[22px] font-extrabold text-white">{completedSteps}</div>
                <div className="text-[11px] text-white/35 font-medium">Step completati</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-green-400">{MAX_FREE_TRIALS}</div>
                <div className="text-[11px] text-white/35 font-medium">Prove gratuite</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-white">{trialCount}</div>
                <div className="text-[11px] text-white/35 font-medium">Prove usate</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BANNER SETUP ── */}
        <div className="flex items-center gap-2.5 bg-white border border-amber-300 border-l-[3px] border-l-amber-400 rounded-[10px] px-4 py-2.5 mb-5">
          <span className="w-[7px] h-[7px] bg-amber-400 rounded-full flex-shrink-0" />
          <span className="text-[13px] text-amber-900 flex-1">
            Inizia dalla configurazione — ci vogliono meno di 5 minuti.
          </span>
          <Link
            href="/app/onboarding"
            className="text-[13px] font-bold text-amber-600 whitespace-nowrap cursor-pointer hover:text-amber-700"
          >
            Inizia ora →
          </Link>
        </div>

        {/* ── GATE STEPS ── */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          {GATE_STEPS.map((step, idx) => {
            const done = step.checkField === "plan" ? isPremium : isConfigured;
            const isPrimaryStep = idx === 0 && !done;
            if (isPrimaryStep) {
              return (
                <div
                  key={step.key}
                  className="relative overflow-hidden bg-white rounded-[14px] p-5 border border-blue-200 border-l-[3px] border-l-blue-600 rounded-l-none"
                >
                  <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.07),transparent_70%)] pointer-events-none" />
                  <div className="absolute top-0 left-0 w-10 h-full bg-gradient-to-r from-transparent via-blue-100/40 to-transparent animate-shimmer pointer-events-none" />
                  <div className="w-[26px] h-[26px] rounded-full bg-blue-700 text-white text-[12px] font-extrabold flex items-center justify-center mb-3.5">
                    {step.num}
                  </div>
                  <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{step.desc}</p>
                  <Link
                    href={step.ctaHref}
                    className="inline-flex items-center gap-1.5 bg-blue-700 text-white text-[13px] font-bold px-5 py-2.5 rounded-[9px] hover:bg-blue-800 transition animate-pulse-glow"
                  >
                    {step.ctaLabel}
                  </Link>
                </div>
              );
            }
            return (
              <div
                key={step.key}
                className="relative overflow-hidden bg-white rounded-[14px] p-5 border border-emerald-200 border-l-[3px] border-l-emerald-500 rounded-l-none"
              >
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.07),transparent_70%)] pointer-events-none" />
                <div
                  className={`w-[26px] h-[26px] rounded-full ${done ? "bg-green-100 text-green-600" : "bg-emerald-500 text-white"} text-[12px] font-extrabold flex items-center justify-center mb-3.5`}
                >
                  {done ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{step.desc}</p>
                {!done && (
                  <Link
                    href={step.ctaHref}
                    className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[13px] font-bold px-5 py-2.5 rounded-[9px] hover:bg-emerald-600 transition mt-4"
                  >
                    {step.ctaLabel}
                  </Link>
                )}
                {done && (
                  <span className="inline-block mt-3 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                    Completato
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── TOOL CARDS ── */}
        <section className="mb-6 fade-in-delay">
          <span className="text-[10px] font-bold text-slate-300 tracking-[0.1em] uppercase px-1 mb-3 block">
            Strumenti
          </span>
          <div className="grid grid-cols-4 gap-4">
            {QUICK_TOOLS.map((t, i) => {
              const c = toolColors[t.color] || toolColors.blue;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="relative overflow-hidden bg-white border border-slate-200 rounded-[14px] p-6 cursor-pointer flex flex-col transition-all duration-200 hover:-translate-y-[4px] hover:border-blue-200 hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] animate-fadeup no-underline"
                  style={{ animationDelay: `${280 + i * 80}ms` }}
                >
                  <div
                    className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${c.glow} pointer-events-none`}
                  />
                  <span
                    className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center mb-3 ${c.iconBg}`}
                    style={{ color: c.stroke }}
                  >
                    {t.icon}
                  </span>
                  <span className="text-[14px] font-extrabold text-slate-900 tracking-tight mb-1">
                    {t.title}
                  </span>
                  <span className="text-[13px] text-slate-500 leading-relaxed flex-1">
                    {t.desc}
                  </span>
                  <span
                    className={`inline-block mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${c.badgeBg} ${c.badgeText}`}
                  >
                    {c.badgeLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     MAIN — Plan ready state (V2 — 5 blocks)
     ═══════════════════════════════════════════ */
  return (
    <div className="oggi-v2-page pt-6 fade-in" style={{ background: "#EBF0FA", minHeight: "100vh" }}>
      {/* Trial remaining banner */}
      {!isPremium && isConfigured && (
        <div className="oggi-trial-remaining-banner fade-in">
          <span className="oggi-trial-remaining-icon">🎁</span>
          <span className="oggi-trial-remaining-text">
            {trialCount < MAX_FREE_TRIALS ? (
              <>
                Prova gratuita:{" "}
                <strong>
                  {MAX_FREE_TRIALS - trialCount} di {MAX_FREE_TRIALS}
                </strong>{" "}
                piani rimasti
              </>
            ) : (
              <>
                Prove gratuite esaurite —{" "}
                <Link href="/pricing" className="oggi-trial-upgrade-link">
                  passa al Premium
                </Link>{" "}
                per piani illimitati
              </>
            )}
          </span>
        </div>
      )}

      {/* ── HERO CARD ── */}
      <div className="relative overflow-hidden rounded-2xl p-7 mb-6 bg-gradient-to-br from-[#1E3A6E] via-[#1E4A8A] to-[#162F5C]">
        <div className="pointer-events-none">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_65%)]" />
          <div className="absolute -bottom-16 left-2 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)]" />
          <div className="absolute top-4 left-44 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.13),transparent_70%)]" />
        </div>
        <div className="relative z-10">
          <div className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
            {today}
          </div>
          <h1 className="text-[27px] font-extrabold text-white tracking-tight leading-tight mb-1">
            {greeting}
            {firstName ? ", " : ""}
            {firstName ? <span className="text-blue-200">{firstName}</span> : ""}
          </h1>
          <p className="text-[13.5px] text-white/50 mb-5">
            {plan
              ? "Il tuo piano operativo di oggi è pronto. Ogni blocco ti guida passo dopo passo."
              : "Il piano quotidiano personalizzato con azioni, messaggi e contenuti — pronti da usare."}
          </p>

          {plan && (
            <div className="flex items-center border-t border-white/10 mt-5 pt-5">
              <div className="flex-1">
                <div className="text-[22px] font-extrabold text-white">
                  {plan.contenuto_del_giorno.tipo === "post" ? "Post" : "Articolo"}
                </div>
                <div className="text-[11px] text-white/35 font-medium">Contenuto pronto</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-green-400">
                  {followUps.length}
                </div>
                <div className="text-[11px] text-white/35 font-medium">Follow-up</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-white">
                  {plan.spunti_web?.length || 0}
                </div>
                <div className="text-[11px] text-white/35 font-medium">Spunti web</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-white">{contacts.length}</div>
                <div className="text-[11px] text-white/35 font-medium">Contatti</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── PRE-PLAN: waiting to generate ── */}
      {!plan && !loading && (
        <section className="oggi-ready-card fade-in-delay">
          {error && (
            <div className="ap-error-box" style={{ marginBottom: "1rem" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {error}
            </div>
          )}
          <div className="oggi-ready-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
            </svg>
          </div>
          <h3 className="oggi-ready-title">Il tuo sistema è pronto</h3>
          <p className="oggi-ready-desc">
            L&apos;AI analizzerà la tua configurazione per creare un piano su misura: ricerca LinkedIn,
            profili target, contenuti e spunti dal web.
          </p>
          <button type="button" onClick={generatePlan} className="oggi-launch-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
            </svg>
            Genera il piano di oggi
          </button>
          <div className="oggi-ready-features">
            <span>Persone da contattare</span>
            <span className="oggi-ready-dot" />
            <span>Contenuto pronto</span>
            <span className="oggi-ready-dot" />
            <span>Follow-up</span>
            <span className="oggi-ready-dot" />
            <span>Spunti dal web</span>
          </div>
        </section>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <section className="oggi-loading-v2 fade-in-delay">
          <div className="oggi-loading-orb">
            <div className="oggi-orb-ring oggi-orb-ring-1" />
            <div className="oggi-orb-ring oggi-orb-ring-2" />
            <div className="oggi-orb-ring oggi-orb-ring-3" />
            <div className="oggi-orb-core">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
              </svg>
            </div>
          </div>
          <h3 className="oggi-loading-title-v2">Preparo il tuo piano</h3>
          <div className="oggi-loading-steps">
            {[
              "Analizzo configurazione",
              "Preparo lista contatti",
              "Scrivo contenuto",
              "Genero follow-up",
              "Cerco spunti web",
            ].map((label, i) => (
              <span
                key={label}
                className={`oggi-loading-step ${loadingStep >= i ? "oggi-loading-step--active" : ""}`}
              >
                {label}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           PLAN OUTPUT — V2 — 5 Blocks
         ═══════════════════════════════════════════ */}
      {plan && (
        <div className="space-y-6">
          {/* ══════════════════════════════════════
             BLOCK 1 — LISTA PERSONE DA CONTATTARE
             ══════════════════════════════════════ */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Lista delle persone da contattare
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {dateLabel}
              </span>
            </div>
            <LinkedInSearchCard data={plan.ricerca_linkedin} dateLabel={dateLabel} />
          </section>

          {/* ══════════════════════════════════════
             BLOCK 3 — FOLLOW-UP SULLO STORICO
             ══════════════════════════════════════ */}
          {followUps.length > 0 && (
            <section className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Follow-up sullo storico
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {followUps.length} azioni
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {dateLabel}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {followUps.map((item, i) => (
                  <FollowUpCard key={i} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════
             BLOCK 4 — CONTENUTO DEL GIORNO
             ══════════════════════════════════════ */}
          <section className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Contenuto del giorno
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  plan.contenuto_del_giorno.tipo === "post"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {plan.contenuto_del_giorno.tipo === "post" ? "Post" : "Articolo"} — {dateLabel}
              </span>
            </div>
            <DailyContentCard content={plan.contenuto_del_giorno} />
          </section>

          {/* ══════════════════════════════════════
             BLOCK 5 — SPUNTI DAL WEB
             ══════════════════════════════════════ */}
          {plan.spunti_web && plan.spunti_web.length > 0 && (
            <section className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Spunti dal web
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {plan.spunti_web.length} articoli
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {dateLabel}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {plan.spunti_web.map((insight, i) => (
                  <WebInsightCard key={i} insight={insight} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── STRUMENTI ── */}
          <section className="border-t border-slate-100 pt-4 mt-4 fade-in-delay">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
              Strumenti
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_TOOLS.map((t, i) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="bg-white border border-slate-100 rounded-[14px] p-4 flex flex-col gap-2 no-underline hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 animate-fadeup"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-[13px] font-extrabold text-slate-900 tracking-tight">
                    {t.title}
                  </span>
                  <span className="text-[12px] text-slate-500 leading-relaxed">
                    {t.desc}
                  </span>
                  <span className="text-[12px] font-semibold text-blue-700 mt-auto">
                    Apri →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <div className="oggi-bottom-actions">
            <button
              type="button"
              onClick={generatePlan}
              disabled={loading}
              className="btn-ghost"
            >
              {loading ? "Rigenero…" : "🔄 Rigenera piano"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Follow-up helpers — generate client-side follow-up suggestions ── */
// NOTE: These are rule-based suggestions. When the AI has prospect history context,
// it can generate more targeted follow-ups via the API.

function generateFollowUpAction(daysSince: number): string {
  if (daysSince <= 2) return "Commenta il suo ultimo post per restare visibile";
  if (daysSince <= 5) return "Manda un messaggio di follow-up breve e naturale";
  if (daysSince <= 10) return "Proponi una call conoscitiva di 15 minuti";
  if (daysSince <= 21) return "Condividi un contenuto rilevante per il suo settore";
  return "Riattiva il contatto con un messaggio leggero e un pretesto concreto";
}

function generateFollowUpText(nomeRuolo: string, daysSince: number): string {
  const nome = nomeRuolo.split("—")[0]?.trim() || "Buongiorno";
  if (daysSince <= 2)
    return `Commento costruttivo sul suo ultimo post — aggiungi un dato o un'esperienza diretta, poi chiudi con una domanda aperta.`;
  if (daysSince <= 5)
    return `Ciao ${nome}, volevo condividere un pensiero su quello di cui abbiamo parlato — [inserisci micro-insight specifico]. Ti torna come ragionamento?`;
  if (daysSince <= 10)
    return `Ciao ${nome}, mi è venuta in mente una cosa che potrebbe esserti utile. Ti va uno scambio di 15 minuti questa settimana? Nessun pitch, solo idee.`;
  if (daysSince <= 21)
    return `Ciao ${nome}, ho letto un articolo che mi ha fatto pensare alla nostra conversazione — [link]. Curioso di sapere come procede da voi!`;
  return `Ciao ${nome}, è passato un po' — mi farebbe piacere capire come state procedendo. Novità interessanti?`;
}
