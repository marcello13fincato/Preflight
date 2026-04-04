"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError("Errore durante l'accesso con Google. Riprova.");
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          if (error.message.includes("already registered")) {
            setError("Questa email è già registrata. Prova ad accedere.");
          } else {
            setError(error.message);
          }
          return;
        }
        setError(null);
        alert("Controlla la tua email per confermare la registrazione.");
        return;
      }

      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email o password non corretti.");
        } else {
          setError(error.message);
        }
        return;
      }
      router.push("/app");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <img
            src="/LOGO PREFLIGHT_Pittogramma.png"
            alt="Preflight"
            style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '2rem' }}
          />
          <h2 className="login-left-title">Il sistema che ti dice cosa fare ogni giorno su LinkedIn.</h2>
          <p className="login-left-subtitle">Trova clienti, analizza profili, scrivi con contesto. Tutto guidato dall&apos;AI.</p>
          <div className="login-left-points">
            <div className="login-left-point"><span>🎯</span> Chi contattare e perché</div>
            <div className="login-left-point"><span>✍️</span> Messaggi e post guidati</div>
            <div className="login-left-point"><span>🧭</span> Ogni conversazione ha un prossimo passo</div>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/LOGO PREFLIGHT_Pittogramma.png"
            alt="Preflight"
            style={{ height: 56, width: 'auto' }}
          />
        </div>
        <h1 className="login-card-title">
          {mode === "login" ? "Accedi a Preflight" : "Crea il tuo account"}
        </h1>
        <p className="login-card-subtitle">
          {mode === "login"
            ? "Bentornato! Accedi per continuare."
            : "Registrati per iniziare."}
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="login-google-btn"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continua con Google
        </button>

        {/* Separator */}
        <div className="login-separator">
          <div className="login-separator-line" />
          <span className="login-separator-text">oppure</span>
          <div className="login-separator-line" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="login-form">
          <div>
            <label className="login-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="tuo@email.com"
              required
            />
          </div>
          <div>
            <label className="login-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="login-error">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading
              ? "Caricamento..."
              : mode === "login"
                ? "Accedi"
                : "Registrati"}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer-text">
          Il tuo assistente LinkedIn per trovare clienti.
        </p>

        {/* Toggle mode */}
        <p className="login-toggle-text">
          {mode === "login" ? (
            <>
              Non hai un account?{" "}
              <button
                onClick={() => { setMode("signup"); setError(null); }}
                className="login-toggle-btn"
              >
                Registrati
              </button>
            </>
          ) : (
            <>
              Hai già un account?{" "}
              <button
                onClick={() => { setMode("login"); setError(null); }}
                className="login-toggle-btn"
              >
                Accedi
              </button>
            </>
          )}
        </p>
        </div>
      </div>
    </div>
  );
}
