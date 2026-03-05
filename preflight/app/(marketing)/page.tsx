import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    const { redirect } = await import("next/navigation");
    redirect("/app");
  }

  return (
    <main className="min-h-screen">
      <section className="rounded-2xl border border-app bg-soft p-10">
        <h1 className="max-w-4xl text-4xl font-bold md:text-5xl">LinkedIn non è un social.<br />È la tua pagina di vendita.</h1>
        <p className="mt-4 max-w-4xl text-lg">Preflight trasforma LinkedIn nel tuo sistema per trovare clienti.</p>
        <p className="mt-4 max-w-4xl text-lg">
          Ti dice:<br />• cosa dire<br />• a chi scrivere<br />• come rispondere<br /><br />Così le conversazioni diventano call e clienti.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/onboarding" className="btn-primary px-5 py-3">Crea il tuo sistema clienti</Link>
          <Link href="/how-it-works" className="btn-secondary px-5 py-3">Guarda come funziona</Link>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-app p-8">
        <h2 className="text-2xl font-semibold">Pubblicare non porta clienti.</h2>
        <p className="mt-3 text-sm text-muted">Molti freelance pubblicano su LinkedIn ma non ricevono richieste.</p>
        <p className="mt-3 text-sm text-muted">Non è un problema di contenuti.</p>
        <p className="mt-3 text-sm text-muted">È un problema di sistema.</p>
        <p className="mt-4 text-sm">Serve un metodo per:</p>
        <p className="mt-2 text-sm">• attirare le persone giuste<br />• iniziare conversazioni<br />• gestire messaggi<br />• fare follow-up</p>
      </section>

      <section className="mt-10 rounded-2xl border border-app p-8">
        <h2 className="text-2xl font-semibold">Un sistema commerciale per LinkedIn.</h2>
        <p className="mt-4 text-sm">Preflight ti aiuta a:</p>
        <p className="mt-2 text-sm">• posizionare la tua offerta<br />• parlare ai clienti giusti<br />• gestire commenti e messaggi<br />• trasformare conversazioni in call</p>
        <p className="mt-4 text-sm text-muted">Non è un tool di contenuti.</p>
        <p className="mt-1 text-sm text-muted">È il tuo sistema commerciale su LinkedIn.</p>
      </section>

      <section className="mt-10 rounded-2xl border border-app p-8">
        <h2 className="text-2xl font-semibold">Come funziona</h2>
        <p className="mt-3 text-sm"><strong>1) Setup</strong><br />Rispondi a poche domande su cosa vendi.</p>
        <p className="mt-3 text-sm"><strong>2) Sistema</strong><br />Creiamo il tuo piano commerciale LinkedIn.</p>
        <p className="mt-3 text-sm"><strong>3) Azione</strong><br />Segui le azioni giornaliere. Incolla commenti o messaggi e ti diciamo cosa rispondere.</p>
      </section>
    </main>
  );
}
