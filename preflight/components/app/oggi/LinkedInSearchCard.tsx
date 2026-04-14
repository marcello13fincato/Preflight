"use client";

import { useState } from "react";
import type { LinkedInSearchBlock } from "@/lib/sales/schemas";

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
          Copia query
        </>
      )}
    </button>
  );
}

interface Props {
  data: LinkedInSearchBlock;
  dateLabel: string;
}

/**
 * Block 1 — LinkedIn search of the day.
 * Shows the generated search query, explanation, and a direct LinkedIn link.
 */
export default function LinkedInSearchCard({ data, dateLabel }: Props) {
  return (
    <div className="relative bg-white border border-slate-100 rounded-[14px] p-6 overflow-hidden">
      {/* Micro-glow top-right */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(29,78,216,0.05),transparent_70%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Search query box */}
        <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-4 mb-4">
          <p className="text-[14px] font-semibold text-slate-800 leading-relaxed break-all">
            {data.query}
          </p>
        </div>

        {/* Explanation */}
        <p className="text-[13.5px] text-slate-700 leading-[1.7] mb-5">
          {data.spiegazione}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <CopyBtn text={data.query} />
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 text-slate-600 font-semibold rounded-[9px] px-5 py-2.5 hover:border-slate-300 transition-colors text-[13px] inline-flex items-center gap-2 no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Apri su LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
