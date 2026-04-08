"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Link from "next/link";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { postBuilderSchema, type PostBuilderJson } from "@/lib/sales/schemas";

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
  { href: "/app/articolo", icon: "📄", title: "Scrivi articolo", desc: "Articolo autorevole." },
];

export default function PostPage() {
  const params = useSearchParams();
  const { userId, status } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = userId ? repo.profile.getProfile(userId) : { onboarding: null, plan: null, onboarding_complete: false };

  const [draftPost, setDraftPost] = useState(params.get("draft_post") || "");
  const [objective, setObjective] = useState(params.get("objective") || "lead");
  const [dmKeyword, setDmKeyword] = useState(params.get("dm_keyword") || "audit");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<PostBuilderJson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<"clean" | "direct" | "authority">("clean");

  /* Image generation state */
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  /* Article suggestions state */
  const [artLoading, setArtLoading] = useState(false);
  const [artSuggestions, setArtSuggestions] = useState<Array<{ titolo: string; tipo: string; descrizione: string; search_query: string }> | null>(null);
  const [artError, setArtError] = useState<string | null>(null);

  if (status === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          draft_post: draftPost,
          objective,
          dm_keyword: dmKeyword,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      const parsed = postBuilderSchema.safeParse(json);
      if (!parsed.success) throw new Error("Risposta AI non valida. Riprova.");
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId!, "post", draftPost, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function generateImage() {
    if (!output) return;
    setImgLoading(true);
    setImgError(null);
    try {
      const postText = output.post_versions[activeVersion] + "\n\n" + output.cta;
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_content: postText }),
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
      const postText = output.post_versions[activeVersion] + "\n\n" + output.cta;
      const res = await fetch("/api/ai/suggest-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postText, content_type: "post" }),
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

  const VERSION_LABELS = { clean: "Pulita", direct: "Diretta", authority: "Autorevole" } as const;
  const VERSION_ICONS = { clean: "✨", direct: "⚡", authority: "👑" } as const;

  /* ═══════════════════════════════════════════
     RESULTS VIEW
     ═══════════════════════════════════════════ */
  if (output) {
    return (
      <div className="sp-page fade-in">
        {/* ── HERO ── */}
        <div className="sp-hero fade-in">
          <div className="sp-hero-top">
            <button type="button" onClick={() => setOutput(null)} className="ap-back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Nuovo post
            </button>
            <span className="ap-hero-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Post Builder AI
            </span>
          </div>
          <div className="sp-hero-content">
            <h1 className="sp-hero-title">Il tuo post è pronto</h1>
            <p className="sp-hero-sub">5 hook, 3 versioni, CTA e commento di apertura — tutto personalizzato.</p>
            <div className="sp-hero-stats">
              <span className="sp-hero-stat">
                <strong>5</strong> hook
              </span>
              <span className="ap-hero-sep" />
              <span className="sp-hero-stat">
                <strong>3</strong> versioni
              </span>
              <span className="ap-hero-sep" />
              <span className="sp-hero-stat">
                <strong>1</strong> CTA
              </span>
              <span className="ap-hero-sep" />
              <span className="sp-hero-stat">
                <strong>1</strong> commento
              </span>
            </div>
          </div>
        </div>

        {/* ── SEZIONE 1: Hook ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">1</span>
            <div>
              <h2 className="ap-section-title">Hook — scegli il migliore</h2>
              <p className="ap-section-sub">La prima riga decide se il post viene letto. Tocca per copiare.</p>
            </div>
          </div>
          <div className="sp-hooks-grid">
            {output.hooks.map((hook, i) => (
              <div key={i} className="sp-hook-card">
                <div className="sp-hook-head">
                  <span className="sp-hook-num">{i + 1}</span>
                  <CopyBtn text={hook} />
                </div>
                <p className="sp-hook-text">{hook}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEZIONE 2: Versioni (tab) ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">2</span>
            <div>
              <h2 className="ap-section-title">Versioni del post</h2>
              <p className="ap-section-sub">Tre toni diversi — stesso messaggio. Scegli quello che ti rappresenta.</p>
            </div>
          </div>

          <div className="oggi-msg-tabs">
            {(["clean", "direct", "authority"] as const).map((v) => (
              <button key={v} type="button"
                className={`oggi-msg-tab ${activeVersion === v ? "oggi-msg-tab--active" : ""}`}
                onClick={() => setActiveVersion(v)}>
                {VERSION_ICONS[v]} {VERSION_LABELS[v]}
              </button>
            ))}
          </div>

          <div className="oggi-msg-active-card">
            <div className="sp-version-card">
              <div className="sp-version-head">
                <span className="sp-version-badge">{VERSION_ICONS[activeVersion]} {VERSION_LABELS[activeVersion]}</span>
                <CopyBtn text={output.post_versions[activeVersion]} label="Copia post" />
              </div>
              <pre className="sp-version-text">{output.post_versions[activeVersion]}</pre>
              <span className="ap-msg-chars">{output.post_versions[activeVersion].length} caratteri</span>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 3: CTA e Commento ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">3</span>
            <div>
              <h2 className="ap-section-title">CTA e commento di apertura</h2>
              <p className="ap-section-sub">La CTA chiude il post, il commento lo rilancia subito dopo la pubblicazione.</p>
            </div>
          </div>

          <div className="sp-engage-grid">
            <div className="sp-engage-card">
              <div className="sp-engage-head">
                <span className="sp-engage-icon">🎯</span>
                <span className="sp-engage-label">Call to action</span>
                <CopyBtn text={output.cta} />
              </div>
              <p className="sp-engage-text">{output.cta}</p>
            </div>
            <div className="sp-engage-card">
              <div className="sp-engage-head">
                <span className="sp-engage-icon">💬</span>
                <span className="sp-engage-label">Commento di apertura</span>
                <CopyBtn text={output.comment_starter} />
              </div>
              <p className="sp-engage-text">{output.comment_starter}</p>
            </div>
          </div>
        </section>

        {/* ── SEZIONE 4: Immagine ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">4</span>
            <div>
              <h2 className="ap-section-title">Immagine per il post</h2>
              <p className="ap-section-sub">Genera un&apos;immagine coerente con il tuo profilo visivo e il contenuto.</p>
            </div>
          </div>

          <div className="sp-image-section">
            {imgUrl && (
              <div className="sp-img-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt="Immagine generata per il post" className="sp-img-result" />
              </div>
            )}
            {imgError && (
              <div className="ap-error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {imgError}
              </div>
            )}
            {output.suggerimento_immagine && (
              <div className="sp-img-suggestion">
                <span className="sp-img-sug-label">💡 Suggerimento AI</span>
                <p className="sp-img-sug-text"><strong>{output.suggerimento_immagine.tipo}</strong> — {output.suggerimento_immagine.perche_funziona}</p>
              </div>
            )}
            <button type="button" onClick={generateImage} disabled={imgLoading} className="ap-generate-btn">
              {imgLoading ? (
                <><span className="qa-spinner" aria-hidden="true" />Generazione immagine…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                  {imgUrl ? "Genera nuova immagine" : "Genera immagine"}
                </>
              )}
            </button>
          </div>
        </section>

        {/* ── SEZIONE 5: Articoli online ── */}
        <section className="ap-section fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num">5</span>
            <div>
              <h2 className="ap-section-title">Articoli online pertinenti</h2>
              <p className="ap-section-sub">Fonti e contenuti di settore da condividere o citare nel commento.</p>
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

        {/* ── SEZIONE 6: Prossimo step + Nav ── */}
        <section className="ap-section ap-section--next fade-in-delay">
          <div className="ap-section-head">
            <span className="ap-section-num ap-section-num--next">→</span>
            <div>
              <h2 className="ap-section-title">Prossimo step</h2>
              <p className="ap-section-sub">{output.next_step}</p>
            </div>
          </div>
          <div className="ap-next-grid">
            <Link href="/app/articolo" className="ap-next-card ap-next-card--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Scrivi articolo</span>
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
            <div className="ap-stat"><span className="ap-stat-value">5</span><span className="ap-stat-label">Hook</span></div>
            <div className="ap-stat"><span className="ap-stat-value">3</span><span className="ap-stat-label">Versioni</span></div>
            <div className="ap-stat"><span className="ap-stat-value">{output.post_versions[activeVersion].length}</span><span className="ap-stat-label">Caratteri</span></div>
            <div className="ap-stat"><span className="ap-stat-value">{VERSION_LABELS[activeVersion]}</span><span className="ap-stat-label">Tono attivo</span></div>
          </div>
        </section>

        <div className="ap-bottom-actions">
          <button type="button" onClick={() => setOutput(null)} className="btn-ghost">🔄 Nuovo post</button>
        </div>

        <HistoryList userId={userId} type="post" />
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     INPUT VIEW
     ═══════════════════════════════════════════ */
  return (
    <div className="sp-page fade-in">
      {/* Hero */}
      <div className="sp-hero sp-hero--input fade-in">
        <div className="sp-hero-top">
          <span className="ap-hero-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Post Builder AI
          </span>
        </div>
        <h1 className="ap-input-title">Scrivi un post LinkedIn</h1>
        <p className="ap-input-sub">Trasforma un&apos;idea in un post strategico con hook, CTA e immagine — pronto da pubblicare.</p>
        <div className="ap-hero-features">
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            5 hook
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            3 versioni
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            CTA + commento
          </span>
          <span className="ap-hero-sep" />
          <span className="ap-hero-feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            Immagine AI
          </span>
        </div>
      </div>

      {/* Form + sidebar */}
      <div className="ap-input-layout">
        <div className="ap-form-card fade-in-delay">
          <div className="qa-field">
            <label className="qa-label">Bozza o idea del post</label>
            <textarea value={draftPost} onChange={(e) => setDraftPost(e.target.value)} className="qa-input qa-input-lg" rows={5}
              placeholder="Es. Molte aziende SaaS perdono conversioni perché l'onboarding è confuso. Vorrei raccontare come risolvere questo problema." />
          </div>
          <div className="find-section-row">
            <div className="qa-field qa-field-flex">
              <label className="qa-label">Obiettivo</label>
              <select value={objective} onChange={(e) => setObjective(e.target.value)} className="qa-input">
                <option value="lead">Aprire conversazioni</option>
                <option value="call">Portare a call</option>
                <option value="inbound">Ricevere richieste</option>
              </select>
            </div>
            <div className="qa-field qa-field-flex">
              <label className="qa-label">Parola chiave per DM</label>
              <input value={dmKeyword} onChange={(e) => setDmKeyword(e.target.value)} className="qa-input" placeholder="audit, consulenza, demo" />
            </div>
          </div>
          {error && (
            <div className="ap-error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {error}
            </div>
          )}
          <button type="button" onClick={generate} disabled={loading || !draftPost.trim()} className="ap-generate-btn">
            {loading ? (
              <><span className="qa-spinner" aria-hidden="true" />Sto scrivendo il post…</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Genera post
              </>
            )}
          </button>
        </div>

        <div className="ap-info-side">
          <div className="ap-info-card">
            <h3 className="ap-info-title">Cosa otterrai</h3>
            <div className="ap-info-features">
              <div className="ap-info-feature"><span className="ap-info-num">1</span><div><strong>5 hook potenti</strong><p>La prima riga decide tutto</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">2</span><div><strong>3 versioni del post</strong><p>Pulita, diretta, autorevole</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">3</span><div><strong>CTA + commento</strong><p>Chiusura e rilancio immediato</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">4</span><div><strong>Immagine AI</strong><p>Coerente col tuo brand visivo</p></div></div>
              <div className="ap-info-feature"><span className="ap-info-num">5</span><div><strong>Articoli correlati</strong><p>Fonti da citare o condividere</p></div></div>
            </div>
          </div>

          {!profile.onboarding_complete && (
            <div className="sp-onboarding-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div>
                <p className="sp-onboarding-text">Configura il tuo sistema per post più mirati e coerenti.</p>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
              </div>
              <div className="ap-loading-steps">
                <span className="ap-loading-step ap-loading-step--active">Genero hook</span>
                <span className="ap-loading-step">Scrivo versioni</span>
                <span className="ap-loading-step">Compongo CTA</span>
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

      <HistoryList userId={userId} type="post" />
    </div>
  );
}
