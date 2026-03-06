"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 5;

const initial: OnboardingInput = {
  offer_one_liner: "",
  offer_price_range: "",
  offer_delivery_time: "1m",
  offer_outcome: "",
  icp_role: "",
  icp_industry: "",
  icp_company_size: "",
  icp_main_problem: "",
  icp_top_objections: [],
  proof_case_study: "",
  proof_testimonial: "",
  proof_links: "",
  weekly_time_minutes: "30",
  comfort_post: "3",
  comfort_comments: "3",
  comfort_dm: "3",
  goal_primary: "prime conversazioni",
};

const timeOptions = [
  { label: "10–15 minuti", value: "15" },
  { label: "30 minuti", value: "30" },
  { label: "1 ora", value: "60" },
  { label: "Più di 1 ora", value: "120" },
];

const goalOptions = [
  { label: "💬 Più conversazioni", value: "prime conversazioni", desc: "Voglio iniziare a dialogare con potenziali clienti" },
  { label: "📞 Più call", value: "più call", desc: "Voglio trasformare le conversazioni in appuntamenti" },
  { label: "🤝 Più clienti", value: "più clienti", desc: "Voglio chiudere nuovi contratti" },
];

const PLACEHOLDER_VALUE = "Da definire";

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

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Imposta il tuo sistema clienti
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Rispondi a poche domande. Creeremo il tuo piano commerciale LinkedIn su misura.
        </p>
      </div>

      {/* Guide box */}
      <div className="callout text-sm space-y-1.5">
        <div><span className="font-semibold">✅ Cosa fa questa pagina:</span> configura il tuo sistema commerciale.</div>
        <div><span className="font-semibold">📋 Cosa inserire:</span> offerta, cliente ideale, prove e tempo disponibile.</div>
        <div><span className="font-semibold">🎯 Cosa ottieni:</span> un piano pratico per passare da conversazione a call.</div>
      </div>

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
            style={{
              width: `${progressPct}%`,
              background: "var(--color-primary)",
            }}
          />
        </div>
        {/* Step dots */}
        <div className="mt-3 flex justify-between">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                style={{
                  background: i + 1 < step ? "var(--color-primary)" : i + 1 === step ? "var(--color-primary)" : "var(--color-soft)",
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
        {/* ── Step 1 ── */}
        {step === 1 && (
          <>
            <StepHeader
              emoji="💼"
              title="Di cosa ti occupi?"
              subtitle="Descrivi in modo semplice cosa fai e a chi serve."
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Il tuo servizio principale</span>
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
                setData({ ...data, offer_one_liner: data.offer_one_liner || PLACEHOLDER_VALUE, offer_outcome: data.offer_outcome || PLACEHOLDER_VALUE });
                setStep(2);
              }}
            />
          </>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <>
            <StepHeader
              emoji="🎯"
              title="Chi dovrebbe diventare tuo cliente?"
              subtitle="Più specifico sei, più precisi saranno i suggerimenti."
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
                setStep(3);
              }}
            />
          </>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <>
            <StepHeader
              emoji="⭐"
              title="Perché dovrebbero fidarsi di te?"
              subtitle="Anche un solo risultato concreto fa la differenza."
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Un risultato ottenuto per un cliente</span>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Es. Ho aiutato Mario Rossi a passare da 0 a 5 clienti in 3 mesi con LinkedIn."
                value={data.proof_case_study}
                onChange={(e) => setData({ ...data, proof_case_study: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">
                Testimonianza{" "}
                <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(opzionale)</span>
              </span>
              <input
                className="input w-full"
                placeholder={`Es. "Grazie a Marco ho trovato 3 nuovi clienti in un mese."`}
                value={data.proof_testimonial || ""}
                onChange={(e) => setData({ ...data, proof_testimonial: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">
                Link portfolio o casi studio{" "}
                <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(opzionale)</span>
              </span>
              <input
                className="input w-full"
                placeholder="https://..."
                value={data.proof_links || ""}
                onChange={(e) => setData({ ...data, proof_links: e.target.value })}
              />
            </label>
            <SkipOption
              label="Lo aggiungerò più avanti"
              onClick={() => {
                setData({ ...data, proof_case_study: data.proof_case_study || PLACEHOLDER_VALUE });
                setStep(4);
              }}
            />
          </>
        )}

        {/* ── Step 4 ── */}
        {step === 4 && (
          <>
            <StepHeader
              emoji="⏱"
              title="Quanto tempo puoi dedicare a LinkedIn?"
              subtitle="Adatteremo il piano alle tue disponibilità reali."
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

        {/* ── Step 5 ── */}
        {step === 5 && (
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
                  <div className="font-semibold text-sm" style={{ color: data.goal_primary === opt.value ? "var(--color-primary)" : "var(--color-text)" }}>
                    {opt.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{opt.desc}</div>
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

        {/* Navigation */}
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
      </div>

      {/* Reassurance */}
      <p className="text-center text-xs" style={{ color: "var(--color-muted)" }}>
        Puoi modificare queste informazioni in qualsiasi momento dalle impostazioni.
      </p>
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
