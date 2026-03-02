"use client";

import Link from "next/link";
import Image from "next/image";
import { marketingNav, marketingCTA } from "../../lib/routes";

export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-app">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image src="/logo.svg" alt="Preflight" width={96} height={24} className="h-6" />
          <span className="sr-only">Preflight</span>
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
          <Link href="/dashboard" className="rounded-full border border-app px-4 py-2 text-sm font-medium hover:bg-soft transition">
            Dashboard
          </Link>
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
