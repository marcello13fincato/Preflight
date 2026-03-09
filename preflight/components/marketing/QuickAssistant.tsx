"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = null | "profile" | "advice";

export interface ProfileAnalysisOutput {
  chi_e: string;
  potenziale: string;
  perche_parlarle: string;
  strategia_contatto: string;
  primo_messaggio: string;
  step_successivi: string;
}

export interface AdviceOutput {
  lettura_situazione: string;
  cosa_fare: string;
  risposta_consigliata: string;
  step_successivi: string;
}

export default function QuickAssistant() {
  const [mode, setMode] = useState<Mode>(null);

  // Profile analysis state
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showPdfGuide, setShowPdfGuide] = useState(false);
  const [profileReason, setProfileReason] = useState("");
  const [profileResult, setProfileResult] = useState<ProfileAnalysisOutput | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Advice state
  const [situation, setSituation] = useState("");
  const [adviceResult, setAdviceResult] = useState<AdviceOutput | null>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);

  function handleBack() {
    setMode(null);
    setProfileResult(null);
    setAdviceResult(null);
  }

  async function handleAnalyzeProfile() {
    if (!linkedinUrl.trim()) return;
    if (profileLoading) return;
    setProfileLoading(true);
    setProfileResult(null);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analizza questo profilo LinkedIn: ${linkedinUrl}${profileReason ? `\n\nMotivo del contatto: ${profileReason}` : ""}`,
          advice: true,
          demo: true,
          assistantMode: "profile",
          linkedinUrl: linkedinUrl.trim(),
          profileInfo: pdfText || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore nella richiesta");
      const data = await res.json();
      if (data.structured) {
        setProfileResult(data.structured);
      }
    } catch {
      setProfileResult({
        chi_e: "Si è verificato un errore. Riprova più tardi.",
        potenziale: "",
        perche_parlarle: "",
        strategia_contatto: "",
        primo_messaggio: "",
        step_successivi: "",
      });
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleAskAdvice() {
    if (!situation.trim()) return;
    if (adviceLoading) return;
    setAdviceLoading(true);
    setAdviceResult(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: situation,
          advice: true,
          demo: true,
          assistantMode: "advice",
        }),
      });
      if (!res.ok) throw new Error("Errore nella richiesta");
      const data = await res.json();
      if (data.structured) {
        setAdviceResult(data.structured);
      }
    } catch {
      setAdviceResult({
        lettura_situazione: "Si è verificato un errore. Riprova più tardi.",
        cosa_fare: "",
        risposta_consigliata: "",
        step_successivi: "",
      });
    } finally {
      setAdviceLoading(false);
    }
  }

  /* ── SCHERMATA INIZIALE: DUE CARD ── */
  if (!mode) {
    return (
      <div className="qa-container">
        <div className="qa-choice-grid">
          <button type="button" className="qa-choice-card" onClick={() => setMode("profile")}>
            <div className="qa-choice-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="qa-choice-title">Analizza questo profilo</h3>
            <p className="qa-choice-desc">
              Scopri se vale la pena contattare una persona e come farlo.
            </p>
            <span className="qa-choice-cta">
              Analizza profilo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </button>

          <button type="button" className="qa-choice-card" onClick={() => setMode("advice")}>
            <div className="qa-choice-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 className="qa-choice-title">Chiedimi un consiglio</h3>
            <p className="qa-choice-desc">
              Descrivi una situazione reale e scopri come muoverti.
            </p>
            <span className="qa-choice-cta">
              Chiedi un consiglio
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </button>
        </div>
      </div>
    );
  }

  /* ── MODALITÀ 1: ANALIZZA PROFILO ── */
  if (mode === "profile") {
    return (
      <div className="qa-container">
        <button type="button" className="qa-back-btn" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Torna alle opzioni
        </button>

        <div className="qa-section-header">
          <h3 className="qa-section-title">Analizza questo profilo</h3>
          <p className="qa-section-sub">
            Scopri se vale la pena contattare questa persona e come muoverti per iniziare la conversazione.
          </p>
        </div>

        <div className="qa-field">
          <label className="qa-label">Link al profilo LinkedIn</label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="qa-input"
            placeholder="https://linkedin.com/in/nomecognome"
          />
        </div>

        <div className="qa-field">
          <label className="qa-label">
            Carica il PDF del profilo
            <span className="qa-label-opt">(facoltativo)</span>
          </label>
          <p className="qa-microcopy">
            Se vuoi un&apos;analisi più precisa, puoi caricare anche il PDF del profilo.
          </p>
          <label className="qa-file-upload">
            <input
              type="file"
              accept=".pdf"
              className="qa-file-input"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
            <span className="qa-file-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {pdfFile ? pdfFile.name : "Scegli un file PDF"}
            </span>
          </label>
        </div>

        <button
          type="button"
          className="qa-guide-toggle"
          onClick={() => setShowPdfGuide(!showPdfGuide)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Come scaricare il PDF del profilo LinkedIn
        </button>

        {showPdfGuide && (
          <div className="qa-guide">
            <ol className="qa-guide-steps">
              <li>Vai sul profilo LinkedIn della persona</li>
              <li>Clicca sui tre puntini accanto alla foto del profilo</li>
              <li>Seleziona &quot;Salva come PDF&quot;</li>
              <li>Carica il file qui</li>
            </ol>
          </div>
        )}

        <div className="qa-field">
          <label className="qa-label">
            Perché vorresti contattare questa persona?
            <span className="qa-label-opt">(facoltativo)</span>
          </label>
          <textarea
            value={profileReason}
            onChange={(e) => setProfileReason(e.target.value)}
            className="qa-input qa-input-lg"
            rows={3}
            placeholder="Credo che questa persona possa essere interessata a migliorare LinkedIn come canale per trovare clienti."
          />
        </div>

        <button
          onClick={handleAnalyzeProfile}
          disabled={profileLoading || !linkedinUrl.trim()}
          className="qa-btn"
        >
          {profileLoading ? (
            <>
              <span className="qa-spinner" aria-hidden="true" />
              Sto analizzando…
            </>
          ) : (
            <>
              Analizza profilo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </>
          )}
        </button>

        {/* ── OUTPUT ANALISI PROFILO ── */}
        {profileResult && (
          <div className="qa-result">
            {profileResult.chi_e && (
              <div className="qa-result-block">
                <div className="qa-result-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Chi è questa persona
                </div>
                <p className="qa-result-text">{profileResult.chi_e}</p>
              </div>
            )}

            {profileResult.potenziale && (
              <div className="qa-result-block qa-result-valutazione">
                <div className="qa-result-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Ha senso contattarla?
                </div>
                <p className="qa-result-text">{profileResult.potenziale}</p>
              </div>
            )}

            {/* Sezione bloccata (demo) */}
            <div className="qa-locked">
              <div className="qa-locked-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Per vedere l&apos;analisi completa accedi alla dashboard.
              </div>
              <ul className="qa-locked-list">
                <li>Strategia di contatto consigliata</li>
                <li>Primo messaggio pronto da usare</li>
                <li>Step successivi per arrivare a una call</li>
              </ul>
              <Link href="/signup" className="qa-locked-cta">
                Sblocca l&apos;analisi completa
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── MODALITÀ 2: CHIEDIMI UN CONSIGLIO ── */
  return (
    <div className="qa-container">
      <button type="button" className="qa-back-btn" onClick={handleBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Torna alle opzioni
      </button>

      <div className="qa-section-header">
        <h3 className="qa-section-title">Chiedimi un consiglio</h3>
        <p className="qa-section-sub">
          Descrivi una situazione reale su LinkedIn e scopri come conviene muoverti.
        </p>
      </div>

      <div className="qa-field">
        <label className="qa-label">Spiegami la situazione</label>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          className="qa-input qa-input-lg"
          rows={6}
          placeholder={"Ho pubblicato un post su LinkedIn.\nUna persona ha commentato dicendo che anche loro hanno questo problema.\nNon ci siamo mai scritti prima.\nCome mi conviene rispondere per continuare la conversazione?"}
        />
      </div>

      <div className="qa-examples">
        <p className="qa-examples-title">Esempi di situazioni:</p>
        <ul className="qa-examples-list">
          <li>Qualcuno ha commentato un mio post</li>
          <li>Ho ricevuto un messaggio su LinkedIn</li>
          <li>Voglio capire se è il momento giusto per proporre una call</li>
          <li>Non so come continuare una conversazione</li>
        </ul>
      </div>

      <button
        onClick={handleAskAdvice}
        disabled={adviceLoading || !situation.trim()}
        className="qa-btn"
      >
        {adviceLoading ? (
          <>
            <span className="qa-spinner" aria-hidden="true" />
            Sto analizzando…
          </>
        ) : (
          <>
            Chiedi un consiglio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </>
        )}
      </button>

      {/* ── OUTPUT CONSIGLIO ── */}
      {adviceResult && (
        <div className="qa-result">
          {adviceResult.lettura_situazione && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Lettura della situazione
              </div>
              <p className="qa-result-text">{adviceResult.lettura_situazione}</p>
            </div>
          )}

          {adviceResult.cosa_fare && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Cosa conviene fare adesso
              </div>
              <p className="qa-result-text">{adviceResult.cosa_fare}</p>
            </div>
          )}

          {/* Sezione bloccata (demo) */}
          <div className="qa-locked">
            <div className="qa-locked-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Per vedere il consiglio completo accedi alla dashboard.
            </div>
            <ul className="qa-locked-list">
              <li>Risposta consigliata pronta da usare</li>
              <li>Step successivi per portare avanti la conversazione</li>
            </ul>
            <Link href="/signup" className="qa-locked-cta">
              Sblocca il consiglio completo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
