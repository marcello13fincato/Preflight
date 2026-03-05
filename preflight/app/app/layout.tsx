import type { ReactNode } from "react";
import Link from "next/link";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppNav from "@/components/app/AppNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top header bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md shadow-[0_2px_8px_rgba(10,102,194,0.06)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/app" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white font-extrabold text-sm">P</span>
            <span className="font-extrabold text-lg tracking-tight text-[var(--color-primary-dark)]">Preflight</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:block text-[var(--color-muted)]">{session?.user?.email || session?.user?.name || "Modalità ospite"}</span>
            {session ? (
              <Link href="/api/auth/signout" className="btn-secondary px-3 py-1.5 text-sm">Esci</Link>
            ) : (
              <Link href="/app/onboarding" className="btn-primary px-4 py-2 text-sm">Inizia gratis</Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <AppNav />
        {children}
      </main>
    </div>
  );
}
