"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
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
          profile: profile.onboarding || undefined,
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
      <div className="fc-header">
        <div className="fc-header-top">
          <Link href="/app" className="fc-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Dashboard
          </Link>
        </div>
        <div className="fc-header-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Motore di targeting
        </div>
        <h1 className="fc-title">Trova clienti su LinkedIn</h1>
        <p className="fc-subtitle">
          Definisci il tipo di cliente che vuoi raggiungere e Preflight costruisce il targeting LinkedIn più preciso possibile.
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
                <h2 className="fc-input-title">Dati di targeting</h2>
                <p className="fc-input-sub">Più dettagli inserisci, più preciso sarà il targeting.</p>
              </div>
            </div>

            <div className="fc-form">
              {/* 1. Ruolo target */}
              <div className="qa-field">
                <label className="qa-label">Ruolo target <span className="fc-required">*</span></label>
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
                  <label className="qa-label">Città o area locale <span className="qa-label-opt">(facoltativo)</span></label>
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
                <label className="qa-label">Problema principale del cliente <span className="qa-label-opt">(facoltativo)</span></label>
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
                    Sto generando il targeting…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Genera targeting preciso
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Onboarding callout */}
          {!profile.onboarding_complete && (
            <div className="fc-callout">
              <div className="fc-callout-icon">💡</div>
              <div>
                <p className="fc-callout-text">Le ricerche saranno più mirate se configuri il tuo sistema.</p>
                <Link href="/app/onboarding" className="fc-callout-link">Configura il tuo sistema →</Link>
              </div>
            </div>
          )}
        </div>

        {/* OUTPUT PANEL */}
        <div className="fc-output-panel">
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="fc-results">
              {/* SECTION 1 — PROFILO IDEALE */}
              <div className="fc-result-section fc-result-highlight">
                <div className="fc-result-badge">1</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <h3 className="fc-result-title">Profilo ideale</h3>
                </div>
                <p className="fc-result-text">{output.profilo_ideale}</p>
                <CopyButton text={output.profilo_ideale} />
              </div>

              {/* SECTION 2 — RUOLI DA CERCARE */}
              <div className="fc-result-section">
                <div className="fc-result-badge">2</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <h3 className="fc-result-title">Ruoli da cercare</h3>
                </div>
                <div className="fc-roles-grid">
                  <div>
                    <span className="fc-roles-label">Principali</span>
                    <div className="fc-chip-list">
                      {output.ruoli_da_cercare.principali.map((r, i) => (
                        <span key={i} className="fc-chip fc-chip-primary">{r}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="fc-roles-label">Alternativi</span>
                    <div className="fc-chip-list">
                      {output.ruoli_da_cercare.alternativi.map((r, i) => (
                        <span key={i} className="fc-chip fc-chip-alt">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3 — KEYWORD CONSIGLIATE */}
              <div className="fc-result-section">
                <div className="fc-result-badge">3</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                  <h3 className="fc-result-title">Keyword consigliate</h3>
                </div>
                <div className="fc-chip-list">
                  {output.keyword_consigliate.map((kw, i) => (
                    <span key={i} className="fc-chip fc-chip-keyword">{kw}</span>
                  ))}
                </div>
                <CopyButton text={output.keyword_consigliate.join(", ")} />
              </div>

              {/* SECTION 4 — FILTRI LINKEDIN */}
              <div className="fc-result-section">
                <div className="fc-result-badge">4</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  <h3 className="fc-result-title">Filtri LinkedIn consigliati</h3>
                </div>
                <div className="fc-filters-grid">
                  <div className="fc-filter-item">
                    <span className="fc-filter-label">Settore</span>
                    <span className="fc-filter-value">{output.filtri_linkedin.settore}</span>
                  </div>
                  <div className="fc-filter-item">
                    <span className="fc-filter-label">Geografia</span>
                    <span className="fc-filter-value">{output.filtri_linkedin.geografia}</span>
                  </div>
                  <div className="fc-filter-item">
                    <span className="fc-filter-label">Dimensione</span>
                    <span className="fc-filter-value">{output.filtri_linkedin.dimensione_azienda}</span>
                  </div>
                  <div className="fc-filter-item">
                    <span className="fc-filter-label">Segnali</span>
                    <span className="fc-filter-value">{output.filtri_linkedin.segnali}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5 — LISTA PRONTA SU LINKEDIN */}
              <div className="fc-result-section fc-result-linkedin">
                <div className="fc-result-badge fc-result-badge-cta">5</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <h3 className="fc-result-title">Lista pronta su LinkedIn</h3>
                </div>
                <p className="fc-linkedin-desc">
                  Abbiamo preparato una ricerca LinkedIn coerente con il cliente che stai cercando. Aprila e inizia dai profili più rilevanti.
                </p>
                <a
                  href={output.link_ricerca_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fc-linkedin-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Apri la lista su LinkedIn
                </a>
              </div>

              {/* SECTION 6 — COME SCEGLIERE I PROFILI */}
              <div className="fc-result-section">
                <div className="fc-result-badge">6</div>
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
                    <span className="fc-criteria-label">Segnali di attività</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.segnali_attivita}</p>
                  </div>
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Allineamento tematico</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.allineamento_tematico}</p>
                  </div>
                  <div className="fc-criteria-item">
                    <span className="fc-criteria-label">Fit con il servizio</span>
                    <p className="fc-criteria-text">{output.come_scegliere_profili.fit_servizio}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 7 — STRATEGIA DI CONTATTO */}
              <div className="fc-result-section">
                <div className="fc-result-badge">7</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  <h3 className="fc-result-title">Strategia di contatto</h3>
                </div>
                <p className="fc-result-text fc-result-text-strategy">{output.strategia_contatto}</p>
                <CopyButton text={output.strategia_contatto} />
              </div>

              {/* SECTION 8 — PRIMO MESSAGGIO */}
              <div className="fc-result-section fc-result-message">
                <div className="fc-result-badge">8</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <h3 className="fc-result-title">Primo messaggio consigliato</h3>
                </div>
                <div className="fc-message-box">
                  <p className="fc-message-text">{output.primo_messaggio}</p>
                </div>
                <CopyButton text={output.primo_messaggio} />
              </div>

              {/* SECTION 9 — PROSSIMO STEP */}
              <div className="fc-result-section fc-result-next">
                <div className="fc-result-badge">9</div>
                <div className="fc-result-header">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  <h3 className="fc-result-title">Prossimo step</h3>
                </div>
                <p className="fc-result-text">{output.prossimo_step}</p>
                <div className="fc-next-actions">
                  <Link href="/app/prospect" className="btn-primary">
                    Analizza uno di questi profili →
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6M8 11h6"/></svg>
              </div>
              <h3 className="fc-empty-title">Definisci il tuo targeting</h3>
              <p className="fc-empty-text">
                Compila i campi di targeting e Preflight costruirà una strategia LinkedIn precisa e azionabile: profilo ideale, keyword, filtri, messaggio e prossimi step.
              </p>
              <div className="fc-empty-features">
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">1</span>
                  <span>Profilo ideale e ruoli</span>
                </div>
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">2</span>
                  <span>Keyword e filtri LinkedIn</span>
                </div>
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">3</span>
                  <span>Ricerca LinkedIn pronta</span>
                </div>
                <div className="fc-empty-feature">
                  <span className="fc-empty-feature-num">4</span>
                  <span>Strategia e primo messaggio</span>
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
