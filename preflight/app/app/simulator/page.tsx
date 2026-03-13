"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { SimulatorJson } from "@/lib/sales/schemas";
import { simulatorSchema } from "@/lib/sales/schemas";

export default function SimulatorPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const [prospectType, setProspectType] = useState<"Founder" | "HR" | "CEO" | "Marketing">("Founder");
  const [scenario, setScenario] = useState<"Prima risposta dopo connessione" | "Prospect interessato" | "Prospect scettico" | "Nessuna risposta" | "Obiezione">("Prima risposta dopo connessione");
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
        body: JSON.stringify({ prospect_type: prospectType, scenario, user_answer: userAnswer, profile: profile.onboarding }),
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
    <div className="tool-page">
      <div className="tool-page-hero">
        <h2>Simulatore di conversazione</h2>
        <p>
          Allenati a gestire conversazioni commerciali LinkedIn con un coach AI.
        </p>
      </div>

      {/* Guide box */}
      <div className="tool-page-guide">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> ti alleni a gestire conversazioni commerciali</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> tipo prospect, scenario e la tua risposta</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> risposta del prospect, feedback e prossima mossa</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> applica i feedback nelle conversazioni reali</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="tool-page-grid">
        {/* INPUT */}
        <div className="tool-page-panel space-y-4">
          <h3 className="tool-page-panel-header">Input</h3>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Tipo di prospect</span>
            <select className="input w-full" value={prospectType} onChange={(e) => setProspectType(e.target.value as typeof prospectType)}>
              <option>Founder</option>
              <option>HR</option>
              <option>CEO</option>
              <option>Marketing</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Scenario</span>
            <select className="input w-full" value={scenario} onChange={(e) => setScenario(e.target.value as typeof scenario)}>
              <option>Prima risposta dopo connessione</option>
              <option>Prospect interessato</option>
              <option>Prospect scettico</option>
              <option>Nessuna risposta</option>
              <option>Obiezione</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">La tua risposta</span>
            <textarea rows={5} className="input w-full resize-none" placeholder="Grazie per la risposta. Posso chiederti qual è oggi il blocco principale nel trovare nuovi clienti su LinkedIn?" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
          </label>
          <button onClick={simulate} disabled={loading} className="btn-primary w-full">
            {loading ? "Simulazione in corso…" : "Simula conversazione →"}
          </button>
        </div>

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="tool-page-panel space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="tool-page-panel-header" style={{ margin: 0 }}>
                  Feedback coach
                </h3>
                <CopyButton text={JSON.stringify(output, null, 2)} />
              </div>

              <OutputCard title="💬 Risposta del prospect" text={output.prospect_reply} accent />
              <OutputCard title="📋 Feedback" text={output.feedback.join("\n")} />

              <div
                className={`rounded-lg p-3 text-sm ${
                  output.message_risk_warning && output.message_risk_warning !== "nessuno"
                    ? "callout-warning"
                    : ""
                }`}
                style={
                  !output.message_risk_warning || output.message_risk_warning === "nessuno"
                    ? { background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }
                    : {}
                }
              >
                <span className="font-medium">⚠️ Valutazione messaggio: </span>
                <span>{output.message_risk_warning || "nessuno"}</span>
              </div>

              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_action}
              </div>
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon">🎭</p>
              <p className="tool-page-empty-title">
                Il risultato apparirà qui
              </p>
              <p className="tool-page-empty-text">
                Scegli scenario e scrivi la tua risposta, poi clicca &quot;Simula conversazione&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OutputCard({ title, text, accent }: { title: string; text: string; accent?: boolean }) {
  return (
    <div
      className="rounded-lg p-4 text-sm"
      style={{
        background: accent ? "var(--color-soft)" : "var(--color-soft-2)",
        border: `1px solid ${accent ? "var(--color-primary)" : "var(--color-border)"}`,
      }}
    >
      <div className="font-semibold mb-1">{title}</div>
      <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}
