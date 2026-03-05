"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="rounded-lg border border-app p-4 text-sm">
        <div><strong>Utente:</strong> {userId}</div>
        <div><strong>Onboarding completato:</strong> {profile.onboarding_complete ? "Si" : "No"}</div>
      </div>
      <div className="rounded-lg border border-app p-4 text-sm">
        <h3 className="font-semibold">Account/Billing (MVP)</h3>
        <p className="text-muted">Gestione account e fatturazione semplificata. Collegamento provider pagamenti in step successivo.</p>
      </div>
    </div>
  );
}
