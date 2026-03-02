export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="mt-10 text-3xl font-bold">Dashboard</h1>
        <p className="mt-3 text-text-secondary">
          Il tuo quartier generale: storici audit, playbook e suggerimenti per una strategia vincente.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-background-alt p-6 shadow-premium">
          <div className="font-semibold">Prossimo contenuto consigliato</div>
          <div className="text-text-secondary mt-2">
            (questa funzionalità sarà pronta appena colleghiamo il tuo account e salviamo lo storico)
          </div>
        </div>
      </div>
    </main>
  );
}