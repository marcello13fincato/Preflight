"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

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

export default function SystemBanner() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  if (profile.onboarding_complete) return null;

  const pct = computeSystemProgress(profile.onboarding as Record<string, unknown> | null);

  return (
    <div className="sys-banner">
      <span className="sys-banner-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" />
          <path d="m19.4 15-.8 1.4.3 1.6-1.4.8-1.2-1.1-1.6.4-.8 1.4h-1.6l-.8-1.4-1.6-.4-1.2 1.1-1.4-.8.3-1.6-.8-1.4-1.5-.4v-1.6l1.5-.4.8-1.4-.3-1.6 1.4-.8 1.2 1.1 1.6-.4.8-1.4h1.6l.8 1.4 1.6.4 1.2-1.1 1.4.8-.3 1.6.8 1.4 1.5.4v1.6z" />
        </svg>
      </span>
      <div className="sys-banner-content">
        <p className="sys-banner-title">Sistema non configurato</p>
        <p className="sys-banner-text">
          Configura il tuo servizio e il cliente ideale per risultati più precisi.
        </p>
      </div>
      {pct > 0 && (
        <div className="sys-banner-progress">
          <div className="sys-banner-progress-bar" style={{ width: `${pct}%` }} />
        </div>
      )}
      <Link href="/app/onboarding" className="sys-banner-cta">
        Configura ora →
      </Link>
    </div>
  );
}
