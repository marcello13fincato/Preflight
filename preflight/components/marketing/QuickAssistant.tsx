"use client";

import Link from "next/link";
import { useState } from "react";

const INTERACTION_TYPES = ["Commento", "Messaggio", "Post", "Prima interazione"] as const;
const WHO_WROTE_OPTIONS = ["L'ho scritto io", "L'ho ricevuto"] as const;

export interface AdviceOutput {
  valutazione: { qualita: number; probabilita: string };
  temperatura: { stato: string; spiegazione: string };
  chi_e: string;
  interessi: string;
  perche_parlargli: string;
  strategia_contatto: string;
  primo_messaggio: string;
  prossima_mossa: string;
}

export default function QuickAssistant() {
  const [input, setInput] = useState("");
  const [interactionType, setInteractionType] = useState<string>(INTERACTION_TYPES[0]);
  const [whoWrote, setWhoWrote] = useState<string>(WHO_WROTE_OPTIONS[0]);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showPdfGuide, setShowPdfGuide] = useState(false);
  const [result, setResult] = useState<AdviceOutput | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!input.trim() && !linkedinUrl.trim()) return;
    if (loading) return;
    setLoading(true);
    setResult(null);
    try {
      let pdfText = "";
      if (pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);
        // Extract text client-side from the PDF name as context hint
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input || `Analizza questo profilo LinkedIn: ${linkedinUrl}`,
          advice: true,
          demo: true,
          linkedinUrl: linkedinUrl.trim() || undefined,
          profileInfo: pdfText || undefined,
          interactionType: input.trim() ? interactionType : undefined,
          whoWrote: input.trim() ? whoWrote : undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore nella richiesta");
      const data = await res.json();
      if (data.structured) {
        setResult(data.structured);
      } else {
        setResult({
          valutazione: { qualita: 0, probabilita: "–" },
          temperatura: { stato: "Neutra", spiegazione: data.reply || "Non disponibile." },
          chi_e: "",
          interessi: "",
          perche_parlargli: "",
          strategia_contatto: "",
          primo_messaggio: "",
          prossima_mossa: "",
        });
      }
    } catch {
      setResult({
        valutazione: { qualita: 0, probabilita: "–" },
        temperatura: { stato: "–", spiegazione: "Errore." },
        chi_e: "Si è verificato un errore. Riprova più tardi.",
        interessi: "",
        perche_parlargli: "",
        strategia_contatto: "",
        primo_messaggio: "",
        prossima_mossa: "",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qa-container">
      {/* ── SEZIONE 1: DESCRIVI LA SITUAZIONE ── */}
      <div className="qa-section-header">
        <h3 className="qa-section-title">Descrivi la situazione</h3>
      </div>

      <div className="qa-field">
        <label className="qa-label">Spiegami il contesto</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="qa-input qa-input-lg"
          rows={6}
          placeholder={"Ho pubblicato un post su LinkedIn.\nUna persona ha commentato dicendo che anche loro hanno questo problema.\nÈ founder di una startup SaaS.\nNon ci siamo mai scritti prima.\n\nCome mi conviene rispondere?"}
        />
      </div>

      <div className="qa-selectors">
        <div className="qa-field">
          <label className="qa-label">Tipo di interazione</label>
          <div className="qa-segmented">
            {INTERACTION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className={`qa-seg-btn${interactionType === t ? " qa-seg-active" : ""}`}
                onClick={() => setInteractionType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="qa-field">
          <label className="qa-label">Chi ha scritto il messaggio?</label>
          <div className="qa-segmented">
            {WHO_WROTE_OPTIONS.map((o) => (
              <button
                key={o}
                type="button"
                className={`qa-seg-btn${whoWrote === o ? " qa-seg-active" : ""}`}
                onClick={() => setWhoWrote(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEZIONE 2: ANALIZZA UN PROFILO LINKEDIN ── */}
      <div className="qa-section-divider" />

      <div className="qa-section-header">
        <h3 className="qa-section-title">Analizza questo profilo</h3>
        <p className="qa-section-sub">
          Inserisci il profilo LinkedIn di una persona e scopri come iniziare una conversazione.
        </p>
      </div>

      <div className="qa-field">
        <label className="qa-label">Link profilo LinkedIn</label>
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
          Carica il PDF del profilo LinkedIn
          <span className="qa-label-opt">(facoltativo)</span>
        </label>
        <p className="qa-microcopy">
          Questo aiuta l&apos;AI a capire meglio il contesto professionale della persona.
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

      {/* ── CTA ── */}
      <button
        onClick={handleAsk}
        disabled={loading || (!input.trim() && !linkedinUrl.trim())}
        className="qa-btn"
      >
        {loading ? (
          <>
            <span className="qa-spinner" aria-hidden="true" />
            Sto analizzando…
          </>
        ) : (
          <>
            Dammi un consiglio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </>
        )}
      </button>

      {/* ── OUTPUT ── */}
      {result && (
        <div className="qa-result">
          {/* Valutazione */}
          <div className="qa-result-block qa-result-valutazione">
            <div className="qa-result-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Valutazione della conversazione
            </div>
            <div className="qa-valutazione-grid">
              <div className="qa-valutazione-item">
                <span className="qa-valutazione-number">{result.valutazione.qualita}<span className="qa-valutazione-max">/10</span></span>
                <span className="qa-valutazione-desc">Qualità della conversazione</span>
              </div>
              <div className="qa-valutazione-item">
                <span className="qa-valutazione-number">{result.valutazione.probabilita}</span>
                <span className="qa-valutazione-desc">Probabilità stimata di arrivare a una call</span>
              </div>
            </div>
          </div>

          {/* Temperatura */}
          <div className="qa-result-block qa-result-temperatura">
            <div className="qa-result-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
              Temperatura della conversazione
            </div>
            <div className="qa-temperatura-badge" data-stato={result.temperatura.stato}>
              {result.temperatura.stato}
            </div>
            <p className="qa-result-text">{result.temperatura.spiegazione}</p>
          </div>

          {/* Chi è questa persona */}
          {result.chi_e && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Chi è questa persona
              </div>
              <p className="qa-result-text">{result.chi_e}</p>
            </div>
          )}

          {/* Sezione bloccata */}
          <div className="qa-locked">
            <div className="qa-locked-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Per vedere l&apos;analisi completa accedi alla dashboard.
            </div>
            <ul className="qa-locked-list">
              <li>Primo messaggio consigliato</li>
              <li>Strategia di contatto completa</li>
              <li>Prossima mossa per arrivare a una call</li>
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
