"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function sendMagicLink() {
    setMsg(null);
    const r = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setMsg(j?.error ?? "Errore");
    setMsg("Controlla la mail: ti abbiamo inviato il link di accesso.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white/5 p-7">
        <a href="/" className="text-slate-300 text-sm">← Home</a>
        <h1 className="text-2xl font-bold mt-4">Accedi</h1>
        <p className="text-slate-300 mt-2">
          Inserisci email. Ricevi un magic link (senza password).
        </p>

        <label className="block mt-6 text-sm text-slate-300">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/40 p-3 outline-none"
          placeholder="tuo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendMagicLink}
          className="mt-4 w-full rounded-xl bg-[#0A66C2] py-3 font-semibold hover:brightness-110"
        >
          Invia link
        </button>

        {msg && <div className="mt-4 text-sm text-slate-200">{msg}</div>}

        <div className="mt-6 text-xs text-slate-400">
 <div className="mt-6 text-xs text-slate-400">
  Nota: per farlo funzionare serve Supabase Auth (lo configuriamo tra poco).
</div>
        </div>
      </div>
    </main>
  );
}