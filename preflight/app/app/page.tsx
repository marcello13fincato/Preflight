"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { Lead } from "@/lib/sales/schemas";

const MODAL_DISMISSED_KEY = "onboarding-modal-dismissed";

/* ─── Status badge colour mapping ─── */
const statusColors: Record<string, { bg: string; fg: string }> = {
  Nuovo:               { bg: "var(--color-soft)",       fg: "var(--color-primary)" },
  "In conversazione":  { bg: "#FEF3C7",                fg: "#92400E" },
  Interessato:         { bg: "#D1FAE5",                 fg: "#065F46" },
  "Call proposta":     { bg: "#DBEAFE",                 fg: "#1E40AF" },
  "Call fissata":      { bg: "#E0E7FF",                 fg: "#3730A3" },
  Cliente:             { bg: "var(--color-success-bg)", fg: "var(--color-success)" },
  "Da ricontattare":   { bg: "var(--color-warning-bg)", fg: "var(--color-warning)" },
};

/* ─── AI suggestion stubs per status ─── */
function aiSuggestion(lead: Lead): string {
  switch (lead.status) {
    case "Nuovo":
      return "Potresti iniziare con un commento a un suo post recente per rompere il ghiaccio.";
    case "In conversazione":
      return "Potresti chiedere se stanno già affrontando questo problema.";
    case "Interessato":
      return "Il momento è buono: proponi una call conoscitiva breve (15 min).";
    case "Call proposta":
      return "Manda un follow-up gentile per confermare data e ora della call.";
    case "Call fissata":
      return "Preparati alla call: rivedi le note e i punti chiave del prospect.";
    case "Cliente":
      return "Ottimo! Chiedi un feedback e valuta un caso studio da condividere.";
    default:
      return "Riprendi la conversazione con un messaggio personalizzato.";
  }
}

export default function AppTodayPage() {
  const { data: session } = useSession();
  const [dashMode, setDashMode] = useState<null | "profile" | "advice" | "find">(null);
  // Find clients state
  const [findTipoCliente, setFindTipoCliente] = useState("");
  const [findSettore, setFindSettore] = useState("");
  const [findDimensione, setFindDimensione] = useState("");
  const [findArea, setFindArea] = useState("");
  const [findResult, setFindResult] = useState<{
    tipo_cliente_ideale: string; come_cercarlo: string;
    link_ricerca_linkedin: string; suggerimenti_filtri: string;
    profili_simili: string; cosa_fare_dopo: string;
  } | null>(null);
  const [findLoading, setFindLoading] = useState(false);
  // Profile analysis state
  const [quickLinkedinUrl, setQuickLinkedinUrl] = useState("");
  const [quickPdfFile, setQuickPdfFile] = useState<File | null>(null);
  const [quickShowGuide, setQuickShowGuide] = useState(false);
  const [quickProfileReason, setQuickProfileReason] = useState("");
  const [quickProfileResult, setQuickProfileResult] = useState<{
    chi_e: string; potenziale: string; perche_parlarle: string;
    strategia_contatto: string; primo_messaggio: string; step_successivi: string;
    primo_followup: string; secondo_followup: string;
    segnali_positivi: string; segnali_deboli: string; promemoria: string;
  } | null>(null);
  const [quickProfileLoading, setQuickProfileLoading] = useState(false);
  // Advice state
  const [quickSituation, setQuickSituation] = useState("");
  const [quickSituationType, setQuickSituationType] = useState("");
  const [quickPersonProfile, setQuickPersonProfile] = useState("");
  const [quickAdviceResult, setQuickAdviceResult] = useState<{
    lettura_situazione: string; cosa_fare: string;
    risposta_consigliata: string; step_successivi: string;
    followup_consigliato: string; errori_da_evitare: string;
  } | null>(null);
  const [quickAdviceLoading, setQuickAdviceLoading] = useState(false);
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const allLeads = repo.lead.listLeads(userId);

  /* Conversations to manage: non-client leads, most recent first */
  const conversationsToManage = allLeads
    .filter((l) => l.status !== "Cliente")
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 6);

  // Onboarding modal state
  const [modalDismissed, setModalDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(MODAL_DISMISSED_KEY) === "1";
    }
    return false;
  });
  const [modalClosedTemporarily, setModalClosedTemporarily] = useState(false);
  const modalOpen = !profile.onboarding_complete && !modalDismissed && !modalClosedTemporarily;

  function dismissModal() {
    sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
    setModalDismissed(true);
  }

  async function handleDashProfile() {
    if (!quickLinkedinUrl.trim()) return;
    if (quickProfileLoading) return;
    setQuickProfileLoading(true);
    setQuickProfileResult(null);
    try {
      let pdfText = "";
      if (quickPdfFile) {
        pdfText = `[PDF caricato: ${quickPdfFile.name}]`;
      }
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analizza questo profilo LinkedIn: ${quickLinkedinUrl}${quickProfileReason ? `\n\nMotivo del contatto: ${quickProfileReason}` : ""}`,
          advice: true,
          assistantMode: "profile",
          profile: profile.onboarding || undefined,
          linkedinUrl: quickLinkedinUrl.trim(),
          profileInfo: pdfText || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      if (data.structured) {
        setQuickProfileResult(data.structured);
      }
    } catch {
      setQuickProfileResult({
        chi_e: "Si è verificato un errore. Riprova più tardi.",
        potenziale: "", perche_parlarle: "",
        strategia_contatto: "", primo_messaggio: "", step_successivi: "",
        primo_followup: "", secondo_followup: "",
        segnali_positivi: "", segnali_deboli: "", promemoria: "",
      });
    } finally {
      setQuickProfileLoading(false);
    }
  }

  async function handleDashAdvice() {
    if (!quickSituation.trim()) return;
    if (quickAdviceLoading) return;
    setQuickAdviceLoading(true);
    setQuickAdviceResult(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: quickSituation,
          advice: true,
          assistantMode: "advice",
          profile: profile.onboarding || undefined,
          interactionType: quickSituationType || undefined,
          profileInfo: quickPersonProfile || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      if (data.structured) {
        setQuickAdviceResult(data.structured);
      }
    } catch {
      setQuickAdviceResult({
        lettura_situazione: "Si è verificato un errore. Riprova più tardi.",
        cosa_fare: "", risposta_consigliata: "", step_successivi: "",
        followup_consigliato: "", errori_da_evitare: "",
      });
    } finally {
      setQuickAdviceLoading(false);
    }
  }

  async function handleFindClients() {
    if (!findTipoCliente.trim()) return;
    if (findLoading) return;
    setFindLoading(true);
    setFindResult(null);
    try {
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_cliente: findTipoCliente,
          settore: findSettore || undefined,
          dimensione: findDimensione || undefined,
          area_geografica: findArea || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      setFindResult(data);
    } catch {
      setFindResult({
        tipo_cliente_ideale: "Si è verificato un errore. Riprova più tardi.",
        come_cercarlo: "", link_ricerca_linkedin: "",
        suggerimenti_filtri: "", profili_simili: "", cosa_fare_dopo: "",
      });
    } finally {
      setFindLoading(false);
    }
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          ONBOARDING MODAL
      ══════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal">
            <div className="dash-modal-icon">⚙️</div>
            <h2 className="dash-modal-title">Configura il tuo sistema clienti</h2>
            <p className="dash-modal-desc">
              Preflight funziona meglio quando conosce il tuo lavoro.<br />
              Ti bastano pochi passaggi per personalizzare l&apos;AI.
            </p>

            <div className="dash-modal-actions">
              <Link
                href="/app/onboarding"
                className="dash-btn-primary dash-btn-full"
                onClick={() => setModalClosedTemporarily(true)}
              >
                Configura ora
                <span className="dash-btn-arrow">→</span>
              </Link>
              <button onClick={dismissModal} className="dash-btn-secondary dash-btn-full">
                Lo farò dopo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dash-page">

        {/* ══════════════════════════════════════════════════════
            PAGE HEADING
        ══════════════════════════════════════════════════════ */}
        <div className="dash-hero">
          <h2 className="dash-hero-title">Cosa vuoi fare oggi?</h2>
          <p className="dash-hero-sub">Preflight ti aiuta a capire chi contattare, cosa scrivere e quali step seguire per arrivare a una call.</p>
        </div>

        {/* ══════════════════════════════════════════════════════
            DUE AZIONI PRINCIPALI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <div className="dash-start-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="dash-start-card">
              <div className="dash-start-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h4 className="dash-start-card-title">Analizza questo profilo</h4>
              <p className="dash-start-card-desc">Incolla il link di un profilo LinkedIn. L&apos;AI ti dirà chi è, se ha senso contattarla, cosa scriverle e quali step seguire.</p>
              <button type="button" onClick={() => setDashMode("profile")} className="dash-btn-primary dash-btn-full">
                Analizza profilo
                <span className="dash-btn-arrow">→</span>
              </button>
            </div>
            <div className="dash-start-card">
              <div className="dash-start-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h4 className="dash-start-card-title">Chiedimi un consiglio</h4>
              <p className="dash-start-card-desc">Descrivi una situazione reale — un commento ricevuto, un messaggio, un follow-up — e scopri come muoverti.</p>
              <button type="button" onClick={() => setDashMode("advice")} className="dash-btn-primary dash-btn-full">
                Chiedi un consiglio
                <span className="dash-btn-arrow">→</span>
              </button>
            </div>
            <div className="dash-start-card">
              <div className="dash-start-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h4 className="dash-start-card-title">Trova clienti su LinkedIn</h4>
              <p className="dash-start-card-desc">Descrivi il tipo di cliente che vuoi trovare e Preflight ti aiuta a creare la ricerca LinkedIn giusta.</p>
              <button type="button" onClick={() => setDashMode("find")} className="dash-btn-primary dash-btn-full">
                Trova clienti
                <span className="dash-btn-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── MODALITÀ PROFILO ── */}
        {dashMode === "profile" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setQuickProfileResult(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna alle opzioni
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Analizza questo profilo</h4>
                <p className="qa-section-sub">Scopri se vale la pena contattare questa persona e come muoverti per iniziare la conversazione.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Link al profilo LinkedIn</label>
                <input type="url" value={quickLinkedinUrl} onChange={(e) => setQuickLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
                <p className="qa-microcopy">Se vuoi un&apos;analisi più precisa, puoi caricare anche il PDF del profilo.</p>
                <label className="qa-file-upload">
                  <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setQuickPdfFile(e.target.files?.[0] || null)} />
                  <span className="qa-file-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {quickPdfFile ? quickPdfFile.name : "Scegli un file PDF"}
                  </span>
                </label>
              </div>

              <button type="button" className="qa-guide-toggle" onClick={() => setQuickShowGuide(!quickShowGuide)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Come scaricare il PDF del profilo LinkedIn
              </button>

              {quickShowGuide && (
                <div className="qa-guide">
                  <ol className="qa-guide-steps">
                    <li>Vai sul profilo LinkedIn della persona</li>
                    <li>Clicca sui tre puntini accanto alla foto del profilo</li>
                    <li>Seleziona &quot;Salva come PDF&quot;</li>
                    <li>Carica il file qui</li>
                  </ol>
                </div>
              )}

              <div className="qa-field">
                <label className="qa-label">Perché vorresti contattare questa persona? <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={quickProfileReason} onChange={(e) => setQuickProfileReason(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Credo che questa persona possa essere interessata a migliorare LinkedIn come canale per trovare clienti." />
              </div>

              <button onClick={handleDashProfile} disabled={quickProfileLoading || !quickLinkedinUrl.trim()} className="qa-btn">
                {quickProfileLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto analizzando…</>) : (<>Analizza profilo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {quickProfileResult && (
                <div className="qa-result">
                  {quickProfileResult.chi_e && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Chi è questa persona</div><p className="qa-result-text">{quickProfileResult.chi_e}</p></div>
                  )}
                  {quickProfileResult.potenziale && (
                    <div className="qa-result-block qa-result-valutazione"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Ha senso contattarla?</div><p className="qa-result-text">{quickProfileResult.potenziale}</p></div>
                  )}
                  {quickProfileResult.perche_parlarle && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg> Perché potrebbe avere senso parlarle</div><p className="qa-result-text">{quickProfileResult.perche_parlarle}</p></div>
                  )}
                  {quickProfileResult.strategia_contatto && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Strategia di contatto consigliata</div><p className="qa-result-text">{quickProfileResult.strategia_contatto}</p></div>
                  )}
                  {quickProfileResult.primo_messaggio && (
                    <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Primo messaggio consigliato</div><p className="qa-result-text">{quickProfileResult.primo_messaggio}</p></div>
                  )}
                  {quickProfileResult.step_successivi && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg> Step successivi</div><p className="qa-result-text">{quickProfileResult.step_successivi}</p></div>
                  )}
                  {quickProfileResult.primo_followup && (
                    <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Primo follow-up consigliato</div><p className="qa-result-text">{quickProfileResult.primo_followup}</p></div>
                  )}
                  {quickProfileResult.secondo_followup && (
                    <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Secondo follow-up</div><p className="qa-result-text">{quickProfileResult.secondo_followup}</p></div>
                  )}
                  {quickProfileResult.segnali_positivi && (
                    <div className="qa-result-block qa-result-valutazione"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><path d="M18.8 10H5.2A2.2 2.2 0 0 0 3 12.2v7.6A2.2 2.2 0 0 0 5.2 22h13.6a2.2 2.2 0 0 0 2.2-2.2v-7.6A2.2 2.2 0 0 0 18.8 10z"/></svg> Segnali positivi</div><p className="qa-result-text">{quickProfileResult.segnali_positivi}</p></div>
                  )}
                  {quickProfileResult.segnali_deboli && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Segnali deboli o rischi</div><p className="qa-result-text">{quickProfileResult.segnali_deboli}</p></div>
                  )}
                  {quickProfileResult.promemoria && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Promemoria (tra 7 giorni)</div><p className="qa-result-text">{quickProfileResult.promemoria}</p></div>
                  )}
                </div>
              )}

              {quickProfileResult && !profile.onboarding_complete && (
                <div className="qa-callout">
                  <p className="qa-callout-text">💡 Questa analisi può essere ancora più precisa se configuri il tuo sistema.</p>
                  <Link href="/app/onboarding" className="qa-callout-link">Configura il tuo sistema →</Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── MODALITÀ CONSIGLIO ── */}
        {dashMode === "advice" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setQuickAdviceResult(null); setQuickSituationType(""); setQuickPersonProfile(""); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna alle opzioni
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Chiedimi un consiglio</h4>
                <p className="qa-section-sub">Descrivi una situazione reale su LinkedIn e scopri come conviene muoverti.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Tipo di situazione</label>
                <div className="qa-chip-group">
                  {["Commento ricevuto", "Messaggio ricevuto", "Messaggio inviato", "Prima interazione", "Follow-up", "Altro"].map((t) => (
                    <button key={t} type="button" className={`qa-chip${quickSituationType === t ? " qa-chip-active" : ""}`} onClick={() => setQuickSituationType(quickSituationType === t ? "" : t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Spiegami la situazione</label>
                <textarea value={quickSituation} onChange={(e) => setQuickSituation(e.target.value)} className="qa-input qa-input-lg" rows={6} placeholder={"Ho pubblicato un post su LinkedIn.\nUna persona ha commentato dicendo che anche loro hanno questo problema.\nNon ci siamo mai scritti prima.\nCome mi conviene rispondere per continuare la conversazione?"} />
              </div>

              <div className="qa-field">
                <label className="qa-label">Profilo della persona coinvolta <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={quickPersonProfile} onChange={(e) => setQuickPersonProfile(e.target.value)} className="qa-input" rows={2} placeholder="Es: CEO di un'agenzia di marketing, 5000 follower, pubblica regolarmente su LinkedIn" />
              </div>

              <div className="qa-examples">
                <p className="qa-examples-title">Esempi — clicca per usare:</p>
                <div className="qa-examples-chips">
                  {[
                    "Qualcuno ha commentato un mio post e sembra interessato al tema",
                    "Ho ricevuto un messaggio su LinkedIn da una persona che non conosco",
                    "Ho scritto un messaggio 5 giorni fa e non ho ricevuto risposta",
                    "Voglio capire se è il momento giusto per proporre una call",
                  ].map((ex) => (
                    <button key={ex} type="button" className="qa-example-btn" onClick={() => setQuickSituation(ex)}>{ex}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleDashAdvice} disabled={quickAdviceLoading || !quickSituation.trim()} className="qa-btn">
                {quickAdviceLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto analizzando…</>) : (<>Chiedi un consiglio <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {quickAdviceResult && (
                <div className="qa-result">
                  {quickAdviceResult.lettura_situazione && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> Lettura della situazione</div><p className="qa-result-text">{quickAdviceResult.lettura_situazione}</p></div>
                  )}
                  {quickAdviceResult.cosa_fare && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Cosa conviene fare adesso</div><p className="qa-result-text">{quickAdviceResult.cosa_fare}</p></div>
                  )}
                  {quickAdviceResult.risposta_consigliata && (
                    <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Risposta consigliata</div><p className="qa-result-text">{quickAdviceResult.risposta_consigliata}</p></div>
                  )}
                  {quickAdviceResult.step_successivi && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg> Step successivi</div><p className="qa-result-text">{quickAdviceResult.step_successivi}</p></div>
                  )}
                  {quickAdviceResult.followup_consigliato && (
                    <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Follow-up consigliato</div><p className="qa-result-text">{quickAdviceResult.followup_consigliato}</p></div>
                  )}
                  {quickAdviceResult.errori_da_evitare && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Errori da evitare</div><p className="qa-result-text">{quickAdviceResult.errori_da_evitare}</p></div>
                  )}
                </div>
              )}

              {quickAdviceResult && !profile.onboarding_complete && (
                <div className="qa-callout">
                  <p className="qa-callout-text">💡 Questa analisi può essere ancora più precisa se configuri il tuo sistema.</p>
                  <Link href="/app/onboarding" className="qa-callout-link">Configura il tuo sistema →</Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── MODALITÀ TROVA CLIENTI ── */}
        {dashMode === "find" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setFindResult(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna alle opzioni
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Trova clienti su LinkedIn</h4>
                <p className="qa-section-sub">Descrivi il tipo di cliente che vuoi trovare e Preflight ti aiuta a creare la ricerca LinkedIn giusta.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Che tipo di cliente vuoi trovare?</label>
                <textarea value={findTipoCliente} onChange={(e) => setFindTipoCliente(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Founder di startup SaaS B2B" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Settore <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={findSettore} onChange={(e) => setFindSettore(e.target.value)} className="qa-input" placeholder="Software / SaaS" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Dimensione azienda <span className="qa-label-opt">(facoltativo)</span></label>
                <div className="qa-chip-group">
                  {["freelance", "startup", "PMI", "enterprise"].map((d) => (
                    <button key={d} type="button" className={`qa-chip${findDimensione === d ? " qa-chip-active" : ""}`} onClick={() => setFindDimensione(findDimensione === d ? "" : d)}>{d}</button>
                  ))}
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Area geografica <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={findArea} onChange={(e) => setFindArea(e.target.value)} className="qa-input" placeholder="Italia / Europa / globale" />
              </div>

              <button onClick={handleFindClients} disabled={findLoading || !findTipoCliente.trim()} className="qa-btn">
                {findLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto cercando…</>) : (<>Trova clienti <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {findResult && (
                <div className="qa-result">
                  {findResult.tipo_cliente_ideale && (
                    <div className="qa-result-block qa-result-valutazione"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Tipo di cliente ideale</div><p className="qa-result-text">{findResult.tipo_cliente_ideale}</p></div>
                  )}
                  {findResult.come_cercarlo && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Come cercarlo su LinkedIn</div><p className="qa-result-text">{findResult.come_cercarlo}</p></div>
                  )}
                  {findResult.link_ricerca_linkedin && (
                    <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Link di ricerca LinkedIn</div><p className="qa-result-text"><a href={findResult.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="qa-result-link">{findResult.link_ricerca_linkedin}</a></p></div>
                  )}
                  {findResult.suggerimenti_filtri && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Suggerimenti per filtrare meglio</div><p className="qa-result-text">{findResult.suggerimenti_filtri}</p></div>
                  )}
                  {findResult.profili_simili && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Profili simili da cercare</div><p className="qa-result-text">{findResult.profili_simili}</p></div>
                  )}
                  {findResult.cosa_fare_dopo && (
                    <div className="qa-result-block"><div className="qa-result-label"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg> Cosa fare dopo</div><p className="qa-result-text">{findResult.cosa_fare_dopo}</p></div>
                  )}

                  <div className="qa-result-ctas" style={{ marginTop: "1rem" }}>
                    <button type="button" className="qa-cta-secondary" onClick={() => { setDashMode("profile"); setFindResult(null); }}>
                      Analizza questo profilo →
                    </button>
                  </div>
                </div>
              )}

              {findResult && !profile.onboarding_complete && (
                <div className="qa-callout">
                  <p className="qa-callout-text">💡 Questa ricerca può essere ancora più precisa se configuri il tuo sistema.</p>
                  <Link href="/app/onboarding" className="qa-callout-link">Configura il tuo sistema →</Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
            PERSONALIZZA I SUGGERIMENTI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <h3 className="dash-section-title">Personalizza i suggerimenti</h3>
          <div className="dash-start-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="dash-start-card">
              <div className="dash-start-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <h4 className="dash-start-card-title">Imposta il tuo sistema</h4>
              <p className="dash-start-card-desc">Più l&apos;AI conosce il tuo lavoro, più i consigli saranno precisi.</p>
              <Link href="/app/onboarding" className="dash-btn-primary dash-btn-full">
                Configura il tuo sistema
                <span className="dash-btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ANALISI RECENTI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <h3 className="dash-section-title">Analisi recenti</h3>
          {conversationsToManage.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p className="dash-empty-text">Nessuna analisi ancora.</p>
              <p className="dash-empty-sub">Analizza un profilo o chiedi un consiglio per iniziare.</p>
            </div>
          ) : (
            <div className="dash-conv-list">
              {conversationsToManage.map((lead) => (
                <ConversationCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function ConversationCard({ lead }: { lead: Lead }) {
  const colors = statusColors[lead.status] || statusColors["Nuovo"];
  return (
    <div className="dash-conv-card">
      <div className="dash-conv-card-top">
        <div className="dash-conv-card-info">
          <div className="dash-conv-avatar">{lead.name.charAt(0).toUpperCase()}</div>
          <div>
            <h4 className="dash-conv-name">{lead.name}</h4>
            {lead.company && <p className="dash-conv-company">{lead.company}</p>}
          </div>
        </div>
        <span
          className="dash-status-badge"
          style={{ background: colors.bg, color: colors.fg }}
        >
          {lead.status}
        </span>
      </div>

      {lead.notes && (
        <p className="dash-conv-context">{lead.notes}</p>
      )}

      <div className="dash-conv-ai">
        <span className="dash-conv-ai-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/><line x1="11" y1="23" x2="13" y2="23"/></svg>
          Suggerimento AI
        </span>
        <p className="dash-conv-ai-text">{aiSuggestion(lead)}</p>
      </div>

      <div className="dash-conv-actions">
        <Link href={`/app/comments?received_comment=`} className="dash-btn-sm-outline">Rispondi</Link>
        <Link href={`/app/dm?pasted_chat_thread=`} className="dash-btn-sm-outline">Apri messaggio</Link>
        <Link href="/app/pipeline" className="dash-btn-sm-outline">Pipeline</Link>
      </div>
    </div>
  );
}
