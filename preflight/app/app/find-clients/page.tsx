"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
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

export default function FindClientsPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const onboarding = profile.onboarding as Record<string, unknown> | null;

  const [ruoloTarget, setRuoloTarget] = useState("");
  const [settore, setSettore] = useState("");
  const [area, setArea] = useState("");
  const [citta, setCitta] = useState("");
  const [dimensione, setDimensione] = useState("");
  const [faseAzienda, setFaseAzienda] = useState("");
  const [problemaCliente, setProblemaCliente] = useState("");
  const [output, setOutput] = useState<FindClientsJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);

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
    if (!ruoloTarget.trim() || loading) return;
    setLoading(true);
    setError(null);
    setCheckedItems([false, false, false, false, false]);
    try {
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruolo_target: ruoloTarget.trim(),
          settore: settore.trim() || undefined,
          area_geografica: area.trim() || undefined,
          citta: citta.trim() || undefined,
          dimensione: dimensione || undefined,
          fase_azienda: faseAzienda || undefined,
          problema_cliente: problemaCliente.trim() || undefined,
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
      saveTargetingResult(userId, parsed.data);
      repo.interaction.addInteraction(userId, "prospect", `Targeting: ${ruoloTarget}`, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  const completedCount = checkedItems.filter(Boolean).length;

  function resetSearch() {
    setOutput(null);
    setError(null);
    setCheckedItems([false, false, false, false, false]);
  }

  /* ── FULLSCREEN RESULTS VIEW ── */
  if (output) {
    return (
      <div className="fc-fullscreen">
        {/* Top bar */}
        <div className="pr-topbar">
          <button onClick={resetSearch} className="pr-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Nuova ricerca
          </button>
          <div className="pr-topbar-url">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Target: {ruoloTarget}
          </div>
          <div className="pr-topbar-actions">
            <Link href="/app/prospect" className="pr-topbar-link">Analizza profilo</Link>
            <Link href="/app/dm" className="pr-topbar-link">Scrivi DM</Link>
            <Link href="/app/oggi" className="pr-topbar-link">Piano oggi</Link>
          </div>
        </div>

        <div className="fc-results">
          {/* RIEPILOGO STRATEGIA */}
          <div className="fc-summary-card" style={{ marginBottom: '2.5rem' }}>
            <div className="fc-summary-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h3 className="fc-summary-title">Riepilogo strategia</h3>
              <p className="fc-summary-text">{output.riepilogo_strategia}</p>
            </div>
          </div>

          {/* Grid a 2 colonne per le sezioni principali */}
          <div className="fc-results-grid">
            {/* SEZIONE 1 — CATEGORIA PRIORITARIA */}
            <div className="fc-result-section fc-result-highlight">
              <div className="fc-result-badge">1</div>
              <div className="fc-result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <h3 className="fc-result-title">Da chi partire oggi</h3>
              </div>
              <h4 className="fc-cat-title">{output.categoria_prioritaria.titolo}</h4>
              <p className="fc-result-text">{output.categoria_prioritaria.descrizione}</p>
              <div className="fc-cat-why">
                <span className="fc-cat-why-label">Perché ora</span>
                <p className="fc-result-text">{output.categoria_prioritaria.perche_ora}</p>
              </div>
              <div className="fc-signals">
                <span className="fc-signals-label">Segnali da cercare nel profilo</span>
                <p className="fc-signals-text">{output.categoria_prioritaria.segnali_profilo}</p>
              </div>
              <a href={output.categoria_prioritaria.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="fc-linkedin-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Apri la lista su LinkedIn
              </a>
              <div className="fc-msg-group">
                <div className="fc-msg-item">
                  <div className="fc-msg-header">
                    <span className="fc-msg-label">Nota di connessione</span>
                    <CopyButton text={output.categoria_prioritaria.messaggio_connessione} />
                  </div>
                  <div className="fc-msg-box">{output.categoria_prioritaria.messaggio_connessione}</div>
                </div>
                <div className="fc-msg-item">
                  <div className="fc-msg-header">
                    <span className="fc-msg-label fc-msg-label-green">Primo DM dopo accettazione</span>
                    <CopyButton text={output.categoria_prioritaria.messaggio_dopo_accettazione} />
                  </div>
                  <div className="fc-msg-box fc-msg-box-green">{output.categoria_prioritaria.messaggio_dopo_accettazione}</div>
                </div>
              </div>
            </div>

            {/* SEZIONE 5 — STRATEGIA + MESSAGGI FOLLOW-UP */}
            <div className="fc-result-section fc-result-message">
              <div className="fc-result-badge fc-badge-msg">5</div>
              <div className="fc-result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <h3 className="fc-result-title">Strategia di contatto + messaggi pronti</h3>
              </div>
              <div className="fc-strategy-approach">
                <span className="fc-strategy-label">Sequenza consigliata</span>
                <p className="fc-result-text fc-result-text-strategy">{output.strategia_contatto.approccio_step}</p>
              </div>
              <div className="fc-msg-group">
                <div className="fc-msg-item">
                  <div className="fc-msg-header">
                    <span className="fc-msg-label">Primo messaggio</span>
                    <CopyButton text={output.strategia_contatto.primo_messaggio} />
                  </div>
                  <div className="fc-msg-box">{output.strategia_contatto.primo_messaggio}</div>
                </div>
                <div className="fc-msg-item">
                  <div className="fc-msg-header">
                    <span className="fc-msg-label">Follow-up 48h</span>
                    <CopyButton text={output.strategia_contatto.followup_48h} />
                  </div>
                  <div className="fc-msg-box">{output.strategia_contatto.followup_48h}</div>
                </div>
                <div className="fc-msg-item">
                  <div className="fc-msg-header">
                    <span className="fc-msg-label">Follow-up 5 giorni</span>
                    <CopyButton text={output.strategia_contatto.followup_5g} />
                  </div>
                  <div className="fc-msg-box">{output.strategia_contatto.followup_5g}</div>
                </div>
              </div>
            </div>

            {/* SEZIONE 2 — CATEGORIE ALTERNATIVE */}
            <div className="fc-result-section">
              <div className="fc-result-badge">2</div>
              <div className="fc-result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3 className="fc-result-title">Altre categorie utili</h3>
              </div>
              <div className="fc-alt-cats">
                {output.categorie_alternative.map((cat, i) => (
                  <div key={i} className="fc-alt-cat">
                    <h4 className="fc-alt-cat-title">{cat.titolo}</h4>
                    <p className="fc-alt-cat-desc">{cat.descrizione}</p>
                    <p className="fc-alt-cat-why">{cat.perche_ora}</p>
                    <div className="fc-alt-cat-signals">
                      <span className="fc-signals-label">Segnali</span>
                      <p className="fc-signals-text">{cat.segnali_profilo}</p>
                    </div>
                    <div className="fc-alt-cat-actions">
                      <a href={cat.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="fc-linkedin-btn-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Lista LinkedIn
                      </a>
                      <CopyButton text={cat.messaggio_connessione} />
                    </div>
                    <div className="fc-alt-cat-msg">
                      <span className="fc-msg-label">Nota connessione:</span>
                      <span className="fc-alt-cat-msg-text">{cat.messaggio_connessione}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEZIONE 4 — CRITERI DI SELEZIONE */}
            <div className="fc-result-section">
              <div className="fc-result-badge">4</div>
              <div className="fc-result-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <h3 className="fc-result-title">Come scegliere i profili migliori</h3>
              </div>
              <div className="fc-criteria-grid">
                <div className="fc-criteria-item fc-criteria-good">
                  <span className="fc-criteria-label">Segnali positivi</span>
                  <p className="fc-criteria-text">{output.criteri_selezione.segnali_positivi}</p>
                </div>
                <div className="fc-criteria-item fc-criteria-warn">
                  <span className="fc-criteria-label fc-criteria-label-warn">Red flags — chi evitare</span>
                  <p className="fc-criteria-text">{output.criteri_selezione.red_flags}</p>
                </div>
                <div className="fc-criteria-item">
                  <span className="fc-criteria-label">Attività recente</span>
                  <p className="fc-criteria-text">{output.criteri_selezione.attivita_recente}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEZIONE 3 — CHECKLIST (full width) */}
          <div className="fc-result-section fc-result-checklist">
            <div className="fc-result-badge fc-badge-action">3</div>
            <div className="fc-result-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3 className="fc-result-title">Checklist — le 5 azioni da fare adesso</h3>
              <span className="fc-check-count">{completedCount}/5</span>
            </div>
            <div className="fc-check-progress">
              <div className="fc-check-progress-bar" style={{ width: `${(completedCount / 5) * 100}%` }} />
            </div>
            <div className="fc-checklist">
              {output.checklist_azioni.map((azione, i) => (
                <button key={i} type="button" className={`fc-check-item${checkedItems[i] ? " fc-check-done" : ""}`} onClick={() => toggleCheck(i)}>
                  <span className="fc-check-box">
                    {checkedItems[i] && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </span>
                  <span className="fc-check-text">{azione}</span>
                </button>
              ))}
            </div>
            {completedCount === 5 && (
              <div className="fc-check-complete">Tutte le azioni completate! Vai al passo successivo.</div>
            )}
          </div>

          {/* SEZIONE 6 — PROSSIMO STEP */}
          <div className="fc-result-section fc-result-next">
            <div className="fc-result-badge fc-badge-next">→</div>
            <div className="fc-result-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              <h3 className="fc-result-title">Prossimo step</h3>
            </div>
            <p className="fc-result-text">{output.prossimo_step}</p>
            <div className="fc-next-actions">
              <Link href="/app/prospect" className="fc-action-btn fc-action-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Analizza un profilo
              </Link>
              <Link href="/app/dm" className="fc-action-btn fc-action-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Scrivi un DM
              </Link>
              <Link href="/app/oggi" className="fc-action-btn fc-action-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Piano di oggi
              </Link>
              <Link href="/app/pipeline" className="fc-action-btn fc-action-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Pipeline
              </Link>
            </div>
          </div>
        </div>

        <HistoryList userId={userId} type="prospect" />
      </div>
    );
  }

  /* ── INPUT VIEW (no results yet) ── */
  return (
    <div className="find-clients-page fade-in">
      <div className="find-clients-hero fade-in">
        {/* ── HERO ── */}
        <div className="fc-hero">
          <div className="fc-hero-glow" />
          <span className="fc-hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Motore di selezione prospect
          </span>
          <h1 className="fc-hero-title">Chi contattare</h1>
          <p className="fc-hero-subtitle">
            Categorie e opportunità basate sul tuo posizionamento. Decidi chi contattare, capisci perché, sai come iniziare.
          </p>
          <div className="fc-hero-stats">
            <div className="fc-hero-stat">
              <span className="fc-hero-stat-value">3</span>
              <span className="fc-hero-stat-label">Categorie target</span>
            </div>
            <div className="fc-hero-stat">
              <span className="fc-hero-stat-value">5</span>
              <span className="fc-hero-stat-label">Messaggi pronti</span>
            </div>
            <div className="fc-hero-stat">
              <span className="fc-hero-stat-value">5</span>
              <span className="fc-hero-stat-label">Azioni checklist</span>
            </div>
          </div>
        </div>
      </div>

      <div className="find-clients-form-card fade-in-delay">
        {/* ── TWO COLUMN: INPUT | OUTPUT ── */}
        <div className="fc-layout">
          {/* INPUT PANEL */}
          <div className="fc-input-panel">
            <div className="fc-input-card">
              <div className="fc-input-header">
                <div className="fc-input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                </div>
                <div>
                  <h2 className="fc-input-title">Definisci il target</h2>
                  <p className="fc-input-sub">Più dettagli dai, più precise saranno le categorie e i messaggi.</p>
                </div>
              </div>

              {prefilled && onboarding && (
                <div className="fc-prefill-notice">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Alcuni campi precompilati dal tuo sistema.
                </div>
              )}

              <div className="fc-form">
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

                <div className="find-section-row">
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
                  <div className="fc-pills">
                    {DIMENSIONE_OPTIONS.map((opt) => (
                      <button key={opt.value} type="button" className={`fc-pill${dimensione === opt.value ? " fc-pill-active" : ""}`} onClick={() => setDimensione(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qa-field">
                  <label className="qa-label">Fase azienda</label>
                  <div className="fc-pills">
                    {FASE_OPTIONS.map((opt) => (
                      <button key={opt.value} type="button" className={`fc-pill${faseAzienda === opt.value ? " fc-pill-active" : ""}`} onClick={() => setFaseAzienda(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qa-field">
                  <label className="qa-label">Problema che risolvi per loro <span className="qa-label-opt">(facoltativo)</span></label>
                  <textarea value={problemaCliente} onChange={(e) => setProblemaCliente(e.target.value)} className="qa-input" rows={2} placeholder="Non riescono a generare pipeline su LinkedIn, il team sales non ha un processo outbound" />
                </div>

                <button onClick={generate} disabled={loading || !ruoloTarget.trim()} className="fc-generate-btn">
                  {loading ? (
                    <><span className="qa-spinner" aria-hidden="true" />Sto analizzando il target…</>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Identifica chi contattare
                    </>
                  )}
                </button>
              </div>
            </div>

            {!profile.onboarding_complete && (
              <div className="fc-callout">
                <div className="fc-callout-icon"><IconLightbulb size={20} /></div>
                <div>
                  <p className="fc-callout-text">Configura il tuo sistema per risultati più precisi.</p>
                  <Link href="/app/onboarding" className="fc-callout-link">Configura il sistema →</Link>
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="fc-quick-links">
              <span className="fc-quick-links-label">Dopo la ricerca:</span>
              <Link href="/app/prospect" className="fc-quick-link">Analizza un profilo</Link>
              <Link href="/app/dm" className="fc-quick-link">Scrivi un DM</Link>
              <Link href="/app/oggi" className="fc-quick-link">Piano di oggi</Link>
            </div>
          </div>

          {/* OUTPUT PANEL — empty state with demo data */}
          <div className="fc-output-panel">
            {error ? (
              <div className="callout-danger rounded-xl p-5">
                <p className="font-semibold mb-1">Errore</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div className="fc-demo-state">
                <div className="fc-demo-header">
                  <span className="fc-demo-badge">Esempio</span>
                  <h3 className="fc-demo-title">Ecco cosa otterrai</h3>
                  <p className="fc-demo-sub">Questi sono esempi realistici. Compila il form per generare categorie basate sul tuo posizionamento.</p>
                </div>
                <div className="fc-demo-cards">
                  {DEMO_CATEGORIES.map((cat, i) => (
                    <ProspectCategoryCard key={i} category={cat} index={i} demo />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <HistoryList userId={userId} type="prospect" />
      </div>
    </div>
  );
}
