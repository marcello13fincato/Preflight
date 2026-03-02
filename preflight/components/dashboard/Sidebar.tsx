"use client";

import Link from "next/link";
import { dashboardNav } from "../../lib/routes";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-surface border-r border-app min-h-screen px-4 py-6">
      <div className="font-bold text-lg mb-6 text-app">Preflight</div>
      <nav className="flex flex-col gap-4 text-app">
        {dashboardNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="py-2 px-3 rounded hover:bg-soft2 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
