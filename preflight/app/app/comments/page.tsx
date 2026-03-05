"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Rispondi ai commenti.</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: ti suggerisce come rispondere per continuare la conversazione.</p>
        <p><strong>Cosa incollare</strong>: il post e il commento ricevuto.</p>
        <p><strong>Cosa ottieni</strong>: 3 risposte, DM suggerito e prossima azione.</p>
      </div>
      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm"><span className="mb-1 block text-muted">Post originale</span><textarea rows={5} className="input w-full" placeholder="Many SaaS companies lose conversions because onboarding is confusing." value={originalPost} onChange={(e) => setOriginalPost(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Commento ricevuto</span><textarea rows={4} className="input w-full" placeholder="Interesting. We might have this issue." value={receivedComment} onChange={(e) => setReceivedComment(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Profilo autore commento (opzionale)</span><textarea rows={4} className="input w-full" value={commenterProfileText} onChange={(e) => setCommenterProfileText(e.target.value)} /></label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Obiettivo conversazione</span>
          <select className="input w-full" value={conversationGoal} onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}>
            <option value="understand_fit">Capire se è un cliente in target</option>
            <option value="continue_conversation">Continuare conversazione</option>
            <option value="move_to_dm">Spostare la conversazione in DM</option>
            <option value="propose_call">Proporre una call</option>
            <option value="follow_up">Fare follow-up</option>
          </select>
        </label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>

      {output && (
        <section className="rounded-lg border border-app p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Risultato</h3>
            <CopyButton text={`${output.replies.soft}\n\n${output.replies.authority}\n\n${output.replies.dm_pivot}`} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-app p-3 text-sm"><strong>Client Heat Level:</strong> {output.client_heat_level}</div>
            <div className="rounded border border-app p-3 text-sm"><strong>Valutazione messaggio:</strong> {output.message_risk_warning}</div>
          </div>
          <div className="rounded border border-app p-3 text-sm"><strong>Strategia:</strong> {output.strategy}</div>
          <div className="grid gap-3 md:grid-cols-3">
            <ResultCard title="Risposta soft" text={output.replies.soft} />
            <ResultCard title="Risposta autorevole" text={output.replies.authority} />
            <ResultCard title="Risposta con pivot DM" text={output.replies.dm_pivot} />
          </div>
          <ResultCard title="DM suggerito" text={output.suggested_dm} />
          <div className="rounded border border-app bg-soft p-3 text-sm"><strong>Next action:</strong> {output.next_action}</div>
          <Link href="/app/pipeline" className="inline-block btn-secondary px-3 py-1.5">Aggiungi questo contatto alla pipeline?</Link>
        </section>
      )}
      <section className="rounded-lg border border-app p-4"><h3 className="font-semibold mb-2">Storico</h3><HistoryList userId={userId} type="comments" /></section>
    </div>
  );
}

function ResultCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded border border-app p-3 text-sm">
      <div className="font-semibold">{title}</div>
      <p className="mt-1 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
