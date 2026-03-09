"use client";

import Link from "next/link";
import { useState } from "react";

interface AdviceOutput {
  lettura: string;
  strategia: string;
  risposta: string;
  prossima_mossa: string;
}

export default function QuickAssistant() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AdviceOutput | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, advice: true, demo: true }),
      });
      if (!res.ok) throw new Error("Errore nella richiesta");
      const data = await res.json();
      if (data.structured) {
        setResult(data.structured);
      } else {
        setResult({
          lettura: data.reply || "Non sono riuscito a generare una risposta.",
          strategia: "",
          risposta: "",
          prossima_mossa: "",
        });
      }
    } catch {
      setResult({
        lettura: "Si è verificato un errore. Riprova più tardi.",
        strategia: "",
        risposta: "",
        prossima_mossa: "",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qa-container">
      <div className="qa-field">
        <label className="qa-label">Spiegami il contesto</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="qa-input qa-input-lg"
          rows={6}
          placeholder={"Ho pubblicato un post su LinkedIn.\nUna persona ha commentato dicendo che anche loro hanno questo problema.\nÈ founder di una piccola azienda SaaS.\nNon ci siamo mai scritti prima.\nCome mi conviene rispondere?"}
        />
      </div>

      <button
        onClick={handleAsk}
        disabled={loading || !input.trim()}
        className="qa-btn"
      >
        {loading ? (
          <>
            <span className="qa-spinner" aria-hidden="true" />
            Sto pensando…
          </>
        ) : (
          <>
            Dammi un consiglio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </>
        )}
      </button>

      {result && (
        <div className="qa-result">
          {result.lettura && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Lettura della situazione
              </div>
              <p className="qa-result-text">{result.lettura}</p>
            </div>
          )}

          {result.strategia && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>
                Strategia consigliata
              </div>
              <p className="qa-result-text">{result.strategia}</p>
            </div>
          )}

          {result.risposta && (
            <div className="qa-result-block qa-result-reply">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Esempio di risposta
              </div>
              <p className="qa-result-text">{result.risposta}</p>
            </div>
          )}

          {result.prossima_mossa && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                Prossima mossa
              </div>
              <p className="qa-result-text">{result.prossima_mossa}</p>
            </div>
          )}

          <div className="qa-result-ctas">
            <Link href="/app/onboarding" className="hp-cta-primary">
              Prova il sistema completo
            </Link>
            <Link href="/app" className="qa-cta-secondary">
              Accedi alla dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
