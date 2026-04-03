"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/hooks/useSession";
import Link from "next/link";
import { IconAlertTriangle } from "@/components/shared/icons";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { postBuilderSchema, type PostBuilderJson } from "@/lib/sales/schemas";

export default function PostPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [draftPost, setDraftPost] = useState(params.get("draft_post") || "");
  const [objective, setObjective] = useState(params.get("objective") || "lead");
  const [dmKeyword, setDmKeyword] = useState(params.get("dm_keyword") || "audit");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<PostBuilderJson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<"clean" | "direct" | "authority">("clean");
  const [copied, setCopied] = useState<string | null>(null);

  /* Image generation state */
  const [imgLoading, setImgLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

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
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = postBuilderSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "post", draftPost, parsed.data);
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
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore (${res.status})`);
      }
      if (typeof json.image_url !== "string") {
        throw new Error("Nessuna immagine restituita.");
      }
      setImgUrl(json.image_url);
    } catch (err) {
      setImgError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setImgLoading(false);
    }
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const VERSION_LABELS = { clean: "Pulita", direct: "Diretta", authority: "Autorevole" } as const;

  return (
    <div className="pr-fullscreen">
      {/* Hero */}
      <div className="pr-score-hero" style={{ background: "linear-gradient(135deg, rgba(108,92,231,0.15), rgba(0,206,209,0.08))" }}>
        <div className="pr-hero-content">
          <div className="pr-hero-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Scrivi un post
          </div>
          <h1 className="pr-hero-title">Crea un post LinkedIn che genera conversazioni</h1>
          <p className="pr-hero-subtitle">Trasforma un&apos;idea in un post strategico con hook, CTA e immagine — pronto da pubblicare.</p>
        </div>
      </div>

      {/* Input form */}
      <div className="fc-section">
        <div className="fc-section-inner">
          <div className="fc-input-header">
            <div className="fc-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div>
              <h2 className="fc-section-title">Componi il tuo post</h2>
              <p className="fc-section-desc">Scrivi una bozza o un&apos;idea — l&apos;AI la trasforma in 3 versioni ottimizzate.</p>
            </div>
          </div>

          <div className="fc-form">
            <div className="qa-field">
              <label className="qa-label">Bozza o idea del post <span className="fc-required">*</span></label>
              <textarea value={draftPost} onChange={(e) => setDraftPost(e.target.value)} className="qa-input qa-input-lg" rows={5}
                placeholder="Es. Molte aziende SaaS perdono conversioni perché l'onboarding è confuso. Vorrei raccontare come risolvere questo problema." />
            </div>

            <div className="find-section-row">
              <div className="qa-field" style={{ flex: 1 }}>
                <label className="qa-label">Obiettivo</label>
                <select value={objective} onChange={(e) => setObjective(e.target.value)} className="qa-input">
                  <option value="lead">Aprire conversazioni</option>
                  <option value="call">Portare a call</option>
                  <option value="inbound">Ricevere richieste</option>
                </select>
              </div>
              <div className="qa-field" style={{ flex: 1 }}>
                <label className="qa-label">Parola chiave per DM</label>
                <input value={dmKeyword} onChange={(e) => setDmKeyword(e.target.value)} className="qa-input" placeholder="audit, consulenza, demo" />
              </div>
            </div>

            <button onClick={generate} disabled={loading || !draftPost.trim()} className="fc-generate-btn">
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
          {/* Hooks */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <h3 className="post-section-label">Hook — scegli il migliore</h3>
              <div className="post-hooks-grid">
                {output.hooks.map((hook, i) => (
                  <button key={i} className="post-hook-card" onClick={() => copyText(hook, `hook-${i}`)}>
                    <span className="post-hook-num">{i + 1}</span>
                    <span className="post-hook-text">{hook}</span>
                    <span className="post-hook-copy">{copied === `hook-${i}` ? "✓" : "Copia"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Versioni post */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <h3 className="post-section-label">Versioni del post</h3>
              <div className="fc-mode-toggle" style={{ marginBottom: "1rem" }}>
                {(["clean", "direct", "authority"] as const).map((v) => (
                  <button key={v} type="button" className={`fc-mode-btn${activeVersion === v ? " fc-mode-active" : ""}`} onClick={() => setActiveVersion(v)}>
                    {VERSION_LABELS[v]}
                  </button>
                ))}
              </div>
              <div className="post-version-card">
                <pre className="post-version-text">{output.post_versions[activeVersion]}</pre>
                <div className="post-version-actions">
                  <button className="post-copy-btn" onClick={() => copyText(output.post_versions[activeVersion], "version")}>
                    {copied === "version" ? "✓ Copiato" : "Copia testo"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA & Comment starter */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <div className="post-engage-grid">
                <div className="post-engage-card">
                  <div className="post-engage-label">Call to action</div>
                  <p className="post-engage-text">{output.cta}</p>
                  <button className="post-copy-btn-sm" onClick={() => copyText(output.cta, "cta")}>{copied === "cta" ? "✓" : "Copia"}</button>
                </div>
                <div className="post-engage-card">
                  <div className="post-engage-label">Commento di apertura</div>
                  <p className="post-engage-text">{output.comment_starter}</p>
                  <button className="post-copy-btn-sm" onClick={() => copyText(output.comment_starter, "comment")}>{copied === "comment" ? "✓" : "Copia"}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Image generator — first-class */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <div className="fc-input-header">
                <div className="fc-input-icon" style={{ background: "linear-gradient(135deg, rgba(0,206,209,0.15), rgba(108,92,231,0.15))" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
                <div>
                  <h3 className="fc-section-title">Immagine per il post</h3>
                  <p className="fc-section-desc">Genera un&apos;immagine coerente con il tuo profilo visivo e il contenuto del post.</p>
                </div>
              </div>

              {imgUrl && (
                <div className="post-img-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="Immagine generata per il post" className="post-img-result" />
                </div>
              )}

              {imgError && <p className="post-img-error"><IconAlertTriangle size={14} /> {imgError}</p>}

              <button onClick={generateImage} disabled={imgLoading} className="fc-generate-btn" style={{ marginTop: "1rem" }}>
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
          </div>

          {/* Next action */}
          <div className="fc-section">
            <div className="fc-section-inner">
              <div className="fc-callout" style={{ borderLeft: "3px solid var(--v7-accent, #6C5CE7)" }}>
                <div className="fc-callout-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </div>
                <div>
                  <p className="fc-callout-text"><strong>Prossima azione:</strong> {output.next_step}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!output && !error && !loading && (
        <div className="fc-section">
          <div className="fc-section-inner">
            <div className="fc-empty-state">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p className="fc-empty-title">Scrivi la tua idea e genera il post</p>
              <p className="fc-empty-text">Riceverai hook, 3 versioni, CTA e un&apos;immagine coerente col tuo brand.</p>
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
                <p className="fc-callout-text">Configura il tuo sistema per post più mirati e coerenti.</p>
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
          <HistoryList userId={userId} type="post" />
        </div>
      </div>
    </div>
  );
}
