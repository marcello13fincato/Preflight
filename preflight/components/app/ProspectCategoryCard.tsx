"use client";

import CopyButton from "@/components/shared/CopyButton";

export type ProspectCategory = {
  titolo: string;
  priorita: "Alta" | "Media" | "Bassa";
  perche: string;
  segnali: string[];
  angolo_attacco: string;
  azione_consigliata: string;
  link_ricerca_linkedin?: string;
  messaggio_connessione?: string;
  primo_messaggio?: string;
  followup?: string;
  steps?: string[];
};

const PRIORITY_CONFIG = {
  Alta: { color: "red", icon: "🔴" },
  Media: { color: "amber", icon: "🟡" },
  Bassa: { color: "blue", icon: "🔵" },
} as const;

export default function ProspectCategoryCard({
  category,
  index,
  demo,
}: {
  category: ProspectCategory;
  index: number;
  demo?: boolean;
}) {
  const p = PRIORITY_CONFIG[category.priorita];

  return (
    <div className={`pcc-card fade-in${demo ? " pcc-demo" : ""}`}>
      {/* Header */}
      <div className="pcc-header">
        <span className="pcc-index">{index + 1}</span>
        <div className="pcc-header-info">
          <h4 className="pcc-title">{category.titolo}</h4>
          <span className={`pcc-priority pcc-priority-${p.color}`}>
            {p.icon} Priorità {category.priorita}
          </span>
        </div>
      </div>

      {/* Perché è rilevante */}
      <div className="pcc-section">
        <span className="pcc-label">Perché è rilevante</span>
        <p className="pcc-text">{category.perche}</p>
      </div>

      {/* Segnali */}
      <div className="pcc-section">
        <span className="pcc-label">📡 Segnali da osservare su LinkedIn</span>
        <div className="pcc-signals">
          {category.segnali.map((s, i) => (
            <span key={i} className="pcc-signal-badge">{s}</span>
          ))}
        </div>
      </div>

      {/* Angolo di attacco */}
      <div className="pcc-section pcc-section-highlight">
        <span className="pcc-label">⚔️ Angolo di attacco</span>
        <p className="pcc-text pcc-text-strong">{category.angolo_attacco}</p>
      </div>

      {/* Azione consigliata */}
      <div className="pcc-section">
        <span className="pcc-label">→ Azione consigliata</span>
        <p className="pcc-text">{category.azione_consigliata}</p>
      </div>

      {/* CTA LinkedIn */}
      {category.link_ricerca_linkedin && (
        <a
          href={category.link_ricerca_linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="fc-linkedin-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Apri ricerca su LinkedIn
        </a>
      )}

      {/* Mini workflow */}
      {(category.messaggio_connessione || category.primo_messaggio || category.followup) && (
        <div className="pcc-workflow">
          <span className="pcc-label">💬 Sequenza messaggi</span>
          {category.messaggio_connessione && (
            <div className="pcc-msg">
              <div className="pcc-msg-header">
                <span className="pcc-msg-step">1. Nota connessione</span>
                <CopyButton text={category.messaggio_connessione} />
              </div>
              <div className="pcc-msg-text">{category.messaggio_connessione}</div>
            </div>
          )}
          {category.primo_messaggio && (
            <div className="pcc-msg">
              <div className="pcc-msg-header">
                <span className="pcc-msg-step">2. Primo DM</span>
                <CopyButton text={category.primo_messaggio} />
              </div>
              <div className="pcc-msg-text">{category.primo_messaggio}</div>
            </div>
          )}
          {category.followup && (
            <div className="pcc-msg">
              <div className="pcc-msg-header">
                <span className="pcc-msg-step">3. Follow-up</span>
                <CopyButton text={category.followup} />
              </div>
              <div className="pcc-msg-text">{category.followup}</div>
            </div>
          )}
        </div>
      )}

      {/* Steps */}
      {category.steps && category.steps.length > 0 && (
        <div className="pcc-steps">
          <span className="pcc-label">✅ Prossimi step</span>
          {category.steps.map((step, i) => (
            <div key={i} className="pcc-step">
              <span className="pcc-step-num">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
