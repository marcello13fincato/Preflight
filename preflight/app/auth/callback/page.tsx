"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Supabase handles the token exchange automatically via the URL hash.
    // We just need to wait for the session to be established.
    supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_IN") {
        router.replace("/app/oggi");
      }
    });

    // Fallback redirect after a short delay
    const timeout = setTimeout(() => {
      router.replace("/app/oggi");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-screen bg-app text-app flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Accesso in corso...</p>
      </div>
    </main>
  );
}

