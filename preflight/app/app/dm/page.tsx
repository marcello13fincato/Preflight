"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import HistoryList from "@/components/app/HistoryList";
import InsightCard, { ResultHeader, MetricRow, MetricBadge, SectionDivider } from "@/components/app/InsightCard";
import { IconEdit3, IconAlertTriangle, IconThermometer, IconSearch, IconTarget, IconMail, IconRefresh, IconClipboard, IconMessageCircle } from "@/components/shared/icons";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { adviceSchema, type AdviceJson } from "@/lib/sales/schemas";

export default function DmPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [situation, setSituation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [output, setOutput] = useState<AdviceJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!situation.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }
      const res = await fetch("/api/ai/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          situation: situation.trim(),
          linkedin_url: linkedinUrl.trim(),
          website_url: websiteUrl.trim(),
          pdf_text: pdfText,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = adviceSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "dm", situation, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  function fillExample(text: string) {
    setSituation(text);
  }

  return (
    <div className="tool-page">
      {/* ── Hero header ── */}
      <div className="page-hero" style={{ marginBottom: "0.5rem" }}>
        <span className="page-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Consulenza
        </span>
        <h1 className="page-hero-title">Chiedimi un consiglio</h1>
        <p className="page-hero-subtitle">
          Descrivi una situazione reale su LinkedIn e scopri come conviene muoverti.
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
            <label className="qa-label">Spiegami la situazione</label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="qa-input qa-input-lg"
              rows={6}
              placeholder={"Ho scritto a un founder SaaS e mi ha risposto in modo abbastanza generico.\nNon so come continuare la conversazione."}
            />
          </div>

          <div className="qa-examples">
            <p className="qa-examples-title">Esempi di situazioni:</p>
            <div className="qa-examples-chips">
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Qualcuno ha commentato un mio post e sembra interessato a quello che faccio.")}>
                Qualcuno ha commentato un mio post
              </button>
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Ho ricevuto un messaggio su LinkedIn da qualcuno che non conosco.")}>
                Ho ricevuto un messaggio su LinkedIn
              </button>
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Voglio capire se è il momento giusto per proporre una call a un contatto con cui sto parlando.")}>
                Voglio capire se è il momento giusto per proporre una call
              </button>
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Non so come continuare una conversazione che si è fermata dopo il mio ultimo messaggio.")}>
                Non so come continuare una conversazione
              </button>
            </div>
          </div>

          <div className="qa-field">
            <label className="qa-label">
              Link profilo LinkedIn della persona coinvolta
              <span className="qa-label-opt">(facoltativo)</span>
            </label>
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

          <div className="qa-field">
            <label className="qa-label">
              Link sito web azienda
              <span className="qa-label-opt">(facoltativo)</span>
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="qa-input"
              placeholder="https://azienda.com"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !situation.trim()}
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
                Chiedi un consiglio
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </>
            )}
          </button>
          </div>
        </details>
        ) : (
        <div className="tool-page-panel space-y-1">
          <div className="qa-field">
            <label className="qa-label">Spiegami la situazione</label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="qa-input qa-input-lg"
              rows={6}
              placeholder={"Ho scritto a un founder SaaS e mi ha risposto in modo abbastanza generico.\nNon so come continuare la conversazione."}
            />
          </div>

          <div className="qa-examples">
            <p className="qa-examples-title">Esempi di situazioni:</p>
            <div className="qa-examples-chips">
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Qualcuno ha commentato un mio post e sembra interessato a quello che faccio.")}>
                Qualcuno ha commentato un mio post
              </button>
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Ho ricevuto un messaggio su LinkedIn da qualcuno che non conosco.")}>
                Ho ricevuto un messaggio su LinkedIn
              </button>
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Voglio capire se è il momento giusto per proporre una call a un contatto con cui sto parlando.")}>
                Voglio capire se è il momento giusto per proporre una call
              </button>
              <button type="button" className="qa-example-btn" onClick={() => fillExample("Non so come continuare una conversazione che si è fermata dopo il mio ultimo messaggio.")}>
                Non so come continuare una conversazione
              </button>
            </div>
          </div>

          <div className="qa-field">
            <label className="qa-label">
              Link profilo LinkedIn della persona coinvolta
              <span className="qa-label-opt">(facoltativo)</span>
            </label>
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

          <div className="qa-field">
            <label className="qa-label">
              Link sito web azienda
              <span className="qa-label-opt">(facoltativo)</span>
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="qa-input"
              placeholder="https://azienda.com"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading || !situation.trim()}
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
                Chiedi un consiglio
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
              <ResultHeader title="Analisi situazione" copyText={`${output.risposta_suggerita}\n\n${output.followup_consigliato}`} />

              <MetricRow>
                <MetricBadge icon={<IconThermometer size={16} />} label="Interesse" value={output.client_heat_level} color={output.client_heat_level === "Hot" ? "red" : output.client_heat_level === "Warm" ? "amber" : "blue"} />
              </MetricRow>

              <InsightCard icon={<IconSearch size={16} />} label="Lettura della situazione" text={output.lettura_situazione} variant="summary" />

              <SectionDivider label="Strategia" />

              <InsightCard icon={<IconTarget size={16} />} label="Strategia consigliata" text={output.strategia_consigliata} variant="strategy" />
              <InsightCard icon={<IconMail size={16} />} label="Risposta suggerita" text={output.risposta_suggerita} variant="message" copyable />
              <InsightCard icon={<IconRefresh size={16} />} label="Follow-up consigliato" text={output.followup_consigliato} variant="message" copyable />

              <SectionDivider label="Prossimi passi" />

              <InsightCard icon={<IconClipboard size={16} />} label="Step successivi" text={output.step_successivi} variant="action" />
              <InsightCard icon={<IconAlertTriangle size={16} />} label="Errori da evitare" text={output.errori_da_evitare} variant="warning" />
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon"><IconMessageCircle size={28} /></p>
              <p className="tool-page-empty-title">
                Il risultato apparirà qui
              </p>
              <p className="tool-page-empty-text">
                Descrivi la situazione e clicca &quot;Chiedi un consiglio&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="tool-page-panel">
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="dm" />
      </div>
    </div>
  );
}
