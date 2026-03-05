"use client";

import { useState } from "react";
import CopyButton from "@/components/shared/CopyButton";
import { defaultOpportunityFinder } from "@/lib/sales/defaults";
import type { OpportunityFinderJson } from "@/lib/sales/schemas";

export default function OpportunityPage() {
  const [idealClientDescription, setIdealClientDescription] = useState("");
  const [output, setOutput] = useState<OpportunityFinderJson | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideal_client_description: idealClientDescription }),
      });
      const json = await res.json();
      setOutput(json?.post_types_to_search ? json : defaultOpportunityFinder);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Trova opportunita di conversazione</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: ti suggerisce dove commentare per aprire conversazioni utili.</p>
        <p><strong>Cosa incollare</strong>: descrizione del cliente ideale.</p>
        <p><strong>Cosa ottieni</strong>: tipi di post, keyword e opportunita pratiche.</p>
      </div>

      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Cliente ideale</span>
          <textarea
            rows={5}
            className="input w-full"
            placeholder="Founder SaaS B2B con team 10-50 che vuole aumentare demo call"
            value={idealClientDescription}
            onChange={(e) => setIdealClientDescription(e.target.value)}
          />
        </label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>

      {output && (
        <section className="rounded-lg border border-app p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Opportunity Finder</h3>
            <CopyButton text={JSON.stringify(output, null, 2)} />
          </div>
          <ResultCard title="Types of posts to search" text={output.post_types_to_search.join("\n")} />
          <ResultCard title="Keywords to monitor" text={output.keywords_to_monitor.join("\n")} />
          <ResultCard title="Conversation opportunities" text={output.conversation_opportunities.join("\n")} />
          <div className="rounded border border-app bg-soft p-3 text-sm"><strong>Next action:</strong> {output.next_action}</div>
        </section>
      )}
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
