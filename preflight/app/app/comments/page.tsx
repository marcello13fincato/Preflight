"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { commentAssistantSchema, type CommentAssistantJson } from "@/lib/sales/schemas";

export default function CommentsPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [originalPost, setOriginalPost] = useState(params.get("original_post") || "");
  const [receivedComment, setReceivedComment] = useState(params.get("received_comment") || "");
  const [commenterProfileText, setCommenterProfileText] = useState(params.get("commenter_profile_text") || "");
  const [conversationGoal, setConversationGoal] = useState<"understand_fit" | "continue_conversation" | "move_to_dm" | "propose_call" | "follow_up">("continue_conversation");
  const [output, setOutput] = useState<CommentAssistantJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      repo.interaction.addInteraction(userId, "comments", `${originalPost}\n${receivedComment}`, parsed.data);
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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Rispondi ai commenti</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Trasforma i commenti ricevuti in conversazioni commerciali.
        </p>
      </div>

      {/* Guide box */}
      <div className="callout">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> rispondi ai commenti in modo strategico</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> post originale e commento ricevuto</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> 3 risposte, DM suggerito, prossima azione</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> sposta la conversazione in DM</div>
        </div>
      </div>

      {/* Two-column layout: input + output */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* INPUT */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
            Input
          </h3>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Post originale</span>
            <textarea
              rows={5}
              className="input w-full resize-none"
              placeholder="Many SaaS companies lose conversions because onboarding is confusing."
              value={originalPost}
              onChange={(e) => setOriginalPost(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Commento ricevuto</span>
            <textarea
              rows={4}
              className="input w-full resize-none"
              placeholder="Interesting. We might have this issue."
              value={receivedComment}
              onChange={(e) => setReceivedComment(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              Profilo autore commento{" "}
              <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(opzionale)</span>
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

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div
              className="rounded-xl p-5 space-y-4"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
                  Risultato
                </h3>
                <CopyButton text={`${output.replies.soft}\n\n${output.replies.authority}\n\n${output.replies.dm_pivot}`} />
              </div>

              {/* Heat level + risk warning */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className="rounded-lg p-3 text-sm flex items-center gap-2"
                  style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
                >
                  <span className="font-medium">🌡️ Heat:</span>
                  <span className={`badge ${heatColors[output.client_heat_level] || "badge-blue"}`}>
                    {output.client_heat_level}
                  </span>
                </div>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    output.message_risk_warning && output.message_risk_warning !== "nessuno"
                      ? "callout-warning"
                      : ""
                  }`}
                  style={
                    !output.message_risk_warning || output.message_risk_warning === "nessuno"
                      ? { background: "var(--color-soft-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }
                      : {}
                  }
                >
                  <span className="font-medium">⚠️ Risk: </span>
                  <span>{output.message_risk_warning || "nessuno"}</span>
                </div>
              </div>

              <div
                className="rounded-lg p-3 text-sm"
                style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
              >
                <span className="font-semibold">Strategia: </span>
                {output.strategy}
              </div>

              {/* 3 replies */}
              <div className="grid gap-3 md:grid-cols-3">
                <OutputCard title="🟢 Risposta soft" text={output.replies.soft} />
                <OutputCard title="🔵 Risposta autorevole" text={output.replies.authority} />
                <OutputCard title="💌 Pivot DM" text={output.replies.dm_pivot} />
              </div>

              <OutputCard title="DM suggerito" text={output.suggested_dm} accent />

              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_action}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/app/pipeline" className="btn-primary">
                  + Aggiungi in Pipeline
                </Link>
                <Link href="/app/dm" className="btn-secondary">
                  Vai ai messaggi DM →
                </Link>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-8 flex flex-col items-center justify-center text-center h-full"
              style={{
                background: "var(--color-soft-2)",
                border: "1.5px dashed var(--color-border)",
                minHeight: "320px",
              }}
            >
              <p className="text-4xl mb-3">💬</p>
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Il risultato apparirà qui
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Inserisci il post e il commento, poi clicca "Genera risposte"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="comments" />
      </div>
    </div>
  );
}

function OutputCard({ title, text, accent }: { title: string; text: string; accent?: boolean }) {
  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{
        background: accent ? "var(--color-soft)" : "var(--color-soft-2)",
        border: `1px solid ${accent ? "var(--color-primary)" : "var(--color-border)"}`,
      }}
    >
      <div className="font-semibold mb-1">{title}</div>
      <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}
