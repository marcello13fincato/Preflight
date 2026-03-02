import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Accesso richiesto</h2>
          <p className="mt-2">Devi effettuare il login per visualizzare il profilo.</p>
          <Link href="/auth/login" className="mt-4 inline-block btn-primary">Vai al login</Link>
        </div>
      </div>
    );
  }
  const user = (session as any)?.user;

  return (
    <main className="min-h-screen p-6 bg-app">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Il tuo account</h1>
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold">Informazioni</h2>
            <p className="mt-2 text-sm text-muted">Nome: {user?.name || "-"}</p>
            <p className="mt-1 text-sm text-muted">Email: {user?.email || "-"}</p>
          </div>

          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold">Sicurezza</h2>
            <p className="mt-2 text-sm text-muted">Cambia password non è supportato in questa demo.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="btn-secondary">Torna alla dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
