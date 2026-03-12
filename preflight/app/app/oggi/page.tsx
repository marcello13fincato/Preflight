"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { DailyPlanJson } from "@/lib/sales/schemas";

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

export default function CosaFareOggiPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const contacts = useMemo(() => repo.contact.listContacts(userId), [userId, repo]);

  const [plan, setPlan] = useState<DailyPlanJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);

  // Load cached plan on mount
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
      const data = await res.json() as DailyPlanJson;
      setPlan(data);
      cachePlan(data);
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [loading, profile.onboarding]);

  // Auto-generate plan on first visit if no cache
  useEffect(() => {
    if (!autoLoaded && !plan && !loading && profile.onboarding_complete) {
      generatePlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoaded, profile.onboarding_complete]);

  const recentContacts = contacts.slice(0, 5);
  const today = new Date().toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="oggi-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-hero" style={{ marginBottom: "1.5rem" }}>
        <div className="oggi-header-top">
          <span className="oggi-date">{today}</span>
        </div>
        <span className="page-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Piano giornaliero
        </span>
        <h1 className="page-hero-title">Cosa fare oggi</h1>
        <p className="page-hero-subtitle">
          In base al tuo sistema, ai contatti che hai già analizzato e ai consigli precedenti, Preflight ti suggerisce le azioni più utili per oggi.
        </p>
      </div>

      {/* ── GENERATE / REGENERATE ── */}
      {!plan && !loading && (
        <section className="oggi-section">
          <div className="oggi-empty-state">
            <div className="oggi-empty-icon">📋</div>
            <h3 className="oggi-empty-title">Il tuo piano di oggi non è ancora pronto</h3>
            <p className="oggi-empty-desc">
              {profile.onboarding_complete
                ? "Genera il piano e scopri cosa fare oggi su LinkedIn."
                : "Configura il tuo sistema per ricevere consigli personalizzati, oppure genera un piano generico."}
            </p>
            <div className="oggi-empty-actions">
              <button type="button" onClick={generatePlan} className="btn-primary oggi-gen-btn">
                Genera il piano di oggi <span className="dash-btn-arrow">→</span>
              </button>
              {!profile.onboarding_complete && (
                <Link href="/app/onboarding" className="btn-secondary">
                  Configura il tuo sistema
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <section className="oggi-section">
          <div className="oggi-loading">
            <span className="qa-spinner oggi-spinner" aria-hidden="true" />
            <p className="oggi-loading-text">Sto preparando il tuo piano di oggi…</p>
            <p className="oggi-loading-sub">Analizzo il tuo profilo, i contatti e le conversazioni recenti.</p>
          </div>
        </section>
      )}

      {plan && (
        <>
          {/* ── SEZIONE A — PRIORITÀ DI OGGI ── */}
          <section className="oggi-section">
            <div className="oggi-section-header">
              <div className="oggi-section-badge">A</div>
              <div>
                <h2 className="oggi-section-title">Le 3 azioni più importanti di oggi</h2>
                <p className="oggi-section-sub">Parti da qui. Queste sono le priorità per la giornata.</p>
              </div>
            </div>
            <div className="oggi-priority-grid">
              <div className="oggi-priority-card">
                <div className="oggi-priority-num">1</div>
                <div className="oggi-priority-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <p className="oggi-priority-text">{plan.priorita_oggi.azione_1}</p>
              </div>
              <div className="oggi-priority-card">
                <div className="oggi-priority-num">2</div>
                <div className="oggi-priority-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p className="oggi-priority-text">{plan.priorita_oggi.azione_2}</p>
              </div>
              <div className="oggi-priority-card">
                <div className="oggi-priority-num">3</div>
                <div className="oggi-priority-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                </div>
                <p className="oggi-priority-text">{plan.priorita_oggi.azione_3}</p>
              </div>
            </div>
          </section>

          {/* ── SEZIONE B — PERSONE DA CONTATTARE ── */}
          <section className="oggi-section">
            <div className="oggi-section-header">
              <div className="oggi-section-badge">B</div>
              <div>
                <h2 className="oggi-section-title">Persone da contattare oggi</h2>
                <p className="oggi-section-sub">Chi cercare, come trovarli e cosa scrivere.</p>
              </div>
            </div>
            <div className="oggi-detail-card">
              <div className="oggi-detail-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>

              {plan.persone_da_contattare.tipo_profili && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Tipo di profili da cercare</span>
                  <p className="oggi-block-text">{plan.persone_da_contattare.tipo_profili}</p>
                </div>
              )}

              {plan.persone_da_contattare.link_ricerca && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Ricerca LinkedIn pronta</span>
                  <p className="oggi-block-text">
                    <a href={plan.persone_da_contattare.link_ricerca} target="_blank" rel="noopener noreferrer" className="oggi-link-btn">
                      Apri ricerca su LinkedIn ↗
                    </a>
                  </p>
                </div>
              )}

              {plan.persone_da_contattare.criteri_scelta && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Criteri per scegliere i profili migliori</span>
                  <p className="oggi-block-text">{plan.persone_da_contattare.criteri_scelta}</p>
                </div>
              )}

              {plan.persone_da_contattare.primo_messaggio && (
                <div className="oggi-block oggi-block-highlight">
                  <span className="oggi-block-label">Primo messaggio suggerito</span>
                  <p className="oggi-block-text">{plan.persone_da_contattare.primo_messaggio}</p>
                </div>
              )}

              {plan.persone_da_contattare.perche_oggi && (
                <div className="oggi-block oggi-block-accent">
                  <span className="oggi-block-label">Perché oggi ha senso contattarli</span>
                  <p className="oggi-block-text">{plan.persone_da_contattare.perche_oggi}</p>
                </div>
              )}

              {plan.persone_da_contattare.strategia && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Approccio consigliato</span>
                  <p className="oggi-block-text">{plan.persone_da_contattare.strategia}</p>
                </div>
              )}

              <div className="oggi-detail-ctas">
                <Link href="/app/prospect" className="btn-primary">
                  Analizza un profilo →
                </Link>
                <Link href="/app/find-clients" className="btn-secondary">
                  Trova clienti su LinkedIn
                </Link>
              </div>
            </div>

            {/* Recent contacts quick list */}
            {recentContacts.length > 0 && (
              <div className="oggi-contacts-hint">
                <span className="oggi-contacts-hint-label">Contatti analizzati di recente:</span>
                <div className="oggi-contacts-hint-list">
                  {recentContacts.map((c) => (
                    <span key={c.id} className="oggi-contact-chip">
                      {c.nome} · {c.ruolo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── SEZIONE C — CONTENUTO CONSIGLIATO ── */}
          <section className="oggi-section">
            <div className="oggi-section-header">
              <div className="oggi-section-badge">C</div>
              <div>
                <h2 className="oggi-section-title">Contenuto consigliato per oggi</h2>
                <p className="oggi-section-sub">Idea, struttura e testo pronto da adattare.</p>
              </div>
            </div>
            <div className="oggi-detail-card">
              <div className="oggi-detail-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>

              {plan.contenuto_consigliato.idea_post && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Idea del contenuto</span>
                  <p className="oggi-block-text">{plan.contenuto_consigliato.idea_post}</p>
                </div>
              )}

              {plan.contenuto_consigliato.angolo_post && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Angolo del post</span>
                  <p className="oggi-block-text">{plan.contenuto_consigliato.angolo_post}</p>
                </div>
              )}

              {plan.contenuto_consigliato.struttura && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Struttura</span>
                  <p className="oggi-block-text">{plan.contenuto_consigliato.struttura}</p>
                </div>
              )}

              {plan.contenuto_consigliato.esempio_testo && (
                <div className="oggi-block oggi-block-highlight">
                  <span className="oggi-block-label">Esempio di testo</span>
                  <p className="oggi-block-text oggi-block-pre">{plan.contenuto_consigliato.esempio_testo}</p>
                </div>
              )}

              {plan.contenuto_consigliato.cta_post && (
                <div className="oggi-block">
                  <span className="oggi-block-label">CTA del post</span>
                  <p className="oggi-block-text">{plan.contenuto_consigliato.cta_post}</p>
                </div>
              )}

              {plan.contenuto_consigliato.suggerimento_immagine && (
                <div className="oggi-block oggi-block-accent">
                  <span className="oggi-block-label">Immagine consigliata</span>
                  <p className="oggi-block-text">{plan.contenuto_consigliato.suggerimento_immagine}</p>
                  <p className="oggi-img-tip">📸 Preferisci sempre foto reali: foto mentre lavori, il tuo ambiente, screenshot del tuo lavoro.</p>
                </div>
              )}
            </div>
          </section>

          {/* ── SEZIONE D — CONVERSAZIONI DA SEGUIRE ── */}
          <section className="oggi-section">
            <div className="oggi-section-header">
              <div className="oggi-section-badge">D</div>
              <div>
                <h2 className="oggi-section-title">Conversazioni da seguire</h2>
                <p className="oggi-section-sub">Follow-up, messaggi e domande per le conversazioni aperte.</p>
              </div>
            </div>
            <div className="oggi-detail-card">
              <div className="oggi-detail-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>

              {plan.conversazioni_da_seguire.followup_da_fare && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Follow-up da fare oggi</span>
                  <p className="oggi-block-text">{plan.conversazioni_da_seguire.followup_da_fare}</p>
                </div>
              )}

              {plan.conversazioni_da_seguire.cosa_chiedere && (
                <div className="oggi-block">
                  <span className="oggi-block-label">Domande da fare</span>
                  <p className="oggi-block-text">{plan.conversazioni_da_seguire.cosa_chiedere}</p>
                </div>
              )}

              {plan.conversazioni_da_seguire.quando_scrivere && (
                <div className="oggi-block oggi-block-highlight">
                  <span className="oggi-block-label">Quando proporre una call o aspettare</span>
                  <p className="oggi-block-text">{plan.conversazioni_da_seguire.quando_scrivere}</p>
                </div>
              )}

              {plan.conversazioni_da_seguire.esempio_followup && (
                <div className="oggi-block oggi-block-highlight">
                  <span className="oggi-block-label">Esempio di messaggio follow-up</span>
                  <p className="oggi-block-text">{plan.conversazioni_da_seguire.esempio_followup}</p>
                </div>
              )}

              {plan.conversazioni_da_seguire.segnali_da_osservare && (
                <div className="oggi-block oggi-block-accent">
                  <span className="oggi-block-label">🔍 Segnali da osservare</span>
                  <p className="oggi-block-text">{plan.conversazioni_da_seguire.segnali_da_osservare}</p>
                </div>
              )}

              {plan.conversazioni_da_seguire.errori_da_evitare && (
                <div className="oggi-block oggi-block-warn">
                  <span className="oggi-block-label">⚠️ Errori da evitare</span>
                  <p className="oggi-block-text">{plan.conversazioni_da_seguire.errori_da_evitare}</p>
                </div>
              )}

              <div className="oggi-detail-ctas">
                <Link href="/app/dm" className="btn-secondary">
                  Chiedi un consiglio →
                </Link>
              </div>
            </div>
          </section>

          {/* ── SEZIONE E — MEMORIA E LOGICA TEMPORALE ── */}
          <section className="oggi-section">
            <div className="oggi-section-header">
              <div className="oggi-section-badge">E</div>
              <div>
                <h2 className="oggi-section-title">Memoria e coerenza</h2>
                <p className="oggi-section-sub">Il piano di oggi tiene conto della tua attività recente.</p>
              </div>
            </div>
            <div className="oggi-memory-card">
              <div className="oggi-memory-grid">
                <div className="oggi-memory-item">
                  <div className="oggi-memory-icon">👥</div>
                  <div className="oggi-memory-value">{contacts.length}</div>
                  <div className="oggi-memory-label">Contatti analizzati</div>
                </div>
                <div className="oggi-memory-item">
                  <div className="oggi-memory-icon">📊</div>
                  <div className="oggi-memory-value">
                    {contacts.filter(c => {
                      const d = new Date(c.analyzed_at);
                      const now = new Date();
                      return d.toDateString() === now.toDateString();
                    }).length}
                  </div>
                  <div className="oggi-memory-label">Analizzati oggi</div>
                </div>
                <div className="oggi-memory-item">
                  <div className="oggi-memory-icon">📅</div>
                  <div className="oggi-memory-value">
                    {contacts.length > 0
                      ? new Date(contacts[0].analyzed_at).toLocaleDateString("it-IT", { day: "numeric", month: "short" })
                      : "—"}
                  </div>
                  <div className="oggi-memory-label">Ultima analisi</div>
                </div>
                <div className="oggi-memory-item">
                  <div className="oggi-memory-icon">{profile.onboarding_complete ? "✅" : "⚙️"}</div>
                  <div className="oggi-memory-value">{profile.onboarding_complete ? "Attivo" : "Da fare"}</div>
                  <div className="oggi-memory-label">Sistema configurato</div>
                </div>
              </div>
              <div className="oggi-memory-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>
                  I consigli di domani terranno conto di quello che fai oggi. Più usi Preflight, più i suggerimenti diventano precisi e coerenti con il tuo percorso.
                </span>
              </div>
            </div>
          </section>

          {/* ── RIGENERA ── */}
          <div className="oggi-regen">
            <button type="button" onClick={generatePlan} disabled={loading} className="btn-secondary">
              {loading ? "Rigenero…" : "Rigenera il piano di oggi"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
