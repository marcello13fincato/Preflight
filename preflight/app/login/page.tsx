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
    <main className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background-alt p-7 shadow-premium">
        <a href="/" className="text-text-secondary text-sm hover:text-text-primary transition-colors duration-200 ease">← Home</a>
        <h1 className="text-2xl font-bold mt-4">Accedi</h1>
        <p className="text-text-secondary mt-2">
          Inserisci email. Ricevi un magic link (senza password).
        </p>

        <label className="block mt-6 text-sm text-text-secondary">Email</label>
        <input
          className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-text-primary placeholder:text-text-secondary outline-none"
          placeholder="tuo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendMagicLink}
          className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-text-primary transition duration-200 ease hover:bg-primary-hover"
        >
          Invia link
        </button>

        {msg && <div className="mt-4 text-sm text-text-secondary">{msg}</div>}

        <div className="mt-6 text-xs text-text-secondary">
          Nota: per farlo funzionare serve Supabase Auth (lo configuriamo tra poco).
        </div>
      </div>
    </main>
  );
}