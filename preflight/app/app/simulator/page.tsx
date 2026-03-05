"use client";

import { useState } from "react";
import CopyButton from "@/components/shared/CopyButton";
import PageGuide from "@/components/shared/PageGuide";
import { RiskWarning } from "@/components/shared/HeatLevel";
import { defaultSimulator } from "@/lib/sales/defaults";
import type { SimulatorJson } from "@/lib/sales/schemas";

const PROSPECT_TYPES = ["Founder", "HR", "CEO", "Marketing"] as const;
const SCENARIOS = [
  { value: "First connection reply", label: "Prima risposta alla connessione" },
  { value: "Interested prospect", label: "Prospect interessato" },
  { value: "Skeptical prospect", label: "Prospect scettico" },
  { value: "No response", label: "Nessuna risposta" },
  { value: "Objection", label: "Obiezione" },
] as const;

type ProspectType = typeof PROSPECT_TYPES[number];

type ScenarioValue = typeof SCENARIOS[number]["value"];

export default function SimulatorPage() {
  const [prospectType, setProspectType] = useState<ProspectType>("Founder");
  const [scenario, setScenario] = useState<ScenarioValue>("First connection reply");
  const [userAnswer, setUserAnswer] = useState("");
  const [output, setOutput] = useState<SimulatorJson | null>(null);
  const [loading, setLoading] = useState(false);

  async function simulate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_type: prospectType, scenario, user_answer: userAnswer }),
      });
      const json = await res.json();
      setOutput(json?.prospect_reply ? json : defaultSimulator);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">🎯 Allenati alle conversazioni</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Pratica con un coach AI che simula i tuoi potenziali clienti.</p>
      </div>

      <PageGuide
        what="alleni le tue abilità conversazionali LinkedIn con un prospect simulato dall'AI."
        paste="la tua risposta al prospect — scrivi come se fosse una vera conversazione."
        get="la risposta del prospect, feedback dettagliato su cosa migliorare e la prossima mossa."
        next="migliora la risposta in base al feedback e riprova — oppure vai ai moduli reali."
      />

      <div className="card-premium p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">Tipo di prospect</span>
            <div className="flex flex-wrap gap-2">
              {PROSPECT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setProspectType(type)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                    prospectType === type
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">Scenario</span>
            <select className="input w-full" value={scenario} onChange={(e) => setScenario(e.target.value as ScenarioValue)}>
              {SCENARIOS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">La tua risposta al prospect</span>
          <textarea
            rows={5}
            className="input w-full"
            placeholder="Es: Grazie per la risposta! Posso chiederti qual è oggi il blocco principale nel trovare nuovi clienti su LinkedIn?"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </label>

        <button onClick={simulate} disabled={loading || !userAnswer.trim()} className="btn-primary px-6 py-3">
          {loading ? "⏳ Simulazione in corso..." : "🎯 Simula conversazione"}
        </button>
      </div>

      {output && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold">💬 Feedback del coach</h2>

          {/* Chat-style output */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
                👤 Prospect ({prospectType}) risponde:
              </p>
              <div className="rounded-lg bg-[var(--color-soft-2)] border border-[var(--color-border)] px-4 py-3 text-sm">
                {output.prospect_reply}
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">
                🎓 Feedback del coach:
              </p>
              <ul className="space-y-2">
                {output.feedback.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 text-[var(--color-primary)] mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <RiskWarning message={output.message_risk_warning} />

          <div className="callout callout-success flex items-start gap-3">
            <span className="text-lg">➡️</span>
            <div><strong>Prossima mossa:</strong> {output.next_action}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setUserAnswer(""); setOutput(null); }}
              className="btn-primary px-4 py-2"
            >
              🔄 Riprova con una risposta migliore
            </button>
            <CopyButton text={`Risposta prospect: ${output.prospect_reply}\n\nFeedback: ${output.feedback.join(", ")}`} />
          </div>
        </section>
      )}
    </div>
  );
}

