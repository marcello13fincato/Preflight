export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <a href="/" className="font-bold text-xl">Pre-Flight</a>
          <div className="flex gap-3 text-sm text-slate-300">
            <a className="hover:text-white" href="/audit">Nuovo Audit</a>
            <a className="hover:text-white" href="/pricing">Prezzi</a>
          </div>
        </div>

        <h1 className="mt-10 text-3xl font-bold">Dashboard</h1>
        <p className="mt-3 text-slate-300">
          Qui vedrai lo storico e il piano settimanale (“cosa pubblicare per vendere di più”).
        </p>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-white/5 p-6">
          <div className="font-semibold">Prossimo contenuto consigliato</div>
          <div className="text-slate-300 mt-2">
            (lo attiviamo quando colleghiamo Supabase + salvataggio storico)
          </div>
        </div>
      </div>
    </main>
  );
}