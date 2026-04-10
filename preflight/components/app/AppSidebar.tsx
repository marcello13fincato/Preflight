"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { useSession } from "@/lib/hooks/useSession";

type NavItem = { href: string; label: string; icon: React.ReactNode; primary?: boolean };

/* ── STRUMENTO PRINCIPALE ── */
const primaryItem: NavItem = {
  href: "/app",
  label: "Cosa fare oggi",
  primary: true,
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

/* ── 4 STRUMENTI SECONDARI ── */
const toolItems: NavItem[] = [
  {
    href: "/app/find-clients",
    label: "Trova clienti",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    href: "/app/prospect",
    label: "Analizza profilo",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/app/post",
    label: "Scrivi un post",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/app/articolo",
    label: "Scrivi un articolo",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];

/* ── SISTEMA ── */
const systemItems: NavItem[] = [
  {
    href: "/app/onboarding",
    label: "Configura sistema",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    href: "/app/settings",
    label: "Impostazioni",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
];

const FREE_TRIAL_KEY = "preflight:daily-plan-trial-count";
const MAX_FREE_TRIALS = 3;

function getTrialCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(FREE_TRIAL_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = userId ? repo.profile.getProfile(userId) : { plan: null, onboarding_complete: false, onboarding: null };
  const planLabel = typeof profile.plan === "string" ? profile.plan : profile.plan ? "Premium" : "Free";
  const trialCount = typeof window !== "undefined" ? getTrialCount() : 0;
  const trialText = profile.plan ? planLabel : `Free · ${trialCount}/${MAX_FREE_TRIALS} prove usate`;

  return (
    <aside className="sb" role="navigation" aria-label="Navigazione principale">
      {/* Brand */}
      <div className="sb-brand">
        <Link href="/app" className="sb-brand-link">
          <div className="sb-logo-icon">
            <img
              src="/LOGO PREFLIGHT_Pittogramma.png"
              alt="Preflight"
              className="sb-logo-img"
            />
          </div>
          <span className="sb-brand-text">Preflight</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sb-nav">
        {/* PRIMARY — Cosa fare oggi */}
        <div className="sb-group">
          <div className="sb-group-items">
            <Link
              href={primaryItem.href}
              className={`sb-link sb-link-primary${pathname === primaryItem.href ? " sb-link-active" : ""}`}
            >
              <span className="sb-link-icon">{primaryItem.icon}</span>
              <span className="sb-link-label">{primaryItem.label}</span>
            </Link>
          </div>
        </div>

        {/* STRUMENTI */}
        <div className="sb-group">
          <span className="sb-group-label">Strumenti</span>
          <div className="sb-group-items">
            {toolItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sb-link${active ? " sb-link-active" : ""}`}
                >
                  <span className="sb-link-icon">{item.icon}</span>
                  <span className="sb-link-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SISTEMA */}
        <div className="sb-group sb-group-system">
          <span className="sb-group-label">Sistema</span>
          <div className="sb-group-items">
            {systemItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sb-link${active ? " sb-link-active" : ""}`}
                >
                  <span className="sb-link-icon">{item.icon}</span>
                  <span className="sb-link-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer — plan badge */}
      <div className="sb-footer">
        <div className="sb-footer-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sb-footer-icon">
            <path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" />
          </svg>
          <span className="sb-footer-badge-text">{trialText}</span>
        </div>
      </div>
    </aside>
  );
}
