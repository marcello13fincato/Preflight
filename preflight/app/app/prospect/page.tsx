"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import HistoryList from "@/components/app/HistoryList";
import InsightCard, { ResultHeader, MetricRow, MetricBadge, SectionDivider } from "@/components/app/InsightCard";
import { IconEdit3, IconAlertTriangle, IconThermometer, IconTarget, IconMail, IconRefresh, IconClipboard, IconUser, IconChart, IconCheck, IconEye, IconSearch } from "@/components/shared/icons";
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

  return (
    <div className="tool-page">
      {/* ── Hero header ── */}
      <div className="page-hero" style={{ marginBottom: "0.5rem" }}>
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
      <div className="tool-page-grid">
        {/* INPUT PANEL */}
        {output ? (
        <details className="tool-input-collapsed">
          <summary><IconEdit3 size={14} /> Modifica parametri</summary>
          <div className="tool-input-body space-y-1">
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
        </details>
        ) : (
        <div className="tool-page-panel space-y-1">
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
        )}

        {/* OUTPUT PANEL */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1"><IconAlertTriangle size={14} /> Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="insight-result">
              <ResultHeader title="Analisi profilo" copyText={`${output.primo_messaggio}\n\n${output.followup_consigliato}`} />

              <MetricRow>
                <MetricBadge icon={<IconThermometer size={16} />} label="Interesse" value={output.client_heat_level} color={output.client_heat_level === "Hot" ? "red" : output.client_heat_level === "Warm" ? "amber" : "blue"} />
                <MetricBadge icon={<IconChart size={16} />} label="Priorità" value={output.priority_signal} color={output.priority_signal === "high" ? "red" : output.priority_signal === "medium" ? "amber" : "blue"} />
              </MetricRow>

              <InsightCard icon={<IconUser size={16} />} label="Quadro generale" text={output.chi_e} variant="summary" />
              <InsightCard icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>} label="Ruolo e contesto" text={output.ruolo_contesto} variant="evidence" />

              <SectionDivider label="Valutazione commerciale" />

              <InsightCard icon={<IconCheck size={16} />} label="Perché è un buon contatto" text={output.perche_buon_contatto} variant="strategy" />
              <InsightCard icon={<IconEye size={16} />} label="Segnali da osservare" text={output.segnali_da_osservare} variant="evidence" />

              <SectionDivider label="Azione consigliata" />

              <InsightCard icon={<IconTarget size={16} />} label="Strategia di contatto" text={output.strategia_contatto} variant="strategy" />
              <InsightCard icon={<IconMail size={16} />} label="Primo messaggio" text={output.primo_messaggio} variant="message" copyable />
              <InsightCard icon={<IconRefresh size={16} />} label="Follow-up consigliato" text={output.followup_consigliato} variant="message" copyable />

              <SectionDivider label="Prossimi passi" />

              <InsightCard icon={<IconClipboard size={16} />} label="Step successivi" text={output.step_successivi} variant="action" />
              <InsightCard icon={<IconAlertTriangle size={16} />} label="Errori da evitare" text={output.errori_da_evitare} variant="warning" />
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon"><IconSearch size={28} /></p>
              <p className="tool-page-empty-title">
                Il risultato apparirà qui
              </p>
              <p className="tool-page-empty-text">
                Inserisci il link LinkedIn e clicca &quot;Analizza profilo&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="tool-page-panel">
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="prospect" />
      </div>
    </div>
  );
}
