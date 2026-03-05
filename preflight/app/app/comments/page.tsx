"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import JsonOutputCard from "@/components/app/JsonOutputCard";
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
  const [objective, setObjective] = useState("conversation");
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
          objective,
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
        <label className="block text-sm"><span className="mb-1 block text-muted">Post originale</span><textarea rows={5} className="input w-full" value={originalPost} onChange={(e) => setOriginalPost(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Commento ricevuto</span><textarea rows={4} className="input w-full" value={receivedComment} onChange={(e) => setReceivedComment(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Profilo autore commento (opzionale)</span><textarea rows={4} className="input w-full" value={commenterProfileText} onChange={(e) => setCommenterProfileText(e.target.value)} /></label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Obiettivo</span>
          <select className="input w-full" value={objective} onChange={(e) => setObjective(e.target.value)}>
            <option value="conversation">Continuare conversazione</option>
            <option value="DM">Portare in DM</option>
            <option value="call">Arrivare a call</option>
          </select>
        </label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>
      {output && <JsonOutputCard title="Output pronto da usare" value={output} />}
      <section className="rounded-lg border border-app p-4"><h3 className="font-semibold mb-2">Storico</h3><HistoryList userId={userId} type="comments" /></section>
    </div>
  );
}
