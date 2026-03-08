"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { computeSystemProgress } from "@/components/app/SystemBanner";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 7;
const PLACEHOLDER_VALUE = "Da definire";

const timeOptions = [
  { label: "30 minuti", value: "15" },
  { label: "1 ora", value: "30" },
  { label: "3 ore", value: "60" },
  { label: "5 ore", value: "120" },
];

const goalOptions = [
  { label: "💬 Più conversazioni", value: "prime conversazioni", desc: "Voglio iniziare a dialogare con potenziali clienti" },
  { label: "📞 Più call", value: "più call", desc: "Voglio trasformare le conversazioni in appuntamenti" },
  { label: "🤝 Più clienti", value: "più clienti", desc: "Voglio chiudere nuovi contratti" },
];

const initial: OnboardingInput = {
  offer_one_liner: "",
  offer_price_range: "",
  offer_delivery_time: "1m",
  offer_outcome: "",
  linkedin_profile_url: "",
  icp_role: "",
  icp_industry: "",
  icp_company_size: "",
  icp_main_problem: "",
  icp_top_objections: [],
  trigger_situation: "",
  proof_case_study: "",
  proof_testimonial: "",
  proof_links: "",
  weekly_time_minutes: "30",
  comfort_post: "3",
  comfort_comments: "3",
  comfort_dm: "3",
  goal_primary: "prime conversazioni",
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
      router.push("/app");
    } catch {
      setError("Non sono riuscito a generare il piano. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);
  const systemPct = computeSystemProgress(data as unknown as Record<string, unknown>);

  return (
    <div className="onb-page">

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="onb-hero">
        <h2 className="onb-hero-title">Configura il tuo sistema clienti</h2>
        <p className="onb-hero-subtitle">
          Preflight usa queste informazioni per adattare l&apos;AI al tuo lavoro.
        </p>
        <p className="onb-hero-body">
          Più l&apos;AI conosce il tuo business, più i suggerimenti saranno precisi.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SPIEGAZIONE
      ═══════════════════════════════════════════════════════ */}
      <section className="onb-explain">
        <h3 className="onb-explain-title">Perché è importante impostare il tuo sistema</h3>
        <p className="onb-explain-text">
          Preflight non è un generatore generico.
          È un sistema che si adatta al tuo modo di trovare clienti su LinkedIn.
        </p>
        <p className="onb-explain-text">Quando inserisci informazioni sul tuo lavoro, l&apos;AI può:</p>
        <ul className="onb-explain-list">
          <li>capire meglio i tuoi clienti ideali</li>
          <li>scrivere contenuti più mirati</li>
          <li>suggerire risposte più efficaci</li>
          <li>analizzare meglio le conversazioni</li>
          <li>proporre strategie più utili</li>
        </ul>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GUIDE CARDS
      ═══════════════════════════════════════════════════════ */}
      <div className="onb-guide-grid">
        <div className="onb-guide-card">
          <div className="onb-guide-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <h4 className="onb-guide-title">Cosa inserirai</h4>
          <ul className="onb-guide-list">
            <li>La tua offerta</li>
            <li>Il cliente ideale</li>
            <li>Prove e risultati</li>
            <li>Il tempo che puoi dedicare a LinkedIn</li>
          </ul>
        </div>
        <div className="onb-guide-card">
          <div className="onb-guide-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7v8l10-12h-7l0-8z"/></svg>
          </div>
          <h4 className="onb-guide-title">Cosa succede dopo</h4>
          <p className="onb-guide-text">L&apos;AI userà queste informazioni per migliorare:</p>
          <ul className="onb-guide-list">
            <li>Contenuti</li>
            <li>Commenti</li>
            <li>Messaggi</li>
            <li>Analisi dei potenziali clienti</li>
          </ul>
        </div>
        <div className="onb-guide-card">
          <div className="onb-guide-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h4 className="onb-guide-title">Cosa ottieni</h4>
          <p className="onb-guide-text">
            Un sistema più preciso per trasformare conversazioni in call e clienti.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SYSTEM COMPLETION BAR
      ═══════════════════════════════════════════════════════ */}
      <div className="onb-completion">
        <div className="onb-completion-header">
          <h3 className="onb-completion-title">Completamento del tuo sistema</h3>
          <span className="onb-completion-pct">
            {systemPct === 100 ? "Sistema configurato correttamente" : `Sistema configurato al ${systemPct}%`}
          </span>
        </div>
        <div className="onb-completion-track">
          <div
            className={`onb-completion-fill${systemPct === 100 ? " onb-completion-fill-done" : ""}`}
            style={{ width: `${systemPct}%` }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FORM
      ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-xl space-y-6">

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
            Passo {step} di {TOTAL_STEPS}
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
            {progressPct}% completato
          </span>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ background: "var(--color-soft)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, background: "var(--color-primary)" }}
          />
        </div>
        {/* Step dots */}
        <div className="mt-3 flex justify-between">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                style={{
                  background: i + 1 <= step ? "var(--color-primary)" : "var(--color-soft)",
                  color: i + 1 <= step ? "white" : "var(--color-muted)",
                  opacity: i + 1 > step ? 0.5 : 1,
                }}
              >
                {i + 1 < step ? "✓" : i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step cards */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* ── Step 1: Di cosa ti occupi? ── */}
        {step === 1 && (
          <>
            <StepHeader
              emoji="💼"
              title="Offerta"
              subtitle="Chi aiuti e che problema risolvi."
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Il tuo servizio principale</span>
              <p className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>Descrivi in modo semplice cosa fai e a chi serve.</p>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Es. Aiuto aziende SaaS a ridurre il churn attraverso una migliore onboarding."
                value={data.offer_one_liner}
                onChange={(e) => setData({ ...data, offer_one_liner: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Risultato concreto che ottiene il cliente</span>
              <p className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>Un beneficio specifico e misurabile.</p>
              <input
                className="input w-full"
                placeholder="Es. Aumenta le conversioni del 30% in 60 giorni."
                value={data.offer_outcome}
                onChange={(e) => setData({ ...data, offer_outcome: e.target.value })}
              />
            </label>
            <SkipOption
              label="Non sono ancora sicuro di come descriverlo"
              onClick={() => {
                setData({
                  ...data,
                  offer_one_liner: data.offer_one_liner || PLACEHOLDER_VALUE,
                  offer_outcome: data.offer_outcome || PLACEHOLDER_VALUE,
                });
                setStep(2);
              }}
            />
          </>
        )}

        {/* ── Step 2: Profilo LinkedIn ── */}
        {step === 2 && (
          <>
            <StepHeader
              emoji="🔗"
              title="Analizziamo anche il tuo profilo LinkedIn"
              subtitle="Questo ci aiuta a capire come ti presenti oggi e a costruire un sistema più preciso."
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Link al tuo profilo LinkedIn</span>
              <input
                className="input w-full"
                type="url"
                placeholder="https://www.linkedin.com/in/tuo-nome"
                value={data.linkedin_profile_url || ""}
                onChange={(e) => setData({ ...data, linkedin_profile_url: e.target.value })}
              />
            </label>
            {/* Microcopy */}
            <div
              className="rounded-xl p-4 text-sm space-y-1.5"
              style={{ background: "var(--color-soft)", border: "1px solid var(--color-border)" }}
            >
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Useremo il tuo profilo per capire:
              </p>
              <ul className="space-y-1" style={{ color: "var(--color-muted)" }}>
                <li>• come ti presenti oggi</li>
                <li>• che tipo di cliente potresti attirare</li>
                <li>• come adattare contenuti e conversazioni</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn-primary w-full py-3 text-base"
                disabled={!data.linkedin_profile_url}
                onClick={() => setStep(3)}
              >
                🔍 Analizza il mio profilo
              </button>
              <SkipOption
                label="Preferisco saltare questo passaggio"
                onClick={() => setStep(3)}
              />
            </div>
          </>
        )}

        {/* ── Step 3: Cliente ideale ── */}
        {step === 3 && (
          <>
            <StepHeader
              emoji="🎯"
              title="Cliente ideale"
              subtitle="Tipo di azienda o professionista che vuoi raggiungere."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Ruolo / Titolo</span>
                <input
                  className="input w-full"
                  placeholder="Es. CEO, Founder, Head of Growth"
                  value={data.icp_role}
                  onChange={(e) => setData({ ...data, icp_role: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Settore</span>
                <input
                  className="input w-full"
                  placeholder="Es. SaaS B2B, E-commerce, Consulenza"
                  value={data.icp_industry}
                  onChange={(e) => setData({ ...data, icp_industry: e.target.value })}
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Dimensione azienda</span>
              <input
                className="input w-full"
                placeholder="Es. 10–50 dipendenti, startup early-stage"
                value={data.icp_company_size}
                onChange={(e) => setData({ ...data, icp_company_size: e.target.value })}
              />
            </label>
            <SkipOption
              label="Non ho ancora un cliente ideale definito"
              onClick={() => {
                setData({
                  ...data,
                  icp_role: data.icp_role || PLACEHOLDER_VALUE,
                  icp_industry: data.icp_industry || PLACEHOLDER_VALUE,
                  icp_company_size: data.icp_company_size || PLACEHOLDER_VALUE,
                });
                setStep(4);
              }}
            />
          </>
        )}

        {/* ── Step 4: Problema principale ── */}
        {step === 4 && (
          <>
            <StepHeader
              emoji="🧩"
              title="Che problema aiuti a risolvere?"
              subtitle="Descrivi la sfida concreta che il tuo cliente affronta prima di trovarti."
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Il problema principale del tuo cliente ideale</span>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Es. Non riesce ad acquisire nuovi clienti in modo costante, gestisce tutto manualmente e perde tempo."
                value={data.icp_main_problem}
                onChange={(e) => setData({ ...data, icp_main_problem: e.target.value })}
              />
            </label>
            <SkipOption
              label="Non sono ancora sicuro"
              onClick={() => {
                setData({ ...data, icp_main_problem: data.icp_main_problem || PLACEHOLDER_VALUE });
                setStep(5);
              }}
            />
          </>
        )}

        {/* ── Step 5: Trigger conversazione ── */}
        {step === 5 && (
          <>
            <StepHeader
              emoji="💡"
              title="Quando nasce la conversazione con il cliente?"
              subtitle="In quale situazione un cliente decide di contattarti?"
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Descrivi la situazione tipica</span>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Es. Quando vuole più clienti, quando il sito non converte, quando cerca un consulente."
                value={data.trigger_situation || ""}
                onChange={(e) => setData({ ...data, trigger_situation: e.target.value })}
              />
            </label>
            {/* Example chips */}
            <div>
              <p className="text-xs mb-2 font-medium" style={{ color: "var(--color-muted)" }}>
                Scegli un esempio o scrivi il tuo:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Quando vuole più clienti",
                  "Quando il sito non converte",
                  "Quando ha bisogno di un consulente",
                  "Quando vuole migliorare LinkedIn",
                ].map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setData({ ...data, trigger_situation: ex })}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
                    style={{
                      background: data.trigger_situation === ex ? "var(--color-primary)" : "var(--color-soft-2)",
                      color: data.trigger_situation === ex ? "white" : "var(--color-text)",
                      border: `1.5px solid ${data.trigger_situation === ex ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <SkipOption
              label="Non sono ancora sicuro"
              onClick={() => {
                setData({ ...data, trigger_situation: data.trigger_situation || PLACEHOLDER_VALUE });
                setStep(6);
              }}
            />
          </>
        )}

        {/* ── Step 6: Tempo disponibile ── */}
        {step === 6 && (
          <>
            <StepHeader
              emoji="⏱"
              title="Quanto tempo puoi dedicare a LinkedIn ogni settimana?"
              subtitle="Questo aiuta Preflight a suggerire strategie realistiche."
            />
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData({ ...data, weekly_time_minutes: opt.value as OnboardingInput["weekly_time_minutes"] })}
                  className="rounded-xl p-4 text-sm font-medium text-left transition-all duration-150"
                  style={{
                    background: data.weekly_time_minutes === opt.value ? "var(--color-primary)" : "var(--color-soft-2)",
                    color: data.weekly_time_minutes === opt.value ? "white" : "var(--color-text)",
                    border: `2px solid ${data.weekly_time_minutes === opt.value ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── Step 7: Obiettivo ── */}
        {step === 7 && (
          <>
            <StepHeader
              emoji="🚀"
              title="Cosa vuoi ottenere?"
              subtitle="Scegli il tuo obiettivo principale con LinkedIn."
            />
            <div className="space-y-3">
              {goalOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData({ ...data, goal_primary: opt.value as OnboardingInput["goal_primary"] })}
                  className="w-full rounded-xl p-4 text-left transition-all duration-150"
                  style={{
                    background: data.goal_primary === opt.value ? "var(--color-soft)" : "var(--color-soft-2)",
                    border: `2px solid ${data.goal_primary === opt.value ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  <div
                    className="font-semibold text-sm"
                    style={{ color: data.goal_primary === opt.value ? "var(--color-primary)" : "var(--color-text)" }}
                  >
                    {opt.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="callout-danger rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Navigation — hidden for step 2 which has its own buttons */}
        {step !== 2 && (
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                className="btn-secondary flex-1"
                disabled={loading}
                onClick={() => setStep((s) => s - 1)}
              >
                ← Indietro
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                className="btn-primary flex-1 py-3 text-base"
                disabled={loading}
                onClick={() => setStep((s) => s + 1)}
              >
                Avanti →
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary flex-1 py-3 text-base"
                disabled={loading}
                onClick={submit}
              >
                {loading ? "Generazione piano in corso…" : "🚀 Genera il mio piano"}
              </button>
            )}
          </div>
        )}

        {/* Back button only for step 2 */}
        {step === 2 && (
          <button
            type="button"
            className="btn-secondary w-full"
            disabled={loading}
            onClick={() => setStep(1)}
          >
            ← Indietro
          </button>
        )}
      </div>

      {/* Reassurance */}
      <p className="text-center text-xs" style={{ color: "var(--color-muted)" }}>
        Puoi modificare queste informazioni in qualsiasi momento dalle impostazioni.
      </p>
      </div>
    </div>
  );
}

function StepHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 pb-2">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{ background: "var(--color-soft)", color: "var(--color-primary)" }}
      >
        {emoji}
      </div>
      <div>
        <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>{title}</h3>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>{subtitle}</p>
      </div>
    </div>
  );
}

function SkipOption({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm underline-offset-2 hover:underline"
      style={{ color: "var(--color-muted)" }}
    >
      {label} →
    </button>
  );
}

