"use client";

import { useEffect, useState } from "react";
import { mockAudit, AuditResult } from "../../../lib/mock/audit";
import Card from "../../../components/shared/Card";
import CopyButton from "../../../components/shared/CopyButton";
import Link from "next/link";

export default function AuditPage() {
  const [text, setText] = useState("");
  const [used, setUsed] = useState(0);
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");
  const [result, setResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUsed(Number(localStorage.getItem("audit_used") || 0));
  }, []);

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
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-3xl">
        <Link href="/" className="text-text-secondary text-sm hover:text-text-primary">
          ← Torna alla home
        </Link>

        {step === "input" && (
          <Card className="mt-4">
            <h1 className="text-2xl font-bold">Audit LinkedIn Post</h1>
            <textarea
              className="mt-4 w-full min-h-[160px] rounded-lg border border-border bg-background p-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Incolla qui il post..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={analyze}
                disabled={!text.trim()}
                className="flex-1 rounded-full bg-primary py-3 font-semibold text-text-primary hover:bg-primary-hover transition disabled:opacity-60"
              >
                Analizza post
              </button>
              <button
                onClick={reset}
                className="rounded-full border border-border px-4 py-3 text-sm text-text-primary hover:bg-background-alt transition"
              >
                Pulisci
              </button>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              Audit gratuiti usati: {used} / 3
            </p>
          </Card>
        )}

        {step === "analyzing" && (
          <div className="mt-8 text-center">
            <div className="animate-pulse text-primary text-xl font-semibold">Analisi in corso...</div>
          </div>
        )}

        {step === "result" && (
          <div className="mt-8 space-y-6">
            {result ? (
              <>
                <Card>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Punteggio complessivo</h2>
                    <div className="text-3xl font-bold">{result.overallScore}</div>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-2">Sezioni</h3>
                  <ul className="space-y-2">
                    {result.sections.map((s) => (
                      <li key={s.name} className="flex justify-between">
                        <span>{s.name}</span>
                        <span className="font-bold">{s.score}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-2">Top 3 correzioni</h3>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary">
                    {result.topFixes.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-2">Riscritture consigliate</h3>
                  <div className="space-y-4">
                    {result.rewrites.map((r) => (
                      <div key={r.title} className="space-y-1">
                        <div className="text-sm font-medium">{r.title}</div>
                        <div className="bg-background p-3 rounded">
                          <pre className="whitespace-pre-wrap text-text-primary">{r.after}</pre>
                        </div>
                        <CopyButton text={r.after} />
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <p className="text-text-secondary">
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
                className="flex-1 rounded-full border border-border py-3 text-text-primary hover:bg-background-alt transition"
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

