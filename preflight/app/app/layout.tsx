import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppSidebar from "@/components/app/AppSidebar";
import SystemBanner from "@/components/app/SystemBanner";
import AIContextBanner from "@/components/app/AIContextBanner";
import SignOutButton from "@/components/app/SignOutButton";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <div className="app-topbar-status">
              <span className="app-topbar-dot" />
              <span className="app-topbar-status-text">Online</span>
            </div>
          </div>
          <div className="app-topbar-right">
            <span className="app-topbar-user">
              {session?.user?.email || session?.user?.name || "Guest"}
            </span>
            <SignOutButton />
          </div>
        </header>
        <SystemBanner />
        <AIContextBanner />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
