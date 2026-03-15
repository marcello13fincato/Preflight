"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import InsightCard, { ResultHeader, SectionDivider } from "@/components/app/InsightCard";
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
          Allenati a gestire conversazioni commerciali su LinkedIn prima di rispondere dal vivo.
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
        {output ? (
        <details className="tool-input-collapsed">
          <summary>✏️ Modifica parametri</summary>
          <div className="tool-input-body space-y-4">
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
        </details>
        ) : (
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
        )}

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="insight-result">
              <ResultHeader title="Feedback coach" />

              <InsightCard icon="💬" label="Risposta del prospect" text={output.prospect_reply} variant="summary" />

              <SectionDivider label="Valutazione" />

              <InsightCard icon="📋" label="Feedback" text={output.feedback.join("\n")} variant="evidence" />

              {output.message_risk_warning && output.message_risk_warning !== "nessuno" && (
                <div className="insight-warn-inline">
                  <span>⚠️</span>
                  <span><strong>Valutazione messaggio:</strong> {output.message_risk_warning}</span>
                </div>
              )}

              <div className="insight-next-action">
                <span className="insight-next-action-icon">➡️</span>
                <div><strong>Prossima azione:</strong> {output.next_action}</div>
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
