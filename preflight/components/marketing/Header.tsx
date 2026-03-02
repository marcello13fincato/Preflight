"use client";

import Link from "next/link";
import { marketingNav, marketingCTA } from "../../lib/routes";

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-main text-main backdrop-blur-md border-b border-border-color shadow-sm transition-colors duration-200 ease">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-main">
          Preflight
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-main">
          {marketingNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 ease hover:text-primary-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={marketingCTA.href}
            className="rounded-full bg-primary px-5 py-2 text-white font-semibold shadow-sm hover:bg-primary-dark transition"
          >
            {marketingCTA.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
