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
      <span className="sys-banner-icon">⚙️</span>
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
