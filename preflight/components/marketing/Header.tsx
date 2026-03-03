"use client";

import Link from "next/link";
import { marketingNav, marketingCTA } from "../../lib/routes";
import { useSession, signOut } from "next-auth/react";

export default function MarketingHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-app">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="text-lg font-extrabold">Preflight</span>
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
          <Link href="/dashboard" className="btn-primary rounded-full px-4 py-2 text-sm font-medium shadow-sm">
            DASHBOARD
          </Link>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Ciao, {session.user?.name || session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-secondary"
              >
                Esci
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="btn-primary rounded-full px-5 py-2 font-semibold shadow-sm"
            >
              Accedi
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
