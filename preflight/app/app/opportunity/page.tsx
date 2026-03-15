"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import InsightCard, { ResultHeader, SectionDivider } from "@/components/app/InsightCard";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { OpportunityFinderJson } from "@/lib/sales/schemas";
import { opportunityFinderSchema } from "@/lib/sales/schemas";

export default function OpportunityPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
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
        body: JSON.stringify({ ideal_client_description: idealClientDescription, profile: profile.onboarding }),
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
    <div className="tool-page">
      <div className="tool-page-hero">
        <h2>Trova opportunità di conversazione</h2>
        <p>
          Scopri dove commentare e interagire per aprire nuove conversazioni con clienti ideali.
        </p>
      </div>

      {/* Guide box */}
      <div className="tool-page-guide">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> trovi post e profili da commentare per iniziare conversazioni</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> descrizione del cliente ideale</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> keyword, profili da cercare, segnali e query LinkedIn pronte</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> vai a &quot;Rispondi ai commenti&quot; per interagire</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="tool-page-grid">
        {/* INPUT */}
        {output ? (
        <details className="tool-input-collapsed">
          <summary>✏️ Modifica parametri</summary>
          <div className="tool-input-body space-y-4">
          <h3 className="tool-page-panel-header">Input</h3>
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
        </details>
        ) : (
        <div className="tool-page-panel space-y-4">
          <h3 className="tool-page-panel-header">Input</h3>
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
        )}

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="insight-result">
              <ResultHeader title="Opportunità trovate" />

              <InsightCard icon="🔍" label="Keyword da cercare" text={output.keywords_to_monitor.map(k => `• ${k}`).join("\n")} variant="strategy" />
              <InsightCard icon="📌" label="Tipi di post da monitorare" text={output.post_types_to_search.map(k => `• ${k}`).join("\n")} variant="evidence" />

              <SectionDivider label="Profili ideali" />

              {output.ideal_profiles.map((p, i) => (
                <InsightCard key={i} icon="👤" label={p.role} text={`${p.sector} · ${p.company_size}\n💡 ${p.why}`} variant="summary" />
              ))}

              <SectionDivider label="Segnali e ricerche" />

              <InsightCard icon="📡" label="Segnali utili" text={output.useful_signals.map(s => `• ${s}`).join("\n")} variant="evidence" />

              <InsightCard icon="🔗" label="Query LinkedIn" text={output.linkedin_search_queries.map((q, i) => `${i + 1}. ${q}`).join("\n")} variant="strategy" />

              <SectionDivider label="Azione" />

              <InsightCard icon="💬" label="Opportunità di conversazione" text={output.conversation_opportunities.map(c => `• ${c}`).join("\n")} variant="action" />

              <div className="insight-next-action">
                <span className="insight-next-action-icon">➡️</span>
                <div><strong>Prossima azione:</strong> {output.next_action}</div>
              </div>
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon">🔍</p>
              <p className="tool-page-empty-title">
                Le opportunità appariranno qui
              </p>
              <p className="tool-page-empty-text">
                Descrivi il cliente ideale e clicca &quot;Trova opportunità&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

