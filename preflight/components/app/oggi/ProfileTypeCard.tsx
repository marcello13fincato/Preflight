"use client";

import { useState } from "react";
import type { ProfileType } from "@/lib/sales/schemas";

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
      className="oggi-copy-btn text-[11px]"
      style={copied ? { color: "#10B981" } : {}}
    >
      {copied ? "✓ Copiato" : "📋 Copia frase"}
    </button>
  );
}

interface Props {
  profile: ProfileType;
  index: number;
}

/**
 * Block 2 — Single profile type card.
 * Renders with staggered fadeup animation based on index.
 */
export default function ProfileTypeCard({ profile, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white border border-slate-100 rounded-[14px] p-6 animate-fadeup"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
    >
      {/* Header: priority + role */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Profilo {index + 1}
          </span>
          <h4 className="text-[14px] font-extrabold text-slate-900 tracking-tight leading-snug">
            {profile.ruolo}
          </h4>
        </div>
        <span
          className={`flex-shrink-0 font-bold text-[10px] rounded-full px-2 py-0.5 ${
            profile.priorita === "alta"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {profile.priorita === "alta" ? "Priorità alta" : "Priorità media"}
        </span>
      </div>

      {/* Sector */}
      <p className="text-[12px] text-slate-400 mb-3">{profile.settore}</p>

      {/* Signals & why interesting */}
      <div className="space-y-2 mb-3">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Segnali da cercare
          </span>
          <p className="text-[13.5px] text-slate-700 leading-[1.7] mt-0.5">{profile.segnali}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Perché è interessante adesso
          </span>
          <p className="text-[13.5px] text-blue-700 font-semibold leading-[1.7] mt-0.5">
            {profile.perche_interessante}
          </p>
        </div>
      </div>

      {/* Priority motivation */}
      <p className="text-[12px] text-slate-500 italic mb-3">{profile.motivazione_priorita}</p>

      {/* Expandable: contact details */}
      <button
        type="button"
        className="text-[12px] font-semibold text-blue-700 hover:text-blue-800 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Nascondi approccio ↑" : "Come contattarlo ↓"}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-fadeup" style={{ animationDuration: "0.2s" }}>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Tono</span>
            <p className="text-[13.5px] text-slate-700 leading-[1.7] mt-0.5">{profile.tono_contatto}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Prima frase</span>
            <div className="bg-slate-50 rounded-[10px] p-3 mt-1">
              <p className="text-[13.5px] text-slate-800 leading-[1.7]">&ldquo;{profile.prima_frase}&rdquo;</p>
              <div className="mt-2">
                <CopyBtn text={profile.prima_frase} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
