"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import { IconLightbulb } from "@/components/shared/icons";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { findClientsSchema, type FindClientsJson } from "@/lib/sales/schemas";

const DIMENSIONE_OPTIONS = [
  { value: "", label: "Qualsiasi" },
  { value: "freelance", label: "Freelance" },
  { value: "startup", label: "Startup" },
  { value: "PMI", label: "PMI" },
  { value: "enterprise", label: "Enterprise" },
] as const;

const FASE_OPTIONS = [
  { value: "", label: "Non so" },
  { value: "early_stage", label: "Early stage" },
  { value: "crescita", label: "Crescita" },
  { value: "strutturata", label: "Strutturata" },
] as const;

const TARGETING_STORAGE_KEY = "preflight:last-targeting";

function saveTargetingResult(userId: string, result: FindClientsJson) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${TARGETING_STORAGE_KEY}:${userId}`,
    JSON.stringify({ result, savedAt: new Date().toISOString() }),
  );
}

export default function FindClientsPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const onboarding = profile.onboarding as Record<string, unknown> | null;

  const [ruoloTarget, setRuoloTarget] = useState("");
  const [settore, setSettore] = useState("");
  const [area, setArea] = useState("");
  const [citta, setCitta] = useState("");
  const [dimensione, setDimensione] = useState("");
  const [faseAzienda, setFaseAzienda] = useState("");
  const [problemaCliente, setProblemaCliente] = useState("");
  const [output, setOutput] = useState<FindClientsJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  // Auto-fill from system setup (onboarding) when available
  useEffect(() => {
    if (!onboarding || prefilled) return;
    const ob = onboarding;
    if (ob.cliente_ideale && !ruoloTarget) setRuoloTarget(String(ob.cliente_ideale));
    if (ob.problema_cliente && !problemaCliente) setProblemaCliente(String(ob.problema_cliente));
    setPrefilled(true);
  }, [onboarding, prefilled, ruoloTarget, problemaCliente]);

  async function generate() {
    if (!ruoloTarget.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruolo_target: ruoloTarget.trim(),
          settore: settore.trim() || undefined,
          area_geografica: area.trim() || undefined,
          citta: citta.trim() || undefined,
          dimensione: dimensione || undefined,
          fase_azienda: faseAzienda || undefined,
          problema_cliente: problemaCliente.trim() || undefined,
          profile: onboarding || undefined,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = findClientsSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      saveTargetingResult(userId, parsed.data);
      repo.interaction.addInteraction(userId, "prospect", `Targeting: ${ruoloTarget}`, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fc-page">
      {/* ── PAGE HEADER ── */}
      <div className="page-hero" style={{ marginBottom: "1.5rem" }}>
        <span className="page-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Selezione prospect
        </span>
        <h1 className="page-hero-title">Chi contattare su LinkedIn</h1>
        <p className="page-hero-subtitle">
          Identifica le categorie di persone da contattare su LinkedIn in base al tuo servizio — con link pronti e strategia di approccio.
        </p>
      </div>

      {/* ── TWO COLUMN: INPUT | OUTPUT ── */}
      <div className="fc-layout">
        {/* INPUT PANEL */}
        <div className="fc-input-panel">
          <div className="fc-input-card">
            <div className="fc-input-header">
              <div className="fc-input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
              </div>
              <div>
                <h2 className="fc-input-title">Definisci il target</h2>
                <p className="fc-input-sub">Più dettagli dai, più precise saranno le categorie di prospect.</p>
              </div>
            </div>

            {prefilled && onboarding && (
              <div className="fc-prefill-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Alcuni campi precompilati dal tuo sistema. Puoi modificarli.
              </div>
            )}

            <div className="fc-form">
              {/* 1. Ruolo target */}
              <div className="qa-field">
                <label className="qa-label">Chi vuoi contattare <span className="fc-required">*</span></label>
                <textarea
                  value={ruoloTarget}
                  onChange={(e) => setRuoloTarget(e.target.value)}
                  className="qa-input qa-input-lg"
                  rows={2}
                  placeholder="Es: Founder SaaS B2B, CEO di agenzia di marketing, Head of Sales"
                />
              </div>

              {/* 2. Settore */}
              <div className="qa-field">
                <label className="qa-label">Settore <span className="qa-label-opt">(facoltativo)</span></label>
                <input
                  type="text"
                  value={settore}
                  onChange={(e) => setSettore(e.target.value)}
                  className="qa-input"
                  placeholder="Software, consulenza, marketing, fintech"
                />
              </div>

              {/* 3 + 4. Area + Città */}
              <div className="find-section-row">
                <div className="qa-field" style={{ flex: 1 }}>
                  <label className="qa-label">Area geografica <span className="qa-label-opt">(facoltativo)</span></label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="qa-input"
                    placeholder="Italia, Europa, DACH"
                  />
                </div>
                <div className="qa-field" style={{ flex: 1 }}>
                  <label className="qa-label">Città <span className="qa-label-opt">(facoltativo)</span></label>
                  <input
                    type="text"
                    value={citta}
                    onChange={(e) => setCitta(e.target.value)}
                    className="qa-input"
                    placeholder="Milano, Roma, Berlino"
                  />
                </div>
              </div>

              {/* 5. Dimensione azienda */}
              <div className="qa-field">
                <label className="qa-label">Dimensione azienda</label>
                <div className="fc-pills">
                  {DIMENSIONE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`fc-pill${dimensione === opt.value ? " fc-pill-active" : ""}`}
                      onClick={() => setDimensione(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Fase azienda */}
              <div className="qa-field">
                <label className="qa-label">Fase azienda</label>
                <div className="fc-pills">
                  {FASE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`fc-pill${faseAzienda === opt.value ? " fc-pill-active" : ""}`}
                      onClick={() => setFaseAzienda(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Problema principale */}
              <div className="qa-field">
                <label className="qa-label">Problema del cliente <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea
                  value={problemaCliente}
                  onChange={(e) => setProblemaCliente(e.target.value)}
                  className="qa-input"
                  rows={2}
                  placeholder="Es: Non trovano clienti tramite LinkedIn, non sanno come posizionarsi"
                />
              </div>

              {/* CTA */}
              <button
                onClick={generate}
                disabled={loading || !ruoloTarget.trim()}
                className="fc-generate-btn"
              >
                {loading ? (
                  <>
                    <span className="qa-spinner" aria-hidden="true" />
                    Sto analizzando il target…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Identifica chi contattare
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Onboarding callout */}
          {!profile.onboarding_complete && (
            <div className="fc-callout">
              <div className="fc-callout-icon"><IconLightbulb size={20} /></div>
              <div>
                <p className="fc-callout-text">Configura il tuo sistema per risultati più precisi e personalizzati.</p>
                <Link href="/app/onboarding" className="fc-callout-link">Configura il tuo sistema →</Link>
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT PANEL */}
        <div className="fc-output-panel">
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">Errore</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="fc-results">
              {/* SECTION 1 — CATEGORIA PRIORITARIA */}
              <div className="fc-result-section fc-result-highlight">
                <div className="fc-result-badge">1</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <h3 className="fc-result-title">Da chi partire oggi</h3>
                </div>
                <h4 className="fc-cat-title">{output.categoria_prioritaria.titolo}</h4>
                <p className="fc-result-text">{output.categoria_prioritaria.descrizione}</p>
                <div className="fc-cat-why">
                  <span className="fc-cat-why-label">Perché ora</span>
                  <p className="fc-result-text">{output.categoria_prioritaria.perche_ora}</p>
                </div>
                <a
                  href={output.categoria_prioritaria.link_ricerca_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fc-linkedin-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Apri la lista su LinkedIn
                </a>
              </div>

              {/* SECTION 2 — ALTRE CATEGORIE UTILI */}
              <div className="fc-result-section">
                <div className="fc-result-badge">2</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h3 className="fc-result-title">Altre categorie utili</h3>
                </div>
                <div className="fc-alt-cats">
                  {output.categorie_alternative.map((cat, i) => (
                    <div key={i} className="fc-alt-cat">
                      <h4 className="fc-alt-cat-title">{cat.titolo}</h4>
                      <p className="fc-alt-cat-desc">{cat.descrizione}</p>
                      <p className="fc-alt-cat-why">{cat.perche_ora}</p>
                      <a
                        href={cat.link_ricerca_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fc-linkedin-btn-sm"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Apri la lista su LinkedIn
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3 — COME SCEGLIERE I PROFILI MIGLIORI */}
              <div className="fc-result-section">
                <div className="fc-result-badge">3</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h3 className="fc-result-title">Come scegliere i profili migliori</h3>
                </div>
                <div className="fc-criteria-grid">
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Ruolo decisionale</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.ruolo_decisionale}</p>
                  </div>
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Chiarezza del profilo</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.chiarezza_profilo}</p>
                  </div>
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Attività recente</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.attivita_recente}</p>
                  </div>
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Rilevanza del problema</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.rilevanza_problema}</p>
                  </div>
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Contesto aziendale</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.contesto_aziendale}</p>
                  </div>
                  <div className="fc-criteria-item fc-criteria-item-warn">
                    <span className="fc-criteria-label fc-criteria-label-warn">Chi evitare</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.chi_evitare}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4 — COME CONTATTARLI */}
              <div className="fc-result-section">
                <div className="fc-result-badge">4</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  <h3 className="fc-result-title">Come contattarli</h3>
                </div>
                <div className="fc-strategy-block">
                  <div className="fc-strategy-item">
                    <span className="fc-strategy-label">Approccio consigliato</span>
                    <p className="fc-result-text fc-result-text-strategy">{output.strategia_contatto.approccio}</p>
                  </div>
                  <div className="fc-strategy-item fc-strategy-msg">
                    <span className="fc-strategy-label">Primo messaggio</span>
                    <div className="fc-message-box">
                      <p className="fc-message-text">{output.strategia_contatto.primo_messaggio}</p>
                    </div>
                    <CopyButton text={output.strategia_contatto.primo_messaggio} />
                  </div>
                  <div className="fc-strategy-item">
                    <span className="fc-strategy-label">Angolo follow-up</span>
                    <p className="fc-result-text">{output.strategia_contatto.angolo_followup}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 5 — PROSSIMO STEP */}
              <div className="fc-result-section fc-result-next">
                <div className="fc-result-badge fc-result-badge-cta">5</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  <h3 className="fc-result-title">Prossimo step</h3>
                </div>
                <p className="fc-result-text">
                  {output.prossimo_step}
                </p>
                <div className="fc-next-actions">
                  <Link href="/app/prospect" className="btn-primary">
                    Analizza uno di questi profili
                  </Link>
                  <Link href="/app/oggi" className="btn-secondary">
                    Vai al piano di oggi
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="fc-empty">
              <div className="fc-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3 className="fc-empty-title">Chi dovresti contattare?</h3>
              <p className="fc-empty-text">
                Preflight identifica le categorie di persone più rilevanti da contattare su LinkedIn in base al tuo posizionamento — con link pronti e strategia di approccio.
              </p>
              <div className="fc-empty-features">
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">1</span>
                  <span>Categorie di prospect prioritarie</span>
                </div>
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">2</span>
                  <span>Liste LinkedIn pronte</span>
                </div>
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">3</span>
                  <span>Guida alla selezione profili</span>
                </div>
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">4</span>
                  <span>Strategia di contatto e messaggi</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <HistoryList userId={userId} type="prospect" />
    </div>
  );
}
