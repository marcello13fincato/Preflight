import { ReactNode } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import getServerAuthSession from "../../lib/getServerAuthSession";
import Layout from "@/components/shared/Layout";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  const locked = !session;

  return (
    <Layout header={<Topbar />}>
      <div className="relative">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 bg-app min-h-screen">{children}</div>
        </div>

        {locked && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="max-w-md rounded bg-white/95 p-6 text-center shadow-lg">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4s-3 1.567-3 3.5S10.343 11 12 11zM6 20v-2a6 6 0 0112 0v2" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Dashboard protetta</h3>
              <p className="mt-2 text-sm text-muted">Per visualizzare gli insights e i consigli è necessario effettuare il login.</p>
              <div className="mt-4 flex justify-center gap-3">
                <a href="/auth/login" className="btn-primary">Accedi</a>
                <a href="/" className="btn-secondary">Torna alla home</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
