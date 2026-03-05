"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">⚙️ Impostazioni</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Gestisci il tuo account e il tuo piano.</p>
      </div>

      <div className="card-premium p-6 space-y-3">
        <h2 className="font-bold text-base">👤 Account</h2>
        <div className="text-sm space-y-1">
          <div className="flex gap-2">
            <span className="text-[var(--color-muted)] w-40">Utente:</span>
            <span className="font-medium">{userId}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--color-muted)] w-40">Setup completato:</span>
            <span className={`font-medium ${profile.onboarding_complete ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
              {profile.onboarding_complete ? "✅ Sì" : "❌ No"}
            </span>
          </div>
        </div>
        {!profile.onboarding_complete && (
          <Link href="/app/onboarding" className="btn-primary px-4 py-2 mt-2 inline-flex">
            ⚙️ Completa il setup
          </Link>
        )}
        {profile.onboarding_complete && (
          <Link href="/app/onboarding" className="btn-secondary px-4 py-2 mt-2 inline-flex">
            ✏️ Modifica impostazioni
          </Link>
        )}
      </div>

      <div className="card-premium p-6 space-y-3">
        <h2 className="font-bold text-base">💳 Piano & Fatturazione</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Gestione account e fatturazione disponibile a breve. Per supporto contattaci direttamente.
        </p>
      </div>
    </div>
  );
}

