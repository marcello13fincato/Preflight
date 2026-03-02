"use client";

import Link from "next/link";
import { marketingNav, marketingCTA } from "../../lib/routes";

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-app">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-app">
          Preflight
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 ease link-primary hover:text-primaryDark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={marketingCTA.href}
            className="btn-primary rounded-full px-5 py-2 font-semibold shadow-sm"
          >
            {marketingCTA.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
