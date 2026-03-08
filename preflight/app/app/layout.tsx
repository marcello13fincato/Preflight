import type { ReactNode } from "react";
import Link from "next/link";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppNav from "@/components/app/AppNav";
import SystemBanner from "@/components/app/SystemBanner";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  return (
    <section className="min-h-screen">
      {/* Top header bar */}
      <header
        className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-3"
        style={{
          background: "var(--color-primary)",
          boxShadow: "0 2px 8px rgba(10,102,194,0.25)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{ background: "var(--color-primary-bg-light)", color: "white" }}
          >
            P
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary-text-dim)" }}>
              Preflight
            </p>
            <h1 className="text-base font-bold leading-tight" style={{ color: "white" }}>
              LinkedIn Sales OS
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:block" style={{ color: "var(--color-primary-text-muted)" }}>
            {session?.user?.email || session?.user?.name || "Guest mode"}
          </span>
          {session ? (
            <Link
              href="/api/auth/signout"
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: "var(--color-primary-bg-light)",
                color: "white",
                border: "1px solid var(--color-primary-bg-border)",
              }}
            >
              Esci
            </Link>
          ) : null}
        </div>
      </header>
      <SystemBanner />
      <AppNav />
      <main className="pb-12">{children}</main>
    </section>
  );
}
