"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import Link from "next/link";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 6;

const TIPO_SERVIZIO_OPTIONS = [
  { label: "Consulenza", value: "consulenza", icon: "💼" },
  { label: "Servizio", value: "servizio", icon: "⚙️" },
  { label: "Coaching", value: "coaching", icon: "🎯" },
  { label: "Agenzia", value: "agenzia", icon: "🏢" },
  { label: "Altro", value: "altro", icon: "✨" },
] as const;

const DIMENSIONE_OPTIONS = [
  { label: "Freelance", value: "freelance" },
  { label: "Startup", value: "startup" },
  { label: "PMI", value: "pmi" },
  { label: "Enterprise", value: "enterprise" },
] as const;

const STATO_LINKEDIN_OPTIONS = [
  { label: "Non lo uso", value: "non_uso", desc: "LinkedIn è fermo o quasi", icon: "🔇" },
  { label: "Pubblico ma senza risultati", value: "pubblico_no_risultati", desc: "Creo contenuti ma non generano lead", icon: "📝" },
  { label: "Scrivo ma senza risposta", value: "scrivo_no_risposta", desc: "Mando messaggi che non ottengono reply", icon: "📨" },
  { label: "Ho conversazioni ma non diventano call", value: "conversazioni_no_call", desc: "Parlo con le persone giuste ma non converto", icon: "💬" },
] as const;

const STEP_META = [
  { num: 1, label: "Offerta", icon: "🎯" },
  { num: 2, label: "Cliente", icon: "👤" },
  { num: 3, label: "Problema", icon: "🔧" },
  { num: 4, label: "Segnali", icon: "📡" },
  { num: 5, label: "Tono", icon: "✍️" },
  { num: 6, label: "Stato", icon: "📊" },
];

const initial: OnboardingInput = {
  servizio: "",
  tipo_servizio: "consulenza",
  cliente_ideale: "",
  settore: "",
  dimensione_azienda: "pmi",
  problema_cliente: "",
  risultato_cliente: "",
  segnali_interesse: "",
  stato_linkedin: "non_uso",
  elevator_pitch: "",
  differenziatore: "",
  obiezione_frequente: "",
  modello_vendita: "consultative",
  ticket_medio: "5k_15k",
  ciclo_vendita: "1_4w",
  tempo_settimanale: "1_3h",
  cta_preferita: "call",
  linkedin_url: "",
  sito_web: "",
  linkedin_search_links: [],
  materiali_nomi: [],
  tone_samples: [],
};

export default function OnboardingPage() {
  const router = useRouter();
  const { userId, status: authStatus } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingInput>(initial);
  const [complete, setComplete] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Tone samples management
  const [currentSample, setCurrentSample] = useState("");

  const addToneSample = useCallback(() => {
    const trimmed = currentSample.trim();
    if (trimmed && (data.tone_samples?.length || 0) < 3) {
      setData((d) => ({ ...d, tone_samples: [...(d.tone_samples || []), trimmed] }));
      setCurrentSample("");
    }
  }, [currentSample, data.tone_samples]);

  const removeToneSample = useCallback((idx: number) => {
    setData((d) => ({
      ...d,
      tone_samples: (d.tone_samples || []).filter((_, i) => i !== idx),
    }));
  }, []);

  function goTo(target: number) {
    setDirection(target > step ? "forward" : "back");
    setStep(target);
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.servizio.trim().length > 0;
      case 2: return data.cliente_ideale.trim().length > 0;
      case 3: return data.problema_cliente.trim().length > 0;
      case 4: return data.segnali_interesse.trim().length > 0;
      case 5: return true;
      case 6: return true;
      default: return true;
    }
  }

  async function submit() {
    setError("");
    const parsed = onboardingInputSchema.safeParse(data);
    if (!parsed.success) {
      setError("Compila i campi obbligatori prima di continuare.");
      return;
    }

    setLoading(true);
    try {
      repo.profile.saveOnboarding(userId!, parsed.data);
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding: parsed.data }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Errore generazione piano (${res.status})`);
      }
      const plan = await res.json();
      repo.profile.savePlan(userId!, plan);
      repo.profile.setOnboardingComplete(userId!);
      repo.interaction.addInteraction(userId!, "onboarding", JSON.stringify(parsed.data), plan);
      setComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Non sono riuscito a generare il piano. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  /* Auth loading guard */
  if (authStatus === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  /* Completion screen */
  if (complete) {
    return (
      <div className="onb-engine">
        <section className="onb-complete fade-in">
          <div className="onb-complete-badge">✓</div>
          <h1 className="onb-complete-title">Il tuo sistema è pronto</h1>
          <p className="onb-complete-subtitle">
            L&apos;AI ha il contesto per trovare prospect, scrivere messaggi e pianificare le tue giornate &mdash; tutto calibrato sulla tua voce e il tuo mercato.
          </p>
          <div className="onb-complete-summary">
            <div className="onb-complete-item">
              <span className="onb-complete-label">Offerta</span>
              <span className="onb-complete-value">{data.servizio}</span>
            </div>
            <div className="onb-complete-item">
              <span className="onb-complete-label">Target</span>
              <span className="onb-complete-value">{data.cliente_ideale}</span>
            </div>
            <div className="onb-complete-item">
              <span className="onb-complete-label">Problema</span>
              <span className="onb-complete-value">{data.problema_cliente}</span>
            </div>
            {(data.tone_samples?.length || 0) > 0 && (
              <div className="onb-complete-item">
                <span className="onb-complete-label">Tono</span>
                <span className="onb-complete-value">{data.tone_samples!.length} esempi configurati</span>
              </div>
            )}
          </div>
          <div className="onb-complete-actions">
            <Link href="/app" className="onb-nav-next onb-nav-submit">
              Vai alla dashboard &rarr;
            </Link>
            <Link href="/app/find-clients" className="onb-nav-next onb-nav-secondary">
              Trova clienti
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="onb-engine">

      {/* Hero */}
      <section className="onb-engine-hero">
        <div className="onb-engine-hero-glow" aria-hidden="true" />
        <p className="onb-engine-eyebrow">⚡ Setup in 3 minuti</p>
        <h1 className="onb-engine-title">
          Configura il tuo sistema commerciale
        </h1>
        <p className="onb-engine-subtitle">
          6 step rapidi. L&apos;AI userà queste informazioni per trovare prospect, scrivere messaggi nel tuo tono e pianificare ogni giornata.
        </p>
      </section>

      {/* Progress bar */}
      <div className="onb-progress-bar-wrap">
        <div className="onb-progress-steps">
          {STEP_META.map((s) => (
            <button
              key={s.num}
              type="button"
              className={`onb-step-pill${s.num === step ? " onb-step-active" : ""}${s.num < step ? " onb-step-done" : ""}`}
              onClick={() => s.num <= step && goTo(s.num)}
            >
              <span className="onb-step-icon">{s.num < step ? "✓" : s.icon}</span>
              <span className="onb-step-label">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="onb-progress-track">
          <div className="onb-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="onb-progress-text">Step {step} di {TOTAL_STEPS}</span>
      </div>

      {/* Step content */}
      <section className="onb-section-block">
        <div className="onb-section-body onb-step-transition" key={step}>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="onb-step-header">
                <span className="onb-step-number">01</span>
                <h2 className="onb-step-title">Cosa offri</h2>
                <p className="onb-step-desc">L&apos;AI usa queste informazioni per creare messaggi che parlano la lingua del tuo mercato.</p>
              </div>
              <OnbField label="Descrivi la tua offerta" hint="Cosa fai concretamente per i tuoi clienti?" required>
                <textarea
                  className="onb-input onb-textarea"
                  rows={2}
                  placeholder="Aiuto team sales B2B a generare pipeline su LinkedIn"
                  value={data.servizio}
                  onChange={(e) => setData({ ...data, servizio: e.target.value })}
                />
              </OnbField>
              <OnbField label="Tipo di servizio">
                <div className="onb-chip-row">
                  {TIPO_SERVIZIO_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`onb-chip onb-chip-lg${data.tipo_servizio === opt.value ? " onb-chip-active" : ""}`}
                      onClick={() => setData({ ...data, tipo_servizio: opt.value })}
                    >{opt.icon} {opt.label}</button>
                  ))}
                </div>
              </OnbField>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="onb-step-header">
                <span className="onb-step-number">02</span>
                <h2 className="onb-step-title">Il tuo cliente ideale</h2>
                <p className="onb-step-desc">Definire il target permette all&apos;AI di filtrare i prospect e personalizzare ogni messaggio.</p>
              </div>
              <OnbField label="Chi vuoi come cliente" hint="Ruolo, tipo di azienda, contesto" required>
                <input
                  className="onb-input"
                  placeholder="Founder SaaS B2B, Head of Sales, CEO PMI"
                  value={data.cliente_ideale}
                  onChange={(e) => setData({ ...data, cliente_ideale: e.target.value })}
                />
              </OnbField>
              <OnbField label="Settore" hint="Facoltativo — aiuta a restringere il target">
                <input
                  className="onb-input"
                  placeholder="SaaS, consulenza, marketing, fintech"
                  value={data.settore}
                  onChange={(e) => setData({ ...data, settore: e.target.value })}
                />
              </OnbField>
              <OnbField label="Dimensione azienda">
                <div className="onb-chip-row">
                  {DIMENSIONE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`onb-chip${data.dimensione_azienda === opt.value ? " onb-chip-active" : ""}`}
                      onClick={() => setData({ ...data, dimensione_azienda: opt.value })}
                    >{opt.label}</button>
                  ))}
                </div>
              </OnbField>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="onb-step-header">
                <span className="onb-step-number">03</span>
                <h2 className="onb-step-title">Il problema che risolvi</h2>
                <p className="onb-step-desc">Serve per definire l&apos;angolo di attacco nei messaggi e nell&apos;analisi dei profili.</p>
              </div>
              <OnbField label="Problema principale del tuo cliente" hint="Qual è la frustrazione o il blocco che risolvi?" required>
                <textarea
                  className="onb-input onb-textarea"
                  rows={2}
                  placeholder="Non generano clienti tramite LinkedIn"
                  value={data.problema_cliente}
                  onChange={(e) => setData({ ...data, problema_cliente: e.target.value })}
                />
              </OnbField>
              <OnbField label="Risultato che offri" hint="Facoltativo — il risultato concreto che ottengono">
                <input
                  className="onb-input"
                  placeholder="5–10 call qualificate al mese"
                  value={data.risultato_cliente}
                  onChange={(e) => setData({ ...data, risultato_cliente: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <div className="onb-step-header">
                <span className="onb-step-number">04</span>
                <h2 className="onb-step-title">Segnali di interesse</h2>
                <p className="onb-step-desc">Questa è la parte più potente. L&apos;AI li usa per valutare i profili e decidere chi contattare prima.</p>
              </div>
              <div className="onb-callout onb-callout-blue">
                <span className="onb-callout-icon">💡</span>
                <p className="onb-callout-text">
                  Più i segnali sono specifici e osservabili su LinkedIn, più l&apos;AI sarà precisa nel trovare i prospect giusti.
                </p>
              </div>
              <OnbField label="Quando capisci che un prospect è interessante?" hint="Cosa vedi su LinkedIn che ti fa pensare 'questo è un buon prospect'?" required>
                <textarea
                  className="onb-input onb-textarea"
                  rows={3}
                  placeholder="Sta assumendo sales, pubblica su crescita, parla di pipeline, ha cambiato ruolo di recente"
                  value={data.segnali_interesse}
                  onChange={(e) => setData({ ...data, segnali_interesse: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* Step 5 — Come comunichi (NEW) */}
          {step === 5 && (
            <>
              <div className="onb-step-header">
                <span className="onb-step-number">05</span>
                <h2 className="onb-step-title">Come comunichi</h2>
                <p className="onb-step-desc">
                  Incolla fino a 3 esempi di testi che hai scritto tu &mdash; post LinkedIn, email, messaggi. L&apos;AI li userà per replicare il tuo tono in ogni output.
                </p>
              </div>
              <div className="onb-callout onb-callout-blue">
                <span className="onb-callout-icon">✍️</span>
                <p className="onb-callout-text">
                  Step opzionale ma molto consigliato. Senza esempi, l&apos;AI userà un tono generico. Con i tuoi testi, ogni messaggio suonerà come te.
                </p>
              </div>

              {(data.tone_samples || []).map((sample, idx) => (
                <div key={idx} className="onb-tone-sample">
                  <div className="onb-tone-sample-header">
                    <span className="onb-tone-sample-label">Esempio {idx + 1}</span>
                    <button
                      type="button"
                      className="onb-tone-sample-remove"
                      onClick={() => removeToneSample(idx)}
                    >✕</button>
                  </div>
                  <p className="onb-tone-sample-text">&ldquo;{sample}&rdquo;</p>
                </div>
              ))}

              {(data.tone_samples?.length || 0) < 3 && (
                <OnbField
                  label={`Aggiungi esempio ${(data.tone_samples?.length || 0) + 1}`}
                  hint="Incolla un tuo testo — un post, una email, un messaggio DM"
                >
                  <textarea
                    className="onb-input onb-textarea"
                    rows={3}
                    placeholder="Incolla qui un testo che hai scritto tu..."
                    value={currentSample}
                    onChange={(e) => setCurrentSample(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        e.preventDefault();
                        addToneSample();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="onb-add-sample-btn"
                    disabled={!currentSample.trim()}
                    onClick={addToneSample}
                  >
                    + Aggiungi esempio
                  </button>
                </OnbField>
              )}

              <OnbField label="Sito web" hint="Facoltativo — l'AI può analizzare il tuo tono dal sito">
                <input
                  className="onb-input"
                  placeholder="https://tuosito.com"
                  value={data.sito_web}
                  onChange={(e) => setData({ ...data, sito_web: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* Step 6 */}
          {step === 6 && (
            <>
              <div className="onb-step-header">
                <span className="onb-step-number">06</span>
                <h2 className="onb-step-title">Come usi LinkedIn oggi</h2>
                <p className="onb-step-desc">Serve per personalizzare i consigli quotidiani e il piano operativo.</p>
              </div>
              <OnbField label="Qual è la tua situazione attuale?">
                <div className="onb-status-grid">
                  {STATO_LINKEDIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`onb-status-card${data.stato_linkedin === opt.value ? " onb-status-active" : ""}`}
                      onClick={() => setData({ ...data, stato_linkedin: opt.value })}
                    >
                      <span className="onb-status-icon">{opt.icon}</span>
                      <span className="onb-status-label">{opt.label}</span>
                      <span className="onb-status-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </OnbField>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="onb-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:"1px"}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {error}
          </div>
        )}

        {/* Navigation */}
        <div className="onb-nav">
          {step > 1 && (
            <button type="button" className="onb-nav-back" disabled={loading} onClick={() => goTo(step - 1)}>
              ← Indietro
            </button>
          )}
          <div className="onb-nav-spacer" />
          {step < TOTAL_STEPS ? (
            <button
              type="button"
              className="onb-nav-next"
              disabled={loading || !canAdvance()}
              onClick={() => goTo(step + 1)}
            >
              Continua →
            </button>
          ) : (
            <button
              type="button"
              className="onb-nav-next onb-nav-submit"
              disabled={loading}
              onClick={submit}
            >
              {loading ? (
                <><span className="onb-spinner" aria-hidden="true" />Generazione piano in corso…</>
              ) : (
                "Attiva il sistema →"
              )}
            </button>
          )}
        </div>
      </section>

      <p className="onb-reassurance">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Puoi modificare queste informazioni in qualsiasi momento dalle impostazioni.
      </p>
    </div>
  );
}

/* Field component */
function OnbField({ label, hint, children, required }: { label: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="onb-field">
      <label className="onb-field-label">
        {label}
        {required && <span className="onb-field-required">*</span>}
      </label>
      {hint && <p className="onb-field-hint">{hint}</p>}
      {children}
    </div>
  );
}
