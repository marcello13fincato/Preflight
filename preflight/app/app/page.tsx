"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import DailyActionCard from "@/components/app/DailyActionCard";
import type { DailyAction } from "@/components/app/DailyActionCard";
import type { DailyPlanJson } from "@/lib/sales/schemas";
import { demoDailyActions } from "@/lib/mock/dailyActions";

const DAILY_PLAN_STORAGE_KEY = "preflight:daily-plan";
const DAILY_PLAN_DATE_KEY = "preflight:daily-plan-date";
const TARGETING_STORAGE_KEY = "preflight:last-targeting";

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

/* ── Quick Actions for the guided system ── */
const QUICK_ACTIONS = [
  {
    href: "/app/find-clients",
    icon: "🔍",
    title: "Trova clienti",
    desc: "Scopri i profili più rilevanti da attivare oggi.",
  },
  {
    href: "/app/prospect",
    icon: "👤",
    title: "Analizza profilo",
    desc: "Valuta fit, priorità e angolo di attacco.",
  },
  {
    href: "/app/post",
    icon: "✍️",
    title: "Scrivi un post",
    desc: "Crea un post LinkedIn con hook, CTA e immagine.",
  },
  {
    href: "/app/articolo",
    icon: "📄",
    title: "Scrivi un articolo",
    desc: "Articolo lungo e autorevole per la tua newsletter.",
  },
];

export default function CosaFareOggiPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const contacts = useMemo(() => repo.contact.listContacts(userId), [userId, repo]);

  const [plan, setPlan] = useState<DailyPlanJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cached = loadCachedPlan();
    if (cached) {
      setPlan(cached);
      setAutoLoaded(true);
    }
  }, []);

  const generatePlan = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setPlan(null);
    setCheckedActions(new Set());
    try {
      const lastTargeting = loadLastTargeting(userId);
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
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [loading, profile.onboarding, userId]);

  useEffect(() => {
    if (!autoLoaded && !plan && !loading && profile.onboarding_complete) {
      generatePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoaded, profile.onboarding_complete]);

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
  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="oggi-page fade-in">
      {/* ── HERO ── */}
      <div className="oggi-hero fade-in">
        <div className="oggi-hero-top">
          <span className="oggi-date">{today}</span>
          {plan && (
            <span className="oggi-progress-pill">
              <span className="oggi-progress-fill" style={{ width: `${(completedCount / actions.length) * 100}%` }} />
              <span className="oggi-progress-label">{completedCount}/{actions.length} completate</span>
            </span>
          )}
        </div>
        <h1 className="oggi-hero-title">Cosa fare oggi</h1>
        {plan?.focus_giornata ? (
          <p className="oggi-hero-focus">{plan.focus_giornata}</p>
        ) : (
          <p className="oggi-hero-sub">Il tuo punto di partenza quotidiano. Azioni, messaggi e strategia — tutto in un posto.</p>
        )}
      </div>

      {/* ── QUICK ACTIONS — Guided system links ── */}
      {!plan && !loading && (
        <>
          {!profile.onboarding_complete && (
            <section className="sys-setup-banner fade-in-delay">
              <div className="sys-setup-icon">⚙️</div>
              <div className="sys-setup-content">
                <h3 className="sys-setup-title">Configura il tuo sistema commerciale</h3>
                <p className="sys-setup-desc">
                  Inserisci cosa vendi, a chi e come — l&apos;AI userà queste informazioni in ogni risposta.
                </p>
                <Link href="/app/onboarding" className="btn-primary">
                  Configura ora →
                </Link>
              </div>
            </section>
          )}

          <section className="oggi-empty fade-in-delay">
            <div className="oggi-empty-icon">📋</div>
            <h3 className="oggi-empty-title">Il tuo piano di oggi non è ancora pronto</h3>
            <p className="oggi-empty-desc">
              {profile.onboarding_complete
                ? "Genera il piano e ricevi azioni intelligenti con contesto, ragionamento e messaggi personalizzati."
                : "Configura il profilo per un piano su misura, oppure genera azioni con esempi realistici."}
            </p>
            <div className="oggi-empty-actions">
              <button type="button" onClick={generatePlan} className="btn-primary oggi-gen-btn">
                Genera il piano di oggi →
              </button>
            </div>
          </section>

          <section className="sys-quick-actions fade-in-delay">
            <h2 className="sys-quick-title">Oppure inizia da qui</h2>
            <div className="sys-quick-grid">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.href} href={action.href} className="sys-quick-card">
                  <span className="sys-quick-card-icon">{action.icon}</span>
                  <h3 className="sys-quick-card-title">{action.title}</h3>
                  <p className="sys-quick-card-desc">{action.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <section className="oggi-loading-card fade-in-delay">
          <div className="oggi-pulse-ring" />
          <p className="oggi-loading-title">Sto preparando il tuo piano…</p>
          <p className="oggi-loading-sub">Analizzo profilo, contatti e conversazioni recenti.</p>
        </section>
      )}

      {plan && (
        <>
          {/* ── SEZIONE 1: PIANO AZIONI ── */}
          <section className="oggi-section-card fade-in-delay">
            <div className="oggi-section-head">
              <span className="oggi-section-num">1</span>
              <div>
                <h2 className="oggi-section-title">Il tuo piano di oggi</h2>
                <p className="oggi-section-sub">Ogni azione è pensata per la tua situazione. Espandi per contesto, ragionamento e messaggio.</p>
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
          </section>

          {/* ── SEZIONE 2: MESSAGGI PRONTI ── */}
          <section className="oggi-section-card fade-in-delay">
            <div className="oggi-section-head">
              <span className="oggi-section-num">2</span>
              <div>
                <h2 className="oggi-section-title">Messaggi pronti da copiare</h2>
                <p className="oggi-section-sub">Copia e incolla su LinkedIn.</p>
              </div>
            </div>

            <div className="oggi-msgs-grid">
              <MsgCard label="Primo contatto" text={plan.messaggi_pronti.primo_contatto} variant={plan.messaggi_pronti.primo_contatto_variante} />
              <MsgCard label="Follow-up" text={plan.messaggi_pronti.followup} variant={plan.messaggi_pronti.followup_variante} />
              <MsgCard label="Commento post" text={plan.messaggi_pronti.commento_post} />
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
                <p className="oggi-section-sub">Testo pronto da pubblicare su LinkedIn.</p>
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

          {/* ── QUICK ACTIONS + STATS + RIGENERA ── */}
          <section className="oggi-section-card oggi-stats-card fade-in-delay">
            <div className="oggi-stats-grid">
              <div className="oggi-stat">
                <span className="oggi-stat-value">{contacts.length}</span>
                <span className="oggi-stat-label">Contatti analizzati</span>
              </div>
              <div className="oggi-stat">
                <span className="oggi-stat-value">{completedCount}/{actions.length}</span>
                <span className="oggi-stat-label">Azioni fatte</span>
              </div>
              <div className="oggi-stat">
                <span className="oggi-stat-value">{profile.onboarding_complete ? "✓" : "—"}</span>
                <span className="oggi-stat-label">Sistema configurato</span>
              </div>
            </div>
          </section>

          {/* Quick navigation */}
          <section className="sys-quick-actions fade-in-delay">
            <h2 className="sys-quick-title">Prossimo passo</h2>
            <div className="sys-quick-grid">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.href} href={action.href} className="sys-quick-card">
                  <span className="sys-quick-card-icon">{action.icon}</span>
                  <h3 className="sys-quick-card-title">{action.title}</h3>
                  <p className="sys-quick-card-desc">{action.desc}</p>
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
