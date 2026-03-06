"use client";

import { useState } from "react";
import CopyButton from "@/components/shared/CopyButton";
import type { SimulatorJson } from "@/lib/sales/schemas";
import { simulatorSchema } from "@/lib/sales/schemas";

export default function SimulatorPage() {
  const [prospectType, setProspectType] = useState<"Founder" | "HR" | "CEO" | "Marketing">("Founder");
  const [scenario, setScenario] = useState<"First connection reply" | "Interested prospect" | "Skeptical prospect" | "No response" | "Objection">("First connection reply");
  const [userAnswer, setUserAnswer] = useState("");
  const [output, setOutput] = useState<SimulatorJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function simulate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_type: prospectType, scenario, user_answer: userAnswer }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = simulatorSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Conversation Simulator</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: ti allena a gestire conversazioni commerciali LinkedIn.</p>
        <p><strong>Cosa inserire</strong>: tipo prospect, scenario e la tua risposta.</p>
        <p><strong>Cosa ottieni</strong>: risposta del prospect, feedback e prossima mossa.</p>
      </div>

      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Prospect type</span>
          <select className="input w-full" value={prospectType} onChange={(e) => setProspectType(e.target.value as typeof prospectType)}>
            <option>Founder</option>
            <option>HR</option>
            <option>CEO</option>
            <option>Marketing</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Scenario</span>
          <select className="input w-full" value={scenario} onChange={(e) => setScenario(e.target.value as typeof scenario)}>
            <option>First connection reply</option>
            <option>Interested prospect</option>
            <option>Skeptical prospect</option>
            <option>No response</option>
            <option>Objection</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">La tua risposta</span>
          <textarea rows={5} className="input w-full" placeholder="Grazie per la risposta. Posso chiederti qual e oggi il blocco principale nel trovare nuovi clienti su LinkedIn?" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
        </label>
        <button onClick={simulate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Simulazione..." : "Simula"}</button>
      </div>

      {error && (
        <div className="callout-danger rounded-xl p-5">
          <p className="font-semibold mb-1">⚠️ Errore AI</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {output && (
        <section className="rounded-lg border border-app p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Feedback coach</h3>
            <CopyButton text={JSON.stringify(output, null, 2)} />
          </div>
          <ResultCard title="Risposta del prospect" text={output.prospect_reply} />
          <ResultCard title="Feedback" text={output.feedback.join("\n")} />
          <div className="rounded border border-app p-3 text-sm"><strong>Valutazione messaggio:</strong> {output.message_risk_warning}</div>
          <div className="rounded border border-app bg-soft p-3 text-sm"><strong>Next action:</strong> {output.next_action}</div>
        </section>
      )}
    </div>
  );
}

function ResultCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded border border-app p-3 text-sm">
      <div className="font-semibold">{title}</div>
      <p className="mt-1 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
