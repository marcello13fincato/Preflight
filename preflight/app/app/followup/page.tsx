"use client";

import { useMemo, useState } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Link from "next/link";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import CopyButton from "@/components/shared/CopyButton";

type FollowupResult = {
  analisi_situazione: string;
  messaggio_followup: string;
  variante_breve: string;
  variante_diretta: string;
  tempistica: string;
  prossimi_passi: string;
};

const TEMPO_OPTIONS = [
  { value: "2_giorni", label: "2 giorni" },
  { value: "5_giorni", label: "5 giorni" },
  { value: "1_settimana", label: "1 settimana" },
  { value: "2_settimane", label: "2+ settimane" },
  { value: "1_mese", label: "1 mese+" },
] as const;

export default function FollowupPage() {
  const { userId, status } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = userId ? repo.profile.getProfile(userId) : { onboarding: null, plan: null, onboarding_complete: false };

  const [context, setContext] = useState("");
  const [tempoPassato, setTempoPassato] = useState("");
  const [output, setOutput] = useState<FollowupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  async function generate() {
    if (!context.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contesto: context.trim(),
          tempo_passato: tempoPassato || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      setOutput(json as FollowupResult);
      repo.interaction.addInteraction(userId!, "dm", `Follow-up: ${context.slice(0, 50)}`, json);
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
            Nuovo follow-up
          </button>
          <div className="pr-topbar-url">🔄 Follow-up</div>
          <div className="pr-topbar-actions">
            <Link href="/app/articolo" className="pr-topbar-link">Scrivi un articolo</Link>
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
              <div className="pr-score-value">🔄</div>
            </div>
            <span className="pr-score-label">Follow-up</span>
          </div>
          <div className="pr-score-info fade-in-delay">
            <h1 className="pr-score-title">Follow-up strategico</h1>
            <p className="pr-score-subtitle">{output.analisi_situazione}</p>
          </div>
        </div>

        <div className="pr-grid">
          <div className="pr-col">
            {/* Main message */}
            <div className="pr-msg-card pr-msg-first fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">1</div>
                <div>
                  <h3 className="pr-msg-title">Messaggio follow-up</h3>
                  <p className="pr-msg-hint">Copia e invia</p>
                </div>
                <CopyButton text={output.messaggio_followup} />
              </div>
              <div className="pr-msg-body">{output.messaggio_followup}</div>
            </div>

            {/* Variants */}
            <div className="pr-msg-card fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">2</div>
                <div>
                  <h3 className="pr-msg-title">Varianti</h3>
                  <p className="pr-msg-hint">Scegli il tono più adatto</p>
                </div>
              </div>
              <div className="sys-alt-msgs">
                <div className="sys-alt-msg">
                  <span className="sys-alt-label">Breve</span>
                  <p className="pr-msg-body">{output.variante_breve}</p>
                  <CopyButton text={output.variante_breve} />
                </div>
                <div className="sys-alt-msg">
                  <span className="sys-alt-label">Diretta</span>
                  <p className="pr-msg-body">{output.variante_diretta}</p>
                  <CopyButton text={output.variante_diretta} />
                </div>
              </div>
            </div>
          </div>

          <div className="pr-col">
            {/* Timing */}
            <div className="pr-card fade-in-delay">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <h3>Tempistica</h3>
              </div>
              <p className="pr-card-text">{output.tempistica}</p>
            </div>

            {/* Next steps */}
            <div className="pr-card fade-in-delay">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                <h3>Prossimi passi</h3>
              </div>
              <p className="pr-card-text">{output.prossimi_passi}</p>
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
            <div className="pr-score-value">🔄</div>
          </div>
          <span className="pr-score-label">Follow-up</span>
        </div>
        <div className="pr-score-info fade-in-delay">
          <h1 className="pr-score-title">Messaggi e Follow-up</h1>
          <p className="pr-score-subtitle">Riprendi una conversazione ferma con il messaggio giusto al momento giusto.</p>
        </div>
      </div>

      <div className="pr-input-layout fade-in">
        <div className="pr-form-card fade-in-delay">
          <div className="pr-form-header">
            <div className="pr-form-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
            </div>
            <div>
              <h2 className="pr-form-title">Contesto del follow-up</h2>
              <p className="pr-form-sub">Cosa è successo nella conversazione e quanto tempo è passato.</p>
            </div>
          </div>
          <div className="pr-form-fields">
            <div className="qa-field">
              <label className="qa-label">Situazione / conversazione precedente <span className="fc-required">*</span></label>
              <textarea value={context} onChange={(e) => setContext(e.target.value)} className="qa-input qa-input-lg" rows={5}
                placeholder="Es: Ho inviato una richiesta di connessione con nota personalizzata. Ha accettato ma non ha risposto al primo messaggio in cui chiedevo come gestiscono l'outbound." />
            </div>

            <div className="qa-field">
              <label className="qa-label">Quanto tempo è passato</label>
              <div className="fc-pills">
                {TEMPO_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button"
                    className={`fc-pill${tempoPassato === opt.value ? " fc-pill-active" : ""}`}
                    onClick={() => setTempoPassato(opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="pr-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {error}
              </div>
            )}

            <button onClick={generate} disabled={loading || !context.trim()} className="pr-generate-btn">
              {loading ? (
                <><span className="qa-spinner" aria-hidden="true" />Preparo il follow-up…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
                  Genera follow-up
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">Messaggio follow-up personalizzato</div>
              <div className="pr-info-feature">Variante breve e diretta</div>
              <div className="pr-info-feature">Tempistica consigliata</div>
              <div className="pr-info-feature">Prossimi passi</div>
            </div>
          </div>
          <div className="sys-quick-nav">
            <Link href="/app/articolo" className="sys-quick-nav-link">📄 Scrivi un articolo</Link>
            <Link href="/app/consiglio" className="sys-quick-nav-link">💡 Chiedi un consiglio</Link>
            <Link href="/app" className="sys-quick-nav-link">📋 Piano di oggi</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
