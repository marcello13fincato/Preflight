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
    <div className="flex min-h-screen bg-[#EBF0FA] text-slate-900">
      <AppSidebar />
      <div className="flex-1 min-w-0 flex flex-col relative z-[1]">
        {/* Topbar */}
        <header className="bg-white border-b border-[#D9E4F5] h-[52px] px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-full px-3 py-1">
              <span className="relative flex items-center justify-center w-[7px] h-[7px]">
                <span className="w-[7px] h-[7px] bg-green-500 rounded-full relative z-10" />
                <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-60" />
              </span>
              <span className="text-[12px] font-bold text-green-700">Sistema online</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-[12px] font-bold flex items-center justify-center" title={session?.user?.email || ""}>
              {initials}
            </div>
            <SignOutButton />
          </div>
        </header>
        <AIContextBanner />
        <main className="flex-1 w-full p-0 px-6 pb-10 box-border max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
