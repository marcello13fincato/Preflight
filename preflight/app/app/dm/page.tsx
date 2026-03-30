"use client";


import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { adviceSchema, type AdviceJson } from "@/lib/sales/schemas";


export default function DmPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [situation, setSituation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [output, setOutput] = useState<AdviceJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);


  async function generate() {
    if (!situation.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }
      const res = await fetch("/api/ai/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          situation: situation.trim(),
          linkedin_url: linkedinUrl.trim(),
          website_url: websiteUrl.trim(),
          pdf_text: pdfText,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = adviceSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "dm", situation, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  function fillExample(text: string) {
    setSituation(text);
  }

  function resetAdvice() {
    setOutput(null);
    setError(null);
  }

  function copyText(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }

  // ── FULLSCREEN OUTPUT ──
  if (output) {
    return (
      <div className="pr-fullscreen fade-in">
        {/* Top bar with controls */}
        <div className="pr-topbar">
          <button onClick={resetAdvice} className="pr-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Nuova richiesta
          </button>
          <div className="pr-topbar-url">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Consulenza AI
          </div>
          <div className="pr-topbar-actions">
            <Link href="/app/prospect" className="pr-topbar-link">Analizza profilo</Link>
            <Link href="/app/find-clients" className="pr-topbar-link">Trova clienti</Link>
            <Link href="/app/oggi" className="pr-topbar-link">Piano oggi</Link>
          </div>
        </div>

        {/* Score + Heat hero banner */}
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
            <span className="pr-score-label">Consiglio</span>
          </div>
          <div className="pr-score-info fade-in-delay">
            <h1 className="pr-score-title">Consiglio personalizzato</h1>
            <p className="pr-score-subtitle">{output.lettura_situazione}</p>
            <div className="pr-score-badges">
              <span className={`pr-badge pr-heat-${output.client_heat_level?.toLowerCase?.() || "cold"}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c.5 1 2.5 3 2.5 5.5a4.5 4.5 0 1 1-5 0C9.5 5 11.5 3 12 2z"/></svg>
                {output.client_heat_level}
              </span>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="pr-grid">
          {/* LEFT COLUMN — Analisi */}
          <div className="pr-col">
            {/* Strategia */}
            <div className="pr-card pr-card-strategy fade-in-delay">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <h3>Strategia consigliata</h3>
              </div>
              <p className="pr-card-text">{output.strategia_consigliata}</p>
            </div>

            {/* Errori da evitare */}
            <div className="pr-card pr-card-warning fade-in-delay">
              <div className="pr-card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <h3>Errori da evitare</h3>
              </div>
              <p className="pr-card-text">{output.errori_da_evitare}</p>
            </div>
          </div>

          {/* RIGHT COLUMN — Messaggi e azioni */}
          <div className="pr-col">
            {/* Risposta suggerita */}
            <div className="pr-msg-card pr-msg-first fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">1</div>
                <div>
                  <h3 className="pr-msg-title">Risposta suggerita</h3>
                  <p className="pr-msg-hint">Invia subito, personalizza se serve</p>
                </div>
                <button onClick={() => copyText(output.risposta_suggerita, "risposta")} className={`pr-copy-btn${copied === "risposta" ? " pr-copied" : ""}`}>
                  {copied === "risposta" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.risposta_suggerita}</div>
            </div>

            {/* Follow-up consigliato */}
            <div className="pr-msg-card fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">2</div>
                <div>
                  <h3 className="pr-msg-title">Follow-up</h3>
                  <p className="pr-msg-hint">Se non risponde entro 2-3 giorni</p>
                </div>
                <button onClick={() => copyText(output.followup_consigliato, "followup")} className={`pr-copy-btn${copied === "followup" ? " pr-copied" : ""}`}>
                  {copied === "followup" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.followup_consigliato}</div>
            </div>

            {/* Step successivi */}
            <div className="pr-msg-card fade-in-delay">
              <div className="pr-msg-header">
                <div className="pr-msg-step">3</div>
                <div>
                  <h3 className="pr-msg-title">Step successivi</h3>
                  <p className="pr-msg-hint">Azioni pratiche da seguire</p>
                </div>
                <button onClick={() => copyText(output.step_successivi, "step")} className={`pr-copy-btn${copied === "step" ? " pr-copied" : ""}`}>
                  {copied === "step" ? "✓ Copiato" : "Copia"}
                </button>
              </div>
              <div className="pr-msg-body">{output.step_successivi}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STATIC PAGE (INPUT) ──
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
          <span className="pr-score-label">Consiglio</span>
        </div>
        <div className="pr-score-info fade-in-delay">
          <h1 className="pr-score-title">Chiedimi un consiglio</h1>
          <p className="pr-score-subtitle">Descrivi una situazione reale su LinkedIn e ricevi una strategia pronta, messaggi da inviare e azioni pratiche.</p>
        </div>
      </div>
      <div className="pr-input-layout fade-in">
        <div className="pr-form-card fade-in-delay">
          <div className="pr-form-header">
            <div className="pr-form-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h2 className="pr-form-title">Descrivi la situazione</h2>
              <p className="pr-form-sub">Più dettagli fornisci, più il consiglio sarà personalizzato e utile.</p>
            </div>
          </div>
          <div className="pr-form-fields">
            <div className="qa-field">
              <label className="qa-label">Spiegami la situazione <span className="fc-required">*</span></label>
              <textarea value={situation} onChange={(e) => setSituation(e.target.value)} className="qa-input qa-input-lg" rows={5} placeholder="Ho scritto a un founder SaaS e mi ha risposto in modo generico. Non so come continuare la conversazione." />
            </div>
            <div className="qa-examples">
              <p className="qa-examples-title">Esempi di situazioni:</p>
              <div className="qa-examples-chips">
                <button type="button" className="qa-example-btn" onClick={() => fillExample("Qualcuno ha commentato un mio post e sembra interessato a quello che faccio.")}>
                  Qualcuno ha commentato un mio post
                </button>
                <button type="button" className="qa-example-btn" onClick={() => fillExample("Ho ricevuto un messaggio su LinkedIn da qualcuno che non conosco.")}>
                  Ho ricevuto un messaggio su LinkedIn
                </button>
                <button type="button" className="qa-example-btn" onClick={() => fillExample("Voglio capire se è il momento giusto per proporre una call a un contatto con cui sto parlando.")}>
                  Voglio capire se è il momento giusto per proporre una call
                </button>
                <button type="button" className="qa-example-btn" onClick={() => fillExample("Non so come continuare una conversazione che si è fermata dopo il mio ultimo messaggio.")}>
                  Non so come continuare una conversazione
                </button>
              </div>
            </div>
            <div className="qa-field">
              <label className="qa-label">Link profilo LinkedIn della persona coinvolta <span className="qa-label-opt">(facoltativo)</span></label>
              <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="qa-input" placeholder="https://linkedin.com/in/nomecognome" />
            </div>
            <div className="qa-field">
              <label className="qa-label">Carica il PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
              <label className="qa-file-upload">
                <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                <span className="qa-file-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {pdfFile ? pdfFile.name : "Scegli un file PDF"}
                </span>
              </label>
            </div>
            <div className="qa-field">
              <label className="qa-label">Link sito web azienda <span className="qa-label-opt">(facoltativo)</span></label>
              <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="qa-input" placeholder="https://azienda.com" />
            </div>
            {error && (
              <div className="pr-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {error}
              </div>
            )}
            <button onClick={generate} disabled={loading || !situation.trim()} className="pr-generate-btn">
              {loading ? (
                <><span className="qa-spinner" aria-hidden="true" />Sto analizzando…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Chiedi un consiglio
                </>
              )}
            </button>
          </div>
        </div>
        <div className="pr-info-side">
          <div className="pr-info-card">
            <h3 className="pr-info-title">Cosa otterrai</h3>
            <div className="pr-info-features">
              <div className="pr-info-feature">Risposta pronta da inviare</div>
              <div className="pr-info-feature">Follow-up personalizzato</div>
              <div className="pr-info-feature">Step pratici e warning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
