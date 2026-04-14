"use client";

import Link from "next/link";
import type { LinkedInSearchBlock } from "@/lib/sales/schemas";

interface Props {
  data: LinkedInSearchBlock;
  dateLabel: string;
}

/**
 * Block 1 — "Lista delle persone da contattare oggi"
 * Shows the daily LinkedIn search context and a single CTA to open on LinkedIn.
 */
export default function LinkedInSearchCard({ data }: Props) {
  return (
    <div className="relative bg-white border border-slate-100 rounded-[14px] p-6 overflow-hidden">
      {/* Micro-glow top-right */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(29,78,216,0.05),transparent_70%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Explanation — why these people today */}
        <p className="text-[13.5px] text-slate-700 leading-[1.7] mb-5">
          {data.spiegazione}
        </p>

        {/* Single CTA — open search on LinkedIn */}
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 text-white font-bold rounded-[9px] px-5 py-2.5 hover:bg-blue-800 transition-colors text-[13px] inline-flex items-center gap-2 no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Apri su LinkedIn
          </a>
          <Link
            href="/app/prospect"
            className="bg-white border border-slate-200 text-slate-600 font-semibold rounded-[9px] px-5 py-2.5 hover:border-slate-300 transition-colors text-[13px] inline-flex items-center gap-2 no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Analizza un profilo
          </Link>
        </div>
      </div>
    </div>
  );
}
