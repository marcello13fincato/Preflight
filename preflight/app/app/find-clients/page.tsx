"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { findClientsSchema, type FindClientsJson } from "@/lib/sales/schemas";

export default function FindClientsPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [tipoCliente, setTipoCliente] = useState("");
  const [settore, setSettore] = useState("");
  const [area, setArea] = useState("");
  const [output, setOutput] = useState<FindClientsJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!tipoCliente.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_cliente: tipoCliente.trim(),
          settore: settore.trim() || undefined,
          area_geografica: area.trim() || undefined,
          profile: profile.onboarding || undefined,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = findClientsSchema.safeParse(json);
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
    <div className="qa-container qa-container-dash">
      {/* ── Hero header ── */}
      <div className="qa-section-header qa-section-header-hero">
        <div className="qa-section-icon" style={{ background: "var(--color-success-bg, #F0FDF4)", color: "var(--color-success, #16A34A)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h3 className="qa-section-title qa-section-title-lg">Trova le persone giuste da contattare</h3>
        <p className="qa-section-sub">
          Definisci il tipo di cliente che cerchi e ottieni ricerche LinkedIn mirate, con suggerimenti su come iniziare la conversazione.
        </p>
      </div>

      {/* ── Two-column layout: INPUT + OUTPUT ── */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* INPUT PANEL */}
        <div
          className="rounded-xl p-6 space-y-1"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="qa-field">
            <label className="qa-label">Che tipo di cliente vuoi trovare?</label>
            <textarea
              value={tipoCliente}
              onChange={(e) => setTipoCliente(e.target.value)}
              className="qa-input qa-input-lg"
              rows={3}
              placeholder="Es: Founder di startup SaaS B2B, CEO di agenzie di marketing, responsabili vendite in PMI"
            />
          </div>

          <div className="find-section-row">
            <div className="qa-field" style={{ flex: 1 }}>
              <label className="qa-label">Settore <span className="qa-label-opt">(facoltativo)</span></label>
              <input
                type="text"
                value={settore}
                onChange={(e) => setSettore(e.target.value)}
                className="qa-input"
                placeholder="Software / SaaS"
              />
            </div>
            <div className="qa-field" style={{ flex: 1 }}>
              <label className="qa-label">Area geografica <span className="qa-label-opt">(facoltativo)</span></label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="qa-input"
                placeholder="Italia / Europa"
              />
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !tipoCliente.trim()}
            className="qa-btn"
            style={{ marginTop: "0.75rem" }}
          >
            {loading ? (
              <>
                <span className="qa-spinner" aria-hidden="true" />
                Sto cercando…
              </>
            ) : (
              <>
                Inizia a cercare
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </>
            )}
          </button>
        </div>

        {/* OUTPUT PANEL */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="qa-result">
              {output.tipo_cliente_ideale && (
                <div className="qa-result-block qa-result-valutazione">
                  <div className="qa-result-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {" "}Cliente ideale
                  </div>
                  <p className="qa-result-text">{output.tipo_cliente_ideale}</p>
                  <CopyButton text={output.tipo_cliente_ideale} />
                </div>
              )}
              {output.come_cercarlo && (
                <div className="qa-result-block">
                  <div className="qa-result-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    {" "}Keyword di ricerca
                  </div>
                  <p className="qa-result-text">{output.come_cercarlo}</p>
                  <CopyButton text={output.come_cercarlo} />
                </div>
              )}
              {output.link_ricerca_linkedin && (
                <div className="qa-result-block qa-result-reply">
                  <div className="qa-result-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {" "}Link di ricerca LinkedIn
                  </div>
                  <p className="qa-result-text">
                    <a href={output.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="qa-result-link">{output.link_ricerca_linkedin}</a>
                  </p>
                  <CopyButton text={output.link_ricerca_linkedin} />
                </div>
              )}
              {output.suggerimenti_filtri && (
                <div className="qa-result-block">
                  <div className="qa-result-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    {" "}Suggerimenti filtri
                  </div>
                  <p className="qa-result-text">{output.suggerimenti_filtri}</p>
                </div>
              )}
              {output.profili_simili && (
                <div className="qa-result-block">
                  <div className="qa-result-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {" "}Ruoli simili
                  </div>
                  <p className="qa-result-text">{output.profili_simili}</p>
                </div>
              )}
              {output.cosa_fare_dopo && (
                <div className="qa-result-block">
                  <div className="qa-result-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    {" "}Cosa fare dopo
                  </div>
                  <p className="qa-result-text">{output.cosa_fare_dopo}</p>
                </div>
              )}

              <div style={{ marginTop: "1rem" }}>
                <Link href="/app/prospect" className="qa-cta-secondary">
                  Analizza un profilo trovato →
                </Link>
              </div>
            </div>
          ) : (
            <div className="qa-empty-state">
              <div className="qa-empty-state-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <p className="qa-empty-state-title">Descrivi il cliente che cerchi</p>
              <p className="qa-empty-state-text">
                Preflight genera ricerche LinkedIn pronte all&apos;uso, con keyword, filtri e link diretto.
              </p>
            </div>
          )}
        </div>
      </div>

      {!profile.onboarding_complete && output && (
        <div className="qa-callout">
          <p className="qa-callout-text">💡 Le ricerche saranno più mirate se configuri il tuo sistema.</p>
          <Link href="/app/onboarding" className="qa-callout-link">Configura il tuo sistema →</Link>
        </div>
      )}

      <HistoryList userId={userId} type="prospect" />
    </div>
  );
}
