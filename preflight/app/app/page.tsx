"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { AnalyzedContact } from "@/lib/sales/schemas";

const MODAL_DISMISSED_KEY = "onboarding-modal-dismissed";

type DashMode =
  | null
  | "profile"
  | "advice"
  | "post"
  | "comment"
  | "dm"
  | "conversation"
  | "followup"
  | "image";

/* ─── Tool definitions (Sezione Strumenti operativi) ─── */
const TOOLS: {
  id: DashMode & string;
  icon: string;
  title: string;
  desc: string;
}[] = [
  {
    id: "profile",
    icon: "👤",
    title: "Analizza questo profilo",
    desc: "Incolla un profilo LinkedIn e scopri se contattarlo e come.",
  },
  {
    id: "advice",
    icon: "💬",
    title: "Chiedimi un consiglio",
    desc: "Descrivi una situazione e scopri come muoverti.",
  },
  {
    id: "post",
    icon: "✍️",
    title: "Scrivi un post",
    desc: "Genera un post LinkedIn efficace con hook e CTA.",
  },
  {
    id: "image",
    icon: "🖼️",
    title: "Genera immagine per il post",
    desc: "Crea un'immagine professionale per il tuo post.",
  },
  {
    id: "comment",
    icon: "💡",
    title: "Scrivi un commento",
    desc: "Rispondi a un commento in modo strategico.",
  },
  {
    id: "dm",
    icon: "✉️",
    title: "Scrivi un messaggio DM",
    desc: "Ottieni la risposta migliore per una conversazione DM.",
  },
  {
    id: "conversation",
    icon: "🗣️",
    title: "Gestisci conversazione",
    desc: "Analizza una conversazione in corso e scopri come portarla avanti.",
  },
  {
    id: "followup",
    icon: "🔄",
    title: "Scrivi follow-up",
    desc: "Genera un follow-up naturale per riprendere una conversazione.",
  },
];

export default function AppTodayPage() {
  const { data: session } = useSession();
  const [dashMode, setDashMode] = useState<DashMode>(null);

  /* ── Daily plan state ── */
  const [dailyPlan, setDailyPlan] = useState<{
    persone_da_contattare: { tipo_profili: string; link_ricerca: string; criteri_scelta: string; primo_messaggio: string; strategia: string };
    contenuto_consigliato: { idea_post: string; struttura: string; esempio_testo: string; suggerimento_immagine: string };
    conversazioni_da_seguire: { followup_da_fare: string; quando_scrivere: string; cosa_chiedere: string; esempio_followup: string };
  } | null>(null);
  const [dailyPlanLoading, setDailyPlanLoading] = useState(false);

  /* ── Profile analysis state ── */
  const [quickLinkedinUrl, setQuickLinkedinUrl] = useState("");
  const [quickPdfFile, setQuickPdfFile] = useState<File | null>(null);
  const [quickShowGuide, setQuickShowGuide] = useState(false);
  const [quickWebsiteUrl, setQuickWebsiteUrl] = useState("");
  const [quickProfileDesc, setQuickProfileDesc] = useState("");
  const [quickProfileResult, setQuickProfileResult] = useState<{
    nome_contatto?: string; ruolo_contatto?: string; azienda_contatto?: string;
    chi_e: string; ruolo_e_contesto: string; perche_buon_contatto: string;
    strategia_contatto: string; primo_messaggio: string; followup_consigliato: string;
    step_successivi: string; segnali_da_osservare: string;
  } | null>(null);
  const [quickProfileLoading, setQuickProfileLoading] = useState(false);

  /* ── Advice state ── */
  const [quickSituation, setQuickSituation] = useState("");
  const [quickAdviceLinkedinUrl, setQuickAdviceLinkedinUrl] = useState("");
  const [quickAdvicePdfFile, setQuickAdvicePdfFile] = useState<File | null>(null);
  const [quickAdviceWebsiteUrl, setQuickAdviceWebsiteUrl] = useState("");
  const [quickAdviceResult, setQuickAdviceResult] = useState<{
    lettura_situazione: string; strategia: string;
    risposta_consigliata: string; followup_consigliato: string;
    step_successivi: string; errori_da_evitare: string;
  } | null>(null);
  const [quickAdviceLoading, setQuickAdviceLoading] = useState(false);

  /* ── Find clients state ── */
  const [findTipoCliente, setFindTipoCliente] = useState("");
  const [findSettore, setFindSettore] = useState("");
  const [findArea, setFindArea] = useState("");
  const [findResult, setFindResult] = useState<{
    tipo_cliente_ideale: string; come_cercarlo: string;
    link_ricerca_linkedin: string; suggerimenti_filtri: string;
    profili_simili: string; cosa_fare_dopo: string;
  } | null>(null);
  const [findLoading, setFindLoading] = useState(false);

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

  async function handleDashProfile() {
    if (!quickLinkedinUrl.trim() && !quickWebsiteUrl.trim() && !quickProfileDesc.trim()) return;
    if (quickProfileLoading) return;
    setQuickProfileLoading(true);
    setQuickProfileResult(null);
    try {
      let pdfText = "";
      if (quickPdfFile) pdfText = `[PDF caricato: ${quickPdfFile.name}]`;

      const inputParts: string[] = [];
      if (quickLinkedinUrl.trim()) inputParts.push(`Profilo LinkedIn: ${quickLinkedinUrl}`);
      if (quickWebsiteUrl.trim()) inputParts.push(`Sito web: ${quickWebsiteUrl}`);
      if (quickProfileDesc.trim()) inputParts.push(`Descrizione persona: ${quickProfileDesc}`);

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analizza questo profilo:\n${inputParts.join("\n")}`,
          advice: true,
          assistantMode: "profile",
          profile: profile.onboarding || undefined,
          linkedinUrl: quickLinkedinUrl.trim() || undefined,
          profileInfo: [pdfText, quickWebsiteUrl.trim() ? `Sito web: ${quickWebsiteUrl}` : ""].filter(Boolean).join("\n") || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      if (data.structured) {
        setQuickProfileResult(data.structured);
        if (quickLinkedinUrl.trim()) saveContact(data.structured, quickLinkedinUrl.trim());
      }
    } catch {
      setQuickProfileResult({
        chi_e: "Si è verificato un errore. Riprova più tardi.",
        ruolo_e_contesto: "", perche_buon_contatto: "", strategia_contatto: "",
        primo_messaggio: "", followup_consigliato: "", step_successivi: "",
        segnali_da_osservare: "",
      });
    } finally {
      setQuickProfileLoading(false);
    }
  }

  async function handleDashAdvice() {
    if (!quickSituation.trim() || quickAdviceLoading) return;
    setQuickAdviceLoading(true);
    setQuickAdviceResult(null);
    try {
      let pdfText = "";
      if (quickAdvicePdfFile) pdfText = `[PDF caricato: ${quickAdvicePdfFile.name}]`;

      const extraParts: string[] = [];
      if (quickAdviceLinkedinUrl.trim()) extraParts.push(`Profilo LinkedIn: ${quickAdviceLinkedinUrl}`);
      if (pdfText) extraParts.push(pdfText);
      if (quickAdviceWebsiteUrl.trim()) extraParts.push(`Sito web: ${quickAdviceWebsiteUrl}`);

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: quickSituation,
          advice: true,
          assistantMode: "advice",
          profile: profile.onboarding || undefined,
          profileInfo: extraParts.length ? extraParts.join("\n") : undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      const data = await res.json();
      if (data.structured) setQuickAdviceResult(data.structured);
    } catch {
      setQuickAdviceResult({
        lettura_situazione: "Si è verificato un errore. Riprova più tardi.",
        strategia: "", risposta_consigliata: "", followup_consigliato: "",
        step_successivi: "", errori_da_evitare: "",
      });
    } finally {
      setQuickAdviceLoading(false);
    }
  }

  async function handleFindClients() {
    if (!findTipoCliente.trim() || findLoading) return;
    setFindLoading(true);
    setFindResult(null);
    try {
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_cliente: findTipoCliente,
          settore: findSettore || undefined,
          area_geografica: findArea || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      if (!res.ok) throw new Error("Errore");
      setFindResult(await res.json());
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

  async function handleGenerateDailyPlan() {
    if (dailyPlanLoading) return;
    setDailyPlanLoading(true);
    setDailyPlan(null);
    try {
      const res = await fetch("/api/ai/daily-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profile.onboarding || undefined }),
      });
      if (!res.ok) throw new Error("Errore");
      setDailyPlan(await res.json());
    } catch {
      setDailyPlan(null);
    } finally {
      setDailyPlanLoading(false);
    }
  }

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

  function openContactAnalysis(contact: AnalyzedContact) {
    setQuickLinkedinUrl(contact.linkedin_url);
    setQuickProfileResult(contact.result as typeof quickProfileResult);
    setDashMode("profile");
  }

  function openContactAdvice(contact: AnalyzedContact) {
    setQuickSituation(`Vorrei un consiglio su come continuare la conversazione con ${contact.nome} (${contact.ruolo} presso ${contact.azienda}).`);
    setDashMode("advice");
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
                Configura ora <span className="dash-btn-arrow">→</span>
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
          <h2 className="dash-hero-title">Cosa fare oggi</h2>
          <p className="dash-hero-sub">Preflight ti aiuta a trovare persone da contattare, capire come scriverle, generare contenuti e gestire le conversazioni.</p>
        </div>

        {/* ══════════════════════════════════════════════════════
            SEZIONE 1 — PIANO DI OGGI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <div className="dp-header">
            <div>
              <h3 className="dp-title">Cosa fare oggi</h3>
              <p className="dp-subtitle">In base al tuo servizio e ai clienti che cerchi, Preflight ti suggerisce cosa fare oggi su LinkedIn.</p>
            </div>
            <button
              type="button"
              onClick={handleGenerateDailyPlan}
              disabled={dailyPlanLoading}
              className="btn-primary"
            >
              {dailyPlanLoading ? (
                <><span className="qa-spinner" aria-hidden="true" />Genero il piano…</>
              ) : (
                <>{dailyPlan ? "Rigenera piano" : "Genera il piano di oggi"} <span className="dash-btn-arrow">→</span></>
              )}
            </button>
          </div>

          {dailyPlan && (
            <div className="dp-grid">
              {/* Blocco 1: Persone da contattare */}
              <div className="dp-card">
                <div className="dp-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h4 className="dp-card-title">Persone da contattare oggi</h4>
                {dailyPlan.persone_da_contattare.tipo_profili && (
                  <div className="dp-block"><span className="dp-block-label">Tipo profilo suggerito</span><p className="dp-block-text">{dailyPlan.persone_da_contattare.tipo_profili}</p></div>
                )}
                {dailyPlan.persone_da_contattare.link_ricerca && (
                  <div className="dp-block"><span className="dp-block-label">Ricerca LinkedIn</span><p className="dp-block-text"><a href={dailyPlan.persone_da_contattare.link_ricerca} target="_blank" rel="noopener noreferrer" className="qa-result-link">{dailyPlan.persone_da_contattare.link_ricerca}</a></p></div>
                )}
                {dailyPlan.persone_da_contattare.primo_messaggio && (
                  <div className="dp-block dp-block-highlight"><span className="dp-block-label">Messaggio iniziale suggerito</span><p className="dp-block-text">{dailyPlan.persone_da_contattare.primo_messaggio}</p></div>
                )}
                {dailyPlan.persone_da_contattare.strategia && (
                  <div className="dp-block"><span className="dp-block-label">Strategia</span><p className="dp-block-text">{dailyPlan.persone_da_contattare.strategia}</p></div>
                )}
                <button type="button" className="qa-cta-secondary dp-cta" onClick={() => setDashMode("profile")}>
                  Analizza questo profilo →
                </button>
              </div>

              {/* Blocco 2: Contenuto da pubblicare */}
              <div className="dp-card">
                <div className="dp-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </div>
                <h4 className="dp-card-title">Contenuto consigliato per oggi</h4>
                {dailyPlan.contenuto_consigliato.idea_post && (
                  <div className="dp-block"><span className="dp-block-label">Idea contenuto</span><p className="dp-block-text">{dailyPlan.contenuto_consigliato.idea_post}</p></div>
                )}
                {dailyPlan.contenuto_consigliato.struttura && (
                  <div className="dp-block"><span className="dp-block-label">Struttura post</span><p className="dp-block-text">{dailyPlan.contenuto_consigliato.struttura}</p></div>
                )}
                {dailyPlan.contenuto_consigliato.esempio_testo && (
                  <div className="dp-block dp-block-highlight"><span className="dp-block-label">Esempio di testo</span><p className="dp-block-text dp-block-pre">{dailyPlan.contenuto_consigliato.esempio_testo}</p></div>
                )}
                {dailyPlan.contenuto_consigliato.suggerimento_immagine && (
                  <div className="dp-block"><span className="dp-block-label">Suggerimento immagine</span><p className="dp-block-text">{dailyPlan.contenuto_consigliato.suggerimento_immagine}</p><p className="qa-microcopy" style={{ marginTop: ".35rem" }}>📸 Preferisci sempre foto reali: foto mentre lavori, il tuo ambiente, screenshot del tuo lavoro.</p></div>
                )}
              </div>

              {/* Blocco 3: Conversazioni da seguire */}
              <div className="dp-card">
                <div className="dp-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h4 className="dp-card-title">Conversazioni da seguire</h4>
                {dailyPlan.conversazioni_da_seguire.followup_da_fare && (
                  <div className="dp-block"><span className="dp-block-label">Follow-up da fare</span><p className="dp-block-text">{dailyPlan.conversazioni_da_seguire.followup_da_fare}</p></div>
                )}
                {dailyPlan.conversazioni_da_seguire.cosa_chiedere && (
                  <div className="dp-block"><span className="dp-block-label">Domande da fare</span><p className="dp-block-text">{dailyPlan.conversazioni_da_seguire.cosa_chiedere}</p></div>
                )}
                {dailyPlan.conversazioni_da_seguire.quando_scrivere && (
                  <div className="dp-block dp-block-highlight"><span className="dp-block-label">Quando proporre call</span><p className="dp-block-text">{dailyPlan.conversazioni_da_seguire.quando_scrivere}</p></div>
                )}
                {dailyPlan.conversazioni_da_seguire.esempio_followup && (
                  <div className="dp-block"><span className="dp-block-label">Esempio follow-up</span><p className="dp-block-text">{dailyPlan.conversazioni_da_seguire.esempio_followup}</p></div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════
            SEZIONE 2 — STRUMENTI OPERATIVI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <h3 className="dash-section-title">Strumenti</h3>

          {/* Mini promemoria "Cosa fare oggi" integrato nel flusso strumenti */}
          {!dailyPlan && (
            <div className="dp-inline-reminder" style={{ marginBottom: "1.25rem", padding: "1rem 1.25rem", borderRadius: ".75rem", border: "1px solid var(--border-secondary, #e5e5e5)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.25rem" }}>📋</span>
              <span style={{ flex: 1, fontSize: ".9rem", color: "var(--fg-secondary, #666)" }}>Non hai ancora generato il piano di oggi. Parti da lì per sapere cosa fare su LinkedIn.</span>
              <button type="button" onClick={handleGenerateDailyPlan} disabled={dailyPlanLoading} className="btn-secondary" style={{ whiteSpace: "nowrap" }}>
                {dailyPlanLoading ? "Genero…" : "Genera il piano di oggi →"}
              </button>
            </div>
          )}

          {dailyPlan && (
            <div className="dp-inline-reminder" style={{ marginBottom: "1.25rem", padding: "1rem 1.25rem", borderRadius: ".75rem", border: "1px solid var(--border-secondary, #e5e5e5)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1.25rem" }}>✅</span>
              <span style={{ flex: 1, fontSize: ".9rem", color: "var(--fg-secondary, #666)" }}>
                <strong>Piano di oggi attivo</strong> — {dailyPlan.persone_da_contattare.tipo_profili ? `Contatta: ${dailyPlan.persone_da_contattare.tipo_profili.substring(0, 80)}${dailyPlan.persone_da_contattare.tipo_profili.length > 80 ? "…" : ""}` : "Usa gli strumenti qui sotto per eseguire il piano."}
              </span>
            </div>
          )}

          <div className="tools-grid">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`tool-card${dashMode === tool.id ? " tool-card-active" : ""}`}
                onClick={() => setDashMode(dashMode === tool.id ? null : tool.id)}
              >
                <span className="tool-card-icon">{tool.icon}</span>
                <h4 className="tool-card-title">{tool.title}</h4>
                <p className="tool-card-desc">{tool.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            ACTIVE TOOL PANEL
        ══════════════════════════════════════════════════════ */}

        {/* ── ANALIZZA PROFILO ── */}
        {dashMode === "profile" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setQuickProfileResult(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Analizza questo profilo</h4>
                <p className="qa-section-sub">Scopri se vale la pena contattare questa persona e come muoverti.</p>
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
                <label className="qa-label">Link sito web <span className="qa-label-opt">(facoltativo, se azienda)</span></label>
                <input type="url" value={quickWebsiteUrl} onChange={(e) => setQuickWebsiteUrl(e.target.value)} className="qa-input" placeholder="https://azienda.com" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Descrizione della persona <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={quickProfileDesc} onChange={(e) => setQuickProfileDesc(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Founder SaaS B2B che pubblica su crescita aziendale." />
              </div>

              <button onClick={handleDashProfile} disabled={quickProfileLoading || (!quickLinkedinUrl.trim() && !quickWebsiteUrl.trim() && !quickProfileDesc.trim())} className="qa-btn">
                {quickProfileLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto analizzando…</>) : (<>Analizza profilo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {quickProfileResult && (
                <div className="qa-result">
                  {quickProfileResult.chi_e && <ResultBlock icon="user" label="Chi è questa persona" text={quickProfileResult.chi_e} />}
                  {quickProfileResult.ruolo_e_contesto && <ResultBlock icon="info" label="Ruolo e contesto" text={quickProfileResult.ruolo_e_contesto} />}
                  {quickProfileResult.perche_buon_contatto && <ResultBlock icon="bulb" label="Perché potrebbe essere un buon contatto" text={quickProfileResult.perche_buon_contatto} variant="valutazione" />}
                  {quickProfileResult.strategia_contatto && <ResultBlock icon="search" label="Strategia di contatto" text={quickProfileResult.strategia_contatto} />}
                  {quickProfileResult.primo_messaggio && <ResultBlock icon="chat" label="Primo messaggio consigliato" text={quickProfileResult.primo_messaggio} variant="reply" />}
                  {quickProfileResult.followup_consigliato && <ResultBlock icon="repeat" label="Follow-up consigliato" text={quickProfileResult.followup_consigliato} variant="reply" />}
                  {quickProfileResult.step_successivi && <ResultBlock icon="arrow" label="Step successivi" text={quickProfileResult.step_successivi} />}
                  {quickProfileResult.segnali_da_osservare && <ResultBlock icon="warn" label="Segnali da osservare" text={quickProfileResult.segnali_da_osservare} />}
                </div>
              )}

              {quickProfileResult && !profile.onboarding_complete && <OnboardingCallout />}
            </div>
          </section>
        )}

        {/* ── CHIEDIMI UN CONSIGLIO ── */}
        {dashMode === "advice" && (
          <section className="dash-section">
            <div className="qa-container qa-container-dash">
              <button type="button" className="qa-back-btn" onClick={() => { setDashMode(null); setQuickAdviceResult(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Torna agli strumenti
              </button>

              <div className="qa-section-header">
                <h4 className="qa-section-title">Chiedimi un consiglio</h4>
                <p className="qa-section-sub">Descrivi una situazione reale su LinkedIn e scopri come conviene muoverti.</p>
              </div>

              <div className="qa-field">
                <label className="qa-label">Spiegami la situazione</label>
                <textarea value={quickSituation} onChange={(e) => setQuickSituation(e.target.value)} className="qa-input qa-input-lg" rows={6} placeholder={"Ho scritto a un founder SaaS ma mi ha risposto in modo abbastanza generico.\nNon so se continuare la conversazione o cosa scrivere."} />
              </div>

              <div className="qa-field">
                <label className="qa-label">Link profilo LinkedIn della persona coinvolta <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="url" value={quickAdviceLinkedinUrl} onChange={(e) => setQuickAdviceLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" />
              </div>

              <div className="qa-field">
                <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
                <label className="qa-file-upload">
                  <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setQuickAdvicePdfFile(e.target.files?.[0] || null)} />
                  <span className="qa-file-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {quickAdvicePdfFile ? quickAdvicePdfFile.name : "Scegli un file PDF"}
                  </span>
                </label>
              </div>

              <div className="qa-field">
                <label className="qa-label">Link sito web azienda <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="url" value={quickAdviceWebsiteUrl} onChange={(e) => setQuickAdviceWebsiteUrl(e.target.value)} className="qa-input" placeholder="https://azienda.com" />
              </div>

              <button onClick={handleDashAdvice} disabled={quickAdviceLoading || !quickSituation.trim()} className="qa-btn">
                {quickAdviceLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto analizzando…</>) : (<>Chiedi un consiglio <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
              </button>

              {quickAdviceResult && (
                <div className="qa-result">
                  {quickAdviceResult.lettura_situazione && <ResultBlock icon="info" label="Lettura della situazione" text={quickAdviceResult.lettura_situazione} />}
                  {quickAdviceResult.strategia && <ResultBlock icon="check" label="Strategia" text={quickAdviceResult.strategia} />}
                  {quickAdviceResult.risposta_consigliata && <ResultBlock icon="chat" label="Risposta suggerita" text={quickAdviceResult.risposta_consigliata} variant="reply" />}
                  {quickAdviceResult.followup_consigliato && <ResultBlock icon="repeat" label="Follow-up" text={quickAdviceResult.followup_consigliato} variant="reply" />}
                  {quickAdviceResult.step_successivi && <ResultBlock icon="arrow" label="Step successivi" text={quickAdviceResult.step_successivi} />}
                  {quickAdviceResult.errori_da_evitare && <ResultBlock icon="warn" label="Errori da evitare" text={quickAdviceResult.errori_da_evitare} />}
                </div>
              )}

              {quickAdviceResult && !profile.onboarding_complete && <OnboardingCallout />}
            </div>
          </section>
        )}

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
                <div className="qa-result">
                  <ResultBlock icon="bulb" label="Hook (5 opzioni)" text={postResult.hooks.join("\n\n")} />
                  <ResultBlock icon="chat" label="Versione pulita" text={postResult.post_versions.clean} variant="reply" />
                  <ResultBlock icon="arrow" label="Versione diretta" text={postResult.post_versions.direct} variant="reply" />
                  <ResultBlock icon="check" label="Versione autorevole" text={postResult.post_versions.authority} variant="reply" />
                  <ResultBlock icon="info" label="CTA" text={postResult.cta} />
                  <ResultBlock icon="chat" label="Commento starter" text={postResult.comment_starter} />
                  <ResultBlock icon="arrow" label="Prossimo passo" text={postResult.next_step} />

                  {/* Immagine suggerita */}
                  {postResult.suggerimento_immagine && (
                    <div className="qa-result-block qa-result-valutazione">
                      <div className="qa-result-label"><RIcon type="image" /> Immagine suggerita per il post</div>
                      <p className="qa-result-text">{postResult.suggerimento_immagine.tipo}</p>
                      <p className="qa-result-text" style={{ marginTop: ".35rem", fontStyle: "italic", fontSize: ".82rem" }}>{postResult.suggerimento_immagine.perche_funziona}</p>
                      <p className="qa-microcopy" style={{ marginTop: ".5rem" }}>📸 Preferisci sempre foto reali: foto mentre lavori, il tuo ambiente, screenshot del tuo lavoro reale.</p>
                      <button
                        type="button"
                        className="qa-cta-secondary"
                        style={{ marginTop: ".75rem" }}
                        onClick={() => {
                          setDashMode("image");
                          setImageContent(postResult.post_versions.clean);
                        }}
                      >
                        Genera immagine per questo post →
                      </button>
                    </div>
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
                <div className="qa-result">
                  <ResultBlock icon="info" label={`Tipo: ${commentResult.comment_type} · Calore: ${commentResult.client_heat_level}`} text={commentResult.strategy} />
                  <ResultBlock icon="chat" label="Risposta empatica" text={commentResult.replies.soft} variant="reply" />
                  <ResultBlock icon="check" label="Risposta autorevole" text={commentResult.replies.authority} variant="reply" />
                  <ResultBlock icon="arrow" label="Porta in DM" text={commentResult.replies.dm_pivot} variant="reply" />
                  <ResultBlock icon="chat" label="Messaggio DM suggerito" text={commentResult.suggested_dm} variant="reply" />
                  {commentResult.message_risk_warning && commentResult.message_risk_warning !== "nessuno" && (
                    <ResultBlock icon="warn" label="Attenzione" text={commentResult.message_risk_warning} />
                  )}
                  <ResultBlock icon="arrow" label="Prossimo passo" text={commentResult.next_action} />
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
                <div className="qa-result">
                  <ResultBlock icon="chat" label={`Risposta migliore · Calore: ${dmResult.client_heat_level}`} text={dmResult.best_reply} variant="reply" />
                  <ResultBlock icon="arrow" label="Versione breve" text={dmResult.alternatives.short} variant="reply" />
                  <ResultBlock icon="check" label="Versione diretta" text={dmResult.alternatives.assertive} variant="reply" />
                  <ResultBlock icon="bulb" label="Domande qualificanti" text={dmResult.qualifying_questions.join("\n\n")} />
                  <ResultBlock icon="repeat" label="Follow-up 48h" text={dmResult.followups["48h"]} variant="reply" />
                  <ResultBlock icon="repeat" label="Follow-up 5 giorni" text={dmResult.followups["5d"]} variant="reply" />
                  <ResultBlock icon="repeat" label="Follow-up 10 giorni" text={dmResult.followups["10d"]} variant="reply" />
                  {dmResult.message_risk_warning && dmResult.message_risk_warning !== "nessuno" && (
                    <ResultBlock icon="warn" label="Attenzione" text={dmResult.message_risk_warning} />
                  )}
                  <ResultBlock icon="arrow" label="Prossimo passo" text={dmResult.next_action} />
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
                <div className="qa-result">
                  <ResultBlock icon="chat" label={`Risposta migliore · Calore: ${convResult.client_heat_level}`} text={convResult.best_reply} variant="reply" />
                  <ResultBlock icon="arrow" label="Versione breve" text={convResult.alternatives.short} variant="reply" />
                  <ResultBlock icon="check" label="Versione diretta" text={convResult.alternatives.assertive} variant="reply" />
                  <ResultBlock icon="bulb" label="Domande qualificanti" text={convResult.qualifying_questions.join("\n\n")} />
                  <ResultBlock icon="repeat" label="Follow-up 48h" text={convResult.followups["48h"]} variant="reply" />
                  <ResultBlock icon="repeat" label="Follow-up 5 giorni" text={convResult.followups["5d"]} variant="reply" />
                  <ResultBlock icon="repeat" label="Follow-up 10 giorni" text={convResult.followups["10d"]} variant="reply" />
                  {convResult.message_risk_warning && convResult.message_risk_warning !== "nessuno" && (
                    <ResultBlock icon="warn" label="Attenzione" text={convResult.message_risk_warning} />
                  )}
                  <ResultBlock icon="arrow" label="Prossimo passo" text={convResult.next_action} />
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
                <div className="qa-result">
                  <ResultBlock icon="info" label="Analisi della situazione" text={followupResult.analisi_situazione} />
                  <ResultBlock icon="chat" label="Messaggio follow-up" text={followupResult.messaggio_followup} variant="reply" />
                  <ResultBlock icon="arrow" label="Variante breve" text={followupResult.variante_breve} variant="reply" />
                  <ResultBlock icon="check" label="Variante diretta" text={followupResult.variante_diretta} variant="reply" />
                  <ResultBlock icon="clock" label="Tempistica" text={followupResult.tempistica} />
                  <ResultBlock icon="arrow" label="Prossimi passi" text={followupResult.prossimi_passi} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
            SEZIONE 3 — TROVA CLIENTI SU LINKEDIN
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section find-section">
          <div className="find-section-header">
            <div className="find-section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <h3 className="find-section-title">Trova clienti su LinkedIn</h3>
              <p className="find-section-sub">Descrivi il tipo di cliente che vuoi trovare e Preflight genera la ricerca LinkedIn giusta.</p>
            </div>
          </div>

          <div className="find-section-form">
            <div className="qa-field">
              <label className="qa-label">Che tipo di cliente vuoi trovare?</label>
              <textarea value={findTipoCliente} onChange={(e) => setFindTipoCliente(e.target.value)} className="qa-input qa-input-lg" rows={2} placeholder="Es: Founder di startup SaaS B2B, CEO di agenzie di marketing, responsabili vendite in PMI" />
            </div>

            <div className="find-section-row">
              <div className="qa-field" style={{ flex: 1 }}>
                <label className="qa-label">Settore <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={findSettore} onChange={(e) => setFindSettore(e.target.value)} className="qa-input" placeholder="Software / SaaS" />
              </div>
              <div className="qa-field" style={{ flex: 1 }}>
                <label className="qa-label">Area geografica <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={findArea} onChange={(e) => setFindArea(e.target.value)} className="qa-input" placeholder="Italia / Europa" />
              </div>
            </div>

            <button onClick={handleFindClients} disabled={findLoading || !findTipoCliente.trim()} className="qa-btn">
              {findLoading ? (<><span className="qa-spinner" aria-hidden="true" />Sto cercando…</>) : (<>Trova clienti <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>)}
            </button>
          </div>

          {findResult && (
            <div className="qa-result">
              {findResult.tipo_cliente_ideale && <ResultBlock icon="user" label="Cliente ideale" text={findResult.tipo_cliente_ideale} variant="valutazione" />}
              {findResult.come_cercarlo && <ResultBlock icon="search" label="Keyword di ricerca" text={findResult.come_cercarlo} />}
              {findResult.link_ricerca_linkedin && (
                <div className="qa-result-block qa-result-reply"><div className="qa-result-label"><RIcon type="link" /> Link di ricerca LinkedIn</div><p className="qa-result-text"><a href={findResult.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="qa-result-link">{findResult.link_ricerca_linkedin}</a></p></div>
              )}
              {findResult.suggerimenti_filtri && <ResultBlock icon="info" label="Suggerimenti filtri" text={findResult.suggerimenti_filtri} />}
              {findResult.profili_simili && <ResultBlock icon="user" label="Ruoli simili" text={findResult.profili_simili} />}
              {findResult.cosa_fare_dopo && <ResultBlock icon="arrow" label="Cosa fare dopo" text={findResult.cosa_fare_dopo} />}
              <div style={{ marginTop: "1rem" }}>
                <button type="button" className="qa-cta-secondary" onClick={() => { setDashMode("profile"); setFindResult(null); }}>
                  Analizza questo profilo →
                </button>
              </div>
            </div>
          )}

          {findResult && !profile.onboarding_complete && <OnboardingCallout />}
        </section>

        {/* ══════════════════════════════════════════════════════
            SEZIONE 4 — CONTATTI ANALIZZATI
        ══════════════════════════════════════════════════════ */}
        <section className="dash-section">
          <h3 className="dash-section-title">Contatti analizzati</h3>
          {contacts.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p className="dash-empty-text">Nessun contatto analizzato.</p>
              <p className="dash-empty-sub">Quando usi &quot;Analizza questo profilo&quot;, i contatti vengono salvati automaticamente qui.</p>
            </div>
          ) : (
            <div className="contacts-list">
              {contacts.map((c) => (
                <div key={c.id} className="contact-card">
                  <div className="contact-card-avatar">{c.nome.charAt(0).toUpperCase()}</div>
                  <div className="contact-card-info">
                    <h4 className="contact-card-name">{c.nome}</h4>
                    <p className="contact-card-role">{c.ruolo}{c.azienda && c.azienda !== "—" ? ` · ${c.azienda}` : ""}</p>
                    {c.linkedin_url && (
                      <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" className="contact-card-link">LinkedIn ↗</a>
                    )}
                    <span className="contact-card-date">{new Date(c.analyzed_at).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="contact-card-actions">
                    <button type="button" className="btn-secondary" onClick={() => openContactAnalysis(c)}>Rivedi analisi</button>
                    <button type="button" className="btn-secondary" onClick={() => openContactAdvice(c)}>Chiedi consiglio</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Configura il sistema ── */}
        {!profile.onboarding_complete && (
          <section className="dash-section">
            <div className="dash-start-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="dash-start-card">
                <div className="dash-start-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <h4 className="dash-start-card-title">Imposta il tuo sistema</h4>
                <p className="dash-start-card-desc">Più l&apos;AI conosce il tuo lavoro, più i consigli saranno precisi.</p>
                <Link href="/app/onboarding" className="dash-btn-primary dash-btn-full">
                  Configura il tuo sistema <span className="dash-btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

const ICON_MAP: Record<string, React.ReactElement> = {
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  bulb: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  repeat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><path d="M18.8 10H5.2A2.2 2.2 0 0 0 3 12.2v7.6A2.2 2.2 0 0 0 5.2 22h13.6a2.2 2.2 0 0 0 2.2-2.2v-7.6A2.2 2.2 0 0 0 18.8 10z"/></svg>,
  warn: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  info: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

function RIcon({ type }: { type: string }) {
  return ICON_MAP[type] || null;
}

function ResultBlock({ icon, label, text, variant }: { icon: string; label: string; text: string; variant?: "reply" | "valutazione" }) {
  const cls = `qa-result-block${variant === "reply" ? " qa-result-reply" : ""}${variant === "valutazione" ? " qa-result-valutazione" : ""}`;
  return (
    <div className={cls}>
      <div className="qa-result-label"><RIcon type={icon} /> {label}</div>
      <p className="qa-result-text">{text}</p>
    </div>
  );
}

function OnboardingCallout() {
  return (
    <div className="qa-callout">
      <p className="qa-callout-text">💡 Questa analisi può essere ancora più precisa se configuri il tuo sistema.</p>
      <Link href="/app/onboarding" className="qa-callout-link">Configura il tuo sistema →</Link>
    </div>
  );
}
