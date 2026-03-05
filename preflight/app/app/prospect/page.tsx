"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import JsonOutputCard from "@/components/app/JsonOutputCard";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";
import { defaultProspectAnalyzer } from "@/lib/sales/defaults";

export default function ProspectPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [pastedProfileText, setPastedProfileText] = useState(params.get("pasted_profile_text") || "");
  const [output, setOutput] = useState<ProspectAnalyzerJson | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profile.onboarding, pasted_profile_text: pastedProfileText }),
      });
      const json = await res.json();
      const parsed = prospectAnalyzerSchema.safeParse(json);
      const valid = parsed.success ? parsed.data : defaultProspectAnalyzer;
      setOutput(valid);
      repo.interaction.addInteraction(userId, "prospect", pastedProfileText, valid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Prospect Analyzer</h2>
      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">pasted prospect profile text</span>
          <textarea rows={9} className="input w-full" value={pastedProfileText} onChange={(e) => setPastedProfileText(e.target.value)} />
        </label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>
      {output && <JsonOutputCard title="Prospect Analyzer JSON" value={output} />}
      <section className="rounded-lg border border-app p-4"><h3 className="font-semibold mb-2">History</h3><HistoryList userId={userId} type="prospect" /></section>
    </div>
  );
}
