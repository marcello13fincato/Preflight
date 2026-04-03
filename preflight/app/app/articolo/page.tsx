"use client";

import { useMemo, useState } from "react";
import { useSession } from "@/lib/hooks/useSession";
import Link from "next/link";
import { IconAlertTriangle } from "@/components/shared/icons";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { articoloSchema, type ArticoloJson } from "@/lib/sales/schemas";

export default function ArticoloPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("professionale");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<ArticoloJson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /* Image generation */
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/articolo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, angle, target_audience: targetAudience, tone }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      const parsed = articoloSchema.safeParse(json);
      if (!parsed.success) throw new Error("Risposta AI non valida. Riprova.");
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "articolo", topic, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    if (!output) return;
    setImgLoading(true);
    setImgError(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_content: `Articolo: ${output.titolo}\n${output.meta_description}` }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : `Errore (${res.status})`);
      if (typeof json.image_url !== "string") throw new Error("Nessuna immagine restituita.");
      setImgUrl(json.image_url);
    } catch (err) {
      setImgError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setImgLoading(false);
    }
  }

  function copyFullArticle() {
    if (!output) return;
    const full = `# ${output.titolo}\n\n*${output.sottotitolo}*\n\n${output.sezioni.map(s => `## ${s.titolo_sezione}\n\n${s.contenuto}`).join("\n\n")}\n\n---\n\n${output.conclusione}\n\n${output.cta_finale}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pr-fullscreen">
      {/* Hero */}
      <div className="pr-score-hero" style={{ background: "linear-gradient(135deg, rgba(0,206,209,0.15), rgba(108,92,231,0.08))" }}>
        <div className="pr-hero-content">
          <div className="pr-hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Scrivi un articolo
          </div>
          <h1 className="pr-hero-title">Crea un articolo LinkedIn autorevole</h1>
          <p className="pr-hero-subtitle">Articoli lunghi, strutturati e SEO-friendly che posizionano la tua expertise nel settore.</p>
        </div>
      </div>

      {/* Input */}
      <div className="fc-section">
        <div className="fc-section-inner">
          <div className="fc-input-header">
            <div className="fc-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <h2 className="fc-section-title">Definisci l&apos;articolo</h2>
              <p className="fc-section-desc">Indica l&apos;argomento e l&apos;AI scriverà un articolo completo con sezioni, SEO e CTA.</p>
            </div>
          </div>

          <div className="fc-form">
            <div className="qa-field">
              <label className="qa-label">Argomento dell&apos;articolo <span className="fc-required">*</span></label>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="qa-input qa-input-lg" rows={3}
                placeholder="Es. Perché il 90% delle strategie outbound su LinkedIn fallisce — e come strutturare un processo che genera pipeline in 30 giorni" />
            </div>

            <div className="qa-field">
              <label className="qa-label">Angolo o prospettiva <span className="qa-label-opt">(facoltativo)</span></label>
              <input value={angle} onChange={(e) => setAngle(e.target.value)} className="qa-input"
                placeholder="Es. Basato sulla mia esperienza con 50+ founder SaaS" />
            </div>

            <div className="find-section-row">
              <div className="qa-field" style={{ flex: 1 }}>
                <label className="qa-label">Target audience <span className="qa-label-opt">(facoltativo)</span></label>
                <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="qa-input"
                  placeholder="CEO SaaS B2B, founder, VP Sales" />
              </div>
              <div className="qa-field" style={{ flex: 1 }}>
                <label className="qa-label">Tono</label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="qa-input">
                  <option value="professionale">Professionale</option>
                  <option value="diretto">Diretto e provocatorio</option>
                  <option value="narrativo">Narrativo / storytelling</option>
                  <option value="educativo">Educativo</option>
                </select>
              </div>
            </div>

            <button onClick={generate} disabled={loading || !topic.trim()} className="fc-generate-btn">
              {loading ? (
                <><span className="qa-spinner" aria-hidden="true" />Sto scrivendo l&apos;articolo…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Genera articolo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="fc-section">
          <div className="fc-section-inner">
            <div className="fc-empty-state" style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}>
              <IconAlertTriangle size={20} />
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <>
          {/* Header articolo */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <div className="art-header">
                <h2 className="art-title">{output.titolo}</h2>
                <p className="art-subtitle">{output.sottotitolo}</p>
                <div className="art-meta">
                  <span className="art-meta-tag">SEO: {output.meta_description}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sezioni */}
          {output.sezioni.map((sezione, i) => (
            <div key={i} className="fc-section">
              <div className="fc-section-inner">
                <div className="art-section">
                  <h3 className="art-section-title">{sezione.titolo_sezione}</h3>
                  <div className="art-section-content">{sezione.contenuto}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Conclusione */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <div className="art-section">
                <h3 className="art-section-title">Conclusione</h3>
                <div className="art-section-content">{output.conclusione}</div>
                <div className="art-cta-box">
                  <p className="art-cta-text">{output.cta_finale}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy full + Image */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <div className="post-engage-grid">
                <button onClick={copyFullArticle} className="fc-generate-btn">
                  {copied ? "✓ Articolo copiato!" : "Copia articolo completo"}
                </button>
                <button onClick={generateImage} disabled={imgLoading} className="fc-generate-btn" style={{ background: "linear-gradient(135deg, rgba(0,206,209,0.8), rgba(108,92,231,0.8))" }}>
                  {imgLoading ? (
                    <><span className="qa-spinner" aria-hidden="true" />Generazione immagine…</>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      {imgUrl ? "Genera nuova cover" : "Genera immagine di copertina"}
                    </>
                  )}
                </button>
              </div>

              {imgUrl && (
                <div className="post-img-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="Cover articolo" className="post-img-result" />
                </div>
              )}
              {imgError && <p className="post-img-error"><IconAlertTriangle size={14} /> {imgError}</p>}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!output && !error && !loading && (
        <div className="fc-section">
          <div className="fc-section-inner">
            <div className="fc-empty-state">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <p className="fc-empty-title">Definisci l&apos;argomento e genera l&apos;articolo</p>
              <p className="fc-empty-text">Riceverai un articolo completo con sezioni, conclusione, CTA e immagine di copertina.</p>
            </div>
          </div>
        </div>
      )}

      {!profile.onboarding_complete && (
        <div className="fc-section">
          <div className="fc-section-inner">
            <div className="fc-callout">
              <div className="fc-callout-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
              <div>
                <p className="fc-callout-text">Configura il tuo sistema per articoli più mirati e coerenti con il tuo brand.</p>
                <Link href="/app/onboarding" className="fc-callout-link">Configura il sistema →</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="fc-section">
        <div className="fc-section-inner">
          <h3 className="post-section-label">Storico</h3>
          <HistoryList userId={userId} type="articolo" />
        </div>
      </div>
    </div>
  );
}
