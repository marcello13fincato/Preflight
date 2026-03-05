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
        <h1 className="max-w-4xl text-4xl font-bold md:text-5xl">LinkedIn non è un social. È il tuo canale clienti.</h1>
        <p className="mt-4 max-w-4xl text-lg">
          Preflight è il Sales OS guidato dall’AI che ti dice cosa pubblicare, chi contattare e cosa rispondere per trasformare commenti e DM in call e clienti.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/onboarding" className="btn-primary px-5 py-3">Crea il mio piano clienti (5 min)</Link>
          <Link href="/how-it-works" className="btn-secondary px-5 py-3">Vedi come funziona</Link>
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          <li>Non ti trasformiamo in social media manager: ti facciamo vendere.</li>
          <li>Non serve collegare LinkedIn: funziona con copia/incolla.</li>
          <li>Piano giornaliero: sai sempre cosa fare oggi.</li>
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-app p-8">
        <h2 className="text-2xl font-semibold">Come funziona</h2>
        <ol className="mt-4 space-y-2 text-sm">
          <li>1) Setup (5 min)</li>
          <li>2) Piano (14 giorni)</li>
          <li>3) Esecuzione (ogni giorno: incolla -&gt; risposta + prossima mossa)</li>
        </ol>
      </section>
    </main>
  );
}
