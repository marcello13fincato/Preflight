import "../globals.css";
import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return (
      <html>
        <body>
          <div className="min-h-screen flex items-center justify-center"> 
            <div className="p-8 bg-white rounded shadow">
              <h2 className="text-xl font-medium">Accesso richiesto</h2>
              <p className="mt-4">Devi effettuare il login per visualizzare la dashboard.</p>
              <a href="/login" className="mt-4 inline-block btn-primary">Vai al login</a>
            </div>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
