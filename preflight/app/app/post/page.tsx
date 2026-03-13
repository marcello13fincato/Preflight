"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
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
      const postText = output.post_versions.clean + "\n\n" + output.cta;
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

  return (
    <div className="tool-page">
      <div className="tool-page-hero">
        <h2>Scrivi un post che genera conversazioni</h2>
        <p>
          Trasforma un&apos;idea in un post LinkedIn strategico pronto da pubblicare.
        </p>
      </div>

      {/* Guide box */}
      <div className="tool-page-guide">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> scrivi un post che apre conversazioni utili</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> bozza o idea del post, obiettivo e parola chiave DM</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> hooks, 3 versioni, CTA e prossima azione</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> pubblica e rispondi ai commenti</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="tool-page-grid">
        {/* INPUT */}
        <div className="tool-page-panel space-y-4">
          <h3 className="tool-page-panel-header">Input</h3>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Bozza o idea del post</span>
            <textarea rows={7} className="input w-full resize-none" placeholder="Es. Molte aziende SaaS perdono conversioni perché l'onboarding è confuso..." value={draftPost} onChange={(e) => setDraftPost(e.target.value)} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Obiettivo</span>
              <select value={objective} onChange={(e) => setObjective(e.target.value)} className="input w-full">
                <option value="lead">Aprire conversazioni</option>
                <option value="call">Portare a call</option>
                <option value="inbound">Ricevere richieste</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Parola chiave per DM</span>
              <input className="input w-full" value={dmKeyword} onChange={(e) => setDmKeyword(e.target.value)} />
            </label>
          </div>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generazione in corso…" : "Genera post →"}
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
                  Post pronto
                </h3>
                <CopyButton text={`${output.post_versions.clean}\n\n${output.cta}`} />
              </div>

              <OutputCard title="🪝 Hooks" text={output.hooks.join("\n")} />

              <div className="grid gap-3 md:grid-cols-3">
                <OutputCard title="✨ Versione pulita" text={output.post_versions.clean} accent />
                <OutputCard title="🎯 Versione diretta" text={output.post_versions.direct} />
                <OutputCard title="🏆 Versione autorevole" text={output.post_versions.authority} />
              </div>

              <OutputCard title="📣 Call to action" text={output.cta} />
              <OutputCard title="💬 Commento di apertura" text={output.comment_starter} />

              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_step}
              </div>
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon">✍️</p>
              <p className="tool-page-empty-title">
                Il risultato apparirà qui
              </p>
              <p className="tool-page-empty-text">
                Inserisci la bozza e clicca &quot;Genera post&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Suggerimento immagine ── */}
      {output && (
        <section className="dash-img-section">
          <div className="dash-img-header">
            <div className="dash-img-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </div>
            <div>
              <h3 className="dash-img-title">Suggerimento immagine</h3>
              <p className="dash-img-sub">Un&apos;immagine aumenta engagement e visibilità del post su LinkedIn.</p>
            </div>
          </div>

          <div className="dash-img-tips">
            <div className="dash-img-tip">
              <span className="dash-img-tip-label">Tipo consigliato:</span>{" "}
              Illustrazione o grafica astratta — evita foto stock generiche.
            </div>
            <div className="dash-img-tip">
              <span className="dash-img-tip-label">Idea visiva:</span>{" "}
              Un&apos;immagine che richiami il concetto chiave del post in modo semplice e professionale.
            </div>
          </div>

          {imgError && (
            <div className="callout-danger rounded-xl p-4">
              <p className="text-sm font-semibold">⚠️ {imgError}</p>
            </div>
          )}

          {imgUrl && (
            <div className="dash-img-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="Immagine generata per il post" className="dash-img-result" />
            </div>
          )}

          <div className="dash-img-actions">
            <button onClick={generateImage} disabled={imgLoading} className="dash-btn-primary">
              {imgLoading ? "Generazione in corso..." : imgUrl ? "Genera un'altra immagine" : "Genera esempio immagine"}
            </button>
          </div>
        </section>
      )}

      {/* History */}
      <div className="tool-page-panel">
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="post" />
      </div>
    </div>
  );
}

function OutputCard({ title, text, accent }: { title: string; text: string; accent?: boolean }) {
  return (
    <div
      className="rounded-lg p-4 text-sm"
      style={{
        background: accent ? "var(--color-soft)" : "var(--color-soft-2)",
        border: `1px solid ${accent ? "var(--color-primary)" : "var(--color-border)"}`,
      }}
    >
      <div className="font-semibold mb-1">{title}</div>
      <p className="mt-1 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
