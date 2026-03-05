import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen space-y-6">
      <section className="rounded-2xl border border-app bg-soft p-10">
        <h1 className="text-4xl font-bold">Un solo obiettivo: più clienti da LinkedIn.</h1>
        <p className="mt-3 text-lg">Paghi per un sistema operativo, non per testi.</p>
      </section>

      <section className="max-w-xl rounded-2xl border border-app p-8">
        <p className="text-sm text-muted">Piano unico</p>
        <h2 className="mt-1 text-3xl font-bold">Pro — €19,99/mese</h2>
        <ul className="mt-5 space-y-2 text-sm">
          <li>Onboarding strategico + piano 14 giorni</li>
          <li>Today Dashboard (azioni quotidiane)</li>
          <li>Post Builder (lead-focused)</li>
          <li>Comment Assistant (conversione)</li>
          <li>DM Assistant + follow-up + invito call</li>
          <li>Prospect Analyzer (messaggi su misura)</li>
          <li>Pipeline + storico</li>
        </ul>
        <Link href="/app/onboarding" className="mt-6 inline-block btn-primary px-5 py-3">Inizia Pro</Link>
      </section>
    </main>
  );
}
