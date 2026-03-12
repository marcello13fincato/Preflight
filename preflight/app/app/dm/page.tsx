"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
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

  const heatBadge = (level: string) =>
    level === "Hot" ? "badge-red" : level === "Warm" ? "badge-amber" : "badge-blue";

  return (
    <div className="qa-container qa-container-dash">
      {/* ── Hero header ── */}
      <div className="page-hero" style={{ marginBottom: "1.5rem" }}>
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
                  Consiglio completo
                </h3>
                <CopyButton text={`${output.risposta_suggerita}\n\n${output.followup_consigliato}`} />
              </div>

              {/* Heat badge */}
              <div
                className="rounded-lg p-3 text-sm flex items-center gap-2"
                style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
              >
                <span className="font-medium">🌡️ Livello interesse:</span>
                <span className={`badge ${heatBadge(output.client_heat_level)}`}>
                  {output.client_heat_level}
                </span>
              </div>

              <ResultBlock icon="🔍" label="Lettura della situazione" text={output.lettura_situazione} />
              <ResultBlock icon="🎯" label="Strategia consigliata" text={output.strategia_consigliata} />
              <ResultBlock icon="✉️" label="Risposta suggerita" text={output.risposta_suggerita} highlight />
              <ResultBlock icon="🔄" label="Follow-up consigliato" text={output.followup_consigliato} />
              <ResultBlock icon="📋" label="Step successivi" text={output.step_successivi} />
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
              <p className="text-4xl mb-3">💬</p>
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Il risultato apparirà qui
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Descrivi la situazione e clicca &quot;Chiedi un consiglio&quot;
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
        <HistoryList userId={userId} type="dm" />
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
