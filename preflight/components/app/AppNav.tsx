"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const topItems: NavItem[] = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/oggi", label: "Cosa fare oggi" },
];

const coreItems: NavItem[] = [
  { href: "/app/find-clients", label: "Trova clienti" },
  { href: "/app/prospect", label: "Analizza profilo" },
  { href: "/app/dm", label: "Chiedi un consiglio" },
];

const configItems: NavItem[] = [
  { href: "/app/onboarding", label: "Configura il tuo sistema" },
];

const bottomItems: NavItem[] = [
  { href: "/app/settings", label: "Impostazioni" },
];

export default function AppNav() {
  const pathname = usePathname();

  function navLink(item: NavItem, highlight?: boolean) {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`dash-nav-link${active ? " dash-nav-link-active" : ""}${highlight ? " dash-nav-link-core" : ""}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <nav className="dash-nav">
      <div className="dash-nav-group">
        {topItems.map((i) => navLink(i))}
      </div>
      <div className="dash-nav-divider" />
      <div className="dash-nav-group">
        <span className="dash-nav-label">Servizi principali</span>
        {coreItems.map((i) => navLink(i, true))}
      </div>
      <div className="dash-nav-divider" />
      <div className="dash-nav-group">
        <span className="dash-nav-label">Configurazione</span>
        {configItems.map((i) => navLink(i))}
      </div>
      <div className="dash-nav-divider" />
      <div className="dash-nav-group">
        {bottomItems.map((i) => navLink(i))}
      </div>
    </nav>
  );
}
