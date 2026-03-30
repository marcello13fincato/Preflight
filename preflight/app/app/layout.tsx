import type { ReactNode } from "react";
import Link from "next/link";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppSidebar from "@/components/app/AppSidebar";
import SystemBanner from "@/components/app/SystemBanner";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  return (
    <div className="app-shell fade-in">
      <AppSidebar />
      <div className="app-main fade-in-delay">
        {/* Top bar */}
        <header className="app-topbar-full fade-in-fast">
          <div className="app-topbar-inner container-wide">
            <div className="app-topbar-left fade-in">
              <div className="app-topbar-status">
                <span className="app-topbar-dot" />
                <span className="app-topbar-status-text">Sistema attivo</span>
              </div>
              <div className="app-topbar-context" aria-label="Contesto dashboard">
                <p className="app-topbar-kicker">Workspace</p>
                <p className="app-topbar-title">Dashboard quotidiana</p>
              </div>
            </div>
            <div className="app-topbar-right fade-in">
              <span className="app-topbar-user">
                {session?.user?.email || session?.user?.name || "Guest mode"}
              </span>
              {session ? (
                <Link href="/api/auth/signout" className="app-topbar-btn fade-in-fast">
                  Esci
                </Link>
              ) : null}
            </div>
          </div>
        </header>
        <SystemBanner />
        <main className="app-content fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
