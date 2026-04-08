"use client";

import { useMemo } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { VisualProfileSetup } from "@/components/visual-profile";

export default function SettingsPage() {
  const { userId, status } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);

  if (status === "loading" || !userId) {
    return <div className="settings-page"><p>Caricamento...</p></div>;
  }

  const profile = repo.profile.getProfile(userId);

  return (
    <div className="settings-page">
      {/* Hero */}
      <div className="page-hero">
        <span className="page-hero-eyebrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Impostazioni
        </span>
        <h1 className="page-hero-title">Impostazioni</h1>
        <p className="page-hero-subtitle">
          Gestisci il tuo account e le preferenze del sistema.
        </p>
      </div>

      {/* Account info */}
      <div className="v3-card-flat settings-card">
        <h3 className="settings-card-label">Account</h3>
        <div className="settings-grid">
          <div className="settings-item">
            <div className="settings-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <span className="settings-item-label">Utente</span>
              <span className="settings-item-value">{userId}</span>
            </div>
          </div>
          <div className="settings-item">
            <div className="settings-item-icon">
              {profile.onboarding_complete ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              )}
            </div>
            <div>
              <span className="settings-item-label">Onboarding</span>
              <span className={`badge ${profile.onboarding_complete ? "badge-green" : "badge-amber"}`}>
                {profile.onboarding_complete ? "Completato" : "Da completare"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Profile */}
      <div className="v3-card-flat settings-card">
        <h3 className="settings-card-label">Profilo Visivo LinkedIn</h3>
        <p className="settings-card-text">
          Crea la tua identità visiva personalizzata. Queste impostazioni influenzano la generazione dei caroselli, i contenuti visivi e i layout dei post.
        </p>
        <div className="settings-section-gap">
          <VisualProfileSetup compact={true} />
        </div>
      </div>

      {/* Billing */}
      <div className="v3-card-flat settings-card">
        <h3 className="settings-card-label">Abbonamento e fatturazione</h3>
        <p className="settings-card-text">
          Gestione account e fatturazione semplificata. Il collegamento al provider di pagamento sarà disponibile nel prossimo aggiornamento.
        </p>
      </div>
    </div>
  );
}
