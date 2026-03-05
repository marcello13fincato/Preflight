"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

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

const STEP_LABELS = [
  "Cosa vendi",
  "Cliente ideale",
  "Credibilità",
  "Tempo & Goal",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [data, setData] = useState<OnboardingInput>(initial);

  const progress = ((step - 1) / 4) * 100;

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
      setDone(true);
    } catch {
      setError("Non sono riuscito a generare il piano. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <div className="text-6xl mb-2">🎉</div>
        <h1 className="text-3xl font-extrabold">Sistema creato!</h1>
        <p className="text-[var(--color-muted)]">
          Il tuo piano LinkedIn è pronto. Ora sai esattamente cosa fare ogni giorno.
        </p>

        {/* Journey preview */}
        <div className="rounded-xl bg-[var(--color-soft)] border border-[var(--color-border)] p-5">
          <p className="text-sm font-bold text-[var(--color-primary)] mb-3">Il tuo percorso verso nuovi clienti:</p>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {["✍️ Post", "💬 Commenti", "✉️ Messaggi", "📞 Call", "🏆 Cliente"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--color-primary)] text-white px-3 py-1 text-xs font-bold">{step}</span>
                {i < arr.length - 1 && <span className="text-[var(--color-muted)]">→</span>}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/app")}
          className="btn-primary px-8 py-4 text-base w-full justify-center"
        >
          🚀 Vai alla Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">⚙️ Imposta il tuo sistema clienti</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Rispondi a poche domande. Creeremo il tuo piano commerciale LinkedIn in pochi secondi.
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-1">⏱️ Tempo stimato: 3–5 minuti</p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-[var(--color-muted)] mb-2">
          {STEP_LABELS.map((label, i) => (
            <span key={i} className={i + 1 <= step ? "font-semibold text-[var(--color-primary)]" : ""}>{label}</span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-1">Step {step} di 4</p>
      </div>

      {/* Steps */}
      {step === 1 && (
        <StepSection
          step={1}
          title="Cosa vendi?"
          why="Ci serve per capire come posizionarti su LinkedIn e cosa far dire ai tuoi post."
        >
          <Field
            label="Servizio principale *"
            hint='Es: "Aiuto aziende SaaS ad aumentare le conversioni con audit UX"'
            value={data.offer_one_liner}
            onChange={(v) => setData({ ...data, offer_one_liner: v })}
          />
          <Field
            label="Prezzo medio"
            hint='Es: "500-1500€" oppure "Non sono ancora sicuro"'
            value={data.offer_price_range}
            onChange={(v) => setData({ ...data, offer_price_range: v })}
            optional
          />
          <FieldSelect
            label="Durata tipica del progetto"
            value={data.offer_delivery_time}
            options={[
              { value: "1w", label: "1 settimana" },
              { value: "2w", label: "2 settimane" },
              { value: "1m", label: "1 mese" },
              { value: "3m", label: "3 mesi o più" },
            ]}
            onChange={(v) => setData({ ...data, offer_delivery_time: v as OnboardingInput["offer_delivery_time"] })}
          />
          <Field
            label="Risultato che ottiene il cliente"
            hint='Es: "Aumenta la retention del 20%" o "Trova 3 nuovi clienti in 60 giorni"'
            value={data.offer_outcome}
            onChange={(v) => setData({ ...data, offer_outcome: v })}
          />
        </StepSection>
      )}

      {step === 2 && (
        <StepSection
          step={2}
          title="Chi è il tuo cliente ideale?"
          why="Ti aiutiamo a scrivere post e messaggi che parlano direttamente a queste persone."
        >
          <Field
            label="Ruolo / titolo"
            hint='Es: "Founder SaaS", "HR Manager", "CEO PMI"'
            value={data.icp_role}
            onChange={(v) => setData({ ...data, icp_role: v })}
            notSureLabel="Non ho ancora le idee chiarissime"
          />
          <Field
            label="Settore"
            hint='Es: "SaaS B2B", "Consulenza", "E-commerce"'
            value={data.icp_industry}
            onChange={(v) => setData({ ...data, icp_industry: v })}
            optional
          />
          <Field
            label="Dimensione azienda"
            hint='Es: "1-10 persone", "10-50", "50-200"'
            value={data.icp_company_size}
            onChange={(v) => setData({ ...data, icp_company_size: v })}
            optional
          />
          <Field
            label="Problema principale che risolvi"
            hint='Es: "Non riescono a convertire i lead in call" o "Non hanno un sistema per trovare clienti"'
            value={data.icp_main_problem}
            onChange={(v) => setData({ ...data, icp_main_problem: v })}
          />
          <Field
            label="Obiezioni principali (separate da virgola, max 3)"
            hint='Es: "Non ho tempo, È troppo caro, Ci penso"'
            value={data.icp_top_objections.join(", ")}
            onChange={(v) => setData({ ...data, icp_top_objections: v.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 3) })}
            optional
          />
        </StepSection>
      )}

      {step === 3 && (
        <StepSection
          step={3}
          title="Perché dovrebbero fidarsi di te?"
          why="Le prove sociali rendono i tuoi messaggi molto più credibili. Anche una frase basta."
        >
          <Field
            label="Mini caso studio"
            hint='Es: "Ho aiutato X a passare da 0 a 3 call/settimana in 4 settimane"'
            value={data.proof_case_study}
            onChange={(v) => setData({ ...data, proof_case_study: v })}
            notSureLabel="Non ho ancora case study — salto per ora"
            optional
          />
          <Field
            label="Testimonianza o risultato"
            hint='Es: "Marco ci ha detto: in 30 giorni ho firmato 2 nuovi clienti"'
            value={data.proof_testimonial || ""}
            onChange={(v) => setData({ ...data, proof_testimonial: v })}
            optional
          />
          <Field
            label="Portfolio o link utili"
            hint="Link al sito, LinkedIn, portfolio..."
            value={data.proof_links || ""}
            onChange={(v) => setData({ ...data, proof_links: v })}
            optional
          />
        </StepSection>
      )}

      {step === 4 && (
        <StepSection
          step={4}
          title="Quanto tempo puoi dedicare?"
          why="Creiamo un piano realistico basato sul tuo tempo disponibile."
        >
          <FieldSelect
            label="Tempo disponibile a settimana"
            value={data.weekly_time_minutes}
            options={[
              { value: "15", label: "15 minuti" },
              { value: "30", label: "30 minuti" },
              { value: "60", label: "1 ora" },
              { value: "120", label: "2 ore o più" },
            ]}
            onChange={(v) => setData({ ...data, weekly_time_minutes: v as OnboardingInput["weekly_time_minutes"] })}
          />
          <FieldSelect
            label="Quanto ti senti sicuro nel pubblicare post? (1=poco, 5=molto)"
            value={data.comfort_post}
            options={[1,2,3,4,5].map((n) => ({ value: String(n), label: String(n) }))}
            onChange={(v) => setData({ ...data, comfort_post: v as OnboardingInput["comfort_post"] })}
          />
          <FieldSelect
            label="Sicurezza nel rispondere ai commenti?"
            value={data.comfort_comments}
            options={[1,2,3,4,5].map((n) => ({ value: String(n), label: String(n) }))}
            onChange={(v) => setData({ ...data, comfort_comments: v as OnboardingInput["comfort_comments"] })}
          />
          <FieldSelect
            label="Sicurezza nei messaggi privati?"
            value={data.comfort_dm}
            options={[1,2,3,4,5].map((n) => ({ value: String(n), label: String(n) }))}
            onChange={(v) => setData({ ...data, comfort_dm: v as OnboardingInput["comfort_dm"] })}
          />
          <FieldSelect
            label="Obiettivo principale"
            value={data.goal_primary}
            options={[
              { value: "prime conversazioni", label: "Iniziare le prime conversazioni" },
              { value: "più call", label: "Avere più call" },
              { value: "più clienti", label: "Chiudere più clienti" },
            ]}
            onChange={(v) => setData({ ...data, goal_primary: v as OnboardingInput["goal_primary"] })}
          />
        </StepSection>
      )}

      {error && (
        <div className="callout callout-danger text-sm">{error}</div>
      )}

      <div className="flex justify-between gap-3">
        <button
          className="btn-secondary px-4 py-2.5"
          disabled={step === 1 || loading}
          onClick={() => setStep((s) => s - 1)}
        >
          ← Indietro
        </button>
        {step < 4 ? (
          <button
            className="btn-primary px-6 py-2.5"
            disabled={loading}
            onClick={() => setStep((s) => s + 1)}
          >
            Avanti →
          </button>
        ) : (
          <button
            className="btn-primary px-6 py-2.5"
            disabled={loading}
            onClick={submit}
          >
            {loading ? "⏳ Generazione piano..." : "🚀 Genera il mio piano"}
          </button>
        )}
      </div>
    </div>
  );
}

function StepSection({ step, title, why, children }: { step: number; title: string; why: string; children: React.ReactNode }) {
  return (
    <div className="card-premium p-6 space-y-4">
      <div>
        <div className="badge badge-primary mb-2">Step {step} di 4</div>
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">💡 <em>{why}</em></p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label, value, onChange, hint, optional, notSureLabel,
}: {
  label: string; value: string; onChange: (v: string) => void;
  hint?: string; optional?: boolean; notSureLabel?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold">
        {label}
        {optional && <span className="ml-1 font-normal text-[var(--color-muted)]">(opzionale)</span>}
      </span>
      {hint && <span className="block text-xs text-[var(--color-muted)] mb-1">{hint}</span>}
      <input className="input w-full" value={value} onChange={(e) => onChange(e.target.value)} />
      {notSureLabel && (
        <button
          type="button"
          className="mt-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] underline underline-offset-2"
          onClick={() => onChange(notSureLabel)}
        >
          💬 {notSureLabel}
        </button>
      )}
    </label>
  );
}

function FieldSelect({
  label, value, onChange, options,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold">{label}</span>
      <select className="input w-full" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

