"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { IconLightbulb } from "@/components/shared/icons";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";

  // ── STATIC PAGE (INPUT) FULLSCREEN WOW ──
  return (
    <div className="pr-fullscreen pr-fullscreen-empty">
      <div className="pr-score-hero">
        <div className="pr-score-ring-wrap">
          <div className="pr-score-ring">
            <svg viewBox="0 0 120 120" className="pr-score-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`327 327`}
                transform="rotate(-90 60 60)" className="pr-score-progress" />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="pr-score-value">AI</div>
          </div>
          <span className="pr-score-label">Analisi</span>
        </div>
        <div className="pr-score-info">
          <h1 className="pr-score-title">Analizza un profilo</h1>
          <p className="pr-score-subtitle">Scopri se vale la pena contattare una persona e ricevi messaggi pronti da copiare per ogni fase.</p>
        </div>
      </div>
      <div className="pr-input-layout">
        <div className="pr-form-card">
          <div className="pr-form-header">
            <div className="pr-form-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h2 className="pr-form-title">Inserisci i dati del profilo</h2>
              <p className="pr-form-sub">Più informazioni dai, più precisa sarà l'analisi e i messaggi generati.</p>
            </div>
          </div>
          <div className="pr-form-fields">
            <div className="qa-field">
              <label className="qa-label">Link al profilo LinkedIn <span className="fc-required">*</span></label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" />
            </div>
            <div className="qa-field">
              <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
              <p className="qa-microcopy">Se vuoi un'analisi più precisa, puoi caricare anche il PDF del profilo.</p>
              <label className="qa-file-upload">
                <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                <span className="qa-file-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {pdfFile ? pdfFile.name : "Scegli un file PDF"}
                </span>
              </label>
              <button type="button" className="qa-guide-toggle" onClick={() => setShowPdfGuide(!showPdfGuide)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Come scaricare il PDF del profilo LinkedIn
              </button>
              {showPdfGuide && (
                <div className="qa-guide">
                  <ol className="qa-guide-steps">
                    <li>Vai sul profilo LinkedIn della persona</li>
                    <li>Clicca sui tre puntini accanto alla foto</li>
                    <li>Seleziona "Salva come PDF"</li>
                    <li>Carica il file qui</li>
                  </ol>
                </div>
              )}
            </div>
            <div className="qa-field">
              <label className="qa-label">Link sito web <span className="qa-label-opt">(facoltativo)</span></label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="qa-input" placeholder="https://azienda.com" />
            </div>
            <div className="qa-field">
              <label className="qa-label">Contesto opzionale <span className="qa-label-opt">(facoltativo)</span></label>
              <textarea value={context} onChange={(e) => setContext(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Founder SaaS che pubblica su crescita aziendale." />
            </div>
            {error && (
              <div className="pr-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {error}
              </div>
            )}
            <button onClick={generate} disabled={loading || !linkedinUrl.trim()} className="pr-generate-btn">
              {loading ? (
                <><span className="qa-spinner" aria-hidden="true" />Sto analizzando il profilo…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 1-4-4H8a4 4 0 0 1-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Analizza profilo
                </>
              )}
            </button>
          </div>
        </div>
        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">Analisi compatibilità</div>
              <div className="pr-info-feature">Messaggi pronti da inviare</div>
              <div className="pr-info-feature">Strategia e warning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
              <div className="pr-score-value">{output.score}</div>
            </div>
            <span className="pr-score-label">Compatibilità</span>
          </div>
          <div className="pr-score-info">
            <h1 className="pr-score-title">{output.chi_e}</h1>
            <p className="pr-score-subtitle">{output.ruolo_contesto}</p>
            <div className="pr-score-badges">
              <span className={`pr-badge ${heatColor}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c.5 1 2.5 3 2.5 5.5a4.5 4.5 0 1 1-5 0C9.5 5 11.5 3 12 2z"/></svg>
                {output.client_heat_level}
              </span>
              <span className={`pr-badge ${priorityColor}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Priorità {output.priority_signal}
              </span>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="pr-grid">
          {/* LEFT COLUMN — Analysis */}
          <div className="pr-col">
            {/* Punti forza */}
            <div className="pr-card pr-card-strengths">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3>Punti di forza</h3>
              </div>
              <ul className="pr-strength-list">
                {output.punti_forza.map((p, i) => (
                  <li key={i} className="pr-strength-item">
                    <span className="pr-strength-num">{i + 1}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Punti deboli */}
            <div className="pr-card pr-card-risks">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <h3>Rischi e criticità</h3>
              </div>
              <ul className="pr-risk-list">
                {output.punti_deboli.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Perché buon contatto */}
            <div className="pr-card">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <h3>Perché contattarlo</h3>
              </div>
              <p className="pr-card-text">{output.perche_buon_contatto}</p>
            </div>

            {/* Strategia */}
            <div className="pr-card pr-card-strategy">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <h3>Strategia di contatto</h3>
              </div>
              <p className="pr-card-text">{output.strategia_contatto}</p>
            </div>

            {/* Segnali */}
            <div className="pr-card">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <h3>Segnali da osservare</h3>
              </div>
              <p className="pr-card-text">{output.segnali_da_osservare}</p>
            </div>

            {/* Errori */}
            <div className="pr-card pr-card-warning">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <h3>Errori da evitare</h3>
              </div>
              <p className="pr-card-text">{output.errori_da_evitare}</p>
            </div>
          </div>

          {/* RIGHT COLUMN — Messages + Actions */}
          <div className="pr-col">
            {/* Nota di connessione */}
            <div className="pr-msg-card pr-msg-connect">
              <div className="pr-msg-header">
                <div className="pr-msg-step">1</div>
                <div>
                  <h3 className="pr-msg-title">Nota di connessione</h3>
                  <p className="pr-msg-hint">Invia con la richiesta di collegamento</p>
                </div>
                <button onClick={() => copyText(output.nota_connessione, "nota")} className={`pr-copy-btn${copiedField === "nota" ? " pr-copied" : ""}`}>
                  {copiedField === "nota" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.nota_connessione}</div>
              <div className="pr-msg-chars">{output.nota_connessione.length}/300 caratteri</div>
            </div>

            {/* Primo messaggio */}
            <div className="pr-msg-card pr-msg-first">
              <div className="pr-msg-header">
                <div className="pr-msg-step">2</div>
                <div>
                  <h3 className="pr-msg-title">Primo DM</h3>
                  <p className="pr-msg-hint">Dopo che accetta il collegamento</p>
                </div>
                <button onClick={() => copyText(output.primo_messaggio, "primo")} className={`pr-copy-btn${copiedField === "primo" ? " pr-copied" : ""}`}>
                  {copiedField === "primo" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.primo_messaggio}</div>
            </div>

            {/* Follow-up 3 giorni */}
            <div className="pr-msg-card">
              <div className="pr-msg-header">
                <div className="pr-msg-step">3</div>
                <div>
                  <h3 className="pr-msg-title">Follow-up · 3 giorni</h3>
                  <p className="pr-msg-hint">Se non risponde al primo messaggio</p>
                </div>
                <button onClick={() => copyText(output.followup_3g, "f3")} className={`pr-copy-btn${copiedField === "f3" ? " pr-copied" : ""}`}>
                  {copiedField === "f3" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.followup_3g}</div>
            </div>

            {/* Follow-up 7 giorni */}
            <div className="pr-msg-card">
              <div className="pr-msg-header">
                <div className="pr-msg-step">4</div>
                <div>
                  <h3 className="pr-msg-title">Follow-up · 7 giorni</h3>
                  <p className="pr-msg-hint">Ultimo tentativo, tono leggero</p>
                </div>
                <button onClick={() => copyText(output.followup_7g, "f7")} className={`pr-copy-btn${copiedField === "f7" ? " pr-copied" : ""}`}>
                  {copiedField === "f7" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.followup_7g}</div>
            </div>

            {/* Step successivi */}
            <div className="pr-card pr-card-steps">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                <h3>Prossimi passi</h3>
              </div>
              <div className="pr-steps">
                {output.step_successivi.map((step, i) => (
                  <div key={i} className="pr-step-item">
                    <span className="pr-step-num">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="pr-nav-card">
              <span className="pr-nav-label">Continua su Preflight</span>
              <div className="pr-nav-links">
                <Link href="/app/dm" className="pr-nav-link pr-nav-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Scrivi un DM
                </Link>
                <Link href="/app/find-clients" className="pr-nav-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Trova clienti
                </Link>
                <Link href="/app/oggi" className="pr-nav-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Piano di oggi
                </Link>
                <Link href="/app/pipeline" className="pr-nav-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Pipeline
                </Link>
              </div>
            </div>
          </div>
        </div>

        <HistoryList userId={userId} type="prospect" />
      </div>
    );
  }

  /* ── INPUT VIEW (no results yet) ── */
  return (
    <div className="pr-input-page">
      {/* Hero */}
      <div className="pr-hero">
        <div className="pr-hero-glow" />
        <span className="pr-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Analisi profilo AI
        </span>
        <h1 className="pr-hero-title">Analizza questo profilo</h1>
        <p className="pr-hero-subtitle">
          Scopri se vale la pena contattare questa persona e ricevi messaggi pronti da copiare per ogni fase del contatto.
        </p>
      </div>

      <div className="pr-input-layout">
        {/* Input form */}
        <div className="pr-form-card">
          <div className="pr-form-header">
            <div className="pr-form-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <h2 className="pr-form-title">Inserisci i dati del profilo</h2>
              <p className="pr-form-sub">Più informazioni dai, più precisa sarà l&apos;analisi e i messaggi generati.</p>
            </div>
          </div>

          <div className="pr-form-fields">
            <div className="qa-field">
              <label className="qa-label">Link al profilo LinkedIn <span className="fc-required">*</span></label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" />
            </div>

            <div className="qa-field">
              <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
              <p className="qa-microcopy">Se vuoi un&apos;analisi più precisa, puoi caricare anche il PDF del profilo.</p>
              <label className="qa-file-upload">
                <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                <span className="qa-file-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {pdfFile ? pdfFile.name : "Scegli un file PDF"}
                </span>
              </label>
              <button type="button" className="qa-guide-toggle" onClick={() => setShowPdfGuide(!showPdfGuide)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Come scaricare il PDF del profilo LinkedIn
              </button>
              {showPdfGuide && (
                <div className="qa-guide">
                  <ol className="qa-guide-steps">
                    <li>Vai sul profilo LinkedIn della persona</li>
                    <li>Clicca sui tre puntini accanto alla foto</li>
                    <li>Seleziona &quot;Salva come PDF&quot;</li>
                    <li>Carica il file qui</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="qa-field">
              <label className="qa-label">Link sito web <span className="qa-label-opt">(facoltativo)</span></label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="qa-input" placeholder="https://azienda.com" />
            </div>

            <div className="qa-field">
              <label className="qa-label">Contesto opzionale <span className="qa-label-opt">(facoltativo)</span></label>
              <textarea value={context} onChange={(e) => setContext(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Founder SaaS che pubblica su crescita aziendale." />
            </div>

            {error && (
              <div className="pr-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {error}
              </div>
            )}

            <button onClick={generate} disabled={loading || !linkedinUrl.trim()} className="pr-generate-btn">
              {loading ? (
                <><span className="qa-spinner" aria-hidden="true" />Sto analizzando il profilo…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Analizza profilo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right side — info + links */}
        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">
                <span className="pr-info-num">1</span>
                <div>
                  <strong>Score di compatibilità</strong>
                  <p>Punteggio 0-100 sul match con il tuo target</p>
                </div>
              </div>
              <div className="pr-info-feature">
                <span className="pr-info-num">2</span>
                <div>
                  <strong>4 messaggi pronti</strong>
                  <p>Nota connessione + DM + 2 follow-up</p>
                </div>
              </div>
              <div className="pr-info-feature">
                <span className="pr-info-num">3</span>
                <div>
                  <strong>Analisi punti forza e rischi</strong>
                  <p>Per capire subito come muoverti</p>
                </div>
              </div>
              <div className="pr-info-feature">
                <span className="pr-info-num">4</span>
                <div>
                  <strong>Strategia step-by-step</strong>
                  <p>Piano d&apos;azione concreto</p>
                </div>
              </div>
            </div>
          </div>

          {!profile.onboarding_complete && (
            <div className="fc-callout">
              <div className="fc-callout-icon"><IconLightbulb size={20} /></div>
              <div>
                <p className="fc-callout-text">Configura il tuo sistema per risultati più personalizzati.</p>
                <Link href="/app/onboarding" className="fc-callout-link">Configura il sistema →</Link>
              </div>
            </div>
          )}

          <div className="fc-quick-links">
            <span className="fc-quick-links-label">Strumenti correlati:</span>
            <Link href="/app/dm" className="fc-quick-link">Scrivi un DM</Link>
            <Link href="/app/find-clients" className="fc-quick-link">Trova clienti</Link>
            <Link href="/app/oggi" className="fc-quick-link">Piano di oggi</Link>
          </div>
        </div>
      </div>

      <HistoryList userId={userId} type="prospect" />
    </div>
  );
}
