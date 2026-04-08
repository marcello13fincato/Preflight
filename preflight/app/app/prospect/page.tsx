"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/hooks/useSession";
import HistoryList from "@/components/app/HistoryList";
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

/* ── Copy button inline (same pattern as oggi/find-clients) ── */
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
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copiato</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copia</>
      )}
    </button>
  );
}

/* ── Quick tool links ── */
const QUICK_TOOLS = [
  { href: "/app", icon: "📋", title: "Cosa fare oggi", desc: "Piano quotidiano AI personalizzato." },
  { href: "/app/find-clients", icon: "🔍", title: "Trova clienti", desc: "Targeting e messaggi pronti." },
  { href: "/app/post", icon: "✍️", title: "Scrivi un post", desc: "Post con hook, CTA e immagine." },
  { href: "/app/articolo", icon: "📄", title: "Scrivi un articolo", desc: "Articolo autorevole con SEO." },
];

export default function ProspectPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [context, setContext] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showPdfGuide, setShowPdfGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProspectAnalyzerJson | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [activeMsg, setActiveMsg] = useState(0);

  const data = result || (showDemo ? DEMO_RESULT : null);

  const generate = async () => {
    if (!linkedinUrl.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = await pdfFile.text();
      }
      const res = await fetch("/api/ai/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkedin_url: linkedinUrl.trim(),
          website_url: websiteUrl.trim() || undefined,
          context: context.trim() || undefined,
          pdf_text: pdfText || undefined,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = prospectAnalyzerSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setResult(parsed.data);
      repo.interaction.addInteraction(userId, "prospect", `Analisi: ${linkedinUrl}`, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  function resetAnalysis() {
    setResult(null);
    setShowDemo(false);
    setActiveMsg(0);
  }

  /* ═══════════════════════════════════════════
     RESULTS VIEW — Premium numbered sections
     ═══════════════════════════════════════════ */
  if (data) {
    const scoreColor = data.score >= 70 ? "#22c55e" : data.score >= 40 ? "#f59e0b" : "#ef4444";
    const heatLabel = data.client_heat_level === "Hot" ? "🔥 Hot" : data.client_heat_level === "Warm" ? "🟠 Warm" : "🔵 Cold";
    const priorityLabel = data.verdetto.priorita === "Alta" ? "⚡ Alta" : data.verdetto.priorita === "Media" ? "🟡 Media" : "🔵 Bassa";

    return (
      <div className="ap-page fade-in">
        {/* Demo banner */}
        {showDemo && (
          <div className="ap-demo-banner fade-in">
            <span className="ap-demo-badge">👁️ Esempio</span>
            <p className="ap-demo-text">Stai vedendo un esempio. Inserisci un profilo reale per un&apos;analisi personalizzata.</p>
            <button type="button" onClick={resetAnalysis} className="ap-demo-close">← Torna al form</button>
          </div>
        )}

        {/* ── HERO — Score + Identity ── */}
        <div className="ap-hero fade-in">
          <div className="ap-hero-top">
            <button type="button" onClick={resetAnalysis} className="ap-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Nuova analisi
            </button>
            <span className="ap-hero-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Diagnosi profilo AI
            </span>
          </div>

          <div className="ap-hero-content">
            <div className="ap-score-ring-wrap">
              <div className="ap-score-ring">
                <svg viewBox="0 0 100 100" className="ap-score-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${(data.score / 100) * 264} 264`}
                    transform="rotate(-90 50 50)" className="ap-score-progress" />
                </svg>
                <div className="ap-score-value">{data.score}</div>
              </div>
              <span className="ap-score-label">Compatibilità</span>
            </div>
            <div className="ap-hero-info">
              <h1 className="ap-hero-title">{data.chi_e}</h1>
              <p className="ap-hero-context">{data.ruolo_contesto}</p>
              <div className="ap-hero-badges">
                <span className="ap-badge ap-badge--verdict">{data.verdetto.vale_la_pena === "Sì" ? "✅ Vale la pena" : data.verdetto.vale_la_pena === "No" ? "❌ Non prioritario" : "⚠️ Da valutare"}</span>
                <span className="ap-badge ap-badge--priority">{priorityLabel}</span>
                <span className="ap-badge ap-badge--heat">{heatLabel}</span>
                <span className="ap-badge ap-badge--confidence">📊 Confidenza: {data.verdetto.confidenza}</span>
              </div>
            </div>
          </div>

          {/* Focus card — verdict */}
          <div className="ap-focus-card">
            <span className="ap-focus-label">Verdetto AI</span>
            <p className="ap-focus-text">{data.verdetto.sintesi}</p>
          </div>
        </div>

        {/* ── SEZIONE 1: Segnali rilevati ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">1</span>
            <div>
              <h2 className="ap-section-title">Segnali rilevati</h2>
              <p className="ap-section-sub">{data.segnali.length} segnali commerciali identificati dall&apos;AI nel profilo.</p>
            </div>
          </div>

          <div className="ap-signals-grid">
            {data.segnali.map((s, i) => (
              <div key={i} className="ap-signal-card">
                <div className="ap-signal-header">
                  <span className="ap-signal-num">{i + 1}</span>
                  <span className="ap-signal-type">{s.tipo}</span>
                </div>
                <p className="ap-signal-meaning">{s.significato}</p>
                <div className="ap-signal-implication">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  <span>{s.implicazione_commerciale}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEZIONE 2: Perché contattarlo ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">2</span>
            <div>
              <h2 className="ap-section-title">Perché contattarlo</h2>
              <p className="ap-section-sub">Tre dimensioni che confermano il potenziale di questo prospect.</p>
            </div>
          </div>

          <div className="ap-why-grid">
            <div className="ap-why-card ap-why--fit">
              <div className="ap-why-icon">🎯</div>
              <span className="ap-why-label">Fit con target</span>
              <p className="ap-why-text">{data.perche.fit_con_target}</p>
            </div>
            <div className="ap-why-card ap-why--timing">
              <div className="ap-why-icon">⏰</div>
              <span className="ap-why-label">Timing</span>
              <p className="ap-why-text">{data.perche.timing}</p>
            </div>
            <div className="ap-why-card ap-why--potential">
              <div className="ap-why-icon">📈</div>
              <span className="ap-why-label">Potenziale</span>
              <p className="ap-why-text">{data.perche.potenziale}</p>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 3: Angolo di attacco ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">3</span>
            <div>
              <h2 className="ap-section-title">Angolo di attacco</h2>
              <p className="ap-section-sub">La strategia consigliata per aprire la conversazione.</p>
            </div>
          </div>

          <div className="ap-attack-card">
            <div className="ap-attack-grid">
              <div className="ap-attack-item ap-attack--tema">
                <span className="ap-attack-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z"/></svg>
                  Tema
                </span>
                <p className="ap-attack-text">{data.angolo_attacco.tema}</p>
              </div>
              <div className="ap-attack-item ap-attack--leva">
                <span className="ap-attack-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  Leva
                </span>
                <p className="ap-attack-text">{data.angolo_attacco.leva}</p>
              </div>
            </div>
            <div className="ap-attack-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span>{data.angolo_attacco.cosa_evitare}</span>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 4: Messaggi pronti (tab-based) ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">4</span>
            <div>
              <h2 className="ap-section-title">Messaggi pronti</h2>
              <p className="ap-section-sub">Copia e incolla su LinkedIn. Personalizzati per questo profilo.</p>
            </div>
          </div>

          <div className="oggi-msg-tabs">
            {["Nota connessione", "Primo messaggio", "Follow-up"].map((label, i) => (
              <button key={label} type="button" className={`oggi-msg-tab ${activeMsg === i ? "oggi-msg-tab--active" : ""}`}
                onClick={() => setActiveMsg(i)}>
                {label}
              </button>
            ))}
          </div>

          <div className="oggi-msg-active-card">
            {activeMsg === 0 && (
              <div className="ap-msg-card">
                <div className="ap-msg-head">
                  <div className="ap-msg-meta">
                    <span className="ap-msg-step-badge">1</span>
                    <span className="ap-msg-label">Nota di connessione</span>
                  </div>
                  <CopyBtn text={data.nota_connessione} />
                </div>
                <p className="ap-msg-text">{data.nota_connessione}</p>
                <span className="ap-msg-chars">{data.nota_connessione.length} caratteri</span>
              </div>
            )}
            {activeMsg === 1 && (
              <div className="ap-msg-card">
                <div className="ap-msg-head">
                  <div className="ap-msg-meta">
                    <span className="ap-msg-step-badge ap-msg-step--purple">2</span>
                    <span className="ap-msg-label">Primo messaggio dopo accettazione</span>
                  </div>
                  <CopyBtn text={data.primo_messaggio} />
                </div>
                <p className="ap-msg-text">{data.primo_messaggio}</p>
                <span className="ap-msg-chars">{data.primo_messaggio.length} caratteri</span>
              </div>
            )}
            {activeMsg === 2 && (
              <div className="ap-msg-card">
                <div className="ap-msg-head">
                  <div className="ap-msg-meta">
                    <span className="ap-msg-step-badge ap-msg-step--green">3</span>
                    <span className="ap-msg-label">Follow-up — {data.followup.quando}</span>
                  </div>
                  <CopyBtn text={data.followup.messaggio} />
                </div>
                <p className="ap-msg-text">{data.followup.messaggio}</p>
                <div className="ap-followup-meta">
                  <span className="ap-followup-tag">💡 Cita: {data.followup.cosa_citare}</span>
                  <span className="ap-followup-tag">🎯 {data.followup.obiettivo}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SEZIONE 5: Errori da evitare ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num ap-section-num--warn">!</span>
            <div>
              <h2 className="ap-section-title">Errori da evitare</h2>
              <p className="ap-section-sub">Cosa NON fare con questo tipo di profilo.</p>
            </div>
          </div>

          <div className="ap-errors-list">
            {data.errori_da_evitare.map((err, i) => (
              <div key={i} className="ap-error-item">
                <span className="ap-error-icon">✕</span>
                <p>{err}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEZIONE 6: Prossimo step + Nav ── */}
        <section className="ap-section ap-section--next fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num ap-section-num--next">→</span>
            <div>
              <h2 className="ap-section-title">Prossimo step</h2>
              <p className="ap-section-sub">{data.prossimo_step}</p>
            </div>
          </div>
          <div className="ap-next-grid">
            <Link href="/app/find-clients" className="ap-next-card ap-next-card--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Trova clienti</span>
            </Link>
            <Link href="/app/post" className="ap-next-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Scrivi un post</span>
            </Link>
            <Link href="/app" className="ap-next-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Cosa fare oggi</span>
            </Link>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="ap-section ap-stats-section fade-in-delay">
          <div className="ap-stats-grid">
            <div className="ap-stat">
              <span className="ap-stat-value">{data.score}/100</span>
              <span className="ap-stat-label">Score</span>
            </div>
            <div className="ap-stat">
              <span className="ap-stat-value">{data.segnali.length}</span>
              <span className="ap-stat-label">Segnali</span>
            </div>
            <div className="ap-stat">
              <span className="ap-stat-value">3</span>
              <span className="ap-stat-label">Messaggi pronti</span>
            </div>
            <div className="ap-stat">
              <span className="ap-stat-value">{data.verdetto.priorita}</span>
              <span className="ap-stat-label">Priorità</span>
            </div>
          </div>
        </section>

        {/* ── Bottom actions ── */}
        <div className="ap-bottom-actions">
          <button type="button" onClick={resetAnalysis} className="btn-ghost">
            🔄 Nuova analisi
          </button>
        </div>

        <HistoryList userId={userId} type="prospect" />
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     INPUT VIEW — Premium form experience
     ═══════════════════════════════════════════ */
  return (
    <div className="ap-page fade-in">
      {/* ── Hero ── */}
      <div className="ap-hero ap-hero--input fade-in">
        <div className="ap-hero-top">
          <span className="ap-hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Diagnosi profilo AI
          </span>
        </div>
        <h1 className="ap-input-title">Analizza un profilo</h1>
        <p className="ap-input-sub">
          Incolla un link LinkedIn. L&apos;AI analizza il profilo, valuta il fit commerciale e genera messaggi personalizzati pronti da copiare.
        </p>
        <div className="ap-hero-features">
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Score 0-100
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Segnali commerciali
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            3 messaggi pronti
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            Errori da evitare
          </span>
        </div>
      </div>

      {/* ── Form + Sidebar ── */}
      <div className="ap-input-layout">
        <div className="ap-form-card fade-in-delay">
          <div className="qa-field">
            <label className="qa-label">Link profilo LinkedIn</label>
            <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nome-cognome" />
          </div>
          <div className="qa-field">
            <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
            <p className="qa-microcopy">Per un&apos;analisi più precisa, carica anche il PDF del profilo.</p>
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
            <div className="ap-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {error}
            </div>
          )}
          <button type="button" onClick={generate} disabled={loading || !linkedinUrl.trim()} className="ap-generate-btn">
            {loading ? (
              <><span className="qa-spinner" aria-hidden="true" />Sto analizzando il profilo…</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Analizza profilo
              </>
            )}
          </button>
          <button type="button" onClick={() => setShowDemo(true)} className="ap-demo-btn">
            <span className="ap-demo-btn-icon">👁️</span>
            Vedi un esempio di diagnosi →
          </button>
        </div>

        <div className="ap-info-side">
          {/* What you get card */}
          <div className="ap-info-card">
            <h3 className="ap-info-title">Cosa otterrai</h3>
            <div className="ap-info-features">
              <div className="ap-info-feature">
                <span className="ap-info-num">1</span>
                <div>
                  <strong>Score e verdetto</strong>
                  <p>Compatibilità 0-100 e analisi fit/timing/potenziale</p>
                </div>
              </div>
              <div className="ap-info-feature">
                <span className="ap-info-num">2</span>
                <div>
                  <strong>Segnali commerciali</strong>
                  <p>Cosa dice il profilo e cosa implica per te</p>
                </div>
              </div>
              <div className="ap-info-feature">
                <span className="ap-info-num">3</span>
                <div>
                  <strong>Angolo di attacco</strong>
                  <p>Tema, leva e cosa evitare</p>
                </div>
              </div>
              <div className="ap-info-feature">
                <span className="ap-info-num">4</span>
                <div>
                  <strong>3 messaggi pronti</strong>
                  <p>Connessione, primo DM e follow-up</p>
                </div>
              </div>
              <div className="ap-info-feature">
                <span className="ap-info-num">5</span>
                <div>
                  <strong>Errori da evitare</strong>
                  <p>Per non bruciare il contatto</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="ap-loading-card">
              <div className="ap-loading-orb">
                <div className="ap-orb-ring ap-orb-ring-1" />
                <div className="ap-orb-ring ap-orb-ring-2" />
                <div className="ap-orb-core">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
              <div className="ap-loading-steps">
                <span className="ap-loading-step ap-loading-step--active">Analizzo profilo</span>
                <span className="ap-loading-step">Valuto segnali</span>
                <span className="ap-loading-step">Genero messaggi</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Other tools ── */}
      <section className="ap-tools-section fade-in-delay">
        <h2 className="ap-tools-title">Altri strumenti</h2>
        <div className="sys-quick-grid">
          {QUICK_TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="sys-quick-card">
              <span className="sys-quick-card-icon">{t.icon}</span>
              <h3 className="sys-quick-card-title">{t.title}</h3>
              <p className="sys-quick-card-desc">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <HistoryList userId={userId} type="prospect" />
    </div>
  );
}
