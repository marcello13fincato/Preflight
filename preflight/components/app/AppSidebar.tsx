"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { useSession } from "@/lib/hooks/useSession";
import { isAdminEmail } from "@/lib/admin";

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
  const isAdmin = isAdminEmail(session?.user?.email);
  const effectivePlan = profile.plan || isAdmin;
  const planLabel = isAdmin && !profile.plan ? "Admin" : typeof profile.plan === "string" ? profile.plan : profile.plan ? "Premium" : "Free";
  const trialCount = typeof window !== "undefined" ? getTrialCount() : 0;
  const trialText = effectivePlan ? planLabel : `${trialCount} di ${MAX_FREE_TRIALS} prove usate`;
  const trialPct = effectivePlan ? 100 : Math.round((trialCount / MAX_FREE_TRIALS) * 100);

  const linkBase = "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-slate-500 hover:bg-blue-50 hover:text-blue-800 transition-all";
  const linkActive = "bg-gradient-to-r from-blue-50 to-blue-50/60 text-blue-700 font-bold border-l-[3px] border-blue-600 rounded-l-none rounded-r-lg pl-[7px]";

  return (
    <aside className="w-[232px] flex-shrink-0 flex flex-col bg-white border-r border-[#D9E4F5] sticky top-0 h-screen overflow-hidden z-[70]" role="navigation" aria-label="Navigazione principale">
      {/* Brand */}
      <div className="px-4 pt-5 pb-4 flex items-center">
        <Link href="/app" className="flex items-center gap-2.5 no-underline">
          <div className="w-[34px] h-[34px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-[10px] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-[15px]">Preflight</span>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-3 overflow-y-auto overflow-x-hidden">
        {/* OGGI */}
        <div className="mb-3">
          <span className="text-[10px] font-bold text-slate-300 tracking-[0.1em] uppercase px-2 mt-4 mb-1 block">Oggi</span>
          <Link
            href={primaryItem.href}
            className={`${linkBase} ${pathname === primaryItem.href ? linkActive : ""}`}
          >
            <span className="w-5 h-5 flex items-center justify-center">{primaryItem.icon}</span>
            <span>{primaryItem.label}</span>
          </Link>
        </div>

        {/* STRUMENTI */}
        <div className="mb-3">
          <span className="text-[10px] font-bold text-slate-300 tracking-[0.1em] uppercase px-2 mt-4 mb-1 block">Strumenti</span>
          <div className="flex flex-col gap-px">
            {toolItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkBase} ${active ? linkActive : ""}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SISTEMA */}
        <div className="mt-auto pt-3 border-t border-[#D9E4F5]">
          <span className="text-[10px] font-bold text-slate-300 tracking-[0.1em] uppercase px-2 mt-4 mb-1 block">Sistema</span>
          <div className="flex flex-col gap-px">
            {systemItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkBase} ${active ? linkActive : ""}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer — PlanBadge */}
      <div className="p-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-[11px] p-3">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Piano attivo</div>
          <div className="text-sm font-extrabold text-blue-700 mt-0.5">{planLabel}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{trialText}</div>
          <div className="h-1 bg-blue-100 rounded-full overflow-hidden mt-2">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${trialPct}%` }} />
          </div>
          {!effectivePlan && (
            <Link href="/pricing" className="block w-full mt-2.5 bg-blue-700 text-white text-[12px] font-semibold rounded-lg py-1.5 hover:bg-blue-800 transition text-center">
              Upgrade
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
