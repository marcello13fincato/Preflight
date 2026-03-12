"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";

export default function ProspectPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showPdfGuide, setShowPdfGuide] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState<ProspectAnalyzerJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!linkedinUrl.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }
      const res = await fetch("/api/ai/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          linkedin_url: linkedinUrl.trim(),
          website_url: websiteUrl.trim(),
          context: context.trim(),
          pdf_text: pdfText,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = prospectAnalyzerSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "prospect", linkedinUrl, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  const heatBadge = (level: string) =>
    level === "Hot" ? "badge-red" : level === "Warm" ? "badge-amber" : "badge-blue";
  const priorityBadge = (level: string) =>
    level === "high" ? "badge-red" : level === "medium" ? "badge-amber" : "badge-blue";

  return (
    <div className="qa-container qa-container-dash">
      {/* ── Hero header ── */}
      <div className="page-hero" style={{ marginBottom: "1.5rem" }}>
        <span className="page-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Analisi profilo
        </span>
        <h1 className="page-hero-title">Analizza questo profilo</h1>
        <p className="page-hero-subtitle">
          Scopri se vale la pena contattare questa persona e come muoverti per iniziare la conversazione.
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
            <label className="qa-label">Link al profilo LinkedIn</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="qa-input"
              placeholder="https://linkedin.com/in/nomecognome"
            />
          </div>

          <div className="qa-field">
            <label className="qa-label">
              Carica il PDF del profilo
              <span className="qa-label-opt">(facoltativo)</span>
            </label>
            <p className="qa-microcopy">
              Se vuoi un&apos;analisi più precisa, puoi caricare anche il PDF del profilo.
            </p>
            <label className="qa-file-upload">
              <input
                type="file"
                accept=".pdf"
                className="qa-file-input"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
              <span className="qa-file-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {pdfFile ? pdfFile.name : "Scegli un file PDF"}
              </span>
            </label>
          </div>

          <button
            type="button"
            className="qa-guide-toggle"
            onClick={() => setShowPdfGuide(!showPdfGuide)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Come scaricare il PDF del profilo LinkedIn
          </button>

          {showPdfGuide && (
            <div className="qa-guide">
              <ol className="qa-guide-steps">
                <li>Vai sul profilo LinkedIn della persona</li>
                <li>Clicca sui tre puntini accanto alla foto del profilo</li>
                <li>Seleziona &quot;Salva come PDF&quot;</li>
                <li>Carica il file qui</li>
              </ol>
            </div>
          )}

          <div className="qa-field">
            <label className="qa-label">
              Link sito web
              <span className="qa-label-opt">(facoltativo, se azienda)</span>
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="qa-input"
              placeholder="https://azienda.com"
            />
          </div>

          <div className="qa-field">
            <label className="qa-label">
              Contesto opzionale
              <span className="qa-label-opt">(facoltativo)</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="qa-input qa-input-lg"
              rows={3}
              placeholder="Founder SaaS che pubblica su crescita aziendale."
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !linkedinUrl.trim()}
            className="qa-btn"
            style={{ marginTop: "0.75rem" }}
          >
            {loading ? (
              <>
                <span className="qa-spinner" aria-hidden="true" />
                Sto analizzando…
              </>
            ) : (
              <>
                Analizza profilo
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
                  Analisi completa
                </h3>
                <CopyButton text={`${output.primo_messaggio}\n\n${output.followup_consigliato}`} />
              </div>

              {/* Heat + Priority badges */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className="rounded-lg p-3 text-sm flex items-center gap-2"
                  style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
                >
                  <span className="font-medium">🌡️ Livello interesse:</span>
                  <span className={`badge ${heatBadge(output.client_heat_level)}`}>
                    {output.client_heat_level}
                  </span>
                </div>
                <div
                  className="rounded-lg p-3 text-sm flex items-center gap-2"
                  style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
                >
                  <span className="font-medium">📊 Priorità:</span>
                  <span className={`badge ${priorityBadge(output.priority_signal)}`}>
                    {output.priority_signal}
                  </span>
                </div>
              </div>

              <ResultBlock icon="👤" label="Chi è questa persona / azienda" text={output.chi_e} />
              <ResultBlock icon="🏢" label="Ruolo e contesto" text={output.ruolo_contesto} />
              <ResultBlock icon="✅" label="Perché potrebbe essere un buon contatto" text={output.perche_buon_contatto} highlight />
              <ResultBlock icon="🎯" label="Strategia di contatto" text={output.strategia_contatto} />
              <ResultBlock icon="✉️" label="Primo messaggio suggerito" text={output.primo_messaggio} highlight />
              <ResultBlock icon="🔄" label="Follow-up consigliato" text={output.followup_consigliato} />
              <ResultBlock icon="📋" label="Step successivi" text={output.step_successivi} />
              <ResultBlock icon="👀" label="Segnali da osservare" text={output.segnali_da_osservare} />
              <ResultBlock icon="⚠️" label="Errori da evitare" text={output.errori_da_evitare} />
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
              <p className="text-4xl mb-3">🔎</p>
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Il risultato apparirà qui
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Inserisci il link LinkedIn e clicca &quot;Analizza profilo&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="prospect" />
      </div>
    </div>
  );
}

function ResultBlock({ icon, label, text, highlight }: { icon: string; label: string; text: string; highlight?: boolean }) {
  return (
    <div className={`qa-result-block ${highlight ? "qa-result-reply" : ""}`}>
      <div className="qa-result-label">
        <span>{icon}</span>
        {label}
      </div>
      <p className="qa-result-text">{text}</p>
    </div>
  );
}
