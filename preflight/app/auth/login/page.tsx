"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [hasEmailProvider] = useState(() => Boolean(process.env.NEXT_PUBLIC_EMAIL_ENABLED));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (res && 'error' in res && res.error) {
      setError(res.error || "Credenziali non valide");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Accedi a Preflight</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full input"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full input"
              required
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div>
            <button type="submit" className="btn-primary w-full">Accedi</button>
          </div>
        </form>
            {hasEmailProvider && (
              <div className="mt-6">
                <hr className="my-4" />
                <h3 className="text-sm font-medium mb-2">Accedi con email (magic link)</h3>
                <div className="flex gap-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tuo@email.com"
                    className="input flex-1"
                  />
                  <button
                    onClick={() => signIn("email", { email, redirect: false })}
                    className="btn-primary"
                  >
                    Invia link
                  </button>
                </div>
                <p className="text-xs text-muted mt-2">Riceverai un link via email per accedere.</p>
              </div>
            )}
      </div>
    </div>
  );
}
