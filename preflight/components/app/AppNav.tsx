"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };
type NavGroup = { label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: "Oggi",
    items: [{ href: "/app", label: "Dashboard" }],
  },
  {
    label: "Sistema",
    items: [{ href: "/app/onboarding", label: "Imposta il tuo sistema" }],
  },
  {
    label: "Attirare Clienti",
    items: [
      { href: "/app/inbound", label: "Contenuti" },
      { href: "/app/post", label: "Scrivi un post" },
    ],
  },
  {
    label: "Parlare con i Clienti",
    items: [
      { href: "/app/comments", label: "Rispondi ai commenti" },
      { href: "/app/dm", label: "Rispondi ai messaggi" },
      { href: "/app/simulator", label: "Simulatore conversazione" },
    ],
  },
  {
    label: "Gestire Clienti",
    items: [
      { href: "/app/prospect", label: "Analizza cliente" },
      { href: "/app/opportunity", label: "Trova opportunità" },
      { href: "/app/pipeline", label: "Pipeline" },
    ],
  },
  {
    label: "Impostazioni",
    items: [{ href: "/app/settings", label: "Impostazioni" }],
  },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 rounded-xl border border-app bg-surface shadow-sm overflow-hidden"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex flex-wrap items-stretch divide-x divide-[var(--color-border)]">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col min-w-0">
            {/* Group header */}
            <div
              className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-muted)" }}
            >
              {group.label}
            </div>
            {/* Items */}
            <div className="flex flex-wrap gap-1 px-2 pb-2">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                      active
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "text-[var(--color-text)] hover:bg-[var(--color-soft)] hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
