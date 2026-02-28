export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="mt-10 text-3xl font-bold">Dashboard</h1>
        <p className="mt-3 text-text-secondary">
          Qui vedrai lo storico e il piano settimanale (“cosa pubblicare per vendere di più”).
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-background-alt p-6 shadow-premium">
          <div className="font-semibold">Prossimo contenuto consigliato</div>
          <div className="text-text-secondary mt-2">
            (lo attiviamo quando colleghiamo Supabase + salvataggio storico)
          </div>
        </div>
      </div>
    </main>
  );
}