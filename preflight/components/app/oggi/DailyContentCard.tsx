"use client";

import { useState } from "react";
import type { DailyContentPost, DailyContentArticle } from "@/lib/sales/schemas";

function CopyBtn({ text }: { text: string }) {
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
          Copiato
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copia tutto
        </>
      )}
    </button>
  );
}

interface Props {
  content: DailyContentPost | DailyContentArticle;
}

/**
 * Block 4 — Content of the day (post or article).
 * Renders differently based on content.tipo.
 */
export default function DailyContentCard({ content }: Props) {
  const [activeSection, setActiveSection] = useState(0);

  if (content.tipo === "post") {
    return (
      <div className="bg-white border border-slate-100 rounded-[14px] p-6">
        {/* Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Post
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Pronto da pubblicare
            </span>
          </div>
          <CopyBtn text={content.testo_completo} />
        </div>

        {/* Post preview */}
        <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-5">
          <p className="text-[15px] font-extrabold text-slate-900 leading-snug mb-3">
            {content.hook}
          </p>
          <p className="text-[13.5px] text-slate-700 leading-[1.7] whitespace-pre-line mb-3">
            {content.corpo}
          </p>
          <p className="text-[13.5px] text-blue-700 font-semibold leading-[1.7]">
            {content.cta}
          </p>
        </div>
      </div>
    );
  }

  /* Article view */
  const article = content as DailyContentArticle;
  const sections = [article.sezione_1, article.sezione_2, article.sezione_3];

  return (
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

      {/* Intro */}
      <p className="text-[13.5px] text-slate-700 leading-[1.7] mb-4">{article.intro}</p>

      {/* Section tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {sections.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors ${
              activeSection === i
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
            onClick={() => setActiveSection(i)}
          >
            {s.titolo}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-5 mb-4">
        <h4 className="text-[14px] font-bold text-slate-800 mb-2">
          {sections[activeSection].titolo}
        </h4>
        <p className="text-[13.5px] text-slate-700 leading-[1.7] whitespace-pre-line">
          {sections[activeSection].contenuto}
        </p>
      </div>

      {/* Conclusion */}
      <div className="border-t border-slate-100 pt-4 mt-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
          Conclusione
        </span>
        <p className="text-[13.5px] text-slate-700 leading-[1.7]">{article.conclusione}</p>
      </div>
    </div>
  );
}
