"use client";

import { useMemo, useState } from "react";
import { useSession } from "@/lib/hooks/useSession";
import Link from "next/link";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import CopyButton from "@/components/shared/CopyButton";

type ConversationResult = {
  best_reply: string;
  client_heat_level: string;
  message_risk_warning: string;
  alternatives: { short: string; assertive: string };
  qualifying_questions: [string, string, string];
  followups: { "48h": string; "5d": string; "10d": string };
  next_action: string;
};

const GOAL_OPTIONS = [
  { value: "continue_conversation", label: "Continuare la conversazione" },
  { value: "propose_call", label: "Proporre una call" },
  { value: "qualify", label: "Capire se è un buon prospect" },
  { value: "reactivate", label: "Riattivare un contatto fermo" },
] as const;

export default function ConversazioniPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [situation, setSituation] = useState("");
  const [objective, setObjective] = useState("continue_conversation");
  const [conversationState, setConversationState] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [output, setOutput] = useState<ConversationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!situation.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          thread: situation.trim(),
          conversation_goal: objective,
          conversation_state: conversationState.trim() || undefined,
          linkedin_url: linkedinUrl.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      setOutput(json as ConversationResult);
      repo.interaction.addInteraction(userId, "dm", situation, json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setOutput(null);
    setError(null);
  }

  /* ── OUTPUT ── */
  if (output) {
    return (
      <div className="pr-fullscreen fade-in">
        <div className="pr-topbar">
          <button onClick={reset} className="pr-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Nuova conversazione
          </button>
          <div className="pr-topbar-url">💬 Strategia conversazione</div>
          <div className="pr-topbar-actions">
            <Link href="/app/followup" className="pr-topbar-link">Follow-up</Link>
            <Link href="/app/consiglio" className="pr-topbar-link">Chiedi consiglio</Link>
          </div>
        </div>

        <div className="pr-score-hero fade-in">
          <div className="pr-score-ring-wrap">
            <div className="pr-score-ring">
              <svg viewBox="0 0 120 120" className="pr-score-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray="327 327" transform="rotate(-90 60 60)" className="pr-score-progress" />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0A66C2" />
                    <stop offset="100%" stopColor="#085BA7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="pr-score-value">💬</div>
            </div>
            <span className="pr-score-label">Risposta strategica</span>
          </div>
          <div className="pr-score-info fade-in-delay">
            <h1 className="pr-score-title">La tua prossima mossa</h1>
            <p className="pr-score-subtitle">{output.next_action}</p>
            <div className="pr-score-badges">
              <span className={`pr-badge pr-heat-${output.client_heat_level?.toLowerCase?.() || "cold"}`}>
                🔥 {output.client_heat_level}
              </span>
            </div>
          </div>
        </div>

        <div className="pr-grid">
          <div className="pr-col">
            {/* Best reply */}
            <div className="pr-msg-card pr-msg-first fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">1</div>
                <div>
                  <h3 className="pr-msg-title">Risposta consigliata</h3>
                  <p className="pr-msg-hint">Copia e invia su LinkedIn</p>
                </div>
                <CopyButton text={output.best_reply} />
              </div>
              <div className="pr-msg-body">{output.best_reply}</div>
            </div>

            {/* Alternatives */}
            <div className="pr-msg-card fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">2</div>
                <div>
                  <h3 className="pr-msg-title">Alternative</h3>
                  <p className="pr-msg-hint">Scegli il tono più adatto</p>
                </div>
              </div>
              <div className="sys-alt-msgs">
                <div className="sys-alt-msg">
                  <span className="sys-alt-label">Breve</span>
                  <p className="pr-msg-body">{output.alternatives.short}</p>
                  <CopyButton text={output.alternatives.short} />
                </div>
                <div className="sys-alt-msg">
                  <span className="sys-alt-label">Assertiva</span>
                  <p className="pr-msg-body">{output.alternatives.assertive}</p>
                  <CopyButton text={output.alternatives.assertive} />
                </div>
              </div>
            </div>

            {output.message_risk_warning && (
              <div className="pr-card pr-card-warning fade-in-delay">
                <div className="pr-card-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <h3>Attenzione</h3>
                </div>
                <p className="pr-card-text">{output.message_risk_warning}</p>
              </div>
            )}
          </div>

          <div className="pr-col">
            {/* Qualifying questions */}
            <div className="pr-card fade-in-delay">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <h3>Domande per qualificare</h3>
              </div>
              <ul className="sys-qualify-list">
                {output.qualifying_questions.map((q, i) => (
                  <li key={i} className="sys-qualify-item">{q}</li>
                ))}
              </ul>
            </div>

            {/* Follow-ups */}
            <div className="pr-card fade-in-delay">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
                <h3>Follow-up programmati</h3>
              </div>
              <div className="sys-followup-list">
                <div className="sys-followup-item">
                  <span className="sys-followup-time">48h</span>
                  <p className="pr-msg-body">{output.followups["48h"]}</p>
                  <CopyButton text={output.followups["48h"]} />
                </div>
                <div className="sys-followup-item">
                  <span className="sys-followup-time">5 giorni</span>
                  <p className="pr-msg-body">{output.followups["5d"]}</p>
                  <CopyButton text={output.followups["5d"]} />
                </div>
                <div className="sys-followup-item">
                  <span className="sys-followup-time">10 giorni</span>
                  <p className="pr-msg-body">{output.followups["10d"]}</p>
                  <CopyButton text={output.followups["10d"]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── INPUT ── */
  return (
    <div className="pr-fullscreen pr-fullscreen-empty fade-in">
      <div className="pr-score-hero fade-in">
        <div className="pr-score-ring-wrap">
          <div className="pr-score-ring">
            <svg viewBox="0 0 120 120" className="pr-score-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray="327 327" transform="rotate(-90 60 60)" className="pr-score-progress" />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0A66C2" />
                  <stop offset="100%" stopColor="#085BA7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="pr-score-value">💬</div>
          </div>
          <span className="pr-score-label">Conversazioni</span>
        </div>
        <div className="pr-score-info fade-in-delay">
          <h1 className="pr-score-title">Gestisci una conversazione</h1>
          <p className="pr-score-subtitle">Incolla la conversazione, scegli l&apos;obiettivo e ricevi la risposta strategica per avanzare verso la call.</p>
        </div>
      </div>

      <div className="pr-input-layout fade-in">
        <div className="pr-form-card fade-in-delay">
          <div className="pr-form-header">
            <div className="pr-form-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h2 className="pr-form-title">La conversazione</h2>
              <p className="pr-form-sub">Incolla la conversazione o descrivi la situazione attuale.</p>
            </div>
          </div>
          <div className="pr-form-fields">
            <div className="qa-field">
              <label className="qa-label">Situazione / conversazione <span className="fc-required">*</span></label>
              <textarea value={situation} onChange={(e) => setSituation(e.target.value)} className="qa-input qa-input-lg" rows={5}
                placeholder="Incolla qui la conversazione LinkedIn o descrivi la situazione. Es: 'Ho scritto a un founder e mi ha risposto: Interessante, mandami più info'" />
            </div>

            <div className="qa-field">
              <label className="qa-label">Obiettivo della conversazione</label>
              <div className="fc-pills">
                {GOAL_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button"
                    className={`fc-pill${objective === opt.value ? " fc-pill-active" : ""}`}
                    onClick={() => setObjective(opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="qa-field">
              <label className="qa-label">Stato attuale della conversazione <span className="qa-label-opt">(facoltativo)</span></label>
              <input type="text" value={conversationState} onChange={(e) => setConversationState(e.target.value)} className="qa-input"
                placeholder="Es: Ha accettato la connessione ma non ha risposto al primo messaggio" />
            </div>

            <div className="qa-field">
              <label className="qa-label">Link profilo LinkedIn <span className="qa-label-opt">(facoltativo)</span></label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="qa-input"
                placeholder="https://linkedin.com/in/nomecognome" />
            </div>

            {error && (
              <div className="pr-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {error}
              </div>
            )}

            <button onClick={generate} disabled={loading || !situation.trim()} className="pr-generate-btn">
              {loading ? (
                <><span className="qa-spinner" aria-hidden="true" />Analizzo la conversazione…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Ottieni la strategia
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">Risposta strategica pronta</div>
              <div className="pr-info-feature">Alternative (breve / assertiva)</div>
              <div className="pr-info-feature">Domande per qualificare</div>
              <div className="pr-info-feature">Follow-up a 48h, 5gg, 10gg</div>
            </div>
          </div>
          <div className="sys-quick-nav">
            <Link href="/app/consiglio" className="sys-quick-nav-link">💡 Chiedi un consiglio</Link>
            <Link href="/app/followup" className="sys-quick-nav-link">🔄 Follow-up</Link>
            <Link href="/app/prospect" className="sys-quick-nav-link">👤 Analizza profilo</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
