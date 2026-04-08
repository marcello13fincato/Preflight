"use client";

import { useMemo, useState } from "react";
import { useSession } from "@/lib/hooks/useSession";
import Link from "next/link";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { articoloSchema, type ArticoloJson } from "@/lib/sales/schemas";

/* ── Copy button inline ── */
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button type="button" onClick={copy} className={`oggi-copy-btn ${copied ? "oggi-copy-done" : ""}`}>
      {copied ? (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copiato</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {label || "Copia"}</>
      )}
    </button>
  );
}

/* ── Quick tools ── */
const QUICK_TOOLS = [
  { href: "/app", icon: "📋", title: "Cosa fare oggi", desc: "Piano quotidiano AI." },
  { href: "/app/find-clients", icon: "🔍", title: "Trova clienti", desc: "Targeting e messaggi." },
  { href: "/app/prospect", icon: "🎯", title: "Analizza profilo", desc: "Diagnosi prospect." },
  { href: "/app/post", icon: "✍️", title: "Scrivi post", desc: "Post con hook e CTA." },
];

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
  const [copiedFull, setCopiedFull] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  /* Image generation */
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  /* Article suggestions */
  const [artLoading, setArtLoading] = useState(false);
  const [artSuggestions, setArtSuggestions] = useState<Array<{ titolo: string; tipo: string; descrizione: string; search_query: string }> | null>(null);
  const [artError, setArtError] = useState<string | null>(null);

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

  async function suggestArticles() {
    if (!output) return;
    setArtLoading(true);
    setArtError(null);
    try {
      const contentText = `${output.titolo}\n${output.sottotitolo}\n${output.sezioni.map(s => s.titolo_sezione).join(", ")}`;
      const res = await fetch("/api/ai/suggest-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentText, content_type: "articolo" }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : `Errore (${res.status})`);
      const articles = json.articles as Array<{ titolo: string; tipo: string; descrizione: string; search_query: string }>;
      if (!Array.isArray(articles)) throw new Error("Nessun suggerimento restituito.");
      setArtSuggestions(articles);
    } catch (err) {
      setArtError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setArtLoading(false);
    }
  }

  function copyFullArticle() {
    if (!output) return;
    const full = `# ${output.titolo}\n\n*${output.sottotitolo}*\n\n${output.sezioni.map(s => `## ${s.titolo_sezione}\n\n${s.contenuto}`).join("\n\n")}\n\n---\n\n${output.conclusione}\n\n${output.cta_finale}`;
    navigator.clipboard.writeText(full);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  }

  /* ═══════════════════════════════════════════
     RESULTS VIEW
     ═══════════════════════════════════════════ */
  if (output) {
    return (
      <div className="sp-page fade-in">
        {/* ── HERO ── */}
        <div className="sp-hero sa-hero fade-in">
          <div className="sp-hero-top">
            <button type="button" onClick={() => setOutput(null)} className="ap-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Nuovo articolo
            </button>
            <span className="ap-hero-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Article Builder AI
            </span>
          </div>
          <div className="sp-hero-content">
            <h1 className="sa-hero-title">{output.titolo}</h1>
            <p className="sa-hero-subtitle">{output.sottotitolo}</p>
            <div className="sp-hero-stats">
              <span className="sp-hero-stat"><strong>{output.sezioni.length}</strong> sezioni</span>
              <span className="ap-hero-sep" />
              <span className="sp-hero-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                SEO-ready
              </span>
              <span className="ap-hero-sep" />
              <span className="sp-hero-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                CTA inclusa
              </span>
            </div>
          </div>
          {/* SEO meta */}
          <div className="ap-focus-card">
            <span className="ap-focus-label">Meta description (SEO)</span>
            <p className="ap-focus-text">{output.meta_description}</p>
          </div>
        </div>

        {/* ── SEZIONE 1: Quick actions ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">1</span>
            <div>
              <h2 className="ap-section-title">Azioni rapide</h2>
              <p className="ap-section-sub">Copia tutto l&apos;articolo o genera una cover image.</p>
            </div>
          </div>
          <div className="sp-engage-grid">
            <button type="button" onClick={copyFullArticle} className="sa-action-btn sa-action-btn--primary">
              {copiedFull ? (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Articolo copiato!</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copia articolo completo</>
              )}
            </button>
            <button type="button" onClick={generateImage} disabled={imgLoading} className="sa-action-btn">
              {imgLoading ? (
                <><span className="qa-spinner" aria-hidden="true" />Generazione immagine…</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg> {imgUrl ? "Nuova cover" : "Genera cover image"}</>
              )}
            </button>
          </div>
          {imgUrl && (
            <div className="sp-img-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="Cover articolo" className="sp-img-result" />
            </div>
          )}
          {imgError && (
            <div className="ap-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {imgError}
            </div>
          )}
        </section>

        {/* ── SEZIONE 2: Sezioni articolo (tab-based) ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">2</span>
            <div>
              <h2 className="ap-section-title">Contenuto dell&apos;articolo</h2>
              <p className="ap-section-sub">{output.sezioni.length} sezioni — naviga e copia singolarmente.</p>
            </div>
          </div>

          <div className="oggi-msg-tabs sa-section-tabs">
            {output.sezioni.map((s, i) => (
              <button key={i} type="button"
                className={`oggi-msg-tab ${activeSection === i ? "oggi-msg-tab--active" : ""}`}
                onClick={() => setActiveSection(i)}>
                {i + 1}. {s.titolo_sezione.length > 30 ? s.titolo_sezione.slice(0, 30) + "…" : s.titolo_sezione}
              </button>
            ))}
          </div>

          <div className="oggi-msg-active-card">
            <div className="sa-section-card">
              <div className="sa-section-head">
                <div className="sa-section-meta">
                  <span className="ap-msg-step-badge">{activeSection + 1}</span>
                  <h3 className="sa-section-title">{output.sezioni[activeSection].titolo_sezione}</h3>
                </div>
                <CopyBtn text={`## ${output.sezioni[activeSection].titolo_sezione}\n\n${output.sezioni[activeSection].contenuto}`} label="Copia sezione" />
              </div>
              <div className="sa-section-content">{output.sezioni[activeSection].contenuto}</div>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 3: Conclusione e CTA ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">3</span>
            <div>
              <h2 className="ap-section-title">Conclusione e CTA</h2>
              <p className="ap-section-sub">Chiudi l&apos;articolo con impatto e una call-to-action diretta.</p>
            </div>
          </div>
          <div className="sa-conclusion-grid">
            <div className="sa-conclusion-card">
              <div className="sa-conclusion-head">
                <span className="sa-conclusion-icon">📝</span>
                <span className="sa-conclusion-label">Conclusione</span>
                <CopyBtn text={output.conclusione} />
              </div>
              <p className="sa-conclusion-text">{output.conclusione}</p>
            </div>
            <div className="sa-conclusion-card sa-conclusion-card--cta">
              <div className="sa-conclusion-head">
                <span className="sa-conclusion-icon">🎯</span>
                <span className="sa-conclusion-label">Call to action finale</span>
                <CopyBtn text={output.cta_finale} />
              </div>
              <p className="sa-conclusion-text">{output.cta_finale}</p>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 4: Articoli online ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">4</span>
            <div>
              <h2 className="ap-section-title">Fonti e articoli correlati</h2>
              <p className="ap-section-sub">Contenuti di settore da citare come riferimento.</p>
            </div>
          </div>

          {artSuggestions && (
            <div className="sp-articles-grid">
              {artSuggestions.map((art, i) => (
                <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(art.search_query)}`} target="_blank" rel="noopener noreferrer" className="sp-article-card">
                  <div className="sp-article-head">
                    <span className="sp-article-num">{i + 1}</span>
                    <span className="sp-article-type">{art.tipo}</span>
                  </div>
                  <strong className="sp-article-title">{art.titolo}</strong>
                  <p className="sp-article-desc">{art.descrizione}</p>
                  <span className="sp-article-link">Cerca su Google →</span>
                </a>
              ))}
            </div>
          )}

          {artError && (
            <div className="ap-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {artError}
            </div>
          )}

          <button type="button" onClick={suggestArticles} disabled={artLoading} className="sp-secondary-btn">
            {artLoading ? (
              <><span className="qa-spinner" aria-hidden="true" />Cerco articoli pertinenti…</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                {artSuggestions ? "Suggerisci altri articoli" : "Suggerisci articoli online"}
              </>
            )}
          </button>
        </section>

        {/* ── SEZIONE 5: Prossimo step + Nav ── */}
        <section className="ap-section ap-section--next fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num ap-section-num--next">→</span>
            <div>
              <h2 className="ap-section-title">Pubblica e promuovi</h2>
              <p className="ap-section-sub">Crea un post LinkedIn per promuovere l&apos;articolo e amplifica la reach.</p>
            </div>
          </div>
          <div className="ap-next-grid">
            <Link href="/app/post" className="ap-next-card ap-next-card--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Scrivi un post</span>
            </Link>
            <Link href="/app/find-clients" className="ap-next-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Trova clienti</span>
            </Link>
            <Link href="/app" className="ap-next-card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Cosa fare oggi</span>
            </Link>
          </div>
        </section>

        {/* Stats strip */}
        <section className="ap-section ap-stats-section fade-in-delay">
          <div className="ap-stats-grid">
            <div className="ap-stat"><span className="ap-stat-value">{output.sezioni.length}</span><span className="ap-stat-label">Sezioni</span></div>
            <div className="ap-stat"><span className="ap-stat-value">1</span><span className="ap-stat-label">Conclusione</span></div>
            <div className="ap-stat"><span className="ap-stat-value">1</span><span className="ap-stat-label">CTA</span></div>
            <div className="ap-stat"><span className="ap-stat-value">SEO</span><span className="ap-stat-label">Ottimizzato</span></div>
          </div>
        </section>

        <div className="ap-bottom-actions">
          <button type="button" onClick={() => setOutput(null)} className="btn-ghost">🔄 Nuovo articolo</button>
        </div>

        <HistoryList userId={userId} type="articolo" />
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     INPUT VIEW
     ═══════════════════════════════════════════ */
  return (
    <div className="sp-page fade-in">
      {/* Hero */}
      <div className="sp-hero sa-hero sp-hero--input fade-in">
        <div className="sp-hero-top">
          <span className="ap-hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Article Builder AI
          </span>
        </div>
        <h1 className="ap-input-title">Scrivi un articolo LinkedIn</h1>
        <p className="ap-input-sub">Articoli lunghi, strutturati e SEO-friendly che posizionano la tua expertise nel settore.</p>
        <div className="ap-hero-features">
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Struttura completa
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            SEO-optimized
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            CTA finale
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            Cover image
          </span>
        </div>
      </div>

      {/* Form + sidebar */}
      <div className="ap-input-layout">
        <div className="ap-form-card fade-in-delay">
          <div className="qa-field">
            <label className="qa-label">Argomento dell&apos;articolo</label>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="qa-input qa-input-lg" rows={3}
              placeholder="Es. Perché il 90% delle strategie outbound su LinkedIn fallisce — e come strutturare un processo che genera pipeline in 30 giorni" />
          </div>
          <div className="qa-field">
            <label className="qa-label">Angolo o prospettiva <span className="qa-label-opt">(facoltativo)</span></label>
            <input value={angle} onChange={(e) => setAngle(e.target.value)} className="qa-input"
              placeholder="Es. Basato sulla mia esperienza con 50+ founder SaaS" />
          </div>
          <div className="find-section-row">
            <div className="qa-field qa-field-flex">
              <label className="qa-label">Target audience <span className="qa-label-opt">(facoltativo)</span></label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="qa-input"
                placeholder="CEO SaaS B2B, founder, VP Sales" />
            </div>
            <div className="qa-field qa-field-flex">
              <label className="qa-label">Tono</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="qa-input">
                <option value="professionale">Professionale</option>
                <option value="diretto">Diretto e provocatorio</option>
                <option value="narrativo">Narrativo / storytelling</option>
                <option value="educativo">Educativo</option>
              </select>
            </div>
          </div>
          {error && (
            <div className="ap-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {error}
            </div>
          )}
          <button type="button" onClick={generate} disabled={loading || !topic.trim()} className="ap-generate-btn">
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

        <div className="ap-info-side">
          <div className="ap-info-card">
            <h3 className="ap-info-title">Cosa otterrai</h3>
            <div className="ap-info-features">
              <div className="ap-info-feature"><span className="ap-info-num">1</span><div><strong>Titolo e sottotitolo</strong><p>Hook + posizionamento chiaro</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">2</span><div><strong>Sezioni strutturate</strong><p>Corpo dell&apos;articolo con flow logico</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">3</span><div><strong>Conclusione + CTA</strong><p>Chiusura con call-to-action</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">4</span><div><strong>SEO meta description</strong><p>Ottimizzata per i motori</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">5</span><div><strong>Cover image AI</strong><p>Immagine di copertina generata</p></div></div>
            </div>
          </div>

          {!profile.onboarding_complete && (
            <div className="sp-onboarding-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div>
                <p className="sp-onboarding-text">Configura il tuo sistema per articoli più coerenti con il tuo brand.</p>
                <Link href="/app/onboarding" className="sp-onboarding-link">Configura il sistema →</Link>
              </div>
            </div>
          )}

          {loading && (
            <div className="ap-loading-card">
              <div className="ap-loading-orb">
                <div className="ap-orb-ring ap-orb-ring-1" />
                <div className="ap-orb-ring ap-orb-ring-2" />
                <div className="ap-orb-core">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
              </div>
              <div className="ap-loading-steps">
                <span className="ap-loading-step ap-loading-step--active">Struttura articolo</span>
                <span className="ap-loading-step">Scrivo sezioni</span>
                <span className="ap-loading-step">SEO + CTA</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Other tools */}
      <section className="ap-tools-section fade-in-delay">
        <h2 className="ap-tools-title">Altri strumenti</h2>
        <div className="sys-quick-grid">
          {QUICK_TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="sys-quick-card">
              <span className="sys-quick-card-icon">{t.icon}</span>
              <h3 className="sys-quick-card-title">{t.title}</h3>
              <p className="sys-quick-card-desc">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <HistoryList userId={userId} type="articolo" />
    </div>
  );
}
