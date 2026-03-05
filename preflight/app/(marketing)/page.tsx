import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";
import LinkedInFactCallout from "@/components/shared/LinkedInFactCallout";
import JourneyBar from "@/components/shared/JourneyBar";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    const { redirect } = await import("next/navigation");
    redirect("/app");
  }

  return (
    <main className="min-h-screen space-y-10">
      {/* Hero */}
      <section className="hero-gradient rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-12 shadow-[var(--shadow-md)]">
        <div className="max-w-2xl">
          <span className="badge badge-primary mb-4 inline-flex">LinkedIn Sales OS</span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            LinkedIn non è un social.<br />
            <span className="text-[var(--color-primary)]">È la tua pagina di vendita.</span>
          </h1>
          <p className="mt-5 text-lg text-[var(--color-muted)] max-w-xl">
            Preflight trasforma LinkedIn nel tuo sistema per trovare clienti.
            Ti dice <strong>cosa dire</strong>, <strong>a chi scrivere</strong> e <strong>come rispondere</strong>.
            Così le conversazioni diventano call e clienti.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/app/onboarding" className="btn-primary px-6 py-3.5 text-base">
              🚀 Crea il tuo sistema clienti (5 min)
            </Link>
            <Link href="/how-it-works" className="btn-secondary px-6 py-3.5 text-base">
              Guarda come funziona →
            </Link>
          </div>
        </div>
      </section>

      <LinkedInFactCallout factIndex={0} />

      {/* Problem section */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10 shadow-[var(--shadow-sm)]">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Pubblicare non porta clienti.</h2>
        <p className="mt-4 text-[var(--color-muted)]">
          Molti freelance e consulenti pubblicano su LinkedIn ogni settimana. Ma non ricevono richieste.
          Non è un problema di contenuti. <strong>È un problema di sistema.</strong>
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { icon: "❌", text: "Pubblichi ma nessuno ti scrive" },
            { icon: "❌", text: "Rispondi ai commenti ma la conversazione muore" },
            { icon: "❌", text: "Scrivi DM ma sembra spam" },
            { icon: "❌", text: "Non sai chi seguire o quando" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 rounded-lg bg-[var(--color-danger-bg)] px-4 py-3 text-sm font-medium">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[var(--color-muted)]">
          Serve un metodo per attirare le persone giuste, iniziare conversazioni, gestire messaggi e fare follow-up.
        </p>
      </section>

      <LinkedInFactCallout factIndex={1} />

      {/* Solution */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10 shadow-[var(--shadow-sm)]">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Un sistema commerciale per LinkedIn.</h2>
        <p className="mt-4 text-[var(--color-muted)]">Non è un tool di contenuti. È il tuo sistema commerciale su LinkedIn.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { icon: "✅", text: "Posiziona la tua offerta in modo chiaro" },
            { icon: "✅", text: "Parla ai clienti giusti con i messaggi giusti" },
            { icon: "✅", text: "Gestisci commenti e DM con l'AI" },
            { icon: "✅", text: "Trasforma conversazioni in call e clienti" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 rounded-lg bg-[var(--color-success-bg)] px-4 py-3 text-sm font-medium">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-soft)] p-8 sm:p-10">
        <h2 className="text-2xl font-extrabold sm:text-3xl mb-6">Come funziona</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { n: "1", title: "Setup (5 min)", desc: "Rispondi a poche domande su cosa vendi e chi è il tuo cliente ideale." },
            { n: "2", title: "Piano personalizzato", desc: "Creiamo il tuo piano commerciale LinkedIn con azioni concrete ogni giorno." },
            { n: "3", title: "Azione guidata", desc: "Segui le azioni giornaliere. Incolla commenti o messaggi e ti diciamo cosa rispondere." },
          ].map((step) => (
            <div key={step.n} className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-white font-extrabold text-sm mb-3">
                {step.n}
              </div>
              <h3 className="font-bold mb-1">{step.title}</h3>
              <p className="text-sm text-[var(--color-muted)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="rounded-2xl border border-[var(--color-primary)] bg-[var(--color-soft)] p-8 text-center">
        <h2 className="text-xl font-extrabold mb-4">Il percorso verso nuovi clienti</h2>
        <JourneyBar variant="light" className="justify-center" />
        <div className="mt-8">
          <Link href="/app/onboarding" className="btn-primary px-8 py-4 text-base inline-flex">
            🚀 Inizia gratis – 5 minuti
          </Link>
        </div>
      </section>

      <LinkedInFactCallout factIndex={2} />
    </main>
  );
}

