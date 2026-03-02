export default function Dashboard() {
  return (
    <main className="min-h-screen bg-main text-main">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="mt-10 text-3xl font-bold">Dashboard</h1>
        <p className="mt-3 text-muted">
          Il tuo quartier generale: storici audit, playbook e suggerimenti per una strategia vincente.
        </p>

        <div className="mt-8 rounded-3xl border border-border-color bg-surface p-6 shadow-premium">
          <div className="font-semibold">Prossimo contenuto consigliato</div>
          <div className="text-muted mt-2">
            (questa funzionalità sarà pronta appena colleghiamo il tuo account e salviamo lo storico)
          </div>
        </div>
      </div>
    </main>
  );
}