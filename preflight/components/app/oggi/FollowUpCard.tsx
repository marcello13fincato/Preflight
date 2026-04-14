"use client";

import { useState } from "react";
import type { FollowUpItem } from "@/lib/sales/schemas";

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
      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
    >
      {copied ? "✓ Copiato" : "📋 Copia testo"}
    </button>
  );
}

interface Props {
  item: FollowUpItem;
}

/**
 * Block 3 — Single follow-up card for a previously analyzed prospect.
 */
export default function FollowUpCard({ item }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-[14px] p-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-extrabold text-slate-900 tracking-tight leading-snug">
            {item.nome_ruolo}
          </h4>
          <span className="text-[12px] text-slate-400">
            Analizzato {item.giorni_fa} {item.giorni_fa === 1 ? "giorno" : "giorni"} fa
          </span>
        </div>
        <span className="flex-shrink-0 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full px-2 py-0.5">
          Follow-up
        </span>
      </div>

      {/* Action */}
      <div className="mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          Azione consigliata
        </span>
        <p className="text-[13.5px] text-emerald-600 font-semibold leading-[1.7]">
          {item.azione_consigliata}
        </p>
      </div>

      {/* Suggested text */}
      <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Testo suggerito
          </span>
          <CopyBtn text={item.testo_suggerito} />
        </div>
        <p className="text-[13.5px] text-slate-700 leading-[1.7] whitespace-pre-line">
          {item.testo_suggerito}
        </p>
      </div>
    </div>
  );
}
