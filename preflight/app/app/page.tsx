"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
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
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  iconClass: string;
}[] = [
  {
    id: "find",
    href: "/app/find-clients",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.6-3.6" />
      </svg>
    ),
    title: "Chi contattare oggi su LinkedIn",
    desc: "Descrivi il tipo di cliente che cerchi. Il sistema genera ricerche LinkedIn mirate con keyword, filtri e strategia di approccio.",
    cta: "Trova chi contattare",
    iconClass: "dash-core-card-icon-find",
  },
  {
    id: "profile",
    href: "/app/prospect",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </svg>
    ),
    title: "Analizza un profilo prima di scrivere",
    desc: "Incolla il profilo LinkedIn di una persona e scopri se vale la pena contattarla, come presentarti e quale messaggio inviare.",
    cta: "Analizza profilo",
    iconClass: "dash-core-card-icon-profile",
  },
  {
    id: "advice",
    href: "/app/dm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 15a3 3 0 0 1-3 3H9l-5 4V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" />
      </svg>
    ),
    title: "Non sai cosa fare? Chiedi un consiglio",
    desc: "Hai una conversazione aperta e non sai come proseguire? Descrivi la situazione e ricevi indicazioni su cosa scrivere adesso.",
    cta: "Chiedi consiglio",
    iconClass: "dash-core-card-icon-advice",
  },
];

/* ─── Secondary Tools ─── */
const SECONDARY_TOOLS: {
  id: DashMode & string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}[] = [
  {
    id: "post",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 21h5l11-11a2.12 2.12 0 0 0-3-3L5 18z" />
      </svg>
    ),
    title: "Scrivi un post",
    desc: "Post mirato al tuo cliente ideale.",
  },
  {
    id: "image",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8" cy="9" r="1.5" />
        <path d="m21 16-5.5-5.5L8 18" />
      </svg>
    ),
    title: "Genera immagine",
    desc: "Immagine per accompagnare il post.",
  },
  {
    id: "comment",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
    title: "Rispondi a un commento",
    desc: "Trasforma un commento in conversazione.",
  },
  {
    id: "dm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
    title: "Scrivi un messaggio",
    desc: "La risposta giusta per un DM ricevuto.",
  },
  {
    id: "conversation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 4h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-1l-4 3v-3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
      </svg>
    ),
    title: "Porta avanti una conversazione",
    desc: "Il prossimo passo in una conversazione aperta.",
  },
  {
    id: "followup",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <path d="M21 3v6h-6" />
      </svg>
    ),
    title: "Scrivi follow-up",
    desc: "Riprendi un contatto fermo.",
  },
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

  /* ── Activity tracking ── */
  const todayStr = new Date().toISOString().split("T")[0];
  const [activityDates, setActivityDates] = useState<string[]>([]);
  const [markedActiveToday, setMarkedActiveToday] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored: string[] = JSON.parse(localStorage.getItem("preflight-activity-dates") || "[]");
    setActivityDates(stored);
    setMarkedActiveToday(stored.includes(todayStr));
  }, [todayStr]);
  const markActiveToday = useCallback(() => {
    if (typeof window === "undefined") return;
    const stored: string[] = JSON.parse(localStorage.getItem("preflight-activity-dates") || "[]");
    if (!stored.includes(todayStr)) {
      const updated = [...stored, todayStr].sort();
      localStorage.setItem("preflight-activity-dates", JSON.stringify(updated));
      setActivityDates(updated);
    }
    setMarkedActiveToday(true);
  }, [todayStr]);
  const streak = useMemo(() => {
    if (!activityDates.length) return 0;
    const sorted = [...activityDates].sort().reverse();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (sorted[0] !== todayStr && sorted[0] !== yesterday) return 0;
    let count = 0;
    let check = sorted[0];
    for (const d of sorted) {
      if (d === check) {
        count++;
        check = new Date(new Date(check).getTime() - 86400000).toISOString().split("T")[0];
      } else { break; }
    }
    return count;
  }, [activityDates, todayStr]);
  const lastActiveDate = activityDates.length > 0 ? activityDates[activityDates.length - 1] : null;
  const daysSinceActive = lastActiveDate
    ? Math.round((new Date(todayStr).getTime() - new Date(lastActiveDate).getTime()) / 86400000)
    : null;
  const planFeedback = useMemo((): { badge: string; badgeClass: string; message: string } => {
    if (markedActiveToday) {
      if (streak >= 7) return { badge: "Piano completato oggi", badgeClass: "dps-status-active", message: "Eccellente costanza. Stai costruendo un sistema commerciale solido ogni giorno." };
      if (streak >= 3) return { badge: "Piano completato oggi", badgeClass: "dps-status-active", message: "Buona progressione. La costanza è il motore della crescita commerciale su LinkedIn." };
      return { badge: "Piano completato oggi", badgeClass: "dps-status-active", message: "Oggi sei operativo. Ogni azione conta." };
    }
    if (daysSinceActive === null || daysSinceActive > 3) {
      return { badge: "Piano non ancora avviato", badgeClass: "dps-status-pending", message: "Nessuna attività recente rilevata. Oggi è il momento giusto per riprendere." };
    }
    if (daysSinceActive > 1) {
      const days = daysSinceActive - 1;
      return { badge: `Hai saltato ${days} ${days === 1 ? "giorno" : "giorni"}`, badgeClass: "dps-status-missed", message: "La costanza fa la differenza. Bastano 20 minuti al giorno per mantenere il momentum." };
    }
    return { badge: "Piano non ancora fatto oggi", badgeClass: "dps-status-pending", message: "Ieri eri operativo. Continua oggi per mantenere la serie attiva." };
  }, [markedActiveToday, streak, daysSinceActive]);
  const lastActiveLabel = useMemo(() => {
    if (!lastActiveDate) return "—";
    if (lastActiveDate === todayStr) return "Oggi";
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (lastActiveDate === yesterday) return "Ieri";
    return new Date(lastActiveDate).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  }, [lastActiveDate, todayStr]);
  const activityLevel = useMemo((): string => {
    const last7 = Array.from({ length: 7 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    );
    const count = last7.filter((d) => activityDates.includes(d)).length;
    if (count >= 5) return "Alta";
    if (count >= 3) return "Media";
    return "Bassa";
  }, [activityDates]);

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
            <div className="dash-modal-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" />
                <path d="m19.4 15-.8 1.4.3 1.6-1.4.8-1.2-1.1-1.6.4-.8 1.4h-1.6l-.8-1.4-1.6-.4-1.2 1.1-1.4-.8.3-1.6-.8-1.4-1.5-.4v-1.6l1.5-.4.8-1.4-.3-1.6 1.4-.8 1.2 1.1 1.6-.4.8-1.4h1.6l.8 1.4 1.6.4 1.2-1.1 1.4.8-.3 1.6.8 1.4 1.5.4v1.6z" />
              </svg>
            </div>
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

      <div className="dash-page-v5">

        {/* ── DAILY PLAN STATUS ── */}
        <section className="dps-wrap" aria-label="Piano del giorno">
          <div className="dps-blur-orb" aria-hidden="true" />
          <div className="dps-grid">
            <div className="dps-left">
              <div className={`dps-status-badge ${planFeedback.badgeClass}`}>
                <span className="dps-status-dot" aria-hidden="true" />
                {planFeedback.badge}
              </div>
              <h2 className="dps-title">Il tuo piano di oggi</h2>
              <p className="dps-message">{planFeedback.message}</p>
              <div className="dps-meta-row">
                <div className="dps-meta-item">
                  <span className="dps-meta-value">{streak > 0 ? streak : "—"}</span>
                  <span className="dps-meta-label">giorni consecutivi</span>
                </div>
                <div className="dps-meta-item">
                  <span className="dps-meta-value">{lastActiveLabel}</span>
                  <span className="dps-meta-label">ultima attività</span>
                </div>
                <div className="dps-meta-item">
                  <span className="dps-meta-value">{contacts.length}</span>
                  <span className="dps-meta-label">profili analizzati</span>
                </div>
              </div>
              {!markedActiveToday && (
                <Link href="/app/find-clients" className="dps-cta" onClick={markActiveToday}>
                  Inizia il piano di oggi
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </Link>
              )}
            </div>
            <div className="dps-right">
              <p className="dps-actions-panel-title">Priorità di oggi</p>
              <Link href="/app/find-clients" className="dps-action-item" onClick={markActiveToday}>
                <span className="dps-action-item-text">Trova 3 nuovi profili da contattare</span>
                <span className="dps-action-item-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/app/dm" className="dps-action-item" onClick={markActiveToday}>
                <span className="dps-action-item-text">Sblocca 2 conversazioni in corso</span>
                <span className="dps-action-item-arrow" aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                className="dps-action-item"
                onClick={() => { markActiveToday(); setDashMode("post"); }}
              >
                <span className="dps-action-item-text">Pubblica 1 contenuto mirato</span>
                <span className="dps-action-item-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="dps-signals">
            <span className="dps-signal-chip">Outreach: decision maker inattivi da riattivare</span>
            <span className="dps-signal-chip">Follow-up: conversazioni con ultimo touch &gt; 5 giorni</span>
            <span className="dps-signal-chip">Contenuto: errori comuni in fase di acquisizione</span>
          </div>
        </section>

        {/* ── ACTIVITY EVALUATION ── */}
        <div className="dact-section" role="complementary" aria-label="Valutazione attività">
          <div className="dact-stat">
            <span className="dact-label">Costanza</span>
            <span className="dact-value">{activityLevel}</span>
          </div>
          <div className="dact-stat">
            <span className="dact-label">Serie attiva</span>
            <span className="dact-value">{streak > 0 ? `${streak} gg` : "—"}</span>
          </div>
          <div className="dact-stat">
            <span className="dact-label">Profili analizzati</span>
            <span className="dact-value">{contacts.length}</span>
          </div>
          <div className="dact-stat">
            <span className="dact-label">Promemoria</span>
            <p className="dact-reminder-text">
              {activityLevel === "Alta"
                ? "Ritmo eccellente. La costanza trasforma l\u2019effort in risultati concreti."
                : activityLevel === "Media"
                ? "Buon ritmo. Aumenta la frequenza per consolidare pipeline e presenza commerciale."
                : "L\u2019azione quotidiana \u00e8 il motore dell\u2019acquisizione. Anche una sessione breve fa la differenza."}
            </p>
          </div>
        </div>

        {/* ── CORE ACTIONS V5 ── */}
        <section className="dash-core-v5-section" aria-label="Azioni principali">
          <div className="dash-core-v5-head">
            <h3 className="dash-core-v5-title">Azioni principali</h3>
            <p className="dash-core-v5-sub">Le tre leve della tua acquisizione commerciale su LinkedIn.</p>
          </div>
          <div className="dash-core-v5-grid">
            {CORE_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="dash-core-v5-card"
                onClick={markActiveToday}
              >
                <div className={`dash-core-v5-icon dash-core-v5-icon-${action.id}`}>{action.icon}</div>
                <h4 className="dash-core-v5-card-title">{action.title}</h4>
                <p className="dash-core-v5-card-desc">{action.desc}</p>
                <span className="dash-core-v5-card-cta">
                  {action.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SECONDARY OPS V5 ── */}
        <section className="dash-ops-v5-section" aria-label="Strumenti operativi">
          <div className="dash-ops-v5-head">
            <h3 className="dash-ops-v5-title">Strumenti operativi</h3>
            <p className="dash-ops-v5-sub">Contenuti, risposte e avanzamento conversazioni quando servono.</p>
          </div>
          <div className="dash-ops-v5-grid">
            {SECONDARY_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`dash-ops-v5-card${dashMode === tool.id ? " dash-ops-v5-card-active" : ""}`}
                onClick={() => { markActiveToday(); setDashMode(dashMode === tool.id ? null : tool.id); }}
              >
                <div className="dash-ops-v5-icon">{tool.icon}</div>
                <div className="dash-ops-v5-body">
                  <h4 className="dash-ops-v5-title-card">{tool.title}</h4>
                  <p className="dash-ops-v5-desc">{tool.desc}</p>
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
                  <ResultHeader title="Output strategico" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.43 1 .96 1.2 1.6h5.6c.2-.64.6-1.17 1.2-1.6A7 7 0 0 0 12 2Z"/></svg>} label="Hook (5 opzioni)" text={postResult.hooks.join("\n\n")} variant="evidence" />
                  <SectionDivider label="Versioni" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h5l11-11a2.12 2.12 0 0 0-3-3L5 18z"/></svg>} label="Versione pulita" text={postResult.post_versions.clean} variant="message" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>} label="Versione diretta" text={postResult.post_versions.direct} variant="message" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17V5"/><path d="M7 9h10"/></svg>} label="Versione autorevole" text={postResult.post_versions.authority} variant="message" copyable />
                  <SectionDivider label="Engagement" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11h6l2-3v10l-2-3H3z"/><path d="M14 9a5 5 0 0 1 0 6"/></svg>} label="CTA" text={postResult.cta} variant="strategy" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/></svg>} label="Commento starter" text={postResult.comment_starter} variant="strategy" />
                  <div className="insight-next-action">
                    <span className="insight-next-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></span>
                    <div><strong>Prossimo passo:</strong> {postResult.next_step}</div>
                  </div>

                  {/* Immagine suggerita */}
                  {postResult.suggerimento_immagine && (
                    <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m21 16-5.5-5.5L8 18"/></svg>} label="Immagine suggerita" text={`${postResult.suggerimento_immagine.tipo}\n\n${postResult.suggerimento_immagine.perche_funziona}\n\nPreferisci sempre foto reali: mentre lavori, del tuo ambiente o screenshot del tuo lavoro reale.`} variant="evidence" />
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

              <p className="qa-microcopy">Consiglio: usa foto reali quando possibile. L&apos;immagine generata è un punto di partenza.</p>

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
                      {commentProfileLoading ? "Analizzo…" : commentProfileAnalyzed ? "Analisi completata" : "Analizza profilo"}
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
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>} label={`Tipo: ${commentResult.comment_type} · Calore: ${commentResult.client_heat_level}`} text={commentResult.strategy} variant="summary" />
                  <SectionDivider label="Risposte suggerite" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/></svg>} label="Risposta empatica" text={commentResult.replies.soft} variant="message" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5"/></svg>} label="Risposta autorevole" text={commentResult.replies.authority} variant="message" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>} label="Porta in DM" text={commentResult.replies.dm_pivot} variant="message" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>} label="Messaggio DM suggerito" text={commentResult.suggested_dm} variant="strategy" copyable />
                  {commentResult.message_risk_warning && commentResult.message_risk_warning !== "nessuno" && (
                    <div className="insight-warn-inline">
                      <span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg></span>
                      <span>{commentResult.message_risk_warning}</span>
                    </div>
                  )}
                  <div className="insight-next-action">
                    <span className="insight-next-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></span>
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
                      {dmProfileLoading ? "Analizzo…" : dmProfileAnalyzed ? "Analisi completata" : "Analizza profilo"}
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
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/></svg>} label={`Risposta migliore · Calore: ${dmResult.client_heat_level}`} text={dmResult.best_reply} variant="message" copyable />
                  <SectionDivider label="Alternative" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>} label="Versione breve" text={dmResult.alternatives.short} variant="message" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5"/></svg>} label="Versione diretta" text={dmResult.alternatives.assertive} variant="message" copyable />
                  <SectionDivider label="Approfondimento" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.43 1 .96 1.2 1.6h5.6c.2-.64.6-1.17 1.2-1.6A7 7 0 0 0 12 2Z"/></svg>} label="Domande qualificanti" text={dmResult.qualifying_questions.join("\n\n")} variant="evidence" />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>} label="Follow-up 48h" text={dmResult.followups["48h"]} variant="strategy" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>} label="Follow-up 5 giorni" text={dmResult.followups["5d"]} variant="strategy" copyable />
                  <InsightCard icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>} label="Follow-up 10 giorni" text={dmResult.followups["10d"]} variant="strategy" copyable />
                  {dmResult.message_risk_warning && dmResult.message_risk_warning !== "nessuno" && (
                    <div className="insight-warn-inline">
                      <span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg></span>
                      <span>{dmResult.message_risk_warning}</span>
                    </div>
                  )}
                  <div className="insight-next-action">
                    <span className="insight-next-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg></span>
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
                      {convProfileLoading ? "Analizzo…" : convProfileAnalyzed ? "Analisi completata" : "Analizza profilo"}
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
                  <ResultHeader title="Analisi conversazione" />
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
                  <ResultHeader title="Piano follow-up" />
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
        <section className="dash-v2-section dash-v2-section-bottom">
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
        <section className="dash-v2-section dash-v2-section-bottom">
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


