"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 5;

const TIPO_SERVIZIO_OPTIONS = [
  { label: "Consulenza", value: "consulenza" },
  { label: "Servizio", value: "servizio" },
  { label: "Coaching", value: "coaching" },
  { label: "Agenzia", value: "agenzia" },
  { label: "Altro", value: "altro" },
] as const;

const DIMENSIONE_OPTIONS = [
  { label: "Freelance", value: "freelance" },
  { label: "Startup", value: "startup" },
  { label: "PMI", value: "pmi" },
  { label: "Enterprise", value: "enterprise" },
] as const;

const STATO_LINKEDIN_OPTIONS = [
  { label: "Non lo uso", value: "non_uso", desc: "LinkedIn è fermo o quasi" },
  { label: "Pubblico ma senza risultati", value: "pubblico_no_risultati", desc: "Creo contenuti ma non generano lead" },
  { label: "Scrivo ma senza risposta", value: "scrivo_no_risposta", desc: "Mando messaggi che non ottengono reply" },
  { label: "Ho conversazioni ma non diventano call", value: "conversazioni_no_call", desc: "Parlo con le persone giuste ma non converto" },
] as const;

const STEP_META = [
  { num: 1, label: "Cosa vendi", icon: "🎯" },
  { num: 2, label: "Il tuo cliente", icon: "👤" },
  { num: 3, label: "Il problema", icon: "🔧" },
  { num: 4, label: "Segnali", icon: "📡" },
  { num: 5, label: "Stato attuale", icon: "📊" },
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
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingInput>(initial);
  const [complete, setComplete] = useState(false);

  function canAdvance(): boolean {
    switch (step) {
      case 1: return data.servizio.trim().length > 0;
      case 2: return data.cliente_ideale.trim().length > 0;
      case 3: return data.problema_cliente.trim().length > 0;
      case 4: return data.segnali_interesse.trim().length > 0;
      case 5: return true;
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
      repo.profile.saveOnboarding(userId, parsed.data);
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding: parsed.data }),
      });
      if (!res.ok) throw new Error("Errore generazione piano");
      const plan = await res.json();
      repo.profile.savePlan(userId, plan);
      repo.profile.setOnboardingComplete(userId);
      repo.interaction.addInteraction(userId, "onboarding", JSON.stringify(parsed.data), plan);
      setComplete(true);
    } catch {
      setError("Non sono riuscito a generare il piano. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  /* ── Completion screen ── */
  if (complete) {
    return (
      <div className="onb-engine">
        <section className="onb-complete fade-in">
          <div className="onb-complete-icon">✅</div>
          <h1 className="onb-complete-title">Il tuo sistema è pronto</h1>
          <p className="onb-complete-subtitle">
            Ora sai chi contattare, come iniziare e cosa fare ogni giorno.
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
          </div>
          <div className="onb-complete-actions">
            <Link href="/app" className="onb-nav-next onb-nav-submit">
              Vai alla dashboard →
            </Link>
            <Link href="/app/find-clients" className="onb-nav-next" style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.1)", color: "var(--color-text)" }}>
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

      {/* ── Hero ── */}
      <section className="onb-engine-hero">
        <div className="onb-engine-hero-glow" aria-hidden="true" />
        <h1 className="onb-engine-title">
          Costruisci il tuo sistema commerciale
        </h1>
        <p className="onb-engine-subtitle">
          5 domande, meno di 3 minuti. L&apos;AI userà queste informazioni per trovare prospect, scrivere messaggi e pianificare le tue giornate.
        </p>
      </section>

      {/* ── Progress bar ── */}
      <div className="onb-progress-bar-wrap">
        <div className="onb-progress-steps">
          {STEP_META.map((s) => (
            <button
              key={s.num}
              type="button"
              className={`onb-step-pill${s.num === step ? " onb-step-active" : ""}${s.num < step ? " onb-step-done" : ""}`}
              onClick={() => s.num <= step && setStep(s.num)}
            >
              <span className="onb-step-icon">{s.num < step ? "✓" : s.icon}</span>
              <span className="onb-step-label">{s.label}</span>
            </button>
          ))}
        </div>
        <div className="onb-progress-track">
          <div className="onb-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="onb-progress-text">{step}/{TOTAL_STEPS}</span>
      </div>

      {/* ── Step content ── */}
      <section className="onb-section-block">
        <div className="onb-section-body">

          {/* Step 1 — Cosa vendi */}
          {step === 1 && (
            <>
              <div className="onb-step-header">
                <h2 className="onb-step-title">Cosa offri</h2>
                <p className="onb-step-desc">L&apos;AI usa queste informazioni per creare messaggi che parlano la lingua del tuo mercato.</p>
              </div>
              <OnbField label="Descrivi la tua offerta" hint="Cosa fai concretamente per i tuoi clienti?">
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
                      className={`onb-chip${data.tipo_servizio === opt.value ? " onb-chip-active" : ""}`}
                      onClick={() => setData({ ...data, tipo_servizio: opt.value })}
                    >{opt.label}</button>
                  ))}
                </div>
              </OnbField>
            </>
          )}

          {/* Step 2 — Chi è il tuo cliente */}
          {step === 2 && (
            <>
              <div className="onb-step-header">
                <h2 className="onb-step-title">Chi è il tuo cliente</h2>
                <p className="onb-step-desc">Definire il target permette all&apos;AI di filtrare i prospect e personalizzare ogni messaggio.</p>
              </div>
              <OnbField label="Chi vuoi come cliente" hint="Ruolo, tipo di azienda, contesto">
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

          {/* Step 3 — Problema che risolvi */}
          {step === 3 && (
            <>
              <div className="onb-step-header">
                <h2 className="onb-step-title">Problema che risolvi</h2>
                <p className="onb-step-desc">Serve per definire l&apos;angolo di attacco nei messaggi e nell&apos;analisi dei profili.</p>
              </div>
              <OnbField label="Problema principale del tuo cliente" hint="Qual è la frustrazione o il blocco che risolvi?">
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

          {/* Step 4 — Segnali */}
          {step === 4 && (
            <>
              <div className="onb-step-header">
                <h2 className="onb-step-title">Segnali di interesse</h2>
                <p className="onb-step-desc">Questa è la parte più potente. L&apos;AI li usa per valutare i profili e decidere chi contattare prima.</p>
              </div>
              <div className="onb-callout onb-callout-blue">
                <span className="onb-callout-icon">💡</span>
                <p className="onb-callout-text">
                  Più i segnali sono specifici e osservabili su LinkedIn, più l&apos;AI sarà precisa.
                </p>
              </div>
              <OnbField label="Quando capisci che un cliente è interessante?" hint="Cosa vedi su LinkedIn che ti fa pensare 'questo è un buon prospect'?">
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

          {/* Step 5 — Stato attuale */}
          {step === 5 && (
            <>
              <div className="onb-step-header">
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
                      <span className="onb-status-label">{opt.label}</span>
                      <span className="onb-status-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </OnbField>
            </>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="onb-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:"1px"}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {error}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="onb-nav">
          {step > 1 && (
            <button type="button" className="onb-nav-back" disabled={loading} onClick={() => setStep((s) => s - 1)}>
              ← Indietro
            </button>
          )}
          <div className="onb-nav-spacer" />
          {step < TOTAL_STEPS ? (
            <button
              type="button"
              className="onb-nav-next"
              disabled={loading || !canAdvance()}
              onClick={() => setStep((s) => s + 1)}
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

/* ── Field component ── */
function OnbField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="onb-field">
      <label className="onb-field-label">{label}</label>
      {hint && <p className="onb-field-hint">{hint}</p>}
      {children}
    </div>
  );
}
