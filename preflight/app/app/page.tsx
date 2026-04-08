"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import DailyActionCard from "@/components/app/DailyActionCard";
import type { DailyAction } from "@/components/app/DailyActionCard";
import type { DailyPlanJson } from "@/lib/sales/schemas";
import { demoDailyActions } from "@/lib/mock/dailyActions";
import { demoDailyPlan } from "@/lib/mock/demoDailyPlan";

const DAILY_PLAN_STORAGE_KEY = "preflight:daily-plan";
const DAILY_PLAN_DATE_KEY = "preflight:daily-plan-date";
const TARGETING_STORAGE_KEY = "preflight:last-targeting";
const FREE_TRIAL_KEY = "preflight:daily-plan-trial-count";
const MAX_FREE_TRIALS = 3;

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

function loadCachedPlan(): DailyPlanJson | null {
  if (typeof window === "undefined") return null;
  const date = localStorage.getItem(DAILY_PLAN_DATE_KEY);
  if (date !== todayKey()) return null;
  const raw = localStorage.getItem(DAILY_PLAN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyPlanJson;
  } catch {
    return null;
  }
}

function cachePlan(plan: DailyPlanJson) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAILY_PLAN_STORAGE_KEY, JSON.stringify(plan));
  localStorage.setItem(DAILY_PLAN_DATE_KEY, todayKey());
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={`oggi-copy-btn ${copied ? "oggi-copy-done" : ""}`}>
      {copied ? (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copiato</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copia</>
      )}
    </button>
  );
}

/* ── Quick tool links ── */
const QUICK_TOOLS = [
  { href: "/app/find-clients", icon: "🔍", title: "Trova clienti", desc: "Scopri profili da attivare oggi." },
  { href: "/app/prospect", icon: "👤", title: "Analizza profilo", desc: "Valuta fit e angolo di attacco." },
  { href: "/app/post", icon: "✍️", title: "Scrivi un post", desc: "Post con hook, CTA e immagine." },
  { href: "/app/articolo", icon: "📄", title: "Scrivi un articolo", desc: "Articolo autorevole con SEO." },
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

export default function CosaFareOggiPage() {
  const { userId, status, session } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = userId ? repo.profile.getProfile(userId) : { plan: null, onboarding_complete: false, onboarding: null };
  const contacts = useMemo(() => userId ? repo.contact.listContacts(userId) : [], [userId, repo]);

  const isPremium = profile.plan !== null;
  const isConfigured = profile.onboarding_complete;
  const [trialCount, setTrialCount] = useState(0);
  const hasTrialsLeft = isConfigured && !isPremium && trialCount < MAX_FREE_TRIALS;
  const isReady = (isPremium && isConfigured) || hasTrialsLeft;

  const [plan, setPlan] = useState<DailyPlanJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());
  const [activeMsg, setActiveMsg] = useState<number>(0);
  const [showDemo, setShowDemo] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrialCount(getTrialCount());
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const cached = loadCachedPlan();
    if (cached) {
      setPlan(cached);
      setAutoLoaded(true);
    }
  }, [isReady]);

  const generatePlan = useCallback(async () => {
    if (loading || !isReady) return;
    setLoading(true);
    setPlan(null);
    setCheckedActions(new Set());
    setLoadingStep(0);
    const stepTimer = setInterval(() => setLoadingStep((s) => Math.min(s + 1, 3)), 2500);
    setError(null);
    try {
      const lastTargeting = loadLastTargeting(userId!);
      const res = await fetch("/api/ai/daily-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding || undefined,
          targeting: lastTargeting || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = (await res.json()) as DailyPlanJson;
      setPlan(data);
      cachePlan(data);
      if (hasTrialsLeft && !isPremium) {
        const newCount = incrementTrialCount();
        setTrialCount(newCount);
      }
    } catch (err) {
      setPlan(null);
      setError(err instanceof Error ? err.message : "Errore nella generazione del piano. Riprova.");
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  }, [loading, isReady, profile.onboarding, userId, hasTrialsLeft, isPremium]);

  useEffect(() => {
    if (isReady && !autoLoaded && !plan && !loading) {
      generatePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, autoLoaded]);

  const toggleAction = (key: string) => {
    setCheckedActions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const actions: DailyAction[] = useMemo(() => {
    if (!plan) return [];
    const azioniObj = plan.azioni;
    const keys = ["azione_1", "azione_2", "azione_3", "azione_4", "azione_5"] as const;
    const extracted = keys.map((k) => azioniObj[k]).filter(Boolean);
    const firstAction = extracted[0] as Record<string, unknown> | undefined;
    if (firstAction && typeof firstAction.contesto === "object" && firstAction.contesto !== null) {
      return extracted as unknown as DailyAction[];
    }
    return demoDailyActions;
  }, [plan]);

  const completedCount = checkedActions.size;
  const progressPct = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;
  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
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
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  /* ═══════════════════════════════════════════
     DEMO VIEW — visible to everyone
     ═══════════════════════════════════════════ */
  if (showDemo && !isReady) {
    const demoActions: DailyAction[] = (() => {
      const azioniObj = demoDailyPlan.azioni;
      const keys = ["azione_1", "azione_2", "azione_3", "azione_4", "azione_5"] as const;
      return keys.map((k) => azioniObj[k]).filter(Boolean) as unknown as DailyAction[];
    })();

    return (
      <div className="oggi-page fade-in">
        {/* Demo banner */}
        <div className="oggi-demo-banner fade-in">
          <div className="oggi-demo-banner-content">
            <span className="oggi-demo-badge">👁️ Esempio</span>
            <p className="oggi-demo-banner-text">
              Stai vedendo un esempio di piano quotidiano. <strong>Configura il tuo sistema</strong> per ricevere un piano personalizzato con 3 prove gratuite.
            </p>
          </div>
          <button type="button" onClick={() => setShowDemo(false)} className="oggi-demo-close-btn">
            ← Torna indietro
          </button>
        </div>

        {/* Hero */}
        <div className="oggi-hero fade-in">
          <div className="oggi-hero-top">
            <span className="oggi-date">{today}</span>
          </div>
          <h1 className="oggi-hero-title">Cosa fare oggi</h1>
          <div className="oggi-focus-card">
            <span className="oggi-focus-label">Focus del giorno</span>
            <p className="oggi-focus-text">{demoDailyPlan.focus_giornata}</p>
          </div>
        </div>

        {/* Azioni demo */}
        <section className="oggi-section-card fade-in-delay">
          <div className="oggi-section-head">
            <span className="oggi-section-num">1</span>
            <div>
              <h2 className="oggi-section-title">Le tue 5 azioni di oggi</h2>
              <p className="oggi-section-sub">Ecco un esempio di azioni personalizzate che riceverai ogni giorno.</p>
            </div>
          </div>
          <div className="oggi-actions-list">
            {demoActions.map((action, i) => (
              <DailyActionCard key={`demo_${i}`} action={action} index={i} done={false} onToggle={() => {}} />
            ))}
          </div>
        </section>

        {/* Messaggi demo */}
        <section className="oggi-section-card fade-in-delay">
          <div className="oggi-section-head">
            <span className="oggi-section-num">2</span>
            <div>
              <h2 className="oggi-section-title">Messaggi pronti</h2>
              <p className="oggi-section-sub">Copia e incolla direttamente su LinkedIn.</p>
            </div>
          </div>
          <div className="oggi-msg-tabs">
            {["Primo contatto", "Follow-up", "Commento"].map((label, i) => (
              <button key={label} type="button" className={`oggi-msg-tab ${activeMsg === i ? "oggi-msg-tab--active" : ""}`}
                onClick={() => setActiveMsg(i)}>
                {label}
              </button>
            ))}
          </div>
          <div className="oggi-msg-active-card">
            {activeMsg === 0 && (
              <MsgCard label="Primo contatto" text={demoDailyPlan.messaggi_pronti.primo_contatto} variant={demoDailyPlan.messaggi_pronti.primo_contatto_variante} />
            )}
            {activeMsg === 1 && (
              <MsgCard label="Follow-up" text={demoDailyPlan.messaggi_pronti.followup} variant={demoDailyPlan.messaggi_pronti.followup_variante} />
            )}
            {activeMsg === 2 && (
              <MsgCard label="Commento post" text={demoDailyPlan.messaggi_pronti.commento_post} />
            )}
          </div>
        </section>

        {/* Post demo */}
        <section className="oggi-section-card fade-in-delay">
          <div className="oggi-section-head">
            <span className="oggi-section-num">3</span>
            <div>
              <h2 className="oggi-section-title">Post del giorno</h2>
              <p className="oggi-section-sub">Pronto da pubblicare su LinkedIn.</p>
            </div>
          </div>
          <div className="oggi-post-card">
            <div className="oggi-post-header">
              <span className="oggi-post-badge">✍️ Post pronto</span>
            </div>
            <div className="oggi-post-preview">
              <p className="oggi-post-hook">{demoDailyPlan.post_del_giorno.hook}</p>
              <p className="oggi-post-body">{demoDailyPlan.post_del_giorno.corpo}</p>
              <p className="oggi-post-cta">{demoDailyPlan.post_del_giorno.chiusura}</p>
            </div>
            {demoDailyPlan.post_del_giorno.tipo_immagine && (
              <p className="oggi-post-img-tip">📷 {demoDailyPlan.post_del_giorno.tipo_immagine}</p>
            )}
          </div>
        </section>

        {/* CTA finale */}
        <section className="oggi-demo-cta-section fade-in-delay">
          <div className="oggi-demo-cta-card">
            <h3 className="oggi-demo-cta-title">Vuoi il tuo piano personalizzato?</h3>
            <p className="oggi-demo-cta-desc">
              Configura il tuo sistema in 3 minuti e ricevi <strong>3 piani giornalieri gratuiti</strong>, creati su misura per il tuo business.
            </p>
            <div className="oggi-demo-cta-actions">
              <Link href="/app/onboarding" className="oggi-launch-btn">
                Configura il sistema →
              </Link>
              <button type="button" onClick={() => setShowDemo(false)} className="btn-ghost">
                ← Torna indietro
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     GATE — Setup required (with demo + trial info)
     ═══════════════════════════════════════════ */
  if (!isReady) {
    const trialsExhausted = isConfigured && !isPremium && trialCount >= MAX_FREE_TRIALS;
    const completedSteps = [isPremium, isConfigured].filter(Boolean).length;
    return (
      <div className="oggi-page fade-in">
        {/* Hero — gate version */}
        <div className="oggi-hero oggi-hero--gate fade-in">
          <div className="oggi-hero-top">
            <span className="oggi-date">{today}</span>
            <span className="oggi-gate-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              {completedSteps}/2 requisiti
            </span>
          </div>
          <h1 className="oggi-hero-title">
            {greeting}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="oggi-hero-sub">
            {trialsExhausted
              ? "Hai usato le 3 prove gratuite. Attiva il Piano Premium per continuare con piani quotidiani illimitati."
              : "Per attivare il tuo piano quotidiano AI servono due cose. Completa i passaggi qui sotto."}
          </p>
        </div>

        {/* Trial info banner */}
        {trialsExhausted ? (
          <div className="oggi-trial-banner fade-in-delay" style={{ borderColor: 'rgba(251,191,36,0.25)', background: 'linear-gradient(135deg,rgba(251,191,36,0.1) 0%,rgba(245,158,11,0.05) 100%)' }}>
            <div className="oggi-trial-banner-icon">⚡</div>
            <div className="oggi-trial-banner-content">
              <strong>Prove gratuite esaurite</strong>
              <p>Hai usato tutte e 3 le prove. Passa al Premium per avere piani illimitati, storico e molto altro.</p>
            </div>
          </div>
        ) : (
          <div className="oggi-trial-banner fade-in-delay">
            <div className="oggi-trial-banner-icon">🎁</div>
            <div className="oggi-trial-banner-content">
              <strong>3 prove gratuite incluse</strong>
              <p>Configura il tuo sistema e ricevi 3 piani giornalieri AI gratuiti — personalizzati sul tuo business.</p>
            </div>
          </div>
        )}

        {/* Gate progress bar */}
        <div className="oggi-gate-progress fade-in-delay">
          <div className="oggi-gate-progress-track">
            <div className="oggi-gate-progress-fill" style={{ width: `${completedSteps * 50}%` }} />
          </div>
          <span className="oggi-gate-progress-label">{completedSteps}/2 completati</span>
        </div>

        {/* Gate steps */}
        <div className="oggi-gate-steps fade-in-delay">
          {GATE_STEPS.map((step) => {
            const done = step.checkField === "plan" ? isPremium : isConfigured;
            return (
              <div key={step.key} className={`oggi-gate-step ${done ? "oggi-gate-step--done" : ""}`}>
                <div className="oggi-gate-step-indicator">
                  {done ? (
                    <div className="oggi-gate-check-done">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  ) : (
                    <div className="oggi-gate-check-pending">
                      <span>{step.num}</span>
                    </div>
                  )}
                </div>
                <div className="oggi-gate-step-content">
                  <div className="oggi-gate-step-icon">{step.icon}</div>
                  <h3 className="oggi-gate-step-title">{step.title}</h3>
                  <p className="oggi-gate-step-desc">{step.desc}</p>
                  {!done && (
                    <Link href={step.ctaHref} className="oggi-gate-step-cta">
                      {step.ctaLabel}
                    </Link>
                  )}
                  {done && <span className="oggi-gate-step-badge-done">Completato</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tools — always available */}
        <section className="oggi-gate-tools fade-in-delay">
          <div className="oggi-gate-tools-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span>Nel frattempo, gli strumenti sono già attivi</span>
          </div>
          <div className="sys-quick-grid">
            {QUICK_TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="sys-quick-card">
                <span className="sys-quick-card-icon">{t.icon}</span>
                <h3 className="sys-quick-card-title">{t.title}</h3>
                <p className="sys-quick-card-desc">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Demo CTA */}
        <section className="oggi-demo-preview-section fade-in-delay">
          <button type="button" onClick={() => setShowDemo(true)} className="oggi-demo-preview-btn">
            <span className="oggi-demo-preview-icon">👁️</span>
            <div className="oggi-demo-preview-text">
              <strong>Vedi un esempio</strong>
              <span>Scopri cosa include il piano quotidiano AI prima di configurare</span>
            </div>
            <span className="oggi-demo-preview-arrow">→</span>
          </button>
        </section>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     MAIN — Plan ready state
     ═══════════════════════════════════════════ */
  return (
    <div className="oggi-page fade-in">
      {/* Trial remaining banner */}
      {!isPremium && isConfigured && (
        <div className="oggi-trial-remaining-banner fade-in">
          <span className="oggi-trial-remaining-icon">🎁</span>
          <span className="oggi-trial-remaining-text">
            {trialCount < MAX_FREE_TRIALS ? (
              <>Prova gratuita: <strong>{MAX_FREE_TRIALS - trialCount} di {MAX_FREE_TRIALS}</strong> piani rimasti</>
            ) : (
              <>Prove gratuite esaurite — <Link href="/pricing" className="oggi-trial-upgrade-link">passa al Premium</Link> per piani illimitati</>
            )}
          </span>
        </div>
      )}
      {/* ── HERO ── */}
      <div className="oggi-hero fade-in">
        <div className="oggi-hero-top">
          <span className="oggi-date">{today}</span>
          {plan && (
            <div className="oggi-hero-stats-row">
              <span className="oggi-progress-pill">
                <span className="oggi-progress-fill" style={{ width: `${progressPct}%` }} />
                <span className="oggi-progress-label">{completedCount}/{actions.length}</span>
              </span>
              <span className="oggi-hero-stat-mini">{contacts.length} contatti</span>
            </div>
          )}
        </div>

        <h1 className="oggi-hero-title">
          {plan ? (
            <>
              {greeting}{firstName ? `, ${firstName}` : ""}
              {progressPct === 100 && <span className="oggi-hero-confetti"> 🎉</span>}
            </>
          ) : (
            "Cosa fare oggi"
          )}
        </h1>

        {plan?.focus_giornata ? (
          <div className="oggi-focus-card">
            <span className="oggi-focus-label">Focus del giorno</span>
            <p className="oggi-focus-text">{plan.focus_giornata}</p>
          </div>
        ) : (
          <p className="oggi-hero-sub">Il piano quotidiano personalizzato con azioni, messaggi e contenuti — pronti da usare.</p>
        )}

        {/* Circular progress ring in hero */}
        {plan && (
          <div className="oggi-hero-ring">
            <svg viewBox="0 0 80 80" className="oggi-ring-svg">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ringGrad)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${progressPct * 2.136} 213.6`} transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dasharray 0.6s ease" }} />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
            <span className="oggi-ring-pct">{progressPct}%</span>
          </div>
        )}
      </div>

      {/* ── PRE-PLAN: waiting to generate ── */}
      {!plan && !loading && (
        <section className="oggi-ready-card fade-in-delay">
          {error && (
            <div className="ap-error-box" style={{ marginBottom: '1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {error}
            </div>
          )}
          <div className="oggi-ready-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
            </svg>
          </div>
          <h3 className="oggi-ready-title">Il tuo sistema è pronto</h3>
          <p className="oggi-ready-desc">
            L&apos;AI analizzerà il tuo profilo, i contatti recenti e lo storico per creare un piano su misura con 5 azioni, messaggi pronti e un post da pubblicare.
          </p>
          <button type="button" onClick={generatePlan} className="oggi-launch-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
            </svg>
            Genera il piano di oggi
          </button>
          <div className="oggi-ready-features">
            <span>5 azioni mirate</span>
            <span className="oggi-ready-dot" />
            <span>Messaggi pronti</span>
            <span className="oggi-ready-dot" />
            <span>Post del giorno</span>
            <span className="oggi-ready-dot" />
            <span>Ricerca LinkedIn</span>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
              </svg>
            </div>
          </div>
          <h3 className="oggi-loading-title-v2">Preparo il tuo piano</h3>
          <div className="oggi-loading-steps">
            {["Analizzo profilo", "Valuto contatti", "Creo azioni", "Scrivo messaggi"].map((label, i) => (
              <span key={label} className={`oggi-loading-step ${loadingStep >= i ? "oggi-loading-step--active" : ""}`}>{label}</span>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
           PLAN OUTPUT — 3 sections + stats + tools
         ═══════════════════════════════════════════ */}
      {plan && (
        <>
          {/* ── SEZIONE 1: AZIONI ── */}
          <section className="oggi-section-card fade-in-delay">
            <div className="oggi-section-head">
              <span className="oggi-section-num">1</span>
              <div>
                <h2 className="oggi-section-title">Le tue 5 azioni di oggi</h2>
                <p className="oggi-section-sub">Personalizzate sulla tua situazione. Espandi per contesto, ragionamento e messaggio pronto.</p>
              </div>
            </div>

            <div className="oggi-actions-list">
              {actions.map((action, i) => {
                const key = `azione_${i}`;
                return (
                  <DailyActionCard
                    key={key}
                    action={action}
                    index={i}
                    done={checkedActions.has(key)}
                    onToggle={() => toggleAction(key)}
                  />
                );
              })}
            </div>

            {/* Inline progress */}
            {completedCount > 0 && completedCount < actions.length && (
              <div className="oggi-inline-progress">
                <div className="oggi-inline-bar">
                  <div className="oggi-inline-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="oggi-inline-label">{completedCount}/{actions.length} completate — continua così!</span>
              </div>
            )}
            {completedCount === actions.length && actions.length > 0 && (
              <div className="oggi-done-banner">
                <span className="oggi-done-emoji">🏆</span>
                <div>
                  <strong>Tutte le azioni completate!</strong>
                  <p>Ottimo lavoro. Hai completato il piano di oggi.</p>
                </div>
              </div>
            )}
          </section>

          {/* ── SEZIONE 2: MESSAGGI PRONTI ── */}
          <section className="oggi-section-card fade-in-delay">
            <div className="oggi-section-head">
              <span className="oggi-section-num">2</span>
              <div>
                <h2 className="oggi-section-title">Messaggi pronti</h2>
                <p className="oggi-section-sub">Copia e incolla direttamente su LinkedIn.</p>
              </div>
            </div>

            {/* Tab-style message selector */}
            <div className="oggi-msg-tabs">
              {["Primo contatto", "Follow-up", "Commento"].map((label, i) => (
                <button key={label} type="button" className={`oggi-msg-tab ${activeMsg === i ? "oggi-msg-tab--active" : ""}`}
                  onClick={() => setActiveMsg(i)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="oggi-msg-active-card">
              {activeMsg === 0 && (
                <MsgCard label="Primo contatto" text={plan.messaggi_pronti.primo_contatto} variant={plan.messaggi_pronti.primo_contatto_variante} />
              )}
              {activeMsg === 1 && (
                <MsgCard label="Follow-up" text={plan.messaggi_pronti.followup} variant={plan.messaggi_pronti.followup_variante} />
              )}
              {activeMsg === 2 && (
                <MsgCard label="Commento post" text={plan.messaggi_pronti.commento_post} />
              )}
            </div>

            {plan.link_ricerca_linkedin && (
              <a href={plan.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="oggi-linkedin-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Apri ricerca su LinkedIn ↗
              </a>
            )}
          </section>

          {/* ── SEZIONE 3: POST DEL GIORNO ── */}
          <section className="oggi-section-card fade-in-delay">
            <div className="oggi-section-head">
              <span className="oggi-section-num">3</span>
              <div>
                <h2 className="oggi-section-title">Post del giorno</h2>
                <p className="oggi-section-sub">Pronto da pubblicare su LinkedIn.</p>
              </div>
            </div>

            <div className="oggi-post-card">
              <div className="oggi-post-header">
                <span className="oggi-post-badge">✍️ Post pronto</span>
                <CopyBtn text={plan.post_del_giorno.testo_completo} />
              </div>
              <div className="oggi-post-preview">
                <p className="oggi-post-hook">{plan.post_del_giorno.hook}</p>
                <p className="oggi-post-body">{plan.post_del_giorno.corpo}</p>
                <p className="oggi-post-cta">{plan.post_del_giorno.chiusura}</p>
              </div>
              {plan.post_del_giorno.tipo_immagine && (
                <p className="oggi-post-img-tip">📷 {plan.post_del_giorno.tipo_immagine}</p>
              )}
            </div>
          </section>

          {/* ── STATS STRIP ── */}
          <section className="oggi-section-card oggi-stats-card fade-in-delay">
            <div className="oggi-stats-grid">
              <div className="oggi-stat">
                <span className="oggi-stat-value">{contacts.length}</span>
                <span className="oggi-stat-label">Contatti analizzati</span>
              </div>
              <div className="oggi-stat">
                <span className="oggi-stat-value">{completedCount}/{actions.length}</span>
                <span className="oggi-stat-label">Azioni completate</span>
              </div>
              <div className="oggi-stat">
                <span className="oggi-stat-value">{progressPct}%</span>
                <span className="oggi-stat-label">Progresso di oggi</span>
              </div>
            </div>
          </section>

          {/* ── TOOLS NAV ── */}
          <section className="sys-quick-actions fade-in-delay">
            <h2 className="sys-quick-title">Prossimo passo</h2>
            <div className="sys-quick-grid">
              {QUICK_TOOLS.map((t) => (
                <Link key={t.href} href={t.href} className="sys-quick-card">
                  <span className="sys-quick-card-icon">{t.icon}</span>
                  <h3 className="sys-quick-card-title">{t.title}</h3>
                  <p className="sys-quick-card-desc">{t.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="oggi-bottom-actions">
            <button type="button" onClick={generatePlan} disabled={loading} className="btn-ghost">
              {loading ? "Rigenero…" : "🔄 Rigenera piano"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── MsgCard sub-component ── */
function MsgCard({ label, text, variant }: { label: string; text: string; variant?: string }) {
  const [showVariant, setShowVariant] = useState(false);
  const displayed = showVariant && variant ? variant : text;
  return (
    <div className="oggi-msg-card">
      <div className="oggi-msg-card-head">
        <span className="oggi-msg-card-label">{label}</span>
        <CopyBtn text={displayed} />
      </div>
      <p className="oggi-msg-card-text">{displayed}</p>
      {variant && (
        <button type="button" className="oggi-variant-toggle" onClick={() => setShowVariant(!showVariant)}>
          {showVariant ? "← Versione principale" : "Prova variante →"}
        </button>
      )}
    </div>
  );
}
