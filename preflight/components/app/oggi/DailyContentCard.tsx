"use client";

import { useState } from "react";
import type { DailyContentPost, DailyContentArticle } from "@/lib/sales/schemas";

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="bg-blue-700 text-white font-bold rounded-[9px] px-5 py-2.5 hover:bg-blue-800 transition-colors text-[13px] inline-flex items-center gap-2"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Copiato!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {label || "Copia tutto"}
        </>
      )}
    </button>
  );
}

/* ── Full-screen overlay for copy-paste content ── */
function ContentOverlay({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: DailyContentPost | DailyContentArticle;
}) {
  if (!open) return null;

  const fullText =
    content.tipo === "post"
      ? content.testo_completo
      : `${(content as DailyContentArticle).titolo}\n\n${(content as DailyContentArticle).intro}\n\n${(content as DailyContentArticle).sezione_1.titolo}\n${(content as DailyContentArticle).sezione_1.contenuto}\n\n${(content as DailyContentArticle).sezione_2.titolo}\n${(content as DailyContentArticle).sezione_2.contenuto}\n\n${(content as DailyContentArticle).sezione_3.titolo}\n${(content as DailyContentArticle).sezione_3.contenuto}\n\n${(content as DailyContentArticle).conclusione}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-[16px] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl animate-fadeup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                content.tipo === "post"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {content.tipo === "post" ? "Post" : "Articolo"}
            </span>
            <span className="text-[13px] font-semibold text-slate-700">
              Pronto da copiare e incollare
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="bg-slate-50 border border-slate-100 rounded-[12px] p-5">
            <p className="text-[14px] text-slate-800 leading-[1.8] whitespace-pre-line select-all">
              {fullText}
            </p>
          </div>
        </div>

        {/* Footer — copy button */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[12px] text-slate-400">Seleziona tutto e copia, oppure usa il bottone →</span>
          <CopyBtn text={fullText} label="Copia testo completo" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  content: DailyContentPost | DailyContentArticle;
}

/**
 * Block 4 — Content of the day (post or article).
 * Shows a preview and opens a full overlay for easy copy-paste.
 */
export default function DailyContentCard({ content }: Props) {
  const [overlayOpen, setOverlayOpen] = useState(false);

  if (content.tipo === "post") {
    return (
      <>
        <ContentOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} content={content} />
        <div className="bg-white border border-slate-100 rounded-[14px] p-6">
          {/* Badge row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Post
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Pronto da pubblicare
            </span>
          </div>

          {/* Post preview — truncated */}
          <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-5 mb-4">
            <p className="text-[15px] font-extrabold text-slate-900 leading-snug mb-3">
              {content.hook}
            </p>
            <p className="text-[13.5px] text-slate-700 leading-[1.7] line-clamp-4">
              {content.corpo}
            </p>
          </div>

          {/* Open overlay CTA */}
          <button
            type="button"
            onClick={() => setOverlayOpen(true)}
            className="bg-blue-700 text-white font-bold rounded-[9px] px-5 py-2.5 hover:bg-blue-800 transition-colors text-[13px] inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Apri e copia il testo completo
          </button>
        </div>
      </>
    );
  }

  /* Article view */
  const article = content as DailyContentArticle;

  return (
    <>
      <ContentOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} content={content} />
      <div className="bg-white border border-slate-100 rounded-[14px] p-6">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Articolo
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Struttura completa
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
          {article.titolo}
        </h3>
        <p className="text-[13px] text-slate-500 italic mb-4">{article.angolo_editoriale}</p>

        {/* Preview — intro only */}
        <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-5 mb-4">
          <p className="text-[13.5px] text-slate-700 leading-[1.7] line-clamp-4">{article.intro}</p>
          <p className="text-[12px] text-slate-400 mt-2 italic">
            + 3 sezioni e conclusione →
          </p>
        </div>

        {/* Open overlay CTA */}
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          className="bg-blue-700 text-white font-bold rounded-[9px] px-5 py-2.5 hover:bg-blue-800 transition-colors text-[13px] inline-flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Apri e copia l&apos;articolo completo
        </button>
      </div>
    </>
  );
}
