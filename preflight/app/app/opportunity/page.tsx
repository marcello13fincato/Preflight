"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
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

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="tool-page-panel space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="tool-page-panel-header" style={{ margin: 0 }}>
                  Opportunità trovate
                </h3>
                <CopyButton text={JSON.stringify(output, null, 2)} />
              </div>

              {/* 1. Keywords */}
              <OpportunitySection
                title="🔍 Keyword da cercare"
                items={output.keywords_to_monitor}
                color="var(--color-primary)"
                badge
              />

              {/* 2. Post types */}
              <OpportunitySection
                title="📌 Tipi di post da monitorare"
                items={output.post_types_to_search}
                color="#0B5CAD"
              />

              {/* 3. Ideal profiles */}
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-sm font-semibold mb-3" style={{ color: "#004182" }}>
                  👤 Profili da cercare
                </div>
                <div className="space-y-3">
                  {output.ideal_profiles.map((profile, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3 space-y-1.5"
                      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                    >
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
                          {profile.role}
                        </span>
                        <span className="badge badge-blue">{profile.sector}</span>
                        <span className="badge" style={{ background: "var(--color-soft-2)", color: "var(--color-muted)" }}>
                          {profile.company_size}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                        💡 {profile.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Useful signals */}
              <OpportunitySection
                title="📡 Segnali utili"
                items={output.useful_signals}
                color="#6B7280"
              />

              {/* 5. LinkedIn search queries */}
              <div
                className="rounded-lg p-4"
                style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
              >
                <div className="text-sm font-semibold mb-2" style={{ color: "#004182" }}>
                  🔗 Come cercarli su LinkedIn
                </div>
                <div className="space-y-1.5">
                  {output.linkedin_search_queries.map((query, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md px-3 py-2 text-sm font-mono"
                      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                    >
                      <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>{i + 1}.</span>
                      <span>{query}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Conversation opportunities */}
              <OpportunitySection
                title="💬 Opportunità di conversazione"
                items={output.conversation_opportunities}
                color="#004182"
              />

              {/* Next action */}
              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_action}
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

