"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/app", label: "Oggi" },
  { href: "/app/onboarding", label: "Imposta il tuo sistema" },
  { href: "/app/inbound", label: "Contenuti" },
  { href: "/app/post", label: "Scrivi un post" },
  { href: "/app/comments", label: "Rispondi ai commenti" },
  { href: "/app/dm", label: "Rispondi ai messaggi" },
  { href: "/app/prospect", label: "Analizza un potenziale cliente" },
  { href: "/app/opportunity", label: "Trova opportunita" },
  { href: "/app/simulator", label: "Allenati alle conversazioni" },
  { href: "/app/pipeline", label: "Clienti in corso" },
  { href: "/app/settings", label: "Impostazioni" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg border px-3 py-2 text-sm ${
              active ? "bg-soft border-app" : "border-app hover:bg-soft2"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
