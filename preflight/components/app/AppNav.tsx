"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/app", label: "Today" },
  { href: "/app/onboarding", label: "Onboarding" },
  { href: "/app/inbound", label: "Inbound" },
  { href: "/app/post", label: "Post" },
  { href: "/app/comments", label: "Comments" },
  { href: "/app/dm", label: "DM" },
  { href: "/app/prospect", label: "Prospect" },
  { href: "/app/pipeline", label: "Pipeline" },
  { href: "/app/settings", label: "Settings" },
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
