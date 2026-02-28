"use client";

import { useState } from "react";

export default function AuditPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    console.log("CLICK Analizza post");

    const trimmed = text.trim();
    if (!trimmed) {
      setResult("⚠️ Incolla un testo prima di analizzare.");
      return;
    }

    setLoading(true);
    setResult("");

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
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-white/5 p-7 shadow-2xl">
        <a href="/" className="text-slate-300 text-sm hover:text-white">
          ← Home
        </a>

        <h1 className="text-2xl font-bold mt-4">Audit LinkedIn Post</h1>
        <p className="text-slate-300 mt-2 text-sm">
          Incolla un post. Premi “Analizza post”. Ricevi un audit e suggerimenti
          pratici.
        </p>

        <textarea
          className="mt-5 w-full min-h-[170px] rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/50"
          placeholder="Incolla qui il post LinkedIn…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={analyze}
            disabled={loading}
            className="w-full rounded-2xl bg-[#0A66C2] py-3 font-semibold hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Analisi in corso…" : "Analizza post"}
          </button>

          <button
            onClick={() => {
              setText("");
              setResult("");
            }}
            disabled={loading}
            className="rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Pulisci
          </button>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">Risultato</div>
              <button
                onClick={copyResult}
                className="text-xs rounded-xl border border-slate-700 px-3 py-1.5 text-slate-200 hover:bg-white/5"
              >
                Copia
              </button>
            </div>

            <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-100 leading-relaxed">
              {result}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}