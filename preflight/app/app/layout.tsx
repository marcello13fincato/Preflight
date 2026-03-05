import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import getServerAuthSession from "@/lib/getServerAuthSession";
import AppNav from "@/components/app/AppNav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <section className="min-h-screen">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-app pb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Preflight</p>
          <h1 className="text-xl font-semibold">LinkedIn Sales OS</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{session.user?.email || session.user?.name}</span>
          <Link href="/api/auth/signout" className="btn-secondary px-3 py-1.5">Esci</Link>
        </div>
      </div>
      <AppNav />
      {children}
    </section>
  );
}
