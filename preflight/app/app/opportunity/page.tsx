"use client";

import { useState } from "react";
import CopyButton from "@/components/shared/CopyButton";
import type { OpportunityFinderJson } from "@/lib/sales/schemas";
import { opportunityFinderSchema } from "@/lib/sales/schemas";

export default function OpportunityPage() {
  const [idealClientDescription, setIdealClientDescription] = useState("");
  const [output, setOutput] = useState<OpportunityFinderJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideal_client_description: idealClientDescription }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = opportunityFinderSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Trova opportunità di conversazione</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Scopri dove commentare e interagire per aprire nuove conversazioni con clienti ideali.
        </p>
      </div>

      {/* Guide box */}
      <div className="callout">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> trovi post da commentare per iniziare conversazioni</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> descrizione del cliente ideale</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> tipi di post, keyword e opportunità pratiche</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> vai a "Rispondi ai commenti" per interagire</div>
        </div>
      </div>

      {/* Two-column layout */}
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
            <span className="mb-1 block font-medium">Descrizione cliente ideale</span>
            <textarea
              rows={6}
              className="input w-full resize-none"
              placeholder="Founder SaaS B2B con team 10-50 che vuole aumentare demo call"
              value={idealClientDescription}
              onChange={(e) => setIdealClientDescription(e.target.value)}
            />
          </label>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generazione in corso…" : "Trova opportunità →"}
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
                  Opportunità trovate
                </h3>
                <CopyButton text={JSON.stringify(output, null, 2)} />
              </div>

              <OpportunitySection
                title="📌 Tipi di post da cercare"
                items={output.post_types_to_search}
                color="var(--color-primary)"
              />
              <OpportunitySection
                title="🔍 Keyword da monitorare"
                items={output.keywords_to_monitor}
                color="#0B5CAD"
                badge
              />
              <OpportunitySection
                title="💬 Opportunità di conversazione"
                items={output.conversation_opportunities}
                color="#004182"
              />

              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_action}
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
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Le opportunità appariranno qui
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Descrivi il cliente ideale e clicca "Trova opportunità"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OpportunitySection({
  title,
  items,
  color,
  badge = false,
}: {
  title: string;
  items: string[];
  color: string;
  badge?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
    >
      <div className="text-sm font-semibold mb-2" style={{ color }}>
        {title}
      </div>
      {badge ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="badge badge-blue">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 font-bold" style={{ color }}>
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
