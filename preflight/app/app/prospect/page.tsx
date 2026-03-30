"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { IconLightbulb } from "@/components/shared/icons";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";

export default function Page() {
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [context, setContext] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [showPdfGuide, setShowPdfGuide] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // Placeholder per la funzione generate (da implementare o mock)
    const generate = () => {};
  // ── STATIC PAGE (INPUT) FULLSCREEN WOW ──
  return (
    <div className="pr-fullscreen pr-fullscreen-empty fade-in">
      <div className="pr-score-hero fade-in">
        <div className="pr-score-ring-wrap">
          <div className="pr-score-ring">
            <svg viewBox="0 0 120 120" className="pr-score-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`327 327`}
                transform="rotate(-90 60 60)" className="pr-score-progress" />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="pr-score-value">AI</div>
          </div>
          <span className="pr-score-label">Analisi</span>
        </div>
        <div className="pr-score-info fade-in-delay">
          <h1 className="pr-score-title">Analizza un profilo</h1>
          <p className="pr-score-subtitle">Scopri se vale la pena contattare una persona e ricevi messaggi pronti da copiare per ogni fase.</p>
        </div>
      </div>
      <div className="pr-input-layout fade-in">
        <div className="pr-form-card fade-in-delay">
          <div className="qa-field">
            <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
            <p className="qa-microcopy">Se vuoi un'analisi più precisa, puoi caricare anche il PDF del profilo.</p>
            <label className="qa-file-upload">
              <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
              <span className="qa-file-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {pdfFile ? pdfFile.name : "Scegli un file PDF"}
              </span>
            </label>
            <button type="button" className="qa-guide-toggle" onClick={() => setShowPdfGuide(!showPdfGuide)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Come scaricare il PDF del profilo LinkedIn
            </button>
            {showPdfGuide && (
              <div className="qa-guide">
                <ol className="qa-guide-steps">
                  <li>Vai sul profilo LinkedIn della persona</li>
                  <li>Clicca sui tre puntini accanto alla foto</li>
                  <li>Seleziona "Salva come PDF"</li>
                  <li>Carica il file qui</li>
                </ol>
              </div>
            )}
          </div>
          <div className="qa-field">
            <label className="qa-label">Link sito web <span className="qa-label-opt">(facoltativo)</span></label>
            <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="qa-input" placeholder="https://azienda.com" />
          </div>
          <div className="qa-field">
            <label className="qa-label">Contesto opzionale <span className="qa-label-opt">(facoltativo)</span></label>
            <textarea value={context} onChange={(e) => setContext(e.target.value)} className="qa-input qa-input-lg" rows={3} placeholder="Founder SaaS che pubblica su crescita aziendale." />
          </div>
          {error && (
            <div className="pr-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {error}
            </div>
          )}
          <button onClick={generate} disabled={loading || !linkedinUrl.trim()} className="pr-generate-btn">
            {loading ? (
              <><span className="qa-spinner" aria-hidden="true" />Sto analizzando il profilo…</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 1-4-4H8a4 4 0 0 1-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Analizza profilo
              </>
            )}
          </button>
        </div>
        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">Analisi compatibilità</div>
              <div className="pr-info-feature">Messaggi pronti da inviare</div>
              <div className="pr-info-feature">Strategia e warning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
