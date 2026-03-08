"use client";

import Link from "next/link";
import { useState } from "react";

export default function QuickAssistant() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Rispondi in modo breve, naturale e in stile LinkedIn a questo commento/messaggio. Orientati alla conversazione, non al pitch. Massimo 3 frasi.\n\nMessaggio: ${input}`,
        }),
      });
      if (!res.ok) throw new Error("Errore nella richiesta");
      const data = await res.json();
      setResult(data.reply || "Non sono riuscito a generare una risposta.");
    } catch {
      setResult("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qa-container">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="qa-input"
        rows={4}
        placeholder={`"Ciao, interessante quello che fai. Come funziona il tuo servizio?"`}
      />
      <button
        onClick={handleAnalyze}
        disabled={loading || !input.trim()}
        className="qa-btn"
      >
        {loading ? (
          <>
            <span className="qa-spinner" aria-hidden="true" />
            Analisi in corso…
          </>
        ) : (
          <>
            Analizza
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </>
        )}
      </button>

      {result && (
        <div className="qa-result">
          <div className="qa-result-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>
            Risposta suggerita
          </div>
          <p className="qa-result-text">{result}</p>
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
