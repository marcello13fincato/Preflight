"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "",
    items: [
      { href: "/app", label: "Oggi", icon: "⚡" },
    ],
  },
  {
    title: "ATTIRARE CLIENTI",
    items: [
      { href: "/app/inbound",     label: "Contenuti",            icon: "📣" },
      { href: "/app/post",        label: "Scrivi un post",        icon: "✍️" },
      { href: "/app/opportunity", label: "Trova opportunità",     icon: "🔍" },
    ],
  },
  {
    title: "PARLARE CON I CLIENTI",
    items: [
      { href: "/app/comments",  label: "Rispondi ai commenti",         icon: "💬" },
      { href: "/app/dm",        label: "Rispondi ai messaggi",         icon: "✉️" },
      { href: "/app/prospect",  label: "Analizza un potenziale cliente", icon: "🔎" },
      { href: "/app/simulator", label: "Allenati alle conversazioni",   icon: "🎯" },
    ],
  },
  {
    title: "GESTIRE CLIENTI",
    items: [
      { href: "/app/pipeline", label: "Clienti in corso", icon: "📊" },
    ],
  },
  {
    title: "",
    items: [
      { href: "/app/settings", label: "Impostazioni", icon: "⚙️" },
    ],
  },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-col gap-3" aria-label="Navigazione app">
      {groups.map((group, gi) => (
        <div key={gi}>
          {group.title && (
            <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
              {group.title}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
