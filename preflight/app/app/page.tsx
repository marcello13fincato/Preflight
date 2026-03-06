"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

const MODAL_DISMISSED_KEY = "onboarding-modal-dismissed";

export default function AppTodayPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [quickType, setQuickType] = useState("post");
  const [quickText, setQuickText] = useState("");
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const day = Math.min(14, Math.max(1, new Date().getDate() % 14 || 1));
  const today = profile.plan?.plan_14_days.find((d) => d.day === day) || profile.plan?.plan_14_days[0];
  const leadsByStatus = repo.lead.listByStatus(userId);
  const activeConversations =
    (leadsByStatus["In conversazione"]?.length || 0) +
    (leadsByStatus["Interessato"]?.length || 0) +
    (leadsByStatus["Call proposta"]?.length || 0);
  const totalLeads = repo.lead.listLeads(userId).length;
  const clienti = leadsByStatus["Cliente"]?.length || 0;

  const followupLead = repo
    .lead
    .listLeads(userId)
    .filter((x) => x.status !== "Cliente")
    .sort((a, b) => (a.next_action_at || "").localeCompare(b.next_action_at || ""))[0];

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

  function jumpQuickAssist() {
    const encoded = encodeURIComponent(quickText);
    if (quickType === "post") router.push(`/app/post?draft_post=${encoded}`);
    if (quickType === "comment") router.push(`/app/comments?received_comment=${encoded}`);
    if (quickType === "dm") router.push(`/app/dm?pasted_chat_thread=${encoded}`);
    if (quickType === "prospect") router.push(`/app/prospect?pasted_profile_text=${encoded}`);
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
            <h2 className="dash-modal-title">Imposta il tuo sistema</h2>
            <p className="dash-modal-desc">
              Configura il tuo sistema clienti su LinkedIn.
              Ti bastano pochi passaggi per adattare Preflight al tuo lavoro.
            </p>

            <div className="dash-modal-guide">
              <div className="dash-modal-guide-row">
                <span className="dash-modal-guide-icon">✅</span>
                <div>
                  <span className="dash-modal-guide-label">Cosa fa questa pagina:</span>{" "}
                  configura il tuo sistema commerciale.
                </div>
              </div>
              <div className="dash-modal-guide-row">
                <span className="dash-modal-guide-icon">📋</span>
                <div>
                  <span className="dash-modal-guide-label">Cosa inserire:</span>{" "}
                  offerta, cliente ideale, prove e tempo disponibile.
                </div>
              </div>
              <div className="dash-modal-guide-row">
                <span className="dash-modal-guide-icon">🎯</span>
                <div>
                  <span className="dash-modal-guide-label">Cosa ottieni:</span>{" "}
                  un piano pratico per passare da conversazione a call.
                </div>
              </div>
            </div>

            <div className="dash-modal-actions">
              <Link
                href="/app/onboarding"
                className="dash-btn-primary dash-btn-full"
                onClick={() => setModalClosedTemporarily(true)}
              >
                Imposta ora
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
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
        <div className="dash-heading">
          <h2 className="dash-heading-title">La tua dashboard</h2>
          <p className="dash-heading-sub">
            Gestisci le conversazioni e trova nuove opportunità su LinkedIn.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════
            PERSISTENT ONBOARDING BANNER
        ══════════════════════════════════════════════════════ */}
        {!profile.onboarding_complete && modalDismissed && (
          <div className="dash-banner">
            <div className="dash-banner-content">
              <div className="dash-banner-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <p className="dash-banner-title">Il tuo sistema non è ancora configurato.</p>
                <p className="dash-banner-text">
                  Completa l&apos;impostazione per ricevere suggerimenti più precisi e un piano di azione personalizzato.
                </p>
              </div>
            </div>
            <Link href="/app/onboarding" className="dash-btn-primary dash-btn-sm">
              Completa configurazione
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            KPI CARDS
        ══════════════════════════════════════════════════════ */}
        <div className="dash-kpi-grid">
          <KpiCard label="Conversazioni attive" value={activeConversations} accent />
          <KpiCard label="Contatti in pipeline" value={totalLeads} />
          <KpiCard label="Clienti acquisiti" value={clienti} />
          <KpiCard
            label="Da ricontattare"
            value={
              repo.lead
                .listLeads(userId)
                .filter((l) => l.status !== "Cliente" && !!l.next_action_at).length
            }
          />
        </div>

        {/* ══════════════════════════════════════════════════════
            IL TUO PROSSIMO PASSO
        ══════════════════════════════════════════════════════ */}
        <div className="dash-next-step">
          <div className="dash-next-step-header">
            <h3 className="dash-section-title">Il tuo prossimo passo</h3>
            <p className="dash-section-sub">Ecco cosa puoi fare adesso per avanzare.</p>
          </div>
          <div className="dash-next-step-grid">
            <NextStepCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
              label="Pubblica un contenuto"
              href="/app/post"
            />
            <NextStepCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              label="Rispondi a un commento"
              href="/app/comments"
            />
            <NextStepCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
              label="Analizza un potenziale cliente"
              href="/app/prospect"
            />
            <NextStepCard
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
              label="Invia un messaggio"
              href="/app/dm"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            3 MACRO AREE — Azioni quotidiane
        ══════════════════════════════════════════════════════ */}
        <div>
          <h3 className="dash-section-title">Azioni quotidiane</h3>
          <p className="dash-section-sub">Dedica 15–30 minuti per creare nuove opportunità commerciali.</p>
          <div className="dash-macro-grid">
            <MacroCard
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>}
              number="1"
              title="Attirare clienti"
              explanation="Pubblica contenuti che dimostrano il tuo valore e attirano clienti ideali."
              action={today?.inbound || "Genera il tuo piano per vedere l'azione di oggi."}
              ctaHref="/app/inbound"
              ctaLabel="Crea contenuto"
            />
            <MacroCard
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              number="2"
              title="Parlare con i clienti"
              explanation="Avvia conversazioni autentiche con potenziali clienti nei commenti e nei messaggi."
              action={today?.outbound || "Apri 2 conversazioni con contatti in target."}
              ctaHref="/app/comments"
              ctaLabel="Rispondi ai commenti"
            />
            <MacroCard
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>}
              number="3"
              title="Gestire i clienti"
              explanation="Segui le conversazioni aperte e invia follow-up strategici."
              action={today?.followup || "Invia 1 follow-up su chat aperta."}
              ctaHref="/app/pipeline"
              ctaLabel="Vai alla pipeline"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            PIPELINE SNAPSHOT
        ══════════════════════════════════════════════════════ */}
        <div className="dash-card">
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
          {followupLead && (
            <div className="dash-callout">
              <span className="dash-callout-icon">➡️</span>
              <span className="dash-callout-text">
                <strong>Prossimo follow-up consigliato:</strong>{" "}
                {followupLead.name}
                <span className="dash-badge">{followupLead.status}</span>
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════
            ASSISTENTE RAPIDO
        ══════════════════════════════════════════════════════ */}
        <div className="dash-card">
          <h3 className="dash-card-title">Assistente rapido</h3>
          <p className="dash-card-sub">
            Incolla un testo e scegli il modulo giusto: verrai reindirizzato direttamente.
          </p>
          <div className="dash-quick-grid">
            <select
              value={quickType}
              onChange={(e) => setQuickType(e.target.value)}
              className="dash-select"
            >
              <option value="post">Post</option>
              <option value="comment">Commento</option>
              <option value="dm">Messaggio</option>
              <option value="prospect">Profilo cliente</option>
            </select>
            <textarea
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              rows={3}
              className="dash-textarea"
              placeholder="Incolla qui il testo..."
            />
            <button onClick={jumpQuickAssist} className="dash-btn-primary self-end">
              Apri modulo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            COME FUNZIONA
        ══════════════════════════════════════════════════════ */}
        <div className="dash-guide">
          <h3 className="dash-guide-title">Come funziona Preflight</h3>
          <div className="dash-guide-steps">
            {[
              "Pubblica un post che mostra il tuo valore",
              "Rispondi ai commenti per aprire conversazioni",
              "Sposta la conversazione in messaggio privato",
              "Proponi una call e aggiungi il contatto alla pipeline",
            ].map((step, i) => (
              <div key={i} className="dash-guide-step">
                <span className="dash-guide-num">{i + 1}</span>
                <span className="dash-guide-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Sub-components ─── */

function KpiCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`dash-kpi${accent ? " dash-kpi-accent" : ""}`}>
      <div className="dash-kpi-value">{value}</div>
      <div className="dash-kpi-label">{label}</div>
    </div>
  );
}

function MacroCard({
  icon,
  number,
  title,
  explanation,
  action,
  ctaHref,
  ctaLabel,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  explanation: string;
  action: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="dash-macro-card">
      <div className="dash-macro-header">
        <span className="dash-macro-icon">{icon}</span>
        <span className="dash-macro-num">{number}</span>
      </div>
      <h4 className="dash-macro-title">{title}</h4>
      <p className="dash-macro-text">{explanation}</p>
      <div className="dash-macro-action">
        <span className="dash-macro-action-label">Oggi:</span> {action}
      </div>
      <Link href={ctaHref} className="dash-btn-primary dash-btn-full">
        {ctaLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </Link>
    </div>
  );
}

function NextStepCard({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="dash-next-card">
      <span className="dash-next-card-icon">{icon}</span>
      <span className="dash-next-card-label">{label}</span>
      <svg className="dash-next-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </Link>
  );
}
