"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const topItems: NavItem[] = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/onboarding", label: "Imposta il tuo sistema" },
];

const toolItems: NavItem[] = [
  { href: "/app/inbound", label: "Contenuti" },
  { href: "/app/post", label: "Scrivi un post" },
  { href: "/app/comments", label: "Commenti" },
  { href: "/app/dm", label: "Messaggi" },
  { href: "/app/opportunity", label: "Opportunità" },
  { href: "/app/prospect", label: "Analizza cliente" },
  { href: "/app/simulator", label: "Simulatore" },
  { href: "/app/pipeline", label: "Clienti" },
];

const bottomItems: NavItem[] = [
  { href: "/app/settings", label: "Impostazioni" },
];

export default function AppNav() {
  const pathname = usePathname();

  function navLink(item: NavItem) {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`dash-nav-link${active ? " dash-nav-link-active" : ""}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <nav className="dash-nav">
      <div className="dash-nav-group">
        {topItems.map(navLink)}
      </div>
      <div className="dash-nav-divider" />
      <div className="dash-nav-group">
        <span className="dash-nav-label">Strumenti</span>
        {toolItems.map(navLink)}
      </div>
      <div className="dash-nav-divider" />
      <div className="dash-nav-group">
        {bottomItems.map(navLink)}
      </div>
    </nav>
  );
}
