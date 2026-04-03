"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import InsightCard, { ResultHeader, SectionDivider } from "@/components/app/InsightCard";
import OpportunityCard from "@/components/app/OpportunityCard";
import ActionCard from "@/components/app/ActionCard";
import type { AnalyzedContact } from "@/lib/sales/schemas";

const MODAL_DISMISSED_KEY = "onboarding-modal-dismissed";
const DASH_METRICS_KEY = "preflight-dashboard-metrics-v1";

type DashboardMetrics = {
  postsPublished: number;
  messagesHandled: number;
  followupsDone: number;
  aiSessions: number;
};

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
    title: "Trova clienti",
    desc: "Scopri rapidamente i profili più rilevanti da attivare oggi su LinkedIn.",
    cta: "Apri strumento",
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
    title: "Analizza profilo",
    desc: "Valuta fit, priorità e angolo di attacco prima di iniziare una conversazione.",
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
    title: "Strategia conversazione",
    desc: "Ottieni il prossimo messaggio strategico per avanzare la conversazione verso la call.",
    cta: "Apri strategia",
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
  const [, setMarkedActiveToday] = useState(false);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    postsPublished: 0,
    messagesHandled: 0,
    followupsDone: 0,
    aiSessions: 0,
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored: string[] = JSON.parse(localStorage.getItem("preflight-activity-dates") || "[]");
    setActivityDates(stored);
    setMarkedActiveToday(stored.includes(todayStr));

    const metrics: DashboardMetrics = JSON.parse(
      localStorage.getItem(DASH_METRICS_KEY) ||
      '{"postsPublished":0,"messagesHandled":0,"followupsDone":0,"aiSessions":0}',
    );
    setDashboardMetrics(metrics);
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
  const trackDashboardMetric = useCallback((metric: keyof DashboardMetrics, amount = 1) => {
    setDashboardMetrics((prev) => {
      const next = { ...prev, [metric]: prev[metric] + amount };
      if (typeof window !== "undefined") {
        localStorage.setItem(DASH_METRICS_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);
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
  const currentWeekActiveDays = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    );
    return last7.filter((d) => activityDates.includes(d)).length;
  }, [activityDates]);
  const previousWeekActiveDays = useMemo(() => {
    const prev7 = Array.from({ length: 7 }, (_, i) =>
      new Date(Date.now() - (i + 7) * 86400000).toISOString().split("T")[0],
    );
    return prev7.filter((d) => activityDates.includes(d)).length;
  }, [activityDates]);
  const weeklyDelta = currentWeekActiveDays - previousWeekActiveDays;
  const activeDaysLast30 = useMemo(() => {
    const last30 = Array.from({ length: 30 }, (_, i) =>
      new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    );
    return last30.filter((d) => activityDates.includes(d)).length;
  }, [activityDates]);
  const activityIndex = useMemo(() => {
    // 1. Client research activity: profiles analyzed (max 25)
    const researchScore = Math.min(25, Math.round(contacts.length * 2.5));
    // 2. Conversation activity: messages + follow-ups + strategic AI sessions (max 35)
    const convScore = Math.min(35, dashboardMetrics.messagesHandled * 2 + dashboardMetrics.followupsDone * 3 + dashboardMetrics.aiSessions);
    // 3. Content activity: posts published (max 20)
    const contentScore = Math.min(20, dashboardMetrics.postsPublished * 4);
    // 4. Continuity: active days in last 30 (max 20)
    const continuityScore = Math.min(20, Math.round((activeDaysLast30 / 20) * 20));
    return Math.max(0, Math.min(100, Math.round(researchScore + convScore + contentScore + continuityScore)));
  }, [contacts.length, dashboardMetrics, activeDaysLast30]);
  const activityIndexStatus = useMemo(() => {
    if (activityIndex >= 75) return { label: "Ritmo commerciale solido", className: "acti-status-high" };
    if (activityIndex >= 45) return { label: "Impegno discontinuo", className: "acti-status-mid" };
    return { label: "Slancio commerciale basso", className: "acti-status-low" };
  }, [activityIndex]);
  const smartAlert = useMemo(() => {
    if (weeklyDelta >= 2 && activityIndex >= 75) {
      return {
        title: "Ritmo in crescita",
        body: "L'intensità settimanale è in aumento. Mantieni la frequenza su ricerca, conversazioni e contenuti per consolidare la pipeline.",
        className: "smart-alert-positive",
      };
    }
    if ((daysSinceActive ?? 0) >= 2 || weeklyDelta < 0) {
      return {
        title: "Ritmo in calo",
        body: "L'attività recente è diminuita. Riparti oggi con profili da analizzare e conversazioni ferme da riattivare.",
        className: "smart-alert-warning",
      };
    }
    return {
      title: "Opportunità da capitalizzare",
      body: "Il margine di miglioramento è concreto: più follow-up sistematici e un ritmo di ricerca più costante aumentano la probabilità di call.",
      className: "smart-alert-risk",
    };
  }, [weeklyDelta, activityIndex, daysSinceActive]);

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
      trackDashboardMetric("postsPublished");
      trackDashboardMetric("aiSessions");
      markActiveToday();
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
        trackDashboardMetric("aiSessions");
        markActiveToday();
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
      trackDashboardMetric("messagesHandled");
      trackDashboardMetric("aiSessions");
      markActiveToday();
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
      trackDashboardMetric("messagesHandled");
      trackDashboardMetric("aiSessions");
      markActiveToday();
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
      trackDashboardMetric("messagesHandled");
      trackDashboardMetric("aiSessions");
      markActiveToday();
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
      trackDashboardMetric("followupsDone");
      trackDashboardMetric("aiSessions");
      markActiveToday();
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
      trackDashboardMetric("aiSessions");
      markActiveToday();
    } catch {
      setImageUrl("");
    } finally {
      setImageLoading(false);
    }
  }

  function openContactAnalysis(contact: AnalyzedContact) {
    void contact;
    router.push("/app/prospect");
  }

  function openContactAdvice(contact: AnalyzedContact) {
    void contact;
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

      <div className="dash-page-v6">

        {/* ═══════════════════════════════════════════════════════════
            HEADER — Premium branded hero
        ═══════════════════════════════════════════════════════════ */}
        <div className="dash-hero">
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="dash-page-eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>
              ◆ Sala operativa
            </p>
            <h1 className="dash-page-title-v7" style={{
              background: "none", WebkitBackgroundClip: "unset", WebkitTextFillColor: "#fff",
              color: "#fff", fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)"
            }}>Le tue opportunità di oggi</h1>
            <p className="dash-page-sub-v7" style={{ color: "rgba(255,255,255,0.5)" }}>
              Parti da ciò che può generare una conversazione o avvicinarti a una call.
            </p>
          </div>
          <div className="dash-hero-kpis">
            <div className="dash-hero-kpi">
              <span className="dash-hero-kpi-value">{activityIndex}</span>
              <span className="dash-hero-kpi-label">Indice attività</span>
            </div>
            <div className="dash-hero-kpi">
              <span className="dash-hero-kpi-value">{streak > 0 ? `${streak}g` : "0g"}</span>
              <span className="dash-hero-kpi-label">Streak</span>
            </div>
            <div className="dash-hero-kpi">
              <span className="dash-hero-kpi-value">{contacts.length}</span>
              <span className="dash-hero-kpi-label">Profili</span>
            </div>
            <div className="dash-hero-kpi">
              <span className="dash-hero-kpi-value">{dashboardMetrics.messagesHandled}</span>
              <span className="dash-hero-kpi-label">Messaggi</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SEZIONE 1 — OPPORTUNITÀ DI OGGI
        ═══════════════════════════════════════════════════════════ */}
        <section className="opp-section-v7" aria-label="Opportunità di oggi">
          <div className="opp-grid-v7">
            <OpportunityCard
              icon="🔴"
              variant="urgent"
              title="Follow-up urgenti"
              reason="Luca Martini (CEO, agenzia digital) — call esplorativa 10 giorni fa, nessuna risposta al recap. La finestra di follow-up si chiude tra 2-3 giorni."
              action="Invia DM con micro-insight sul suo problema specifico (conversion rate al 12%). Non riproporre la call, riattiva l'interesse."
            />
            <OpportunityCard
              icon="📞"
              variant="call"
              title="Azione con più probabilità di call"
              reason="Marco Bianchi (Founder SaaS CRM) — ha commentato un tuo post ieri, sta assumendo 2 sales. Segnale forte: espansione team → bisogno di pipeline."
              action="Rispondi al suo commento con un insight concreto, poi invia DM personalizzato. Proponi 15 min su come generare pipeline per i nuovi sales."
            />
            <OpportunityCard
              icon="🟡"
              variant="warm"
              title="Prospect da contattare oggi"
              reason="Sara Ferri (Head of Sales, consulenza B2B) — ha interagito con 3 tuoi post nell'ultimo mese. Il suo team sta lanciando un nuovo servizio."
              action="Invia richiesta di connessione con nota personalizzata. Fai riferimento al nuovo servizio e proponi uno scambio di idee su pipeline."
            />
            <OpportunityCard
              icon="🔓"
              variant="unlock"
              title="Conversazione da sbloccare"
              reason="Andrea Colombo (VP Sales, SaaS fintech) — ha accettato la connessione 5 giorni fa, ha visto il tuo profilo ma non ha risposto al primo messaggio."
              action="Commenta un suo post recente per tornare visibile, poi invia un secondo messaggio con un angolo diverso (es. case study specifico fintech)."
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SEZIONE 2 — AZIONI PRIORITARIE
        ═══════════════════════════════════════════════════════════ */}
        <section className="pri-section-v7" aria-label="Azioni prioritarie">
          <div className="pri-head-v7">
            <h3 className="pri-title-v7">Azioni prioritarie</h3>
            <p className="pri-sub-v7">Le 3 azioni che hanno il maggior impatto oggi sulla tua pipeline.</p>
          </div>
          <div className="pri-list-v7">
            <ActionCard
              priority="alta"
              why="Il follow-up con Luca Martini è nella finestra critica. Dopo 14 giorni la conversazione si raffredda e ripartire costa 3x lo sforzo."
              what="Apri LinkedIn → DM a Luca → Condividi il dato sul follow-up day 3-7 (dove il 40% dei deal muore) → Proponi 10 min questa settimana."
            />
            <ActionCard
              priority="alta"
              why="Marco Bianchi ha commentato il tuo post ieri. Rispondere entro 24h mantiene il momentum. Dopo 48h il thread è morto."
              what="Rispondi al commento con un insight su pipeline per nuovi sales → Se risponde, invia richiesta di connessione → Prepara DM per domani."
            />
            <ActionCard
              priority="media"
              why={`Non pubblichi da 4 giorni. L'ultimo post ha performato bene (1.200 impression). L'algoritmo è "caldo" — pubblicare oggi massimizza la portata.`}
              what="Pubblica tra le 8:00-9:30 → Nei primi 30 min rispondi a ogni commento entro 5 min → Se un decision-maker commenta, segnalo come prospect caldo."
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SEZIONE 3 — CONVERSAZIONI E FOLLOW-UP
        ═══════════════════════════════════════════════════════════ */}
        <section className="conv-section" aria-label="Conversazioni e follow-up">
          <div className="conv-head">
            <h3 className="conv-title">Conversazioni e follow-up</h3>
            <p className="conv-sub">Stato delle conversazioni attive e prossimo passo per ciascuna.</p>
          </div>
          <div className="conv-list">
            <div className="conv-row">
              <div className="conv-avatar">LM</div>
              <div className="conv-info">
                <span className="conv-name">Luca Martini</span>
                <span className="conv-role">CEO · Agenzia digital · 15 persone</span>
              </div>
              <span className="conv-status conv-status-stale">In stallo (10gg)</span>
              <span className="conv-step">→ DM con micro-insight sul conversion rate</span>
            </div>
            <div className="conv-row">
              <div className="conv-avatar">SF</div>
              <div className="conv-info">
                <span className="conv-name">Sara Ferri</span>
                <span className="conv-role">Head of Sales · Consulenza B2B</span>
              </div>
              <span className="conv-status conv-status-warm">Segnale caldo</span>
              <span className="conv-step">→ Richiesta connessione + nota personalizzata</span>
            </div>
            <div className="conv-row">
              <div className="conv-avatar">AC</div>
              <div className="conv-info">
                <span className="conv-name">Andrea Colombo</span>
                <span className="conv-role">VP Sales · SaaS fintech</span>
              </div>
              <span className="conv-status conv-status-cold">Connesso, no risposta</span>
              <span className="conv-step">→ Commenta un suo post, poi 2° messaggio</span>
            </div>
            <div className="conv-row">
              <div className="conv-avatar">MB</div>
              <div className="conv-info">
                <span className="conv-name">Marco Bianchi</span>
                <span className="conv-role">Founder · SaaS CRM per PMI</span>
              </div>
              <span className="conv-status conv-status-hot">Alta probabilità call</span>
              <span className="conv-step">→ Rispondi al commento + DM domani</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SEZIONE 4 — PROSPECT AD ALTA PRIORITÀ
        ═══════════════════════════════════════════════════════════ */}
        <section className="prosp-section" aria-label="Prospect ad alta priorità">
          <div className="prosp-head">
            <h3 className="prosp-title">Prospect ad alta priorità</h3>
            <p className="prosp-sub">I profili con il segnale di timing più forte questa settimana.</p>
          </div>
          <div className="prosp-grid">
            <div className="prosp-card">
              <div className="prosp-card-top">
                <div className="prosp-card-avatar">MB</div>
                <div>
                  <h4 className="prosp-card-name">Marco Bianchi</h4>
                  <p className="prosp-card-role">Founder · SaaS CRM per PMI</p>
                </div>
              </div>
              <p className="prosp-card-reason"><strong>Rilevanza:</strong> Sta assumendo 2 sales → ha bisogno di pipeline subito. Ha commentato il tuo post = awareness già presente.</p>
              <p className="prosp-card-action">Commenta il suo post sull&apos;hiring con insight su ramp-up sales, poi connessione personalizzata.</p>
            </div>
            <div className="prosp-card">
              <div className="prosp-card-top">
                <div className="prosp-card-avatar">SF</div>
                <div>
                  <h4 className="prosp-card-name">Sara Ferri</h4>
                  <p className="prosp-card-role">Head of Sales · Consulenza B2B (50-200 dip.)</p>
                </div>
              </div>
              <p className="prosp-card-reason"><strong>Rilevanza:</strong> 3 interazioni in un mese (warm signal). Nuovo servizio in lancio → bisogno di acquisire nuovi clienti per quel verticale.</p>
              <p className="prosp-card-action">Connessione con nota su come altri team gestiscono pipeline durante un lancio. Proponi 15 min.</p>
            </div>
            <div className="prosp-card">
              <div className="prosp-card-top">
                <div className="prosp-card-avatar">GR</div>
                <div>
                  <h4 className="prosp-card-name">Giulia Rossi</h4>
                  <p className="prosp-card-role">CRO · Scale-up SaaS (serie A, 80 persone)</p>
                </div>
              </div>
              <p className="prosp-card-reason"><strong>Rilevanza:</strong> Ha pubblicato un post sulla difficoltà di prevedere la pipeline Q2. Il team sales è passato da 4 a 12 persone in 6 mesi.</p>
              <p className="prosp-card-action">Commenta con esperienza su pipeline forecasting in fase di scaling. Se risponde, proponi scambio di idee.</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SEZIONE 5 — AVANZAMENTO (ex Performance, ridotta)
        ═══════════════════════════════════════════════════════════ */}
        <section className="perf-reduced" aria-label="Avanzamento verso call">
          <div className="perf-reduced-head">
            <h3 className="perf-reduced-title">Avanzamento</h3>
            <p className="perf-reduced-sub">Metriche sintetiche sulla tua attività commerciale.</p>
          </div>
          <div className="perf-reduced-grid">
            <div className="perf-reduced-card">
              <span className="perf-reduced-label">Indice attività</span>
              <span className="perf-reduced-value">{activityIndex}<span className="perf-reduced-over">/100</span></span>
              <span className={`perf-reduced-status ${activityIndexStatus.className}`}>{activityIndexStatus.label}</span>
            </div>
            <div className="perf-reduced-card">
              <span className="perf-reduced-label">Streak attivo</span>
              <span className="perf-reduced-value">{streak > 0 ? `${streak} gg` : "0 gg"}</span>
            </div>
            <div className="perf-reduced-card">
              <span className="perf-reduced-label">Giorni attivi (30g)</span>
              <span className="perf-reduced-value">{activeDaysLast30}</span>
            </div>
            <div className="perf-reduced-card">
              <span className="perf-reduced-label">Profili analizzati</span>
              <span className="perf-reduced-value">{contacts.length}</span>
            </div>
            <div className="perf-reduced-card">
              <span className="perf-reduced-label">Messaggi gestiti</span>
              <span className="perf-reduced-value">{dashboardMetrics.messagesHandled}</span>
            </div>
            <div className="perf-reduced-card">
              <span className="perf-reduced-label">Trend settimanale</span>
              <span className={`perf-reduced-value ${weeklyDelta >= 0 ? "perf-trend-up" : "perf-trend-down"}`}>
                {weeklyDelta >= 0 ? `+${weeklyDelta}` : weeklyDelta}
              </span>
            </div>
          </div>
          {smartAlert && (
            <div className={`smart-alert ${smartAlert.className}`} role="status" aria-live="polite">
              <p className="smart-alert-title">{smartAlert.title}</p>
              <p className="smart-alert-body">{smartAlert.body}</p>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SEZIONE 6 — STRUMENTI DI SUPPORTO
        ═══════════════════════════════════════════════════════════ */}
        <section className="support-tools-section" aria-label="Strumenti di supporto">
          <div className="support-tools-head">
            <h3 className="support-tools-title">Strumenti di supporto</h3>
            <p className="support-tools-sub">Usa questi strumenti quando hai bisogno di creare contenuti, messaggi o approfondire un profilo.</p>
          </div>

          {/* Core actions */}
          <div className="main-tools-grid">
            {CORE_ACTIONS.map((action) => (
              <Link key={action.id} href={action.href} className="main-tool-card" onClick={markActiveToday}>
                <div className={`main-tool-icon main-tool-icon-${action.id}`}>{action.icon}</div>
                <h4 className="main-tool-title">{action.title}</h4>
                <p className="main-tool-desc">{action.desc}</p>
                <span className="main-tool-cta">{action.cta} →</span>
              </Link>
            ))}
          </div>

          {/* Secondary tools */}
          <div className="dash-ops-v5-grid" style={{ marginTop: "1rem" }}>
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


