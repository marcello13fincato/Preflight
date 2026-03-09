"use client";

import Link from "next/link";
import { useState } from "react";

const CONTENT_TYPES = [
  { value: "post", label: "Post" },
  { value: "commento", label: "Commento" },
  { value: "messaggio", label: "Messaggio" },
] as const;

type ContentType = (typeof CONTENT_TYPES)[number]["value"];

const PLACEHOLDERS: Record<ContentType, string> = {
  post: "Molte aziende B2B pubblicano su LinkedIn ma non riescono a trasformare i contenuti in clienti.",
  commento: "Interessante, anche noi stiamo affrontando questo problema.",
  messaggio: "Ciao, interessante quello che fai. Come funziona il tuo servizio?",
};

interface AiOutput {
  risposta: string;
  perche: string;
  prossima_mossa: string;
  analisi?: string;
}

export default function QuickAssistant() {
  const [contentType, setContentType] = useState<ContentType>("post");
  const [origin, setOrigin] = useState<"scritto" | "ricevuto">("ricevuto");
  const [personProfile, setPersonProfile] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AiOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const profileHint =
    origin === "ricevuto"
      ? "Chi ti ha scritto / chi ha commentato"
      : "La persona a cui è rivolto o che potrebbe leggerlo";

  async function handleAnalyze() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: {
            contentType,
            origin,
            personProfile: personProfile.trim() || undefined,
          },
        }),
      });
      if (!res.ok) throw new Error("Errore nella richiesta");
      const data = await res.json();
      if (data.structured) {
        setResult(data.structured);
      } else {
        setResult({
          risposta: data.reply || "Non sono riuscito a generare una risposta.",
          perche: "",
          prossima_mossa: "",
        });
      }
    } catch {
      setResult({
        risposta: "Si è verificato un errore. Riprova più tardi.",
        perche: "",
        prossima_mossa: "",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qa-container">
      {/* A. Tipo di contenuto */}
      <div className="qa-field">
        <label className="qa-label">Che tipo di contenuto vuoi analizzare?</label>
        <div className="qa-segmented">
          {CONTENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`qa-seg-btn${contentType === t.value ? " qa-seg-active" : ""}`}
              onClick={() => setContentType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* B. Chi lo ha scritto */}
      <div className="qa-field">
        <label className="qa-label">Questo contenuto…</label>
        <div className="qa-segmented">
          <button
            type="button"
            className={`qa-seg-btn${origin === "scritto" ? " qa-seg-active" : ""}`}
            onClick={() => setOrigin("scritto")}
          >
            L&apos;ho scritto io
          </button>
          <button
            type="button"
            className={`qa-seg-btn${origin === "ricevuto" ? " qa-seg-active" : ""}`}
            onClick={() => setOrigin("ricevuto")}
          >
            L&apos;ho ricevuto
          </button>
        </div>
      </div>

      {/* C. Profilo persona */}
      <div className="qa-field">
        <label className="qa-label">
          Profilo della persona coinvolta
          <span className="qa-label-opt">(facoltativo)</span>
        </label>
        <p className="qa-microcopy">{profileHint}</p>
        <textarea
          value={personProfile}
          onChange={(e) => setPersonProfile(e.target.value)}
          className="qa-input"
          rows={2}
          placeholder="Founder di una startup SaaS, pubblica spesso su crescita e clienti, lavora con aziende B2B."
        />
      </div>

      {/* Testo principale */}
      <div className="qa-field">
        <label className="qa-label">Incolla qui il testo</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="qa-input"
          rows={4}
          placeholder={PLACEHOLDERS[contentType]}
        />
      </div>

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
          {/* Risposta consigliata */}
          <div className="qa-result-block">
            <div className="qa-result-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Risposta consigliata
            </div>
            <p className="qa-result-text">{result.risposta}</p>
          </div>

          {/* Analisi (solo se scritto dall'utente) */}
          {result.analisi && (
            <div className="qa-result-block qa-result-analysis">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Analisi del testo
              </div>
              <p className="qa-result-text">{result.analisi}</p>
            </div>
          )}

          {/* Perché */}
          {result.perche && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>
                Perché può funzionare
              </div>
              <p className="qa-result-text">{result.perche}</p>
            </div>
          )}

          {/* Prossima mossa */}
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
