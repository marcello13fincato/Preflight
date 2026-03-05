"use client";

import { useState } from "react";
import CopyButton from "@/components/shared/CopyButton";
import PageGuide from "@/components/shared/PageGuide";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">🔍 Trova opportunità di conversazione</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Scopri dove commentare per aprire conversazioni con i clienti giusti.</p>
      </div>

      <PageGuide
        what="trovi dove e come commentare su LinkedIn per incontrare potenziali clienti."
        paste="la descrizione del tuo cliente ideale (ruolo, settore, problema principale)."
        get="tipi di post da monitorare, keyword da usare e opportunità pratiche dove commentare."
        next="vai su LinkedIn, cerca i post suggeriti e commenta con valore — poi usa 'Rispondi ai commenti'."
      />

      <div className="card-premium p-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Cliente ideale</span>
          <textarea
            rows={5}
            className="input w-full"
            placeholder="Es: Founder SaaS B2B con team 10-50 che vuole aumentare le demo call"
            value={idealClientDescription}
            onChange={(e) => setIdealClientDescription(e.target.value)}
          />
        </label>
        <button onClick={generate} disabled={loading || !idealClientDescription.trim()} className="btn-primary px-6 py-3">
          {loading ? "⏳ Ricerca in corso..." : "🔍 Trova opportunità"}
        </button>
      </div>

      {output && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold">✅ Dove trovare i tuoi clienti</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <ListCard title="📝 Tipi di post da monitorare" items={output.post_types_to_search} />
            <ListCard title="🔎 Keyword da monitorare" items={output.keywords_to_monitor} />
          </div>

          <ListCard title="💬 Opportunità concrete dove commentare" items={output.conversation_opportunities} />

          <div className="callout callout-success flex items-start gap-3">
            <span className="text-lg">➡️</span>
            <div><strong>Prossima mossa:</strong> {output.next_action}</div>
          </div>
        </section>
      )}
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  const text = items.join("\n");
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-bold text-sm">{title}</span>
        <CopyButton text={text} />
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

