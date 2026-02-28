"use client";
import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    // Supabase gestirà la sessione; qui reindirizziamo.
    window.location.href = "/dashboard";
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="text-text-secondary">Accesso in corso…</div>
    </main>
  );
}