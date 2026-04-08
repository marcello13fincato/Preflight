"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import CopyButton from "@/components/shared/CopyButton";
import { IconLightbulb } from "@/components/shared/icons";
import HistoryList from "@/components/app/HistoryList";
import ProspectCategoryCard, { type ProspectCategory } from "@/components/app/ProspectCategoryCard";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { findClientsSchema, type FindClientsJson } from "@/lib/sales/schemas";

const DIMENSIONE_OPTIONS = [
  { value: "", label: "Qualsiasi" },
  { value: "freelance", label: "Freelance" },
  { value: "startup", label: "Startup" },
  { value: "PMI", label: "PMI" },
  { value: "enterprise", label: "Enterprise" },
] as const;

const FASE_OPTIONS = [
  { value: "", label: "Non so" },
  { value: "early_stage", label: "Early stage" },
  { value: "crescita", label: "Crescita" },
  { value: "strutturata", label: "Strutturata" },
] as const;

const TARGETING_STORAGE_KEY = "preflight:last-targeting";

function saveTargetingResult(userId: string, result: FindClientsJson) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${TARGETING_STORAGE_KEY}:${userId}`,
    JSON.stringify({ result, savedAt: new Date().toISOString() }),
  );
}

/* ── Copy button inline (same pattern as oggi page) ── */
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

/* ── Quick tool links (matches oggi page) ── */
const QUICK_TOOLS = [
  { href: "/app", icon: "📋", title: "Cosa fare oggi", desc: "Piano quotidiano AI personalizzato." },
  { href: "/app/prospect", icon: "👤", title: "Analizza profilo", desc: "Valuta fit e angolo di attacco." },
  { href: "/app/post", icon: "✍️", title: "Scrivi un post", desc: "Post con hook, CTA e immagine." },
  { href: "/app/articolo", icon: "📄", title: "Scrivi un articolo", desc: "Articolo autorevole con SEO." },
];

/* ── Active section tab for results ── */
const RESULT_SECTIONS = [
  { key: "priority", label: "Target #1", icon: "🎯" },
  { key: "alternatives", label: "Alternative", icon: "👥" },
  { key: "strategy", label: "Strategia", icon: "💬" },
  { key: "criteria", label: "Criteri", icon: "📋" },
  { key: "checklist", label: "Checklist", icon: "✅" },
] as const;

export default function FindClientsPage() {
  const { userId, status } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);

  const profile = userId ? repo.profile.getProfile(userId) : { onboarding: null, plan: null, onboarding_complete: false };
  const onboarding = profile.onboarding as Record<string, unknown> | null;

  const [ruoloTarget, setRuoloTarget] = useState("");
  const [settore, setSettore] = useState("");
  const [area, setArea] = useState("");
  const [citta, setCitta] = useState("");
  const [dimensione, setDimensione] = useState("");
  const [faseAzienda, setFaseAzienda] = useState("");
  const [problemaCliente, setProblemaCliente] = useState("");
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [searchMode, setSearchMode] = useState<"manual" | "profile">("manual");
  const [output, setOutput] = useState<FindClientsJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);
  const [activeSection, setActiveSection] = useState(0);
  const [activeMsg, setActiveMsg] = useState(0);

  const DEMO_CATEGORIES: ProspectCategory[] = [
    {
      titolo: "Founder SaaS B2B in fase di hiring sales",
      priorita: "Alta",
      perche: "Stanno assumendo venditori → budget allocato per crescita commerciale → apertura a metodi e strumenti nuovi per accelerare.",
      segnali: ["Pubblica offerte lavoro sales", "Post su crescita aziendale", "Series A/B recente", "Team < 30 persone"],
      angolo_attacco: "Parlare di come scalare l'outbound senza dipendere solo dai nuovi assunti — il processo conta più dell'headcount.",
      azione_consigliata: "Commenta un loro post su crescita → dopo 2 interazioni, DM con domanda specifica sul loro processo outbound.",
      link_ricerca_linkedin: "https://www.linkedin.com/search/results/people/?keywords=founder%20SaaS%20B2B&origin=GLOBAL_SEARCH_HEADER",
      messaggio_connessione: "Ho visto che state espandendo il team sales — lavoro su temi simili. Mi farebbe piacere connetterci.",
      primo_messaggio: "Curiosità: come state strutturando l'outbound con il team che cresce? Vedo pattern interessanti nelle scale-up in questa fase.",
      followup: "Ho letto il tuo post su [tema] — punto interessante. Ti capita lo stesso problema con il mid-market?",
      steps: ["Cerca 5 profili con questi segnali", "Commenta 2-3 post prima di connetterti", "Invia nota di connessione personalizzata"],
    },
    {
      titolo: "Head of Sales con focus pipeline",
      priorita: "Media",
      perche: "Chi gestisce la pipeline ha il problema più concreto: convertire contatti in clienti. Se il processo non funziona, lo sente ogni giorno.",
      segnali: ["Post su pipeline/CRM", "Commenta leader di settore", "Cambiato ruolo negli ultimi 6 mesi"],
      angolo_attacco: "Partire dal problema specifico della conversione — non dalla generazione di lead, ma da cosa succede dopo il primo contatto.",
      azione_consigliata: "DM diretto dopo connessione, con domanda su come gestiscono il follow-up oggi.",
      messaggio_connessione: "Vedo che ti occupi di pipeline — mi occupo dello stesso tema in ambito B2B. Connettiamoci.",
      primo_messaggio: "Domanda veloce: come gestite il follow-up dopo il primo contatto? È il punto dove vedo più opportunità perse.",
      steps: ["Cerca profili Head of Sales / VP Sales", "Filtra per aziende 10-100 dipendenti", "Prioritizza chi pubblica contenuti"],
    },
    {
      titolo: "Consulente che pubblica contenuti su LinkedIn",
      priorita: "Bassa",
      perche: "Già attivi sulla piattaforma, capiscono il valore del networking. Potenziale più come partner o referral che come cliente diretto.",
      segnali: ["Pubblica 2+ post a settimana", "Commenta attivamente su altri post", "Ha 1000+ connessioni"],
      angolo_attacco: "Non vendere — proporre uno scambio di valore o una collaborazione su contenuti.",
      azione_consigliata: "Interazione organica sui loro contenuti → connessione → proposta di scambio",
      steps: ["Identifica 3 consulenti nel tuo settore", "Commenta con valore per 2 settimane", "Proponi scambio di insight"],
    },
  ];

  useEffect(() => {
    if (!onboarding || prefilled) return;
    const ob = onboarding;
    if (ob.cliente_ideale && !ruoloTarget) setRuoloTarget(String(ob.cliente_ideale));
    if (ob.problema_cliente && !problemaCliente) setProblemaCliente(String(ob.problema_cliente));
    setPrefilled(true);
  }, [onboarding, prefilled, ruoloTarget, problemaCliente]);

  function toggleCheck(i: number) {
    setCheckedItems((prev) => { const next = [...prev]; next[i] = !next[i]; return next; });
  }

  async function generate() {
    if (searchMode === "manual" && !ruoloTarget.trim()) return;
    if (searchMode === "profile" && !linkedinProfileUrl.trim()) return;
    if (loading) return;
    setLoading(true);
    setError(null);
    setCheckedItems([false, false, false, false, false]);
    setActiveSection(0);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruolo_target: searchMode === "profile"
            ? `Trova profili simili a questo profilo LinkedIn: ${linkedinProfileUrl.trim()}`
            : ruoloTarget.trim(),
          settore: settore.trim() || undefined,
          area_geografica: area.trim() || undefined,
          citta: citta.trim() || undefined,
          dimensione: dimensione || undefined,
          fase_azienda: faseAzienda || undefined,
          problema_cliente: problemaCliente.trim() || undefined,
          linkedin_profile_url: linkedinProfileUrl.trim() || undefined,
          pdf_text: pdfText || undefined,
          profile: onboarding || undefined,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = findClientsSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      saveTargetingResult(userId!, parsed.data);
      repo.interaction.addInteraction(userId!, "prospect", `Targeting: ${ruoloTarget}`, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  const completedCount = checkedItems.filter(Boolean).length;
  const progressPct = Math.round((completedCount / 5) * 100);

  function resetSearch() {
    setOutput(null);
    setError(null);
    setCheckedItems([false, false, false, false, false]);
    setActiveSection(0);
  }

  /* ═══════════════════════════════════════════
     AUTH LOADING GUARD
     ═══════════════════════════════════════════ */
  if (status === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  /* ═══════════════════════════════════════════
     RESULTS VIEW — Premium Command Center style
     ═══════════════════════════════════════════ */
  if (output) {
    return (
      <div className="fcp-page fade-in">
        {/* ── Hero risultati ── */}
        <div className="fcp-hero fade-in">
          <div className="fcp-hero-top">
            <button onClick={resetSearch} className="fcp-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Nuova ricerca
            </button>
            <div className="fcp-hero-stats-row">
              <span className="fcp-progress-pill">
                <span className="fcp-progress-fill" style={{ width: `${progressPct}%` }} />
                <span className="fcp-progress-label">{completedCount}/5 azioni</span>
              </span>
            </div>
          </div>
          <h1 className="fcp-hero-title">
            {output.categoria_prioritaria.titolo}
          </h1>
          <div className="fcp-focus-card">
            <span className="fcp-focus-label">Strategia AI</span>
            <p className="fcp-focus-text">{output.riepilogo_strategia}</p>
          </div>
          {/* Progress ring */}
          <div className="fcp-hero-ring">
            <svg viewBox="0 0 80 80" className="fcp-ring-svg">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#fcpRingGrad)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${progressPct * 2.136} 213.6`} transform="rotate(-90 40 40)"
                style={{ transition: "stroke-dasharray 0.6s ease" }} />
              <defs>
                <linearGradient id="fcpRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
            </svg>
            <span className="fcp-ring-pct">{progressPct}%</span>
          </div>
        </div>

        {/* ── SEZIONE 1: Categoria prioritaria ── */}
        <section className="fcp-section fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num">1</span>
            <div>
              <h2 className="fcp-section-title">Da chi partire oggi</h2>
              <p className="fcp-section-sub">Il profilo più compatibile con il tuo posizionamento — con messaggi pronti.</p>
            </div>
          </div>

          <div className="fcp-priority-card">
            <div className="fcp-priority-header">
              <span className="fcp-priority-badge">Priorità #1</span>
              <h3 className="fcp-priority-title">{output.categoria_prioritaria.titolo}</h3>
            </div>
            <p className="fcp-priority-desc">{output.categoria_prioritaria.descrizione}</p>

            <div className="fcp-priority-grid">
              <div className="fcp-priority-insight">
                <span className="fcp-insight-label">Perché ora</span>
                <p className="fcp-insight-text">{output.categoria_prioritaria.perche_ora}</p>
              </div>
              <div className="fcp-priority-insight fcp-insight-signals">
                <span className="fcp-insight-label">Segnali da cercare</span>
                <p className="fcp-insight-text">{output.categoria_prioritaria.segnali_profilo}</p>
              </div>
            </div>

            <a href={output.categoria_prioritaria.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="fcp-linkedin-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Apri ricerca su LinkedIn
            </a>

            {/* Messages for priority category */}
            <div className="fcp-msg-group">
              <div className="fcp-msg-card">
                <div className="fcp-msg-head">
                  <span className="fcp-msg-label">Nota di connessione</span>
                  <CopyBtn text={output.categoria_prioritaria.messaggio_connessione} />
                </div>
                <p className="fcp-msg-text">{output.categoria_prioritaria.messaggio_connessione}</p>
              </div>
              <div className="fcp-msg-card fcp-msg-card--accent">
                <div className="fcp-msg-head">
                  <span className="fcp-msg-label fcp-msg-label--green">Primo DM dopo accettazione</span>
                  <CopyBtn text={output.categoria_prioritaria.messaggio_dopo_accettazione} />
                </div>
                <p className="fcp-msg-text">{output.categoria_prioritaria.messaggio_dopo_accettazione}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 2: Messaggi pronti (tab-based, like oggi) ── */}
        <section className="fcp-section fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num">2</span>
            <div>
              <h2 className="fcp-section-title">Sequenza messaggi</h2>
              <p className="fcp-section-sub">Copia e incolla. Personalizza solo il nome.</p>
            </div>
          </div>

          <div className="fcp-strategy-box">
            <span className="fcp-strategy-badge">Sequenza consigliata</span>
            <p className="fcp-strategy-text">{output.strategia_contatto.approccio_step}</p>
          </div>

          <div className="oggi-msg-tabs">
            {["Primo messaggio", "Follow-up 48h", "Follow-up 5 giorni"].map((label, i) => (
              <button key={label} type="button" className={`oggi-msg-tab ${activeMsg === i ? "oggi-msg-tab--active" : ""}`}
                onClick={() => setActiveMsg(i)}>
                {label}
              </button>
            ))}
          </div>

          <div className="oggi-msg-active-card">
            {activeMsg === 0 && (
              <div className="fcp-msg-card">
                <div className="fcp-msg-head">
                  <span className="fcp-msg-label">Primo messaggio</span>
                  <CopyBtn text={output.strategia_contatto.primo_messaggio} />
                </div>
                <p className="fcp-msg-text">{output.strategia_contatto.primo_messaggio}</p>
              </div>
            )}
            {activeMsg === 1 && (
              <div className="fcp-msg-card">
                <div className="fcp-msg-head">
                  <span className="fcp-msg-label">Follow-up 48h</span>
                  <CopyBtn text={output.strategia_contatto.followup_48h} />
                </div>
                <p className="fcp-msg-text">{output.strategia_contatto.followup_48h}</p>
              </div>
            )}
            {activeMsg === 2 && (
              <div className="fcp-msg-card">
                <div className="fcp-msg-head">
                  <span className="fcp-msg-label">Follow-up 5 giorni</span>
                  <CopyBtn text={output.strategia_contatto.followup_5g} />
                </div>
                <p className="fcp-msg-text">{output.strategia_contatto.followup_5g}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── SEZIONE 3: Categorie alternative ── */}
        <section className="fcp-section fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num">3</span>
            <div>
              <h2 className="fcp-section-title">Altre categorie target</h2>
              <p className="fcp-section-sub">Profili alternativi da esplorare per diversificare la pipeline.</p>
            </div>
          </div>

          <div className="fcp-alt-grid">
            {output.categorie_alternative.map((cat, i) => (
              <div key={i} className="fcp-alt-card">
                <div className="fcp-alt-card-header">
                  <span className="fcp-alt-num">{i + 2}</span>
                  <h4 className="fcp-alt-title">{cat.titolo}</h4>
                </div>
                <p className="fcp-alt-desc">{cat.descrizione}</p>
                <p className="fcp-alt-why">{cat.perche_ora}</p>
                <div className="fcp-alt-signals">
                  <span className="fcp-insight-label">Segnali</span>
                  <p className="fcp-insight-text">{cat.segnali_profilo}</p>
                </div>
                <div className="fcp-alt-actions">
                  <a href={cat.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="fcp-linkedin-btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    LinkedIn
                  </a>
                  <CopyBtn text={cat.messaggio_connessione} />
                </div>
                <div className="fcp-alt-msg-box">
                  <span className="fcp-alt-msg-label">Nota connessione</span>
                  <p className="fcp-alt-msg-text">{cat.messaggio_connessione}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEZIONE 4: Criteri di selezione ── */}
        <section className="fcp-section fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num">4</span>
            <div>
              <h2 className="fcp-section-title">Criteri di selezione</h2>
              <p className="fcp-section-sub">Come distinguere i profili ad alto potenziale da quelli da evitare.</p>
            </div>
          </div>

          <div className="fcp-criteria-grid">
            <div className="fcp-criteria-card fcp-criteria--good">
              <div className="fcp-criteria-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="fcp-criteria-label">Segnali positivi</span>
              <p className="fcp-criteria-text">{output.criteri_selezione.segnali_positivi}</p>
            </div>
            <div className="fcp-criteria-card fcp-criteria--warn">
              <div className="fcp-criteria-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <span className="fcp-criteria-label fcp-criteria-label--warn">Red flags</span>
              <p className="fcp-criteria-text">{output.criteri_selezione.red_flags}</p>
            </div>
            <div className="fcp-criteria-card fcp-criteria--neutral">
              <div className="fcp-criteria-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span className="fcp-criteria-label">Attività recente</span>
              <p className="fcp-criteria-text">{output.criteri_selezione.attivita_recente}</p>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 5: Checklist azioni ── */}
        <section className="fcp-section fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num fcp-section-num--action">5</span>
            <div>
              <h2 className="fcp-section-title">Le 5 azioni da fare adesso</h2>
              <p className="fcp-section-sub">Completa ogni step per massimizzare le possibilità di risposta.</p>
            </div>
          </div>

          <div className="fcp-check-progress">
            <div className="fcp-check-bar">
              <div className="fcp-check-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="fcp-check-label">{completedCount}/5 completate</span>
          </div>

          <div className="fcp-checklist">
            {output.checklist_azioni.map((azione, i) => (
              <button key={i} type="button" className={`fcp-check-item ${checkedItems[i] ? "fcp-check-item--done" : ""}`} onClick={() => toggleCheck(i)}>
                <span className="fcp-check-box">
                  {checkedItems[i] ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <span className="fcp-check-num">{i + 1}</span>
                  )}
                </span>
                <span className="fcp-check-text">{azione}</span>
              </button>
            ))}
          </div>

          {completedCount === 5 && (
            <div className="fcp-done-banner">
              <span className="fcp-done-emoji">🏆</span>
              <div>
                <strong>Tutte le azioni completate!</strong>
                <p>Ottimo lavoro. Passa al prossimo step.</p>
              </div>
            </div>
          )}
          {completedCount > 0 && completedCount < 5 && (
            <div className="fcp-inline-progress">
              <span className="fcp-inline-label">{completedCount}/5 completate — continua così!</span>
            </div>
          )}
        </section>

        {/* ── SEZIONE 6: Prossimo step + Stats ── */}
        <section className="fcp-section fcp-section--next fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num fcp-section-num--next">→</span>
            <div>
              <h2 className="fcp-section-title">Prossimo step</h2>
              <p className="fcp-section-sub">{output.prossimo_step}</p>
            </div>
          </div>
          <div className="fcp-next-grid">
            <Link href="/app/prospect" className="fcp-next-card fcp-next-card--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Analizza un profilo</span>
            </Link>
            <Link href="/app/articolo" className="fcp-next-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Scrivi un articolo</span>
            </Link>
            <Link href="/app" className="fcp-next-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Cosa fare oggi</span>
            </Link>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="fcp-section fcp-stats-section fade-in-delay">
          <div className="fcp-stats-grid">
            <div className="fcp-stat">
              <span className="fcp-stat-value">{output.categorie_alternative.length + 1}</span>
              <span className="fcp-stat-label">Categorie target</span>
            </div>
            <div className="fcp-stat">
              <span className="fcp-stat-value">4</span>
              <span className="fcp-stat-label">Messaggi pronti</span>
            </div>
            <div className="fcp-stat">
              <span className="fcp-stat-value">{completedCount}/5</span>
              <span className="fcp-stat-label">Azioni completate</span>
            </div>
            <div className="fcp-stat">
              <span className="fcp-stat-value">{progressPct}%</span>
              <span className="fcp-stat-label">Progresso</span>
            </div>
          </div>
        </section>

        {/* ── Bottom actions ── */}
        <div className="fcp-bottom-actions">
          <button type="button" onClick={resetSearch} className="btn-ghost">
            🔄 Nuova ricerca
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
    <div className="fcp-page fade-in">
      {/* ── Hero ── */}
      <div className="fcp-hero fcp-hero--input fade-in">
        <div className="fcp-hero-top">
          <span className="fcp-hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Motore di targeting AI
          </span>
        </div>
        <h1 className="fcp-hero-title">Trova i tuoi clienti</h1>
        <p className="fcp-hero-sub">
          Descrivi il tuo target. L&apos;AI genera categorie di prospect, segnali da cercare, messaggi pronti e una strategia di contatto completa.
        </p>
        <div className="fcp-hero-features">
          <span className="fcp-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            3 categorie target
          </span>
          <span className="fcp-hero-sep" />
          <span className="fcp-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            5 messaggi pronti
          </span>
          <span className="fcp-hero-sep" />
          <span className="fcp-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            5 azioni checklist
          </span>
        </div>
      </div>

      {/* ── Form card ── */}
      <section className="fcp-section fade-in-delay">
        <div className="fcp-section-head">
          <span className="fcp-section-num">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <div>
            <h2 className="fcp-section-title">Definisci il target</h2>
            <p className="fcp-section-sub">Più dettagli dai, più precise saranno le categorie e i messaggi generati dall&apos;AI.</p>
          </div>
        </div>

        {prefilled && onboarding && (
          <div className="fcp-prefill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Alcuni campi precompilati dal tuo profilo.
          </div>
        )}

        {/* Mode toggle */}
        <div className="oggi-msg-tabs" style={{ marginBottom: "1.25rem" }}>
          <button type="button" className={`oggi-msg-tab ${searchMode === "manual" ? "oggi-msg-tab--active" : ""}`} onClick={() => setSearchMode("manual")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            {" "}Descrivi il target
          </button>
          <button type="button" className={`oggi-msg-tab ${searchMode === "profile" ? "oggi-msg-tab--active" : ""}`} onClick={() => setSearchMode("profile")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {" "}Da un profilo LinkedIn
          </button>
        </div>

        <div className="fcp-form">
          {searchMode === "profile" ? (
            <>
              <div className="qa-field">
                <label className="qa-label">Link profilo LinkedIn <span className="fc-required">*</span></label>
                <input type="url" value={linkedinProfileUrl} onChange={(e) => setLinkedinProfileUrl(e.target.value)} className="qa-input"
                  placeholder="https://linkedin.com/in/nomecognome" />
                <p className="qa-field-hint">Incolla il link di un profilo e troveremo categorie di persone simili da contattare.</p>
              </div>
              <div className="qa-field">
                <label className="qa-label">PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
                <label className="qa-file-upload">
                  <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                  <span className="qa-file-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {pdfFile ? pdfFile.name : "Carica PDF profilo"}
                  </span>
                </label>
              </div>
              <div className="qa-field">
                <label className="qa-label">Contesto aggiuntivo <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={problemaCliente} onChange={(e) => setProblemaCliente(e.target.value)} className="qa-input" rows={2}
                  placeholder="Es: Cerco profili simili ma nel mercato italiano" />
              </div>
            </>
          ) : (
            <>
              <div className="qa-field">
                <label className="qa-label">Chi vuoi contattare <span className="fc-required">*</span></label>
                <textarea
                  value={ruoloTarget}
                  onChange={(e) => setRuoloTarget(e.target.value)}
                  className="qa-input qa-input-lg"
                  rows={2}
                  placeholder="Founder SaaS B2B che stanno assumendo, CEO agenzia marketing in crescita"
                />
              </div>

              <div className="qa-field">
                <label className="qa-label">Settore <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={settore} onChange={(e) => setSettore(e.target.value)} className="qa-input" placeholder="Software, consulenza, marketing, fintech" />
              </div>

              <div className="fcp-form-row">
                <div className="qa-field" style={{ flex: 1 }}>
                  <label className="qa-label">Area geografica <span className="qa-label-opt">(facoltativo)</span></label>
                  <input type="text" value={area} onChange={(e) => setArea(e.target.value)} className="qa-input" placeholder="Italia, Europa, DACH" />
                </div>
                <div className="qa-field" style={{ flex: 1 }}>
                  <label className="qa-label">Città <span className="qa-label-opt">(facoltativo)</span></label>
                  <input type="text" value={citta} onChange={(e) => setCitta(e.target.value)} className="qa-input" placeholder="Milano, Roma, Berlino" />
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Dimensione azienda</label>
                <div className="fcp-pills">
                  {DIMENSIONE_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" className={`fcp-pill ${dimensione === opt.value ? "fcp-pill--active" : ""}`} onClick={() => setDimensione(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Fase azienda</label>
                <div className="fcp-pills">
                  {FASE_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" className={`fcp-pill ${faseAzienda === opt.value ? "fcp-pill--active" : ""}`} onClick={() => setFaseAzienda(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Problema che risolvi per loro <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={problemaCliente} onChange={(e) => setProblemaCliente(e.target.value)} className="qa-input" rows={2} placeholder="Non riescono a generare pipeline su LinkedIn, il team sales non ha un processo outbound" />
              </div>
            </>
          )}

          {error && (
            <div className="fcp-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <button onClick={generate} disabled={loading || (searchMode === "manual" ? !ruoloTarget.trim() : !linkedinProfileUrl.trim())} className="fcp-launch-btn">
            {loading ? (
              <><span className="qa-spinner" aria-hidden="true" />Analizzo il target…</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" /></svg>
                Identifica chi contattare
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── Loading state ── */}
      {loading && (
        <section className="fcp-loading fade-in-delay">
          <div className="oggi-loading-orb">
            <div className="oggi-orb-ring oggi-orb-ring-1" />
            <div className="oggi-orb-ring oggi-orb-ring-2" />
            <div className="oggi-orb-ring oggi-orb-ring-3" />
            <div className="oggi-orb-core">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>
          <h3 className="fcp-loading-title">Analizzo il tuo mercato</h3>
          <div className="oggi-loading-steps">
            <span className="oggi-loading-step oggi-loading-step--active">Analizzo target</span>
            <span className="oggi-loading-step">Creo categorie</span>
            <span className="oggi-loading-step">Genero messaggi</span>
            <span className="oggi-loading-step">Preparo strategia</span>
          </div>
        </section>
      )}

      {/* ── Callout onboarding ── */}
      {!profile.onboarding_complete && (
        <section className="fcp-section fcp-callout-section fade-in-delay">
          <div className="fcp-callout">
            <div className="fcp-callout-icon"><IconLightbulb size={20} /></div>
            <div>
              <p className="fcp-callout-text">Configura il tuo sistema per risultati più precisi e personalizzati.</p>
              <Link href="/app/onboarding" className="fcp-callout-link">Configura il sistema →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Demo preview (what you'll get) ── */}
      {!loading && (
        <section className="fcp-section fade-in-delay">
          <div className="fcp-section-head">
            <span className="fcp-section-num fcp-section-num--demo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <div>
              <h2 className="fcp-section-title">Anteprima risultato</h2>
              <p className="fcp-section-sub">Ecco un esempio realistico di cosa genererà l&apos;AI per te.</p>
            </div>
          </div>
          <div className="fcp-demo-cards">
            {DEMO_CATEGORIES.map((cat, i) => (
              <ProspectCategoryCard key={i} category={cat} index={i} demo />
            ))}
          </div>
        </section>
      )}

      {/* ── Tools nav (same pattern as oggi) ── */}
      <section className="sys-quick-actions fade-in-delay">
        <h2 className="sys-quick-title">Altri strumenti</h2>
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
