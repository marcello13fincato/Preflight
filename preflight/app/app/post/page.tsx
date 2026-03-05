"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import PageGuide from "@/components/shared/PageGuide";
import OutputCard from "@/components/shared/OutputCard";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)]">✍️ Scrivi un post che genera conversazioni</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Crea contenuti che aprono conversazioni con i tuoi clienti ideali.</p>
      </div>

      <PageGuide
        what="scrivi o migliori un post LinkedIn che porta nuove conversazioni."
        paste="una bozza o un'idea del post (anche grezza — ci pensiamo noi)."
        get="hook potente, 3 versioni del post, CTA e prossima azione."
        next="pubblica il post e monitora i commenti con 'Rispondi ai commenti'."
      />

      <div className="card-premium p-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold text-[var(--color-text)]">Bozza o idea del post</span>
          <textarea
            rows={7}
            className="input w-full"
            placeholder="Es: Molte aziende SaaS perdono conversioni perché l'onboarding è confuso..."
            value={draftPost}
            onChange={(e) => setDraftPost(e.target.value)}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold text-[var(--color-text)]">Obiettivo del post</span>
            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="input w-full">
              <option value="lead">💬 Aprire conversazioni</option>
              <option value="call">📞 Portare a una call</option>
              <option value="inbound">📥 Ricevere richieste dirette</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold text-[var(--color-text)]">
              Parola chiave per DM
              <span className="ml-1.5 font-normal text-[var(--color-muted)]">(es: &quot;audit&quot;, &quot;guida&quot;)</span>
            </span>
            <input
              className="input w-full"
              placeholder="audit"
              value={dmKeyword}
              onChange={(e) => setDmKeyword(e.target.value)}
            />
            <span className="mt-1 block text-xs text-[var(--color-muted)]">
              Chi commenta questa parola riceve un DM automatico con la tua offerta.
            </span>
          </label>
        </div>

        <button
          onClick={generate}
          disabled={loading || !draftPost.trim()}
          className="btn-primary px-6 py-3"
        >
          {loading ? "⏳ Generazione in corso..." : "🚀 Genera il mio post"}
        </button>
      </div>

      {output && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xl font-extrabold">✅ Post pronto da usare</h2>
            <CopyButton text={`${output.post_versions.clean}\n\n${output.cta}`} />
          </div>

          <div className="card-premium p-5">
            <h3 className="font-bold text-sm uppercase tracking-wide text-[var(--color-muted)] mb-3">🎣 Hook</h3>
            <div className="space-y-2">
              {output.hooks.map((hook, i) => (
                <div key={i} className="rounded-lg bg-[var(--color-soft)] px-4 py-3 text-sm font-medium">{hook}</div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <OutputCard title="✨ Versione naturale" text={output.post_versions.clean} />
            <OutputCard title="🎯 Versione diretta" text={output.post_versions.direct} />
            <OutputCard title="💪 Versione autorevole" text={output.post_versions.authority} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <OutputCard title="📢 CTA" text={output.cta} />
            <OutputCard title="💬 Comment starter" text={output.comment_starter} />
          </div>

          <div className="callout callout-success flex items-start gap-3">
            <span className="text-lg">➡️</span>
            <div><strong>Prossima mossa:</strong> {output.next_step}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/app/comments" className="btn-secondary px-4 py-2">💬 Rispondi ai commenti →</Link>
          </div>
        </section>
      )}

      <section className="card-premium p-5">
        <h3 className="font-bold mb-3">📁 Storico post</h3>
        <HistoryList userId={userId} type="post" />
      </section>
    </div>
  );
}
