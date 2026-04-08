"use client";

import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { useSession } from "@/lib/hooks/useSession";
import { getRepositoryBundle } from "@/lib/sales/repositories";

const BANNER_DISMISSED_KEY = "preflight-setup-banner-dismissed";

export function computeSystemProgress(onboarding: Record<string, unknown> | null): number {
  if (!onboarding) return 0;
  let filled = 0;
  const total = 8;
  const fields = ["servizio", "cliente_ideale", "problema_cliente", "risultato_cliente", "tempo_settimanale"];
  for (const f of fields) {
    if (onboarding[f] && onboarding[f] !== "") filled++;
  }
  const links = onboarding.linkedin_search_links;
  if (Array.isArray(links) && links.length > 0 && links[0]) filled++;
  const materiali = onboarding.materiali_nomi;
  if (Array.isArray(materiali) && materiali.length > 0) filled++;
  const social = onboarding.social_links;
  if (Array.isArray(social) && social.length > 0 && social[0]) filled++;
  return Math.round((filled / total) * 100);
}

type SetupState = "not-started" | "partial";

export default function SystemBanner() {
  const { data: session } = useSession();
  const userId = (session?.user?.id || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const pct = computeSystemProgress(profile.onboarding as Record<string, unknown> | null);

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(BANNER_DISMISSED_KEY) === "true";
  });

  const dismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  }, []);

  if (profile.onboarding_complete || pct >= 100 || dismissed) return null;

  const setupState: SetupState = pct > 0 ? "partial" : "not-started";

  return (
    <div className="setup-card fade-in" role="region" aria-label="Configurazione sistema commerciale">
      <div className="setup-card-inner fade-in-delay">

        <button
          type="button"
          onClick={dismiss}
          aria-label="Chiudi banner"
          className="setup-card-dismiss"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="setup-card-header">
          <span className="setup-card-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <div className="setup-card-header-text">
            <h3 className="setup-card-title">
              Prima di iniziare: definiamo il tuo contesto commerciale
            </h3>
            {setupState === "partial" && (
              <span className="setup-card-state setup-card-state-partial">
                Configurazione parziale — {pct}% completato
              </span>
            )}
            {setupState === "not-started" && (
              <span className="setup-card-state setup-card-state-empty">
                Non ancora configurato
              </span>
            )}
          </div>
        </div>

        <p className="setup-card-desc">
          Preflight fornisce suggerimenti più precisi quando conosce cosa vendi, chi cerchi
          e come stai usando LinkedIn in questo momento.
        </p>

        <ul className="setup-card-benefits" aria-label="Vantaggi della configurazione">
          <li className="setup-card-benefit">
            <span className="setup-ben-dot" aria-hidden="true" />
            Targeting clienti più preciso e contestualizzato
          </li>
          <li className="setup-card-benefit">
            <span className="setup-ben-dot" aria-hidden="true" />
            Piani giornalieri realistici per la tua situazione
          </li>
          <li className="setup-card-benefit">
            <span className="setup-ben-dot" aria-hidden="true" />
            Suggerimenti strategici rilevanti per il tuo mercato
          </li>
        </ul>

        <div className="setup-card-footer">
          {setupState === "partial" && (
            <div className="setup-card-progress-wrap" aria-label={`Progresso configurazione: ${pct}%`}>
              <div className="setup-card-progress-track">
                <div className="setup-card-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="setup-card-progress-label" aria-hidden="true">{pct}%</span>
            </div>
          )}
          <Link href="/app/onboarding" className="setup-card-cta">
            {setupState === "partial" ? "Continua la configurazione" : "Imposta ora il tuo sistema"}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
