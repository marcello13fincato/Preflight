"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import InsightCard, { ResultHeader, SectionDivider } from "@/components/app/InsightCard";
import type { AnalyzedContact } from "@/lib/sales/schemas";

const MODAL_DISMISSED_KEY = "onboarding-modal-dismissed";

type DashMode =
  | null
  | "post"
  | "comment"
  | "dm"
  | "conversation"
  | "followup"
  | "image";

/* ─── Core Actions — Primary (3 most important) ─── */
const CORE_ACTIONS: {
  id: string;
  href: string;
  icon: string;
  title: string;
  desc: string;
  cta: string;
  iconClass: string;
}[] = [
  {
    id: "find",
    href: "/app/find-clients",
    icon: "🔍",
    title: "Chi contattare oggi su LinkedIn",
    desc: "Descrivi il tipo di cliente che cerchi. Il sistema genera ricerche LinkedIn mirate con keyword, filtri e strategia di approccio.",
    cta: "Trova chi contattare",
    iconClass: "dash-core-card-icon-find",
  },
  {
    id: "profile",
    href: "/app/prospect",
    icon: "👤",
    title: "Analizza un profilo prima di scrivere",
    desc: "Incolla il profilo LinkedIn di una persona e scopri se vale la pena contattarla, come presentarti e quale messaggio inviare.",
    cta: "Analizza profilo",
    iconClass: "dash-core-card-icon-profile",
  },
  {
    id: "advice",
    href: "/app/dm",
    icon: "💬",
    title: "Non sai cosa fare? Chiedi un consiglio",
    desc: "Hai una conversazione aperta e non sai come proseguire? Descrivi la situazione e ricevi indicazioni su cosa scrivere adesso.",
    cta: "Chiedi consiglio",
    iconClass: "dash-core-card-icon-advice",
  },
];

/* ─── Secondary Tools ─── */
const SECONDARY_TOOLS: {
  id: DashMode & string;
  icon: string;
  title: string;
  desc: string;
}[] = [
  { id: "post", icon: "✍️", title: "Scrivi un post", desc: "Post mirato al tuo cliente ideale." },
  { id: "image", icon: "🖼️", title: "Genera immagine", desc: "Immagine per accompagnare il post." },
  { id: "comment", icon: "💡", title: "Rispondi a un commento", desc: "Trasforma un commento in conversazione." },
  { id: "dm", icon: "✉️", title: "Scrivi un messaggio", desc: "La risposta giusta per un DM ricevuto." },
  { id: "conversation", icon: "🗣️", title: "Porta avanti una conversazione", desc: "Il prossimo passo in una conversazione aperta." },
  { id: "followup", icon: "🔄", title: "Scrivi follow-up", desc: "Riprendi un contatto fermo." },
];

export default function AppTodayPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dashMode, setDashMode] = useState<DashMode>(null);

  /* ── Post state ── */
  const [postDraft, setPostDraft] = useState("");
  const [postObjective, setPostObjective] = useState("");
  const [postKeyword, setPostKeyword] = useState("");
  const [postResult, setPostResult] = useState<{
    hooks: [string, string, string, string, string];
    post_versions: { clean: string; direct: string; authority: string };
    cta: string; comment_starter: string; next_step: string;
    suggerimento_immagine: { tipo: string; perche_funziona: string };
  } | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  /* ── Comment state ── */
  const [commentLinkedinUrl, setCommentLinkedinUrl] = useState("");
  const [commentProfileAnalyzed, setCommentProfileAnalyzed] = useState(false);
  const [commentProfileLoading, setCommentProfileLoading] = useState(false);
  const [commentPost, setCommentPost] = useState("");
  const [commentReceived, setCommentReceived] = useState("");
  const [commentGoal, setCommentGoal] = useState("continue_conversation");
  const [commentResult, setCommentResult] = useState<{
    comment_type: string; strategy: string; client_heat_level: string;
    message_risk_warning: string;
    replies: { soft: string; authority: string; dm_pivot: string };
    suggested_dm: string; next_action: string;
  } | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);

  /* ── DM state ── */
  const [dmLinkedinUrl, setDmLinkedinUrl] = useState("");
  const [dmProfileAnalyzed, setDmProfileAnalyzed] = useState(false);
  const [dmProfileLoading, setDmProfileLoading] = useState(false);
  const [dmThread, setDmThread] = useState("");
  const [dmGoal, setDmGoal] = useState("continue_conversation");
  const [dmProspect, setDmProspect] = useState("");
  const [dmResult, setDmResult] = useState<{
    best_reply: string; client_heat_level: string; message_risk_warning: string;
    alternatives: { short: string; assertive: string };
    qualifying_questions: [string, string, string];
    followups: { "48h": string; "5d": string; "10d": string };
    next_action: string;
  } | null>(null);
  const [dmLoading, setDmLoading] = useState(false);

  /* ── Conversation state ── */
  const [convLinkedinUrl, setConvLinkedinUrl] = useState("");
  const [convProfileAnalyzed, setConvProfileAnalyzed] = useState(false);
  const [convProfileLoading, setConvProfileLoading] = useState(false);
  const [convThread, setConvThread] = useState("");
  const [convGoal, setConvGoal] = useState("continue_conversation");
  const [convProspect, setConvProspect] = useState("");
  const [convResult, setConvResult] = useState<{
    best_reply: string; client_heat_level: string; message_risk_warning: string;
    alternatives: { short: string; assertive: string };
    qualifying_questions: [string, string, string];
    followups: { "48h": string; "5d": string; "10d": string };
    next_action: string;
  } | null>(null);
  const [convLoading, setConvLoading] = useState(false);

  /* ── Follow-up state ── */
  const [followupContext, setFollowupContext] = useState("");
  const [followupTime, setFollowupTime] = useState("");
  const [followupResult, setFollowupResult] = useState<{
    analisi_situazione: string; messaggio_followup: string;
    variante_breve: string; variante_diretta: string;
    tempistica: string; prossimi_passi: string;
  } | null>(null);
  const [followupLoading, setFollowupLoading] = useState(false);

  /* ── Image state ── */
  const [imageContent, setImageContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  /* ── Contacts state ── */
  const [contactsRefresh, setContactsRefresh] = useState(0);

  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contacts = useMemo(() => repo.contact.listContacts(userId), [contactsRefresh, userId, repo]);

  /* ── Onboarding modal ── */
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

  /* ═══════════════════════════════════════════════════════════
     HANDLERS
  ═══════════════════════════════════════════════════════════ */

  const saveContact = useCallback(
    (result: { nome_contatto?: string; ruolo_contatto?: string; azienda_contatto?: string }, url: string) => {
      repo.contact.saveContact(userId, {
        linkedin_url: url,
        nome: result.nome_contatto || "—",
        ruolo: result.ruolo_contatto || "—",
        azienda: result.azienda_contatto || "—",
        analyzed_at: new Date().toISOString(),
        result: result as unknown as Record<string, string>,
      });
      setContactsRefresh((c) => c + 1);
    },
    [repo, userId],
  );

  async function handlePost() {
    if (!postDraft.trim() || postLoading) return;
    setPostLoading(true);
    setPostResult(null);
    try {
      const res = await fetch("/api/ai/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft_post: postDraft,
          objective: postObjective || "engagement",
          dm_keyword: postKeyword || "",
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      setPostResult(await res.json());
    } catch {
      setPostResult(null);
    } finally {
      setPostLoading(false);
    }
  }

  /* ── Inline profile analysis helper (for comment/dm/conv) ── */
  async function analyzeInlineProfile(
    url: string,
    setLoading: (v: boolean) => void,
    setAnalyzed: (v: boolean) => void,
    setProspectText?: (v: string) => void,
  ) {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analizza questo profilo LinkedIn: ${url}`,
          advice: true,
          assistantMode: "profile",
          profile: profile.onboarding || undefined,
          linkedinUrl: url.trim(),
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      if (data.structured) {
        saveContact(data.structured, url.trim());
        setAnalyzed(true);
        if (setProspectText) {
          const s = data.structured;
          setProspectText(`${s.chi_e || ""} ${s.ruolo_e_contesto || ""} ${s.perche_buon_contatto || ""}`.trim());
        }
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  async function handleComment() {
    if (!commentReceived.trim() || commentLoading) return;
    setCommentLoading(true);
    setCommentResult(null);
    try {
      const res = await fetch("/api/ai/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_post: commentPost || "Post non specificato",
          received_comment: commentReceived,
          conversation_goal: commentGoal,
          commenter_linkedin_url: commentLinkedinUrl.trim() || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      setCommentResult(await res.json());
    } catch {
      setCommentResult(null);
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleDm() {
    if (!dmThread.trim() || dmLoading) return;
    setDmLoading(true);
    setDmResult(null);
    try {
      const res = await fetch("/api/ai/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pasted_chat_thread: dmThread,
          conversation_goal: dmGoal,
          prospect_profile_text: dmProspect || "",
          prospect_linkedin_url: dmLinkedinUrl.trim() || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      setDmResult(await res.json());
    } catch {
      setDmResult(null);
    } finally {
      setDmLoading(false);
    }
  }

  async function handleConversation() {
    if (!convThread.trim() || convLoading) return;
    setConvLoading(true);
    setConvResult(null);
    try {
      const res = await fetch("/api/ai/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pasted_chat_thread: convThread,
          conversation_goal: convGoal,
          prospect_profile_text: convProspect || "",
          prospect_linkedin_url: convLinkedinUrl.trim() || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      setConvResult(await res.json());
    } catch {
      setConvResult(null);
    } finally {
      setConvLoading(false);
    }
  }

  async function handleFollowup() {
    if (!followupContext.trim() || followupLoading) return;
    setFollowupLoading(true);
    setFollowupResult(null);
    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contesto: followupContext,
          tempo_passato: followupTime || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      setFollowupResult(await res.json());
    } catch {
      setFollowupResult(null);
    } finally {
      setFollowupLoading(false);
    }
  }

  async function handleImage(content?: string) {
    const text = content || imageContent;
    if (!text.trim() || imageLoading) return;
    setImageLoading(true);
    setImageUrl("");
    if (content) setImageContent(content);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_content: text }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      setImageUrl(data.url || data.image_url || "");
    } catch {
      setImageUrl("");
    } finally {
      setImageLoading(false);
    }
  }

  function openContactAnalysis(_contact: AnalyzedContact) {
    router.push("/app/prospect");
  }

  function openContactAdvice(_contact: AnalyzedContact) {
    router.push("/app/dm");
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          ONBOARDING MODAL
      ══════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="dash-modal-overlay">
          <div className="dash-modal">
            <div className="dash-modal-icon">⚙️</div>
            <h2 className="dash-modal-title">Configura il sistema per ricevere suggerimenti più utili</h2>
            <p className="dash-modal-desc">
              Preflight funziona meglio quando conosce il tuo lavoro.<br />
              Inserisci cosa vendi e chi cerchi: bastano pochi minuti.
            </p>
            <div className="dash-modal-actions">
              <Link
                href="/app/onboarding"
                className="dash-btn-primary dash-btn-full"
                onClick={() => setModalClosedTemporarily(true)}
              >
                Configura ora <span className="dash-btn-arrow">→</span>
              </Link>
              <button onClick={dismissModal} className="dash-btn-secondary dash-btn-full">
                Lo farò dopo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dash-page-v2">

        {/* ══════════════════════════════════════════════════════
            ZONE 1 — DAILY PLAN HERO
        ══════════════════════════════════════════════════════ */}
        <div className="page-hero" style={{ marginBottom: "0" }}>
          <span className="page-hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Dashboard
          </span>
          <h1 className="page-hero-title">Il tuo punto di partenza</h1>
          <p className="page-hero-subtitle">
            Da qui puoi capire chi contattare, come scrivere il primo messaggio e cosa fare per portare ogni conversazione verso la call.
          </p>
        </div>

        <section className="dash-daily-hero">
          <div className="dash-daily-eyebrow">
            <span className="dash-daily-eyebrow-dot" />
            Piano giornaliero
          </div>
          <h2 className="dash-daily-title">Il tuo piano per oggi</h2>
          <p className="dash-daily-subtitle">
            In base al tuo servizio, ai clienti target e alle conversazioni in corso, ecco le azioni più utili per oggi.
          </p>

          <div className="dash-daily-actions">
            <div className="dash-daily-action">
              <div className="dash-daily-action-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div>
                <div className="dash-daily-action-title">3 profili da analizzare</div>
                <div className="dash-daily-action-text">Trova e valuta nuovi contatti da raggiungere.</div>
              </div>
            </div>
            <div className="dash-daily-action">
              <div className="dash-daily-action-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <div className="dash-daily-action-title">2 conversazioni da portare avanti</div>
                <div className="dash-daily-action-text">Rispondi o fai follow-up sui contatti aperti.</div>
              </div>
            </div>
            <div className="dash-daily-action">
              <div className="dash-daily-action-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div>
                <div className="dash-daily-action-title">1 contenuto da pubblicare</div>
                <div className="dash-daily-action-text">Pubblica un post mirato al tuo cliente ideale.</div>
              </div>
            </div>
          </div>

          <div className="dash-daily-extras">
            <div className="dash-daily-extra">
              <div className="dash-daily-extra-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              Tema outreach suggerito
            </div>
            <div className="dash-daily-extra">
              <div className="dash-daily-extra-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              Follow-up suggeriti
            </div>
            <div className="dash-daily-extra">
              <div className="dash-daily-extra-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              Angolo contenuto suggerito
            </div>
          </div>

          <Link href="/app/oggi" className="dash-daily-cta">
            Apri il piano completo <span className="dash-btn-arrow">→</span>
          </Link>
        </section>

        {/* ══════════════════════════════════════════════════════
            ZONE 2 — CORE ACTIONS
        ══════════════════════════════════════════════════════ */}
        <section className="dash-v2-section">
          <div className="dash-v2-section-head">
            <h3 className="dash-v2-section-title">Servizi principali</h3>
            <p className="dash-v2-section-sub">Le tre azioni fondamentali: trovare contatti, capire se vale la pena scrivere, e sapere sempre cosa fare dopo.</p>
          </div>

          <div className="dash-core-grid">
            {CORE_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="dash-core-card"
              >
                <div className={`dash-core-card-icon ${action.iconClass}`}>{action.icon}</div>
                <h4 className="dash-core-card-title">{action.title}</h4>
                <p className="dash-core-card-desc">{action.desc}</p>
                <span className="dash-core-card-cta">{action.cta} <span className="dash-core-card-arrow">→</span></span>
              </Link>
            ))}
          </div>

          <p className="dash-secondary-label">Altri strumenti</p>
          <div className="dash-secondary-grid">
            {SECONDARY_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`dash-sec-card${dashMode === tool.id ? " dash-sec-card-active" : ""}`}
                onClick={() => setDashMode(dashMode === tool.id ? null : tool.id)}
              >
                <div className="dash-sec-card-icon">{tool.icon}</div>
                <div className="dash-sec-card-body">
                  <h4 className="dash-sec-card-title">{tool.title}</h4>
                  <p className="dash-sec-card-desc">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ACTIVE TOOL PANEL (secondary tools only — core services navigate to dedicated pages)
        ══════════════════════════════════════════════════════ */}

        {/* ── SCRIVI UN POST ── */}
        {dashMode === "post" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setPostResult(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Scrivi un post LinkedIn</h4>
                <p className="qa-section-sub">Parti da un&apos;idea o da una bozza. L&apos;AI ti genera versioni diverse del post, hook e CTA.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Idea o bozza del post</label>
                <textarea value={postDraft} onChange={(e) => setPostDraft(e.target.value)} className="qa-input qa-input-lg" rows={5} placeholder="Scrivi qui la tua idea o una bozza del post…" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Obiettivo del post <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={postObjective} onChange={(e) => setPostObjective(e.target.value)} className="qa-input" placeholder="Es: generare commenti, attrarre lead, posizionarsi come esperto" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Keyword per DM <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={postKeyword} onChange={(e) => setPostKeyword(e.target.value)} className="qa-input" placeholder="Es: scrivi 'LinkedIn' nei commenti per ricevere la guida" />
              </div>

              <button onClick={handlePost} disabled={postLoading || !postDraft.trim()} className="qa-btn">
                {postLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto scrivendo…</>) : (<>Genera post <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {postResult && (
                <div className="insight-result">
                  <ResultHeader title="Post generato" />
                  <InsightCard icon="💡" label="Hook (5 opzioni)" text={postResult.hooks.join("\n\n")} variant="evidence" />
                  <SectionDivider label="Versioni" />
                  <InsightCard icon="✨" label="Versione pulita" text={postResult.post_versions.clean} variant="message" copyable />
                  <InsightCard icon="🎯" label="Versione diretta" text={postResult.post_versions.direct} variant="message" copyable />
                  <InsightCard icon="🏆" label="Versione autorevole" text={postResult.post_versions.authority} variant="message" copyable />
                  <SectionDivider label="Engagement" />
                  <InsightCard icon="📣" label="CTA" text={postResult.cta} variant="strategy" />
                  <InsightCard icon="💬" label="Commento starter" text={postResult.comment_starter} variant="strategy" />
                  <div className="insight-next-action">
                    <span className="insight-next-action-icon">➡️</span>
                    <div><strong>Prossimo passo:</strong> {postResult.next_step}</div>
                  </div>

                  {/* Immagine suggerita */}
                  {postResult.suggerimento_immagine && (
                    <InsightCard icon="🖼️" label="Immagine suggerita" text={`${postResult.suggerimento_immagine.tipo}\n\n${postResult.suggerimento_immagine.perche_funziona}\n\n📸 Preferisci sempre foto reali: foto mentre lavori, il tuo ambiente, screenshot del tuo lavoro reale.`} variant="evidence" />
                  )}
                  {postResult.suggerimento_immagine && (
                    <button
                      type="button"
                      className="qa-cta-secondary"
                      onClick={() => {
                        setDashMode("image");
                        setImageContent(postResult.post_versions.clean);
                      }}
                    >
                      Genera immagine per questo post →
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── GENERA IMMAGINE ── */}
        {dashMode === "image" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setImageUrl(""); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Genera immagine per il post</h4>
                <p className="qa-section-sub">Incolla il testo del post e genera un&apos;immagine professionale da accompagnare.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Testo del post</label>
                <textarea value={imageContent} onChange={(e) => setImageContent(e.target.value)} className="qa-input qa-input-lg" rows={5} placeholder="Incolla qui il testo del post per cui vuoi generare l'immagine…" />
              </div>

              <p className="qa-microcopy">📸 Consiglio: usa foto reali quando possibile. L&apos;immagine generata è un punto di partenza.</p>

              <button onClick={() => handleImage()} disabled={imageLoading || !imageContent.trim()} className="qa-btn">
                {imageLoading ? (<><span className="qa-spinner" aria-hidden="true" />Genero l&apos;immagine…</>) : (<>Genera immagine <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {imageUrl && (
                <div className="qa-result">
                  <div className="qa-result-block">
                    <div className="qa-result-label">Immagine generata</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Immagine generata per il post" className="tool-image-preview" />
                    <p className="qa-microcopy" style={{ marginTop: ".75rem" }}>Clicca con il tasto destro per salvare l&apos;immagine.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── SCRIVI UN COMMENTO ── */}
        {dashMode === "comment" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setCommentResult(null); setCommentProfileAnalyzed(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Scrivi un commento</h4>
                <p className="qa-section-sub">Hai ricevuto un commento su LinkedIn? Scopri come rispondere in modo strategico.</p>
              </div>

              {/* Inline profile analysis */}
              <div className="qa-inline-profile">
                <div className="qa-field">
                  <label className="qa-label">Profilo LinkedIn della persona <span className="qa-label-opt">(facoltativo)</span></label>
                  <div className="qa-inline-profile-row">
                    <input type="url" value={commentLinkedinUrl} onChange={(e) => { setCommentLinkedinUrl(e.target.value); setCommentProfileAnalyzed(false); }} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" style={{ flex: 1 }} />
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={commentProfileLoading || !commentLinkedinUrl.trim() || commentProfileAnalyzed}
                      onClick={() => analyzeInlineProfile(commentLinkedinUrl, setCommentProfileLoading, setCommentProfileAnalyzed)}
                    >
                      {commentProfileLoading ? "Analizzo…" : commentProfileAnalyzed ? "✓ Analizzato" : "Analizza profilo"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Il tuo post originale <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={commentPost} onChange={(e) => setCommentPost(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Incolla qui il testo del tuo post originale…" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Commento ricevuto</label>
                <textarea value={commentReceived} onChange={(e) => setCommentReceived(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Incolla qui il commento che hai ricevuto…" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Obiettivo</label>
                <div className="qa-chip-group">
                  {[
                    { id: "continue_conversation", label: "Continuare la conversazione" },
                    { id: "move_to_dm", label: "Portare in DM" },
                    { id: "propose_call", label: "Proporre una call" },
                    { id: "understand_fit", label: "Capire se è in target" },
                  ].map((g) => (
                    <button key={g.id} type="button" className={`qa-chip${commentGoal === g.id ? " qa-chip-active" : ""}`} onClick={() => setCommentGoal(g.id)}>{g.label}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleComment} disabled={commentLoading || !commentReceived.trim()} className="qa-btn">
                {commentLoading ? (<><span className="qa-spinner" aria-hidden="true" />Analizzo…</>) : (<>Suggerisci risposta <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {commentResult && (
                <div className="insight-result">
                  <ResultHeader title="Analisi commento" />
                  <InsightCard icon="🎯" label={`Tipo: ${commentResult.comment_type} · Calore: ${commentResult.client_heat_level}`} text={commentResult.strategy} variant="summary" />
                  <SectionDivider label="Risposte suggerite" />
                  <InsightCard icon="💬" label="Risposta empatica" text={commentResult.replies.soft} variant="message" copyable />
                  <InsightCard icon="✅" label="Risposta autorevole" text={commentResult.replies.authority} variant="message" copyable />
                  <InsightCard icon="➡️" label="Porta in DM" text={commentResult.replies.dm_pivot} variant="message" copyable />
                  <InsightCard icon="✉️" label="Messaggio DM suggerito" text={commentResult.suggested_dm} variant="strategy" copyable />
                  {commentResult.message_risk_warning && commentResult.message_risk_warning !== "nessuno" && (
                    <div className="insight-warn-inline">
                      <span>⚠️</span>
                      <span>{commentResult.message_risk_warning}</span>
                    </div>
                  )}
                  <div className="insight-next-action">
                    <span className="insight-next-action-icon">➡️</span>
                    <div><strong>Prossimo passo:</strong> {commentResult.next_action}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── SCRIVI MESSAGGIO DM ── */}
        {dashMode === "dm" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setDmResult(null); setDmProfileAnalyzed(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Scrivi un messaggio DM</h4>
                <p className="qa-section-sub">Incolla la conversazione DM e ottieni la risposta migliore da inviare.</p>
              </div>

              {/* Inline profile analysis */}
              <div className="qa-inline-profile">
                <div className="qa-field">
                  <label className="qa-label">Profilo LinkedIn della persona <span className="qa-label-opt">(facoltativo)</span></label>
                  <div className="qa-inline-profile-row">
                    <input type="url" value={dmLinkedinUrl} onChange={(e) => { setDmLinkedinUrl(e.target.value); setDmProfileAnalyzed(false); }} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" style={{ flex: 1 }} />
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={dmProfileLoading || !dmLinkedinUrl.trim() || dmProfileAnalyzed}
                      onClick={() => analyzeInlineProfile(dmLinkedinUrl, setDmProfileLoading, setDmProfileAnalyzed, setDmProspect)}
                    >
                      {dmProfileLoading ? "Analizzo…" : dmProfileAnalyzed ? "✓ Analizzato" : "Analizza profilo"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Conversazione DM</label>
                <textarea value={dmThread} onChange={(e) => setDmThread(e.target.value)} className="qa-input qa-input-lg" rows={6} placeholder={"Io: Ciao, ho visto il tuo post su LinkedIn…\nLui: Grazie! Sì, è un tema che mi sta a cuore…"} />
              </div>

              <div className="qa-field">
                <label className="qa-label">Obiettivo</label>
                <div className="qa-chip-group">
                  {[
                    { id: "continue_conversation", label: "Continuare" },
                    { id: "understand_fit", label: "Capire il fit" },
                    { id: "propose_call", label: "Proporre call" },
                    { id: "follow_up", label: "Follow-up" },
                  ].map((g) => (
                    <button key={g.id} type="button" className={`qa-chip${dmGoal === g.id ? " qa-chip-active" : ""}`} onClick={() => setDmGoal(g.id)}>{g.label}</button>
                  ))}
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Profilo della persona <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={dmProspect} onChange={(e) => setDmProspect(e.target.value)} className="qa-input" rows={2} placeholder="Es: Founder di una startup, 2000 follower" />
              </div>

              <button onClick={handleDm} disabled={dmLoading || !dmThread.trim()} className="qa-btn">
                {dmLoading ? (<><span className="qa-spinner" aria-hidden="true" />Analizzo…</>) : (<>Suggerisci risposta <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {dmResult && (
                <div className="insight-result">
                  <ResultHeader title="Analisi DM" />
                  <InsightCard icon="💬" label={`Risposta migliore · Calore: ${dmResult.client_heat_level}`} text={dmResult.best_reply} variant="message" copyable />
                  <SectionDivider label="Alternative" />
                  <InsightCard icon="➡️" label="Versione breve" text={dmResult.alternatives.short} variant="message" copyable />
                  <InsightCard icon="✅" label="Versione diretta" text={dmResult.alternatives.assertive} variant="message" copyable />
                  <SectionDivider label="Approfondimento" />
                  <InsightCard icon="💡" label="Domande qualificanti" text={dmResult.qualifying_questions.join("\n\n")} variant="evidence" />
                  <InsightCard icon="🔄" label="Follow-up 48h" text={dmResult.followups["48h"]} variant="strategy" copyable />
                  <InsightCard icon="🔄" label="Follow-up 5 giorni" text={dmResult.followups["5d"]} variant="strategy" copyable />
                  <InsightCard icon="🔄" label="Follow-up 10 giorni" text={dmResult.followups["10d"]} variant="strategy" copyable />
                  {dmResult.message_risk_warning && dmResult.message_risk_warning !== "nessuno" && (
                    <div className="insight-warn-inline">
                      <span>⚠️</span>
                      <span>{dmResult.message_risk_warning}</span>
                    </div>
                  )}
                  <div className="insight-next-action">
                    <span className="insight-next-action-icon">➡️</span>
                    <div><strong>Prossimo passo:</strong> {dmResult.next_action}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── GESTISCI CONVERSAZIONE ── */}
        {dashMode === "conversation" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setConvResult(null); setConvProfileAnalyzed(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Gestisci conversazione</h4>
                <p className="qa-section-sub">Incolla una conversazione in corso e scopri come portarla avanti verso il tuo obiettivo.</p>
              </div>

              {/* Inline profile analysis */}
              <div className="qa-inline-profile">
                <div className="qa-field">
                  <label className="qa-label">Profilo LinkedIn della persona <span className="qa-label-opt">(facoltativo)</span></label>
                  <div className="qa-inline-profile-row">
                    <input type="url" value={convLinkedinUrl} onChange={(e) => { setConvLinkedinUrl(e.target.value); setConvProfileAnalyzed(false); }} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" style={{ flex: 1 }} />
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={convProfileLoading || !convLinkedinUrl.trim() || convProfileAnalyzed}
                      onClick={() => analyzeInlineProfile(convLinkedinUrl, setConvProfileLoading, setConvProfileAnalyzed, setConvProspect)}
                    >
                      {convProfileLoading ? "Analizzo…" : convProfileAnalyzed ? "✓ Analizzato" : "Analizza profilo"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Conversazione in corso</label>
                <textarea value={convThread} onChange={(e) => setConvThread(e.target.value)} className="qa-input qa-input-lg" rows={6} placeholder={"Incolla tutta la conversazione:\nIo: Ho visto il tuo post su…\nLui: Sì, è un tema importante…\nIo: Come state gestendo questo aspetto?"} />
              </div>

              <div className="qa-field">
                <label className="qa-label">Obiettivo</label>
                <div className="qa-chip-group">
                  {[
                    { id: "continue_conversation", label: "Continuare" },
                    { id: "understand_fit", label: "Capire il fit" },
                    { id: "propose_call", label: "Proporre call" },
                    { id: "follow_up", label: "Follow-up" },
                  ].map((g) => (
                    <button key={g.id} type="button" className={`qa-chip${convGoal === g.id ? " qa-chip-active" : ""}`} onClick={() => setConvGoal(g.id)}>{g.label}</button>
                  ))}
                </div>
              </div>

              <div className="qa-field">
                <label className="qa-label">Note sulla persona <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={convProspect} onChange={(e) => setConvProspect(e.target.value)} className="qa-input" rows={2} placeholder="Es: CEO di un'agenzia, mi ha già chiesto info" />
              </div>

              <button onClick={handleConversation} disabled={convLoading || !convThread.trim()} className="qa-btn">
                {convLoading ? (<><span className="qa-spinner" aria-hidden="true" />Analizzo…</>) : (<>Analizza conversazione <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {convResult && (
                <div className="insight-result">
                  <InsightCard variant="summary" label={`Risposta migliore · Calore: ${convResult.client_heat_level}`} text={convResult.best_reply} copyable />
                  <div className="insight-reply-grid">
                    <InsightCard variant="message" label="Versione breve" text={convResult.alternatives.short} copyable />
                    <InsightCard variant="message" label="Versione diretta" text={convResult.alternatives.assertive} copyable />
                  </div>
                  <InsightCard variant="evidence" label="Domande qualificanti" text={convResult.qualifying_questions.join("\n\n")} />
                  <div className="insight-reply-grid">
                    <InsightCard variant="message" label="Follow-up 48h" text={convResult.followups["48h"]} copyable />
                    <InsightCard variant="message" label="Follow-up 5 giorni" text={convResult.followups["5d"]} copyable />
                    <InsightCard variant="message" label="Follow-up 10 giorni" text={convResult.followups["10d"]} copyable />
                  </div>
                  {convResult.message_risk_warning && convResult.message_risk_warning !== "nessuno" && (
                    <InsightCard variant="warning" label="Attenzione" text={convResult.message_risk_warning} />
                  )}
                  <InsightCard variant="action" label="Prossimo passo" text={convResult.next_action} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── SCRIVI FOLLOW-UP ── */}
        {dashMode === "followup" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setFollowupResult(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Scrivi follow-up</h4>
                <p className="qa-section-sub">Genera un messaggio di follow-up naturale per riprendere una conversazione ferma.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Contesto della conversazione</label>
                <textarea value={followupContext} onChange={(e) => setFollowupContext(e.target.value)} className="qa-input qa-input-lg" rows={5} placeholder={"Ho inviato un messaggio a un founder 5 giorni fa proponendo una call.\nNon ha risposto.\nIl suo profilo mostra che è attivo su LinkedIn."} />
              </div>

              <div className="qa-field">
                <label className="qa-label">Tempo dall&apos;ultimo messaggio</label>
                <div className="qa-chip-group">
                  {["2 giorni", "5 giorni", "10 giorni", "2 settimane", "1 mese"].map((t) => (
                    <button key={t} type="button" className={`qa-chip${followupTime === t ? " qa-chip-active" : ""}`} onClick={() => setFollowupTime(followupTime === t ? "" : t)}>{t}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleFollowup} disabled={followupLoading || !followupContext.trim()} className="qa-btn">
                {followupLoading ? (<><span className="qa-spinner" aria-hidden="true" />Genero il follow-up…</>) : (<>Genera follow-up <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {followupResult && (
                <div className="insight-result">
                  <InsightCard variant="summary" label="Analisi della situazione" text={followupResult.analisi_situazione} />
                  <InsightCard variant="message" label="Messaggio follow-up" text={followupResult.messaggio_followup} copyable />
                  <div className="insight-reply-grid">
                    <InsightCard variant="message" label="Variante breve" text={followupResult.variante_breve} copyable />
                    <InsightCard variant="message" label="Variante diretta" text={followupResult.variante_diretta} copyable />
                  </div>
                  <InsightCard variant="evidence" label="Tempistica" text={followupResult.tempistica} />
                  <InsightCard variant="action" label="Prossimi passi" text={followupResult.prossimi_passi} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
            ZONE 4 — CONTATTI ANALIZZATI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-v2-section">
          <div className="dash-v2-section-head">
            <h3 className="dash-v2-section-title">Contatti analizzati</h3>
            <p className="dash-v2-section-sub">I contatti vengono salvati automaticamente quando usi &quot;Analizza un profilo&quot;.</p>
          </div>
          {contacts.length === 0 ? (
            <div className="dash-empty-v2">
              <div className="dash-empty-v2-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p className="dash-empty-v2-title">Nessun contatto analizzato</p>
              <p className="dash-empty-v2-text">Quando analizzi un profilo LinkedIn, il contatto viene salvato automaticamente qui per rivederlo o chiedere un consiglio.</p>
            </div>
          ) : (
            <div className="dash-contacts-grid">
              {contacts.map((c) => (
                <div key={c.id} className="dash-contact-v2">
                  <div className="dash-contact-v2-top">
                    <div className="dash-contact-v2-avatar">{c.nome.charAt(0).toUpperCase()}</div>
                    <div className="dash-contact-v2-info">
                      <h4 className="dash-contact-v2-name">{c.nome}</h4>
                      <p className="dash-contact-v2-role">{c.ruolo}{c.azienda && c.azienda !== "—" ? ` · ${c.azienda}` : ""}</p>
                    </div>
                  </div>
                  <div className="dash-contact-v2-meta">
                    <span className="dash-contact-v2-date">{new Date(c.analyzed_at).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span>
                    {c.linkedin_url && (
                      <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" className="dash-contact-v2-link">LinkedIn ↗</a>
                    )}
                  </div>
                  <div className="dash-contact-v2-actions">
                    <button type="button" className="btn-secondary" onClick={() => openContactAnalysis(c)}>Rivedi analisi</button>
                    <button type="button" className="btn-secondary" onClick={() => openContactAdvice(c)}>Chiedi consiglio</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════
            ZONE 5 — SYSTEM STATUS
        ══════════════════════════════════════════════════════ */}
        <section className="dash-v2-section">
          <div className="dash-v2-section-head">
            <h3 className="dash-v2-section-title">Stato del sistema</h3>
          </div>
          <div className={`dash-setup-v2 ${profile.onboarding_complete ? "dash-setup-v2-configured" : "dash-setup-v2-pending"}`}>
            <div className="dash-setup-v2-inner">
              <div className={`dash-setup-v2-icon ${profile.onboarding_complete ? "dash-setup-v2-icon-ok" : "dash-setup-v2-icon-pending"}`}>
                {profile.onboarding_complete ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                )}
              </div>
              <div>
                <h4 className="dash-setup-v2-title">
                  {profile.onboarding_complete ? "Sistema configurato" : "Sistema non ancora configurato"}
                </h4>
                <p className="dash-setup-v2-desc">
                  {profile.onboarding_complete
                    ? "L'AI conosce il tuo servizio e il tuo cliente ideale. I consigli sono personalizzati."
                    : "Configura il tuo sistema per ricevere consigli più precisi e personalizzati."}
                </p>
              </div>
            </div>
            <Link href="/app/onboarding" className={profile.onboarding_complete ? "btn-secondary" : "btn-primary"}>
              {profile.onboarding_complete ? "Modifica configurazione" : "Configura il tuo sistema"} <span className="dash-btn-arrow">→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}


