"use client";

import Link from "next/link";
import { marketingNav } from "../../lib/routes";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function MarketingHeader() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-app">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
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
          <Link href="/audit" className="hidden sm:inline-flex btn-primary rounded-full px-4 py-2 text-sm font-medium shadow-sm">
            Fai l’audit gratis
          </Link>

          {session ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm">Ciao, {session.user?.name || session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-secondary"
                aria-label="Esci"
              >
                Esci
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Accedi"
              className="hidden sm:inline-flex btn-secondary rounded-full px-5 py-2 font-semibold shadow-sm"
            >
              Accedi
            </Link>
          )}

          {/* Mobile: hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden bg-white border-t border-app">
          <div className="px-4 py-3 space-y-3">
            {marketingNav.map((item) => (
              <Link key={item.href} href={item.href} className="block text-base link-primary">
                {item.label}
              </Link>
            ))}

            <Link href="/audit" aria-label="Fai l'audit gratis" className="block btn-primary w-full text-center rounded-full px-4 py-2">
              Fai l’audit gratis
            </Link>

            {session ? (
              <div className="flex items-center justify-between">
                <span className="text-sm">Ciao, {session.user?.name || session.user?.email}</span>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary">Esci</button>
              </div>
            ) : (
              <Link href="/login" className="block btn-secondary w-full text-center rounded-full px-4 py-2">Accedi</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
