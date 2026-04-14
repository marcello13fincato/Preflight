"use client";

import Link from "next/link";
import type { WebInsight } from "@/lib/sales/schemas";

interface Props {
  insight: WebInsight;
  index: number;
}

/**
 * Block 5 — Web insight card.
 * Each card has a left blue border and two action buttons
 * that navigate to post/article pages with pre-filled context.
 */
export default function WebInsightCard({ insight, index }: Props) {
  /* Pre-fill query params for post page */
  const postParams = new URLSearchParams({
    draft_post: `Spunto da: ${insight.titolo} (${insight.fonte})\n\n${insight.angolo_post}`,
    objective: "lead",
  });

  /* Pre-fill query params for article page */
  const articleParams = new URLSearchParams({
    topic: insight.titolo,
    angle: insight.angolo_articolo,
    source_url: insight.url,
  });

  return (
    <div
      className="bg-white border border-slate-100 border-l-[3px] border-l-blue-400 rounded-[14px] rounded-l-[4px] p-5 animate-fadeup"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
    >
      {/* Title & source */}
      <div className="mb-3">
        <h4 className="text-[14px] font-extrabold text-slate-900 tracking-tight leading-snug mb-1">
          {insight.titolo}
        </h4>
        <a
          href={insight.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-blue-700 font-medium hover:underline no-underline"
        >
          {insight.fonte} ↗
        </a>
      </div>

      {/* Relevance */}
      <p className="text-[13.5px] text-slate-700 leading-[1.7] mb-4">
        {insight.rilevanza}
      </p>

      {/* Two action buttons in a row */}
      <div className="flex items-center gap-3">
        <Link
          href={`/app/post?${postParams.toString()}`}
          className="bg-blue-700 text-white font-bold rounded-[9px] px-5 py-2.5 hover:bg-blue-800 transition-colors text-[13px] no-underline inline-flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Scrivi un post
        </Link>
        <Link
          href={`/app/articolo?${articleParams.toString()}`}
          className="bg-white border border-slate-200 text-slate-600 font-semibold rounded-[9px] px-5 py-2.5 hover:border-slate-300 transition-colors text-[13px] no-underline inline-flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Scrivi un articolo
        </Link>
      </div>
    </div>
  );
}
