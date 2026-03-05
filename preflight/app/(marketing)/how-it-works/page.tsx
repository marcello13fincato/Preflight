import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen space-y-8">
      <section className="rounded-2xl border border-app bg-soft p-10">
        <h1 className="text-4xl font-bold">Un metodo completo per ottenere clienti su LinkedIn.</h1>
        <p className="mt-3 max-w-3xl text-lg">Non post migliori. Conversazioni migliori.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-app p-5">
          <h2 className="font-semibold">Setup</h2>
          <p className="mt-2 text-sm text-muted">Definisci offerta, ICP, prove e obiettivo primario.</p>
        </article>
        <article className="rounded-xl border border-app p-5">
          <h2 className="font-semibold">Piano 14 giorni</h2>
          <p className="mt-2 text-sm text-muted">Ricevi azioni inbound, outbound e follow-up con priorità quotidiane.</p>
        </article>
        <article className="rounded-xl border border-app p-5">
          <h2 className="font-semibold">Assistenti AI</h2>
          <p className="mt-2 text-sm text-muted">Post, commenti, DM e prospect analyzer con input copia/incolla.</p>
        </article>
        <article className="rounded-xl border border-app p-5">
          <h2 className="font-semibold">Pipeline</h2>
          <p className="mt-2 text-sm text-muted">Gestisci lead, stati, prossime azioni e follow-up suggeriti.</p>
        </article>
      </section>

      <Link href="/app/onboarding" className="inline-block btn-primary px-5 py-3">Crea il piano e inizia oggi</Link>
    </main>
  );
}
