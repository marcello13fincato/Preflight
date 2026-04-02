"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import InsightCard, { SectionDivider, MetricRow, MetricBadge } from "@/components/app/InsightCard";
import { IconLightbulb } from "@/components/shared/icons";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";

/* ── Demo data realistico ── */
const DEMO_RESULT: ProspectAnalyzerJson = {
  score: 78,
  chi_e: "Marco Bianchi — Head of Sales, SaaS B2B nel settore HR Tech",
  ruolo_contesto: "Guida un team di 8 venditori in una scale-up che ha chiuso un Series A da 5M€ sei mesi fa. L'azienda sta espandendo il mercato italiano e ha iniziato ad approcciare il mid-market.",
  verdetto: {
    vale_la_pena: "Sì",
    priorita: "Alta",
    confidenza: "Media",
    sintesi: "Profilo in espansione commerciale attiva con budget e autorità decisionale. Timing favorevole per proporre strumenti di acquisizione clienti.",
  },
  segnali: [
    { tipo: "Sta assumendo in area sales", significato: "Il team commerciale sta crescendo", implicazione_commerciale: "Budget allocato per crescita → apertura a strumenti e metodi nuovi" },
    { tipo: "Post recente su pipeline management", significato: "È attivo sul tema della gestione opportunità", implicazione_commerciale: "Sensibilità alta al tema → leva per aprire conversazione" },
    { tipo: "Series A chiuso 6 mesi fa", significato: "Pressione su crescita revenue da parte degli investitori", implicazione_commerciale: "Urgenza di risultati → decisioni più rapide" },
    { tipo: "Commenta post di founder e sales leader", significato: "Network attivo e in costruzione", implicazione_commerciale: "Ricettivo a nuove connessioni qualificate" },
  ],
  perche: {
    fit_con_target: "Ruolo decisionale in area sales, azienda in crescita, settore compatibile con la tua offerta",
    timing: "Post-fundraising con pressione su crescita, team in espansione — momento in cui cercano soluzioni",
    potenziale: "Se converte, può diventare caso studio e referral per altre scale-up del portfolio",
  },
  angolo_attacco: {
    tema: "Scalare l'outbound senza aumentare l'headcount",
    leva: "La fase di crescita post-Series A crea pressione sui numeri ma il team è ancora snello",
    cosa_evitare: "Non proporre una demo o un prodotto. Apri sul tema strategico, non sulla soluzione",
  },
  nota_connessione: "Marco, ho visto il tuo post sulla pipeline — lavoro su temi simili con team sales in crescita. Mi farebbe piacere connetterci.",
  primo_messaggio: "Grazie per la connessione! Ho notato che state espandendo il team sales — curioso di capire come state strutturando l'outbound in questa fase. Ci sono pattern che vedo spesso nelle scale-up post-Series A.",
  followup: {
    quando: "5 giorni dopo il primo messaggio",
    cosa_citare: "Un suo post o commento recente sul tema sales/pipeline",
    obiettivo: "Riaprire la conversazione con un elemento specifico, senza chiedere nulla",
    messaggio: "Marco, ho letto il tuo commento sul post di [nome] sulla pipeline — punto interessante. Ti capita di avere lo stesso problema con il mid-market?",
  },
  errori_da_evitare: [
    "Non proporre subito una call — prima costruisci il contesto con 2-3 interazioni",
    "Non parlare del tuo prodotto/servizio nel primo messaggio — parla del suo problema",
    "Non inviare messaggi lunghi — massimo 3 righe, tono da pari a pari",
  ],
  prossimo_step: "Invia la richiesta di connessione con la nota personalizzata e metti un reminder tra 3 giorni per il follow-up",
  client_heat_level: "Warm",
  priority_signal: "high",
};

export default function Page() {
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [context, setContext] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [showPdfGuide, setShowPdfGuide] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ProspectAnalyzerJson | null>(null);
    const [showDemo, setShowDemo] = useState(false);

    const data = result || (showDemo ? DEMO_RESULT : null);

    const generate = () => {
      if (!linkedinUrl.trim()) return;
      setLoading(true);
      setError(null);
      // Per ora usa demo data dopo un breve delay
      setTimeout(() => {
        setResult(DEMO_RESULT);
        setLoading(false);
      }, 1800);
    };

  /* ── Output panel ── */
  if (data) {
    const heatColor = data.client_heat_level === "Hot" ? "red" : data.client_heat_level === "Warm" ? "amber" : "blue";
    const priorityColor = data.verdetto.priorita === "Alta" ? "red" : data.verdetto.priorita === "Media" ? "amber" : "blue";
    const verdettoColor = data.verdetto.vale_la_pena === "Sì" ? "green" : data.verdetto.vale_la_pena === "No" ? "red" : "amber";

    return (
      <div className="pr-fullscreen fade-in">
        <div className="pr-score-hero fade-in">
          <div className="pr-score-ring-wrap">
            <div className="pr-score-ring">
              <svg viewBox="0 0 120 120" className="pr-score-svg">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(data.score / 100) * 327} 327`}
                  transform="rotate(-90 60 60)" className="pr-score-progress" />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="pr-score-value">{data.score}</div>
            </div>
            <span className="pr-score-label">Compatibilità</span>
          </div>
          <div className="pr-score-info fade-in-delay">
            <h1 className="pr-score-title">Diagnosi Profilo</h1>
            <p className="pr-score-subtitle">{data.chi_e}</p>
          </div>
        </div>

        {/* Metrics bar */}
        <MetricRow>
          <MetricBadge icon="🎯" label="Verdetto" value={data.verdetto.vale_la_pena} color={verdettoColor} />
          <MetricBadge icon="⚡" label="Priorità" value={data.verdetto.priorita} color={priorityColor} />
          <MetricBadge icon="🔥" label="Temperatura" value={data.client_heat_level} color={heatColor} />
          <MetricBadge icon="📊" label="Confidenza" value={data.verdetto.confidenza} color="blue" />
        </MetricRow>

        {/* Verdetto */}
        <div className="pr-diagnosis-section pr-diagnosis-highlight fade-in">
          <div className="pr-diagnosis-icon">🎯</div>
          <div className="pr-diagnosis-content">
            <h3 className="pr-diagnosis-title">Verdetto</h3>
            <p className="pr-diagnosis-text">{data.verdetto.sintesi}</p>
          </div>
        </div>

        <div className="pr-result-grid">
          {/* Segnali */}
          <SectionDivider label="📡 Segnali rilevati" />
          <div className="pr-signals-list">
            {data.segnali.map((s, i) => (
              <div key={i} className="pr-signal-card fade-in">
                <span className="pr-signal-badge">{s.tipo}</span>
                <p className="pr-signal-meaning">{s.significato}</p>
                <p className="pr-signal-implication">→ {s.implicazione_commerciale}</p>
              </div>
            ))}
          </div>

          {/* Perché contattarlo */}
          <SectionDivider label="🧠 Perché contattarlo" />
          <div className="pr-why-grid">
            <div className="pr-why-card fade-in">
              <span className="pr-why-label">Fit con target</span>
              <p>{data.perche.fit_con_target}</p>
            </div>
            <div className="pr-why-card fade-in">
              <span className="pr-why-label">Timing</span>
              <p>{data.perche.timing}</p>
            </div>
            <div className="pr-why-card fade-in">
              <span className="pr-why-label">Potenziale</span>
              <p>{data.perche.potenziale}</p>
            </div>
          </div>

          {/* Angolo di attacco */}
          <SectionDivider label="⚔️ Angolo di attacco" />
          <div className="pr-diagnosis-section pr-diagnosis-highlight fade-in">
            <div className="pr-diagnosis-content">
              <div className="pr-attack-grid">
                <div className="pr-attack-item">
                  <span className="pr-attack-label">Tema</span>
                  <p>{data.angolo_attacco.tema}</p>
                </div>
                <div className="pr-attack-item">
                  <span className="pr-attack-label">Leva</span>
                  <p>{data.angolo_attacco.leva}</p>
                </div>
                <div className="pr-attack-item pr-attack-avoid">
                  <span className="pr-attack-label">⚠️ Evita</span>
                  <p>{data.angolo_attacco.cosa_evitare}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messaggi */}
          <SectionDivider label="💬 Messaggi" />
          <InsightCard icon="🤝" label="Nota di connessione" text={data.nota_connessione} variant="message" copyable />
          <InsightCard icon="✉️" label="Primo messaggio" text={data.primo_messaggio} variant="message" copyable />

          {/* Follow-up */}
          <SectionDivider label="🔄 Follow-up" />
          <div className="pr-followup-card fade-in">
            <div className="pr-followup-meta">
              <span className="pr-followup-tag">📅 {data.followup.quando}</span>
              <span className="pr-followup-tag">💡 Cita: {data.followup.cosa_citare}</span>
              <span className="pr-followup-tag">🎯 Obiettivo: {data.followup.obiettivo}</span>
            </div>
            <div className="pr-followup-message">
              <p>{data.followup.messaggio}</p>
              <CopyButton text={data.followup.messaggio} />
            </div>
          </div>

          {/* Errori da evitare */}
          <SectionDivider label="🚫 Errori da evitare" />
          <div className="pr-errors-list">
            {data.errori_da_evitare.map((err, i) => (
              <div key={i} className="pr-error-item fade-in">
                <span className="pr-error-icon">✕</span>
                <p>{err}</p>
              </div>
            ))}
          </div>

          {/* Prossimo step */}
          <div className="pr-diagnosis-section pr-next-step fade-in">
            <div className="pr-diagnosis-icon">→</div>
            <div className="pr-diagnosis-content">
              <h3 className="pr-diagnosis-title">Prossimo step</h3>
              <p className="pr-diagnosis-text">{data.prossimo_step}</p>
            </div>
          </div>
        </div>

        <button onClick={() => { setResult(null); setShowDemo(false); }} className="pr-generate-btn" style={{ marginTop: "2rem" }}>
          ← Analizza un altro profilo
        </button>
      </div>
    );
  }

  // ── STATIC PAGE (INPUT) FULLSCREEN WOW ──
  return (
    <div className="pr-fullscreen pr-fullscreen-empty fade-in">
      <div className="pr-score-hero fade-in">
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
        <div className="pr-score-info fade-in-delay">
          <h1 className="pr-score-title">Analizza un profilo</h1>
          <p className="pr-score-subtitle">Scopri se vale la pena contattare una persona e ricevi messaggi pronti da copiare per ogni fase.</p>
        </div>
      </div>
      <div className="pr-input-layout fade-in">
        <div className="pr-form-card fade-in-delay">
          <div className="qa-field">
            <label className="qa-label">Link profilo LinkedIn</label>
            <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nome-cognome" />
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
          <button onClick={() => setShowDemo(true)} className="pr-demo-btn">
            Vedi esempio di diagnosi →
          </button>
        </div>
        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">🎯 Verdetto chiaro: vale la pena contattarlo?</div>
              <div className="pr-info-feature">📡 Segnali con implicazione commerciale</div>
              <div className="pr-info-feature">⚔️ Angolo di attacco specifico</div>
              <div className="pr-info-feature">💬 Messaggi pronti da copiare</div>
              <div className="pr-info-feature">🚫 Errori da evitare</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
