import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppSidebar from "@/components/app/AppSidebar";
import AIContextBanner from "@/components/app/AIContextBanner";
import SignOutButton from "@/components/app/SignOutButton";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const initials = (session?.user?.name || session?.user?.email || "U")
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s: string) => s[0]?.toUpperCase())
    .join("");

  // Prefer email for display — name from OAuth can be unreliable (e.g. project name)
  const displayName = session?.user?.email || session?.user?.name || "Utente";

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <header className="app-topbar">
          <div className="app-topbar-left">
            <span className="app-topbar-user">{displayName}</span>
          </div>
          <div className="app-topbar-right">
            <div className="app-topbar-avatar" title={session?.user?.email || ""}>
              {initials}
            </div>
            <SignOutButton />
          </div>
        </header>
        <AIContextBanner />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
