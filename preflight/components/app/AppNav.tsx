"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const topItems: NavItem[] = [
  { href: "/app", label: "Dashboard" },
];

const toolItems: NavItem[] = [
  { href: "/app/prospect", label: "Analizza profilo" },
  { href: "/app/dm", label: "Chiedi un consiglio" },
];

const bottomItems: NavItem[] = [
  { href: "/app/onboarding", label: "Configura il tuo sistema" },
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
        <span className="dash-nav-label">Area personale</span>
        {bottomItems.map(navLink)}
      </div>
    </nav>
  );
}
