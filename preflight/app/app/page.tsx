"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { computeSystemProgress } from "@/components/app/SystemBanner";
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
  const [quickText, setQuickText] = useState("");
  const [quickResult, setQuickResult] = useState<{
    lettura: string; strategia: string; risposta: string; prossima_mossa: string;
  } | null>(null);
  const [quickLoading, setQuickLoading] = useState(false);
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const leadsByStatus = repo.lead.listByStatus(userId);
  const allLeads = repo.lead.listLeads(userId);
  const activeConversations =
    (leadsByStatus["In conversazione"]?.length || 0) +
    (leadsByStatus["Interessato"]?.length || 0) +
    (leadsByStatus["Call proposta"]?.length || 0);
  const totalLeads = allLeads.length;
  const clienti = leadsByStatus["Cliente"]?.length || 0;
  const daRicontattare = allLeads.filter(
    (l) => l.status !== "Cliente" && !!l.next_action_at
  ).length;

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

  async function handleDashAssist() {
    if (!quickText.trim() || quickLoading) return;
    setQuickLoading(true);
    setQuickResult(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: quickText,
          advice: true,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      if (data.structured) {
        setQuickResult(data.structured);
      } else {
        setQuickResult({
          lettura: data.reply || "Non sono riuscito a generare una risposta.",
          strategia: "",
          risposta: "",
          prossima_mossa: "",
        });
      }
    } catch {
      setQuickResult({
        lettura: "Si è verificato un errore. Riprova più tardi.",
        strategia: "",
        risposta: "",
        prossima_mossa: "",
      });
    } finally {
      setQuickLoading(false);
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
          <h2 className="dash-hero-title">La tua dashboard</h2>
          <p className="dash-hero-sub">
            Gestisci conversazioni, trova opportunità e trasforma LinkedIn in un sistema clienti.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            PROGRESS BAR SISTEMA
        ══════════════════════════════════════════════════════ */}
        {!profile.onboarding_complete && (() => {
          const pct = computeSystemProgress(profile.onboarding as Record<string, unknown> | null);
          return (
            <div className="dash-system-progress">
              <div className="dash-system-progress-header">
                <div>
                  <h3 className="dash-system-progress-title">
                    Sistema clienti configurato al {pct}%
                  </h3>
                  <p className="dash-system-progress-sub">
                    Completa l&apos;impostazione per ricevere suggerimenti più precisi.
                  </p>
                </div>
                <Link href="/app/onboarding" className="dash-btn-primary dash-btn-sm">
                  Completa configurazione
                  <span className="dash-btn-arrow">→</span>
                </Link>
              </div>
              <div className="dash-system-progress-track">
                <div className="dash-system-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════
            ASSISTENTE RAPIDO (prima sezione visibile)
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <h3 className="dash-section-title">Assistente rapido</h3>
          <p className="dash-section-sub">
            Prova subito uno degli strumenti principali.
          </p>
          <div className="dash-start-grid">
            <StartCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              title="Rispondi a un commento"
              description="Incolla un commento ricevuto su LinkedIn e ottieni una risposta pronta."
              href="/app/comments"
              ctaLabel="Rispondi ora"
            />
            <StartCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
              title="Analizza un messaggio"
              description="Incolla una conversazione LinkedIn e scopri cosa rispondere."
              href="/app/dm"
              ctaLabel="Analizza ora"
            />
            <StartCard
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              title="Trova opportunità"
              description="Scopri dove iniziare nuove conversazioni su LinkedIn."
              href="/app/opportunity"
              ctaLabel="Trova ora"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            KPI CARDS
        ══════════════════════════════════════════════════════ */}
        <div className="dash-kpi-grid">
          <KpiCard label="Conversazioni attive" value={activeConversations} accent />
          <KpiCard label="Contatti in pipeline" value={totalLeads} />
          <KpiCard label="Clienti acquisiti" value={clienti} />
          <KpiCard label="Da ricontattare" value={daRicontattare} />
        </div>

        {/* ══════════════════════════════════════════════════════
            3 MACRO AREE
        ══════════════════════════════════════════════════════ */}

        {/* ── 1. Attirare clienti ── */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-num">1</span>
            <div>
              <h3 className="dash-section-title">Attirare clienti</h3>
              <p className="dash-section-sub">Pubblica contenuti che dimostrano il tuo valore e attirano clienti ideali.</p>
            </div>
          </div>
          <div className="dash-tool-grid">
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>}
              title="Contenuti"
              description="Pianifica contenuti strategici per il tuo pubblico ideale."
              href="/app/inbound"
            />
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
              title="Scrivi un post"
              description="Crea un post LinkedIn efficace con hook, corpo e CTA."
              href="/app/post"
            />
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              title="Trova opportunità"
              description="Scopri nuovi contatti con cui iniziare una conversazione."
              href="/app/opportunity"
            />
          </div>
        </section>

        {/* ── 2. Parlare con i clienti ── */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-num">2</span>
            <div>
              <h3 className="dash-section-title">Parlare con i clienti</h3>
              <p className="dash-section-sub">Avvia conversazioni autentiche con potenziali clienti nei commenti e nei messaggi.</p>
            </div>
          </div>
          <div className="dash-tool-grid">
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              title="Rispondi ai commenti"
              description="Analizza un commento ricevuto e genera una risposta strategica."
              href="/app/comments"
            />
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
              title="Rispondi ai messaggi"
              description="Incolla una chat e ricevi suggerimenti per proseguire la conversazione."
              href="/app/dm"
            />
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              title="Analizza un potenziale cliente"
              description="Incolla un profilo LinkedIn e scopri come avvicinarlo."
              href="/app/prospect"
            />
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
              title="Allenati alle conversazioni"
              description="Simula una conversazione con un prospect per prepararti."
              href="/app/simulator"
            />
          </div>
        </section>

        {/* ── 3. Gestire i clienti ── */}
        <section className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-num">3</span>
            <div>
              <h3 className="dash-section-title">Gestire i clienti</h3>
              <p className="dash-section-sub">Segui le conversazioni aperte, invia follow-up e chiudi le trattative.</p>
            </div>
          </div>
          <div className="dash-tool-grid">
            <ToolCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
              title="Clienti in corso"
              description="Visualizza e gestisci tutti i contatti nella tua pipeline."
              href="/app/pipeline"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CONVERSAZIONI DA GESTIRE
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <div className="dash-section-header-row">
            <div>
              <h3 className="dash-section-title">Conversazioni da gestire</h3>
              <p className="dash-section-sub">Le conversazioni più importanti da seguire oggi.</p>
            </div>
            <Link href="/app/pipeline" className="dash-link">Vedi tutte →</Link>
          </div>

          {conversationsToManage.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="dash-empty-text">Nessuna conversazione attiva.</p>
              <p className="dash-empty-sub">Inizia rispondendo a un commento o analizzando un profilo per aggiungere contatti alla tua pipeline.</p>
            </div>
          ) : (
            <div className="dash-conv-list">
              {conversationsToManage.map((lead) => (
                <ConversationCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════
            PIPELINE SNAPSHOT
        ══════════════════════════════════════════════════════ */}
        <section className="dash-card">
          <div className="dash-card-header">
            <h3 className="dash-card-title">Pipeline — stato corrente</h3>
            <Link href="/app/pipeline" className="dash-link">Vai alla pipeline →</Link>
          </div>
          <div className="dash-pipeline-grid">
            {Object.entries(leadsByStatus).map(([status, leads]) => (
              <div key={status} className="dash-pipeline-item">
                <div className="dash-pipeline-label">{status}</div>
                <div className="dash-pipeline-value">{leads.length}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CHIEDI UN CONSIGLIO
        ══════════════════════════════════════════════════════ */}
        <section className="dash-card">
          <h3 className="dash-card-title">Chiedi un consiglio</h3>
          <p className="dash-card-sub">
            Spiega il contesto della conversazione e scopri come muoverti per portarla verso una call.
          </p>

          <div className="qa-container qa-container-dash">
            <div className="qa-field">
              <label className="qa-label">Spiegami il contesto</label>
              <textarea
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                rows={5}
                className="qa-input qa-input-lg"
                placeholder={"Ho scritto a un potenziale cliente.\nMi ha risposto in modo cordiale ma un po' vago.\nLavora come marketing manager in un'azienda B2B.\nCome posso continuare senza sembrare troppo commerciale?"}
              />
            </div>

            <button
              onClick={handleDashAssist}
              disabled={quickLoading || !quickText.trim()}
              className="qa-btn"
            >
              {quickLoading ? (
                <>
                  <span className="qa-spinner" aria-hidden="true" />
                  Sto pensando…
                </>
              ) : (
                <>
                  Dammi un consiglio
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </>
              )}
            </button>

            {quickResult && (
              <div className="qa-result">
                {quickResult.lettura && (
                  <div className="qa-result-block">
                    <div className="qa-result-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      Lettura della situazione
                    </div>
                    <p className="qa-result-text">{quickResult.lettura}</p>
                  </div>
                )}

                {quickResult.strategia && (
                  <div className="qa-result-block">
                    <div className="qa-result-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>
                      Strategia consigliata
                    </div>
                    <p className="qa-result-text">{quickResult.strategia}</p>
                  </div>
                )}

                {quickResult.risposta && (
                  <div className="qa-result-block qa-result-reply">
                    <div className="qa-result-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Esempio di risposta
                    </div>
                    <p className="qa-result-text">{quickResult.risposta}</p>
                  </div>
                )}

                {quickResult.prossima_mossa && (
                  <div className="qa-result-block">
                    <div className="qa-result-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      Prossima mossa
                    </div>
                    <p className="qa-result-text">{quickResult.prossima_mossa}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function KpiCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`dash-kpi${accent ? " dash-kpi-accent" : ""}`}>
      <div className="dash-kpi-value">{value}</div>
      <div className="dash-kpi-label">{label}</div>
    </div>
  );
}

function StartCard({
  icon, title, description, href, ctaLabel,
}: {
  icon: React.ReactNode; title: string; description: string; href: string; ctaLabel: string;
}) {
  return (
    <div className="dash-start-card">
      <div className="dash-start-card-icon">{icon}</div>
      <h4 className="dash-start-card-title">{title}</h4>
      <p className="dash-start-card-desc">{description}</p>
      <Link href={href} className="dash-btn-primary dash-btn-full">
        {ctaLabel}
        <span className="dash-btn-arrow">→</span>
      </Link>
    </div>
  );
}

function ToolCard({
  icon, title, description, href,
}: {
  icon: React.ReactNode; title: string; description: string; href: string;
}) {
  return (
    <Link href={href} className="dash-tool-card">
      <div className="dash-tool-card-icon">{icon}</div>
      <div className="dash-tool-card-body">
        <h4 className="dash-tool-card-title">{title}</h4>
        <p className="dash-tool-card-desc">{description}</p>
      </div>
      <svg className="dash-tool-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </Link>
  );
}

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
