"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import JsonOutputCard from "@/components/app/JsonOutputCard";
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
      <h2 className="text-2xl font-bold">Post Builder</h2>
      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">draft_post</span>
          <textarea rows={7} className="input w-full" value={draftPost} onChange={(e) => setDraftPost(e.target.value)} />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">objective</span>
            <select value={objective} onChange={(e) => setObjective(e.target.value)} className="input w-full">
              <option value="lead">lead</option>
              <option value="call">call</option>
              <option value="inbound">inbound</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">dm_keyword</span>
            <input className="input w-full" value={dmKeyword} onChange={(e) => setDmKeyword(e.target.value)} />
          </label>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">
          {loading ? "Generazione..." : "Genera"}
        </button>
      </div>

      {output && <JsonOutputCard title="Post Builder JSON" value={output} />}

      <section className="rounded-lg border border-app p-4">
        <h3 className="font-semibold mb-2">History</h3>
        <HistoryList userId={userId} type="post" />
      </section>
    </div>
  );
}
