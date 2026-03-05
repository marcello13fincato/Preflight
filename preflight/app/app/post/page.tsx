"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { postBuilderSchema, type PostBuilderJson } from "@/lib/sales/schemas";
import { defaultPostBuilder } from "@/lib/sales/defaults";

export default function PostPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [draftPost, setDraftPost] = useState(params.get("draft_post") || "");
  const [objective, setObjective] = useState(params.get("objective") || "lead");
  const [dmKeyword, setDmKeyword] = useState(params.get("dm_keyword") || "audit");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<PostBuilderJson | null>(null);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          draft_post: draftPost,
          objective,
          dm_keyword: dmKeyword,
        }),
      });
      const json = await res.json();
      const parsed = postBuilderSchema.safeParse(json);
      const valid = parsed.success ? parsed.data : defaultPostBuilder(objective, dmKeyword);
      setOutput(valid);
      repo.interaction.addInteraction(userId, "post", draftPost, valid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Scrivi un post che genera conversazioni.</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: ti aiuta a scrivere un post che apre conversazioni utili.</p>
        <p><strong>Cosa incollare</strong>: una bozza o un&apos;idea del post.</p>
        <p><strong>Cosa ottieni</strong>: hooks, 3 versioni, CTA e prossima azione.</p>
      </div>
      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Bozza o idea del post</span>
          <textarea rows={7} className="input w-full" placeholder="Many SaaS companies lose conversions because onboarding is confusing." value={draftPost} onChange={(e) => setDraftPost(e.target.value)} />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Obiettivo</span>
            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="input w-full">
              <option value="lead">Aprire conversazioni</option>
              <option value="call">Portare a call</option>
              <option value="inbound">Ricevere richieste</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Parola chiave per DM</span>
            <input className="input w-full" value={dmKeyword} onChange={(e) => setDmKeyword(e.target.value)} />
          </label>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">
          {loading ? "Generazione..." : "Genera"}
        </button>
      </div>

      {output && (
        <section className="rounded-lg border border-app p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Post pronto da usare</h3>
            <CopyButton text={`${output.post_versions.clean}\n\n${output.cta}`} />
          </div>
          <ResultCard title="Hooks" text={output.hooks.join("\n")} />
          <div className="grid gap-3 md:grid-cols-3">
            <ResultCard title="Versione clean" text={output.post_versions.clean} />
            <ResultCard title="Versione diretta" text={output.post_versions.direct} />
            <ResultCard title="Versione autorevole" text={output.post_versions.authority} />
          </div>
          <ResultCard title="CTA" text={output.cta} />
          <ResultCard title="Comment starter" text={output.comment_starter} />
          <div className="rounded border border-app bg-soft p-3 text-sm"><strong>Next action:</strong> {output.next_step}</div>
        </section>
      )}

      <section className="rounded-lg border border-app p-4">
        <h3 className="font-semibold mb-2">Storico</h3>
        <HistoryList userId={userId} type="post" />
      </section>
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
