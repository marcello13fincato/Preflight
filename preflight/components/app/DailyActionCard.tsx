"use client";

import { useState } from "react";

export interface DailyAction {
  tipo: string;
  priorita: "alta" | "media" | "bassa";
  contesto: { chi: string; situazione: string };
  perche_ora: string;
  azione_concreta: string;
  messaggio_suggerito: string;
  outcome_atteso: string;
  prossimo_step: string;
}

const TIPO_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  outreach:    { emoji: "🎯", label: "Outreach",    color: "oggi-tipo-outreach" },
  contenuto:   { emoji: "✍️", label: "Contenuto",   color: "oggi-tipo-contenuto" },
  followup:    { emoji: "🔄", label: "Follow-up",   color: "oggi-tipo-followup" },
  ricerca:     { emoji: "🔍", label: "Ricerca",     color: "oggi-tipo-ricerca" },
  commento:    { emoji: "💬", label: "Commento",    color: "oggi-tipo-outreach" },
  connessione: { emoji: "🤝", label: "Connessione", color: "oggi-tipo-followup" },
};

const PRIORITA_CONFIG: Record<string, { label: string; className: string }> = {
  alta:  { label: "Priorità alta",  className: "oggi-prio-alta" },
  media: { label: "Priorità media", className: "oggi-prio-media" },
  bassa: { label: "Priorità bassa", className: "oggi-prio-bassa" },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={`oggi-copy-btn ${copied ? "oggi-copy-done" : ""}`}>
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {" "}Copiato
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {" "}Copia
        </>
      )}
    </button>
  );
}

interface Props {
  action: DailyAction;
  index: number;
  done: boolean;
  onToggle: () => void;
}

export default function DailyActionCard({ action, index, done, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const tipo = TIPO_CONFIG[action.tipo] || TIPO_CONFIG.ricerca;
  const prio = PRIORITA_CONFIG[action.priorita] || PRIORITA_CONFIG.media;

  return (
    <div
      className={`oggi-action-card oggi-action-card-v2 ${done ? "oggi-action-done" : ""}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Header row */}
      <div className="oggi-action-header">
        <button
          type="button"
          className="oggi-check"
          onClick={onToggle}
          aria-label={done ? "Segna come non completata" : "Segna come completata"}
        >
          {done ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <span className="oggi-check-num">{index + 1}</span>
          )}
        </button>
        <div className="oggi-action-badges">
          <span className={`oggi-tipo-badge ${tipo.color}`}>{tipo.emoji} {tipo.label}</span>
          <span className={`oggi-prio-badge ${prio.className}`}>{prio.label}</span>
        </div>
      </div>

      {/* Context: who + situation */}
      <div className="oggi-action-context">
        <p className="oggi-action-chi">
          <span className="oggi-label-dim">Chi →</span> {action.contesto.chi}
        </p>
        <p className="oggi-action-situazione">
          <span className="oggi-label-dim">Situazione →</span> {action.contesto.situazione}
        </p>
      </div>

      {/* Why now */}
      <div className="oggi-action-perche">
        <span className="oggi-label-accent">⚡ Perché ora</span>
        <p>{action.perche_ora}</p>
      </div>

      {/* Concrete action */}
      <div className="oggi-action-cosa">
        <span className="oggi-label-accent">🎯 Cosa fare</span>
        <p>{action.azione_concreta}</p>
      </div>

      {/* Expandable: message, outcome, next step */}
      <button
        type="button"
        className="oggi-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Nascondi dettagli ↑" : "Mostra messaggio e dettagli ↓"}
      </button>

      {expanded && (
        <div className="oggi-action-details fade-in">
          {/* Suggested message */}
          {action.messaggio_suggerito && (
            <div className="oggi-msg-box">
              <div className="oggi-msg-header">
                <span className="oggi-msg-label">💬 Messaggio suggerito</span>
                <CopyBtn text={action.messaggio_suggerito} />
              </div>
              <p className="oggi-msg-text">{action.messaggio_suggerito}</p>
            </div>
          )}

          {/* Expected outcome */}
          <div className="oggi-action-outcome">
            <span className="oggi-label-dim">📈 Outcome atteso</span>
            <p>{action.outcome_atteso}</p>
          </div>

          {/* Next step */}
          <div className="oggi-action-nextstep">
            <span className="oggi-label-dim">→ Prossimo step</span>
            <p>{action.prossimo_step}</p>
          </div>
        </div>
      )}
    </div>
  );
}
