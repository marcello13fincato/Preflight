"use client";

import { useEffect, useState } from "react";

export default function AuditPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // numero di audit gratuiti già utilizzati (persistito in localStorage)
  const [used, setUsed] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const val = Number(localStorage.getItem("audit_used") || 0);
    setUsed(val);
  }, []);


  const analyze = async () => {
    console.log("CLICK Analizza post");

    const trimmed = text.trim();
    if (!trimmed) {
      setResult("⚠️ Incolla un testo prima di analizzare.");
      return;
    }

    setLoading(true);
    setResult("");
    // leggere sempre da storage per evitare valori obsoleti
    const currentUsed = Number(localStorage.getItem("audit_used") || 0);
    console.log("audit count before analyze", currentUsed);
    if (currentUsed >= 3) {
      setLoading(false);
      setResult("🔒 Hai finito i 3 audit gratuiti. Iscriviti per audit illimitati e Assistente alla vendita su Linkedin.");
      return;
    }
    
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Errore API (${res.status})`;
        setResult(`❌ ${msg}`);
        return;
      }

      // Atteso: { result: "..." }
      const out = data?.result ?? "";
      if (!out) {
        setResult("⚠️ Risposta vuota dall’AI. Riprova.");
        return;
      }

      setResult(out);
      // Aggiorna il contatore degli audit usati (chiave stringa corretta)
      const next = currentUsed + 1;
      localStorage.setItem("audit_used", String(next));
      setUsed(next);
    } catch (err: any) {
      setResult(`❌ Errore di rete: ${err?.message || "sconosciuto"}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      // ignora
    }
  };

  return (
    <main className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-background-alt p-8 shadow-premium transition-shadow duration-200 ease">
        <a href="/" className="text-text-secondary text-sm hover:text-text-primary transition-colors duration-200 ease">
          ← Home
        </a>

        <h1 className="text-3xl font-bold mt-4">Audit LinkedIn Post</h1>
        <p className="text-text-secondary mt-2 text-base">
          Incolla un post. Premi “Analizza post”. Ricevi un audit e suggerimenti
          pratici.
        </p>
        <p className="text-text-primary mt-1 text-sm font-medium bg-primary inline-block px-2 rounded">
          Audit gratuiti usati: {used} / 3
        </p>


        <textarea
          className="mt-6 w-full min-h-[180px] rounded-2xl border border-border bg-background p-4 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Incolla qui il post LinkedIn…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={analyze}
            disabled={loading}
            className="w-full rounded-2xl bg-primary py-4 font-semibold text-text-primary transition duration-200 ease hover:bg-primary-hover hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Analisi in corso…" : "Analizza post"}
          </button>

          <button
            onClick={() => {
              setText("");
              setResult("");
            }}
            disabled={loading}
            className="rounded-2xl border border-border px-4 py-3 text-sm text-text-primary hover:bg-background-alt transition duration-200 ease disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Pulisci
          </button>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-white">Risultato</div>
              <button
                onClick={copyResult}
                className="text-xs rounded-xl border border-slate-500 px-3 py-1.5 text-white hover:bg-slate-600"
              >
                Copia
              </button>
            </div>

            <pre className="mt-3 whitespace-pre-wrap text-base text-text-primary leading-relaxed font-sans">
              {result}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}