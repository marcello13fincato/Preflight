import type { ReactNode } from "react";
import Link from "next/link";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppSidebar from "@/components/app/AppSidebar";
import SystemBanner from "@/components/app/SystemBanner";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        {/* Top bar */}
        <header className="app-topbar">
          <div className="app-topbar-left">
            <div className="app-topbar-status">
              <span className="app-topbar-dot" />
              <span className="app-topbar-status-text">Sistema attivo</span>
            </div>
            <div className="app-topbar-context" aria-label="Contesto dashboard">
              <p className="app-topbar-kicker">Workspace</p>
              <p className="app-topbar-title">Dashboard quotidiana</p>
            </div>
          </div>
          <div className="app-topbar-right">
            <span className="app-topbar-user">
              {session?.user?.email || session?.user?.name || "Guest mode"}
            </span>
            {session ? (
              <Link href="/api/auth/signout" className="app-topbar-btn">
                Esci
              </Link>
            ) : null}
          </div>
        </header>
        <SystemBanner />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
