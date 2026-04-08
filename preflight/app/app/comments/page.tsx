"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Link from "next/link";
import HistoryList from "@/components/app/HistoryList";
import InsightCard, { ResultHeader, MetricRow, MetricBadge, SectionDivider } from "@/components/app/InsightCard";
import { IconClipboard, IconTarget, IconEdit3, IconAlertTriangle, IconThermometer, IconMail, IconLogoPreflight } from "@/components/shared/icons";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { commentAssistantSchema, type CommentAssistantJson } from "@/lib/sales/schemas";

export default function CommentsPage() {
  const params = useSearchParams();
  const { userId, status } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = userId ? repo.profile.getProfile(userId) : { onboarding: null, plan: null, onboarding_complete: false };

  const [originalPost, setOriginalPost] = useState(params.get("original_post") || "");
  const [receivedComment, setReceivedComment] = useState(params.get("received_comment") || "");
  const [commenterProfileText, setCommenterProfileText] = useState(params.get("commenter_profile_text") || "");
  const [conversationGoal, setConversationGoal] = useState<"understand_fit" | "continue_conversation" | "move_to_dm" | "propose_call" | "follow_up">("continue_conversation");
  const [output, setOutput] = useState<CommentAssistantJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          original_post: originalPost,
          received_comment: receivedComment,
          commenter_profile_text: commenterProfileText,
          conversation_goal: conversationGoal,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = commentAssistantSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId!, "comments", `${originalPost}\n${receivedComment}`, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  const heatColors: Record<string, string> = {
    Cold: "badge-blue",
    Warm: "badge-amber",
    Hot: "badge-red",
  };

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-hero fade-in">
        <h2>Rispondi ai commenti</h2>
        <p>
          Trasforma i commenti ricevuti in conversazioni commerciali.
        </p>
      </div>

      {/* Guide box */}
      <div className="tool-page-guide fade-in-delay">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-success,#22c55e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><polyline points="20 6 9 17 4 12"/></svg>Cosa fai:</span> rispondi ai commenti in modo strategico</div>
          <div><span className="font-semibold"><IconClipboard size={13} className="guide-icon-inline" />Cosa inserire:</span> post originale e commento ricevuto</div>
          <div><span className="font-semibold"><IconTarget size={13} className="guide-icon-inline" />Cosa ottieni:</span> 3 risposte, DM suggerito, prossima azione</div>
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Prossima mossa:</span> sposta la conversazione in DM</div>
        </div>
      </div>

      {/* Two-column layout: input + output */}
      <div className="tool-page-grid fade-in">
        {/* INPUT */}
        {output ? (
        <details className="tool-input-collapsed">
          <summary><IconEdit3 size={14} /> Modifica parametri</summary>
          <div className="tool-input-body space-y-4">
          <h3 className="tool-page-panel-header">Input</h3>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Post originale</span>
            <textarea
              rows={5}
              className="input w-full resize-none"
              placeholder="Es. Molte aziende SaaS perdono conversioni perché l'onboarding è confuso."
              value={originalPost}
              onChange={(e) => setOriginalPost(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Commento ricevuto</span>
            <textarea
              rows={4}
              className="input w-full resize-none"
              placeholder="Es. Interessante. Potremmo avere questo problema."
              value={receivedComment}
              onChange={(e) => setReceivedComment(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              Profilo autore commento{" "}
              <span className="label-optional">(opzionale)</span>
            </span>
            <textarea
              rows={3}
              className="input w-full resize-none"
              value={commenterProfileText}
              onChange={(e) => setCommenterProfileText(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Obiettivo conversazione</span>
            <select
              className="input w-full"
              value={conversationGoal}
              onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}
            >
              <option value="understand_fit">Capire se è un cliente in target</option>
              <option value="continue_conversation">Continuare conversazione</option>
              <option value="move_to_dm">Spostare la conversazione in DM</option>
              <option value="propose_call">Proporre una call</option>
              <option value="follow_up">Fare follow-up</option>
            </select>
          </label>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generazione in corso…" : "Genera risposte →"}
          </button>
          </div>
        </details>
        ) : (
        <div className="tool-page-panel space-y-4 fade-in-delay">
          <h3 className="tool-page-panel-header">Input</h3>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Post originale</span>
            <textarea
              rows={5}
              className="input w-full resize-none"
              placeholder="Es. Molte aziende SaaS perdono conversioni perché l'onboarding è confuso."
              value={originalPost}
              onChange={(e) => setOriginalPost(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Commento ricevuto</span>
            <textarea
              rows={4}
              className="input w-full resize-none"
              placeholder="Es. Interessante. Potremmo avere questo problema."
              value={receivedComment}
              onChange={(e) => setReceivedComment(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              Profilo autore commento{" "}
              <span className="label-optional">(opzionale)</span>
            </span>
            <textarea
              rows={3}
              className="input w-full resize-none"
              value={commenterProfileText}
              onChange={(e) => setCommenterProfileText(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Obiettivo conversazione</span>
            <select
              className="input w-full"
              value={conversationGoal}
              onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}
            >
              <option value="understand_fit">Capire se è un cliente in target</option>
              <option value="continue_conversation">Continuare conversazione</option>
              <option value="move_to_dm">Spostare la conversazione in DM</option>
              <option value="propose_call">Proporre una call</option>
              <option value="follow_up">Fare follow-up</option>
            </select>
          </label>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generazione in corso…" : "Genera risposte →"}
          </button>
        </div>
        )}

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1"><IconAlertTriangle size={14} /> Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="insight-result">
              <ResultHeader title="Analisi commento" copyText={`${output.replies.soft}\n\n${output.replies.authority}\n\n${output.replies.dm_pivot}`} />

              <MetricRow>
                <MetricBadge icon={<IconThermometer size={16} />} label="Interesse" value={output.client_heat_level} color={heatColors[output.client_heat_level] === "badge-red" ? "red" : heatColors[output.client_heat_level] === "badge-amber" ? "amber" : "blue"} />
                {output.message_risk_warning && output.message_risk_warning !== "nessuno" && (
                  <MetricBadge icon={<IconAlertTriangle size={16} />} label="Rischio" value={output.message_risk_warning} color="amber" />
                )}
              </MetricRow>

              <InsightCard icon={<IconTarget size={16} />} label="Strategia" text={output.strategy} variant="summary" />

              <SectionDivider label="Risposte suggerite" />

              <div className="insight-reply-grid">
                <InsightCard icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>} label="Risposta soft" text={output.replies.soft} variant="message" copyable />
                <InsightCard icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>} label="Risposta autorevole" text={output.replies.authority} variant="message" copyable />
                <InsightCard icon={<IconMail size={16} />} label="Pivot DM" text={output.replies.dm_pivot} variant="message" copyable />
              </div>

              <SectionDivider label="Azione consigliata" />

              <InsightCard icon={<IconMail size={16} />} label="DM suggerito" text={output.suggested_dm} variant="strategy" copyable />

              <div className="insight-next-action">
                <span className="insight-next-action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
                <div><strong>Prossima azione:</strong> {output.next_action}</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/app/pipeline" className="btn-primary">
                  + Aggiungi in Pipeline
                </Link>
                <Link href="/app/articolo" className="btn-secondary">
                  Scrivi un articolo →
                </Link>
              </div>
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon"><IconLogoPreflight size={28} /></p>
              <p className="tool-page-empty-title">
                Il risultato apparirà qui
              </p>
              <p className="tool-page-empty-text">
                Inserisci il post e il commento, poi clicca &quot;Genera risposte&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="tool-page-panel">
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="comments" />
      </div>
    </div>
  );
}
