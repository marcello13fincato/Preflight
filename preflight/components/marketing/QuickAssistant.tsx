"use client";

import Link from "next/link";
import { useState } from "react";

const INTERACTION_TYPES = ["Commento", "Messaggio", "Post", "Prima interazione"] as const;
const WHO_WROTE_OPTIONS = ["L'ho scritto io", "L'ho ricevuto"] as const;

export interface AdviceOutput {
  valutazione: { qualita: number; probabilita: string };
  temperatura: { stato: string; spiegazione: string };
  lettura: string;
  strategia: string;
  risposta: string;
  prossima_mossa: string;
  suggerimenti?: string;
}

export default function QuickAssistant() {
  const [input, setInput] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [interactionType, setInteractionType] = useState<string>(INTERACTION_TYPES[0]);
  const [whoWrote, setWhoWrote] = useState<string>(WHO_WROTE_OPTIONS[0]);
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
        body: JSON.stringify({
          message: input,
          advice: true,
          demo: true,
          linkedinUrl: linkedinUrl.trim() || undefined,
          profileInfo: profileInfo.trim() || undefined,
          interactionType,
          whoWrote,
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
          lettura: data.reply || "Non sono riuscito a generare una risposta.",
          strategia: "",
          risposta: "",
          prossima_mossa: "",
        });
      }
    } catch {
      setResult({
        valutazione: { qualita: 0, probabilita: "–" },
        temperatura: { stato: "–", spiegazione: "Errore." },
        lettura: "Si è verificato un errore. Riprova più tardi.",
        strategia: "",
        risposta: "",
        prossima_mossa: "",
      });
    } finally {
      setLoading(false);
    }
  }

  const truncatedStrategia = result?.strategia
    ? result.strategia.length > 180
      ? result.strategia.slice(0, 180) + "…"
      : result.strategia
    : "";

  return (
    <div className="qa-container">
      {/* Campo principale */}
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

      {/* Profilo LinkedIn */}
      <div className="qa-field">
        <label className="qa-label">
          Profilo LinkedIn della persona
          <span className="qa-label-opt">(facoltativo)</span>
        </label>
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="qa-input"
          placeholder="https://linkedin.com/in/nomecognome"
        />
      </div>

      {/* Info profilo */}
      <div className="qa-field">
        <label className="qa-label">
          Informazioni sul profilo
          <span className="qa-label-opt">(facoltativo)</span>
        </label>
        <textarea
          value={profileInfo}
          onChange={(e) => setProfileInfo(e.target.value)}
          className="qa-input"
          rows={2}
          placeholder={"Founder di startup SaaS.\nPubblica su crescita e acquisizione clienti."}
        />
      </div>

      {/* Selettori */}
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

      <button
        onClick={handleAsk}
        disabled={loading || !input.trim()}
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

      {result && (
        <div className="qa-result">
          {/* Valutazione conversazione */}
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

          {/* Lettura della situazione */}
          {result.lettura && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Lettura della situazione
              </div>
              <p className="qa-result-text">{result.lettura}</p>
            </div>
          )}

          {/* Inizio strategia (troncata) */}
          {truncatedStrategia && (
            <div className="qa-result-block">
              <div className="qa-result-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>
                Strategia consigliata
              </div>
              <p className="qa-result-text">{truncatedStrategia}</p>
            </div>
          )}

          {/* Sezione bloccata */}
          <div className="qa-locked">
            <div className="qa-locked-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Per vedere l&apos;analisi completa
            </div>
            <ul className="qa-locked-list">
              <li>Risposta completa pronta da inviare</li>
              <li>Prossima mossa per portare la conversazione verso una call</li>
              <li>Strategia completa</li>
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
