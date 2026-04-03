"use client";

import { useMemo, useState } from "react";
import { useSession } from "@/lib/hooks/useSession";
import InsightCard, { ResultHeader, SectionDivider } from "@/components/app/InsightCard";
import { IconClipboard, IconTarget, IconEdit3, IconAlertTriangle, IconLogoPreflight } from "@/components/shared/icons";
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
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-success,#22c55e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><polyline points="20 6 9 17 4 12"/></svg>Cosa fai:</span> ti alleni a gestire conversazioni commerciali</div>
          <div><span className="font-semibold"><IconClipboard size={13} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Cosa inserire:</span> tipo prospect, scenario e la tua risposta</div>
          <div><span className="font-semibold"><IconTarget size={13} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Cosa ottieni:</span> risposta del prospect, feedback e prossima mossa</div>
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg>Prossima mossa:</span> applica i feedback nelle conversazioni reali</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="tool-page-grid">
        {/* INPUT */}
        {output ? (
        <details className="tool-input-collapsed">
          <summary><IconEdit3 size={14} /> Modifica parametri</summary>
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
              <p className="font-semibold mb-1"><IconAlertTriangle size={14} /> Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div className="insight-result">
              <ResultHeader title="Feedback coach" />

              <InsightCard icon={<IconLogoPreflight size={16} />} label="Risposta del prospect" text={output.prospect_reply} variant="summary" />

              <SectionDivider label="Valutazione" />

              <InsightCard icon={<IconClipboard size={16} />} label="Feedback" text={output.feedback.join("\n")} variant="evidence" />

              {output.message_risk_warning && output.message_risk_warning !== "nessuno" && (
                <div className="insight-warn-inline">
                  <span><IconAlertTriangle size={14} /></span>
                  <span><strong>Valutazione messaggio:</strong> {output.message_risk_warning}</span>
                </div>
              )}

              <div className="insight-next-action">
                <span className="insight-next-action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
                <div><strong>Prossima azione:</strong> {output.next_action}</div>
              </div>
            </div>
          ) : (
            <div className="tool-page-empty">
              <p className="tool-page-empty-icon"><IconLogoPreflight size={28} /></p>
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
