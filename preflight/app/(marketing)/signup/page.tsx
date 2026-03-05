import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-app bg-surface p-7 text-center">
        <h1 className="text-2xl font-bold">Signup</h1>
        <p className="mt-2 text-sm text-muted">MVP: usa il login esistente e completa onboarding in 5 minuti.</p>
        <Link href="/auth/login" className="mt-6 inline-block btn-primary px-5 py-3">Vai al login</Link>
      </div>
    </main>
  );
}
