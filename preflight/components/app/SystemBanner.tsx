"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export function computeSystemProgress(onboarding: Record<string, unknown> | null): number {
  if (!onboarding) return 0;
  let filled = 0;
  const fields = ["servizio", "cliente_ideale", "problema_cliente", "risultato_cliente", "tempo_settimanale"];
  for (const f of fields) {
    if (onboarding[f] && onboarding[f] !== "") filled++;
  }
  const links = onboarding.linkedin_search_links;
  if (Array.isArray(links) && links.length > 0 && links[0]) filled++;
  return Math.round((filled / 6) * 100);
}

export default function SystemBanner() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  if (profile.onboarding_complete) return null;

  const pct = computeSystemProgress(profile.onboarding as Record<string, unknown> | null);

  return (
    <div className="sys-banner">
      <div className="sys-banner-content">
        <div className="sys-banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div>
          <p className="sys-banner-title">Il tuo sistema non è ancora configurato.</p>
          <p className="sys-banner-text">
            Preflight funziona molto meglio quando conosce il tuo lavoro.
            Completa l&apos;impostazione del sistema per ricevere suggerimenti più precisi.
          </p>
        </div>
      </div>
      <Link href="/app/onboarding" className="sys-banner-cta">
        Configura il tuo sistema
        <span>→</span>
      </Link>
      {pct > 0 && (
        <div className="sys-banner-progress">
          <div className="sys-banner-progress-bar" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
