import { ReactNode } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import getServerAuthSession from "../../lib/getServerAuthSession";
import Layout from "@/components/shared/Layout";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center"> 
        <div className="p-8 bg-white rounded shadow">
          <h2 className="text-xl font-medium">Accesso richiesto</h2>
          <p className="mt-4">Devi effettuare il login per visualizzare la dashboard.</p>
          <a href="/auth/login" className="mt-4 inline-block btn-primary">Vai al login</a>
        </div>
      </div>
    );
  }

  return (
    <Layout header={<Topbar />}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-app">{children}</div>
      </div>
    </Layout>
  );
}
