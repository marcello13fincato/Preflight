"use client";

import { useState } from "react";
import { mockAudit, AuditResult } from "../../../lib/mock/audit";
import Card from "../../../components/shared/Card";
import Link from "next/link";
import GaugeScore from "../../../components/audit/GaugeScore";
import ScoreBars from "../../../components/audit/ScoreBars";
import MetricCard from "../../../components/audit/MetricCard";
import PriorityFixCard from "../../../components/audit/PriorityFixCard";
import RewriteCard from "../../../components/audit/RewriteCard";
import VariantsList from "../../../components/audit/VariantsList";
import { IconCheck } from "../../../components/shared/icons";

export default function AuditPage() {
  const [text, setText] = useState("");
  const [used, setUsed] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("audit_used") || 0);
  });
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [objective, setObjective] = useState("Generare conversazioni");
  const [tone, setTone] = useState("Diretto");
  const [selectedRewriteIdx, setSelectedRewriteIdx] = useState(0);


  const analyze = async () => {
    if (!text.trim()) return;
    const currentUsed = Number(localStorage.getItem("audit_used") || 0);
    if (currentUsed >= 3) {
      setResult(null);
      setStep("result");
      return;
    }
    setStep("analyzing");
    // simulate delay
    setTimeout(() => {
      setResult(mockAudit);
      const next = currentUsed + 1;
      localStorage.setItem("audit_used", String(next));
      setUsed(next);
      setStep("result");
    }, 1200);
  };

  const reset = () => {
    setText("");
    setResult(null);
    setStep("input");
    setSelectedRewriteIdx(0);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-main">
      <div className="w-full max-w-4xl">
        <Link href="/" className="text-muted text-sm hover:text-main">
          ← Torna alla home
        </Link>

        {step === "input" && (
          <Card className="mt-4">
            <h1 className="text-2xl font-bold">Incolla il tuo post LinkedIn</h1>
            <p className="text-muted mt-1 text-sm">
              Ti restituiamo punteggi, grafici e una riscrittura completa. Nessun login.
            </p>
            <label className="block mt-4 text-sm font-medium">
              Testo del post
              <textarea
                className="mt-1 w-full min-h-[160px] rounded-lg border border-border-color bg-main p-4 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                Obiettivo
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="mt-1 w-full rounded border border-border-color bg-main p-2"
                >
                  <option>Generare conversazioni</option>
                  <option>Ottenere clienti</option>
                  <option>Crescere autorevolezza</option>
                </select>
              </label>

              <label className="text-sm">
                Tono
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="mt-1 w-full rounded border border-border-color bg-main p-2"
                >
                  <option>Diretto</option>
                  <option>Narrativo</option>
                  <option>Tecnico</option>
                  <option>Provocatorio</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={analyze}
                disabled={!text.trim()}
                className="flex-1 rounded-full bg-primary py-3 font-semibold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                Analizza post
              </button>
              <button
                onClick={reset}
                className="rounded-full border border-border-color px-4 py-3 text-sm text-main hover:bg-surface transition"
              >
                Pulisci
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">
              Audit gratuiti usati: {used} / 3
            </p>
          </Card>
        )}

        {step === "analyzing" && (
          <Card className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Analizzo il tuo post…</h2>
            <ul className="space-y-2 text-muted">
              <li className="flex items-start gap-2">
                <span className="bg-soft rounded-full p-1">
                  <IconCheck className="w-4 h-4 text-primary" />
                </span>
                Valuto Hook e attenzione iniziale
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-soft rounded-full p-1">
                  <IconCheck className="w-4 h-4 text-primary" />
                </span>
                Misuro chiarezza e scannabilità
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-soft rounded-full p-1">
                  <IconCheck className="w-4 h-4 text-primary" />
                </span>
                Controllo credibilità e prove
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-soft rounded-full p-1">
                  <IconCheck className="w-4 h-4 text-primary" />
                </span>
                Verifico CTA e conversione
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-soft rounded-full p-1">
                  <IconCheck className="w-4 h-4 text-primary" />
                </span>
                Genero riscrittura completa + varianti
              </li>
            </ul>
          </Card>
        )}

        {step === "result" && (
          <div className="mt-8 space-y-6">
            {result ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                    {objective}
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-accent/20 text-accent rounded-full">
                    {tone}
                  </span>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* left column */}
                <div className="space-y-6">
                  <Card>
                    <GaugeScore score={result.overallScore} />
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-2">Breakdown</h3>
                    <ScoreBars breakdown={result.breakdown} />
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-2">Metriche</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        label="Scannabilità"
                        value={result.metrics.scannabilita}
                      />
                      <MetricCard
                        label="Lunghezza"
                        value={result.metrics.lunghezza}
                      />
                      <MetricCard
                        label="Densità io/tu"
                        value={`${result.metrics.densitaIo}% / ${result.metrics.densitaTu}%`}
                      />
                      <MetricCard
                        label="Forza CTA"
                        value={result.metrics.forzaCTA}
                      />
                    </div>
                  </Card>
                </div>

                {/* right column */}
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-semibold mb-2">Top 3 interventi prioritari</h3>
                    <div className="space-y-3">
                      {result.topFixes.map((f, idx) => (
                        <PriorityFixCard
                          key={idx}
                          problem={f.problem}
                          impact={f.impact}
                          fix={f.fix}
                        />
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-2">
                      Riscrittura completa (pronta da pubblicare)
                    </h3>
                    <div className="flex gap-2 mb-3">
                      {result.rewriteVariants.map((v, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedRewriteIdx(idx)}
                          className={`px-3 py-1 text-xs rounded-full border ${
                            selectedRewriteIdx === idx
                              ? "bg-primary text-main"
                              : "border-border-color"
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                    <RewriteCard
                      text={
                        (() => {
                          let t = result.rewriteVariants[selectedRewriteIdx].text;
                          if (objective === "Ottenere clienti") {
                            t += "\n\n[Obiettivo: clienti]";
                          } else if (objective === "Crescere autorevolezza") {
                            t += "\n\n[Obiettivo: autorevolezza]";
                          }
                          if (tone === "Narrativo") {
                            t = "📝 " + t;
                          } else if (tone === "Tecnico") {
                            t = "🔧 " + t;
                          } else if (tone === "Provocatorio") {
                            t = "⚡ " + t;
                          }
                          return t;
                        })()
                      }
                      className={
                        tone === "Provocatorio" ? "border-accent" : ""
                      }
                    />
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-2">Varianti di Hook (scegli la tua)</h3>
                    <VariantsList
                      items={result.hookVariants.map((h, i) => ({
                        label: `#${i + 1}`,
                        text: h,
                      }))}
                    />
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-2">CTA consigliate (per aumentare risposte)</h3>
                    <VariantsList
                      items={result.ctaSuggestions.map((c, i) => ({
                        label: `#${i + 1}`,
                        text: c,
                      }))}
                    />
                  </Card>

                  <Card>
                    <h3 className="font-semibold mb-2">Prossima mossa (per vendere di più)</h3>
                    <ul className="list-disc list-inside text-muted space-y-1">
                      {result.nextMoves.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
            ) : (
              <Card>
                <p className="text-muted">
                  Hai usato tutti e 3 gli audit gratuiti. <br />
                  <a href="/pricing" className="text-primary underline">
                    Passa a Pro per continuare
                  </a>
                </p>
              </Card>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-full border border-border-color py-3 text-main hover:bg-surface transition"
              >
                Nuovo audit
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

