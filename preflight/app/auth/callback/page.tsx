"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AuthCallback() {
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    (async () => {
      // Se c'è una sessione, bene. Se no, aspettiamo comunque un attimo.
      await supabase.auth.getSession();

      // Piccola attesa per evitare race condition
      await new Promise((r) => setTimeout(r, 400));

      // Vai in dashboard
      window.location.replace("/dashboard");
    })();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="text-slate-300 text-sm">Accesso in corso…</div>
    </main>
  );
}