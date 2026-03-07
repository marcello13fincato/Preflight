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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Impostazioni</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Gestisci il tuo account e le preferenze del sistema.
        </p>
      </div>

      {/* Account info */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
          Account
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div
            className="rounded-lg p-3 text-sm"
            style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
          >
            <span className="font-medium">👤 Utente:</span>{" "}
            <span style={{ color: "var(--color-muted)" }}>{userId}</span>
          </div>
          <div
            className="rounded-lg p-3 text-sm flex items-center gap-2"
            style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
          >
            <span className="font-medium">✅ Onboarding:</span>{" "}
            <span className={`badge ${profile.onboarding_complete ? "badge-green" : "badge-amber"}`}>
              {profile.onboarding_complete ? "Completato" : "Da completare"}
            </span>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div
        className="rounded-xl p-5 space-y-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
          Abbonamento e fatturazione
        </h3>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Gestione account e fatturazione semplificata. Il collegamento al provider di pagamento sarà disponibile nel prossimo aggiornamento.
        </p>
      </div>
    </div>
  );
}
