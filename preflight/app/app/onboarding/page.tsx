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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Imposta il tuo sistema clienti</h2>
      <p className="text-sm text-muted">Rispondi a poche domande. Creeremo il tuo piano commerciale LinkedIn.</p>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: configura il tuo sistema commerciale.</p>
        <p><strong>Cosa inserire</strong>: offerta, cliente ideale, prove e tempo disponibile.</p>
        <p><strong>Cosa ottieni</strong>: un piano pratico per passare da conversazione a call.</p>
      </div>
      <p className="text-sm text-muted">Step {step}/4</p>

      {step === 1 && (
        <Section title="Step 1 - Cosa vendi?">
          <Input label="Servizio principale" placeholder="Aiuto aziende SaaS ad aumentare le conversioni." value={data.offer_one_liner} onChange={(v) => setData({ ...data, offer_one_liner: v })} />
          <Input label="Prezzo medio" placeholder="500-1500EUR" value={data.offer_price_range} onChange={(v) => setData({ ...data, offer_price_range: v })} />
          <Select label="Durata progetto" value={data.offer_delivery_time} options={["1w", "2w", "1m", "3m"]} onChange={(v) => setData({ ...data, offer_delivery_time: v as OnboardingInput["offer_delivery_time"] })} />
          <Input label="Risultato che ottiene il cliente" value={data.offer_outcome} onChange={(v) => setData({ ...data, offer_outcome: v })} />
        </Section>
      )}

      {step === 2 && (
        <Section title="Step 2 - Chi è il cliente ideale?">
          <Input label="Ruolo" value={data.icp_role} onChange={(v) => setData({ ...data, icp_role: v })} />
          <Input label="Settore" value={data.icp_industry} onChange={(v) => setData({ ...data, icp_industry: v })} />
          <Input label="Dimensione azienda" value={data.icp_company_size} onChange={(v) => setData({ ...data, icp_company_size: v })} />
          <Input label="Problema principale" value={data.icp_main_problem} onChange={(v) => setData({ ...data, icp_main_problem: v })} />
          <Input
            label="Obiezioni principali (separate da virgola, max 3)"
            value={data.icp_top_objections.join(", ")}
            onChange={(v) => setData({ ...data, icp_top_objections: v.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 3) })}
          />
        </Section>
      )}

      {step === 3 && (
        <Section title="Step 3 - Perché dovrebbero fidarsi?">
          <Input label="Mini caso studio" value={data.proof_case_study} onChange={(v) => setData({ ...data, proof_case_study: v })} />
          <Input label="Testimonianza" value={data.proof_testimonial || ""} onChange={(v) => setData({ ...data, proof_testimonial: v })} />
          <Input label="Portfolio" value={data.proof_links || ""} onChange={(v) => setData({ ...data, proof_links: v })} />
        </Section>
      )}

      {step === 4 && (
        <Section title="Step 4 - Quanto tempo puoi dedicare?">
          <Select label="Tempo settimanale" value={data.weekly_time_minutes} options={["15 min", "30 min", "1h", "2h"]} valueMap={{ "15 min": "15", "30 min": "30", "1h": "60", "2h": "120" }} onChange={(v) => setData({ ...data, weekly_time_minutes: v as OnboardingInput["weekly_time_minutes"] })} />
          <Select label="Quanto ti senti sicuro nel pubblicare? (1-5)" value={data.comfort_post} options={["1", "2", "3", "4", "5"]} onChange={(v) => setData({ ...data, comfort_post: v as OnboardingInput["comfort_post"] })} />
          <Select label="Quanto ti senti sicuro nel rispondere ai commenti? (1-5)" value={data.comfort_comments} options={["1", "2", "3", "4", "5"]} onChange={(v) => setData({ ...data, comfort_comments: v as OnboardingInput["comfort_comments"] })} />
          <Select label="Quanto ti senti sicuro nei messaggi privati? (1-5)" value={data.comfort_dm} options={["1", "2", "3", "4", "5"]} onChange={(v) => setData({ ...data, comfort_dm: v as OnboardingInput["comfort_dm"] })} />
          <Select
            label="Goal"
            value={data.goal_primary}
            options={["Prime conversazioni", "Più call", "Più clienti"]}
            valueMap={{ "Prime conversazioni": "prime conversazioni", "Più call": "più call", "Più clienti": "più clienti" }}
            onChange={(v) => setData({ ...data, goal_primary: v as OnboardingInput["goal_primary"] })}
          />
        </Section>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button className="btn-secondary px-4 py-2" disabled={step === 1 || loading} onClick={() => setStep((s) => s - 1)}>Indietro</button>
        {step < 4 ? (
          <button className="btn-primary px-4 py-2" disabled={loading} onClick={() => setStep((s) => s + 1)}>Avanti</button>
        ) : (
          <button className="btn-primary px-4 py-2" disabled={loading} onClick={submit}>{loading ? "Generazione..." : "Genera piano"}</button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-app p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <input className="input w-full" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Select({ label, value, onChange, options, valueMap }: { label: string; value: string; onChange: (v: string) => void; options: string[]; valueMap?: Record<string, string> }) {
  const selectedLabel = valueMap ? Object.keys(valueMap).find((key) => valueMap[key] === value) || options[0] : value;
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted">{label}</span>
      <select className="input w-full" value={selectedLabel} onChange={(e) => onChange(valueMap ? valueMap[e.target.value] : e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
