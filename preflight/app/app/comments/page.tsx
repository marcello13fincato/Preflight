"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import HistoryList from "@/components/app/HistoryList";
import PageGuide from "@/components/shared/PageGuide";
import OutputCard from "@/components/shared/OutputCard";
import { HeatLevelBadge, RiskWarning } from "@/components/shared/HeatLevel";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { commentAssistantSchema, type CommentAssistantJson } from "@/lib/sales/schemas";
import { defaultCommentAssistant } from "@/lib/sales/defaults";

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

  async function generate() {
    setLoading(true);
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
      const json = await res.json();
      const parsed = commentAssistantSchema.safeParse(json);
      const valid = parsed.success ? parsed.data : defaultCommentAssistant;
      setOutput(valid);
      repo.interaction.addInteraction(userId, "comments", `${originalPost}\n${receivedComment}`, valid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">💬 Rispondi ai commenti</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Trasforma ogni commento in una conversazione commerciale.</p>
      </div>

      <PageGuide
        what="rispondi ai commenti del tuo post per iniziare conversazioni utili."
        paste="il tuo post originale + il commento ricevuto."
        get="3 risposte diverse, DM suggerito, heat level del contatto e prossima mossa."
        next="invia la risposta scelta e, se è warm/hot, spostalo in DM."
      />

      <div className="card-premium p-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Post originale</span>
          <textarea rows={4} className="input w-full" placeholder="Incolla il testo del tuo post..." value={originalPost} onChange={(e) => setOriginalPost(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Commento ricevuto</span>
          <textarea rows={3} className="input w-full" placeholder="Incolla il commento che vuoi gestire..." value={receivedComment} onChange={(e) => setReceivedComment(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">
            Profilo autore commento
            <span className="ml-1.5 font-normal text-[var(--color-muted)]">(opzionale – migliora la risposta)</span>
          </span>
          <textarea rows={3} className="input w-full" placeholder="Incolla headline/bio LinkedIn della persona..." value={commenterProfileText} onChange={(e) => setCommenterProfileText(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">🎯 Obiettivo della conversazione</span>
          <select className="input w-full" value={conversationGoal} onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}>
            <option value="understand_fit">🔍 Capire se è un cliente in target</option>
            <option value="continue_conversation">💬 Continuare la conversazione</option>
            <option value="move_to_dm">✉️ Spostare in DM</option>
            <option value="propose_call">📞 Proporre una call</option>
            <option value="follow_up">🔁 Fare follow-up</option>
          </select>
        </label>
        <button onClick={generate} disabled={loading || !receivedComment.trim()} className="btn-primary px-6 py-3">
          {loading ? "⏳ Generazione in corso..." : "🚀 Genera risposte"}
        </button>
      </div>

      {output && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold">✅ Risultati</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">🌡️ Calore del contatto</p>
              <HeatLevelBadge level={output.client_heat_level} showDesc />
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">📋 Strategia suggerita</p>
              <p className="text-sm">{output.strategy}</p>
            </div>
          </div>

          <RiskWarning message={output.message_risk_warning} />

          <div className="grid gap-4 md:grid-cols-3">
            <OutputCard title="😊 Risposta soft" text={output.replies.soft} />
            <OutputCard title="💪 Risposta autorevole" text={output.replies.authority} />
            <OutputCard title="✉️ Sposta in DM" text={output.replies.dm_pivot} />
          </div>

          <OutputCard title="✉️ DM suggerito da inviare" text={output.suggested_dm} />

          <div className="callout callout-success flex items-start gap-3">
            <span className="text-lg">➡️</span>
            <div><strong>Prossima mossa:</strong> {output.next_action}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/app/pipeline?name=&last=${encodeURIComponent(receivedComment)}`}
              className="btn-primary px-4 py-2"
            >
              📊 Aggiungi in Pipeline
            </Link>
            <Link href="/app/dm" className="btn-secondary px-4 py-2">✉️ Vai ai messaggi →</Link>
          </div>
        </section>
      )}

      <section className="card-premium p-5">
        <h3 className="font-bold mb-3">📁 Storico commenti</h3>
        <HistoryList userId={userId} type="comments" />
      </section>
    </div>
  );
}

