import Link from "next/link";

export default function Login() {
  return (
    <main className="min-h-screen bg-main text-main flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-border-color bg-surface p-7 shadow-premium text-center">
        <Link href="/" className="text-muted text-sm hover:text-main transition-colors duration-200 ease">
          ← Home
        </Link>
        <h1 className="text-2xl font-bold mt-4">Accesso (mock)</h1>
        <p className="text-muted mt-2">
          Questa è una pagina finta. In produzione aggiungeremo l&apos;autenticazione.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-white font-semibold hover:bg-primary-dark transition"
        >
          Vai alla dashboard
        </Link>
      </div>
    </main>
  );
}

