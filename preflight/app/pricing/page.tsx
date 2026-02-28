export default function Pricing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <a href="/" className="font-bold text-xl">Pre-Flight</a>
          <div className="flex gap-3 text-sm text-slate-300">
            <a className="hover:text-white" href="/audit">Audit</a>
            <a className="hover:text-white" href="/dashboard">Dashboard</a>
            <a className="rounded-xl bg-[#0A66C2] px-4 py-2 text-white font-semibold" href="/login">Accedi</a>
          </div>
        </div>

        <h1 className="mt-10 text-4xl font-bold">Prezzi</h1>
        <p className="mt-3 text-slate-300 max-w-2xl">
          Free per provare. Pro per usare davvero la piattaforma: storico, piano settimanale e audit illimitati.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-white/5 p-7">
            <div className="text-sm text-slate-400">Free</div>
            <div className="text-4xl font-bold mt-2">0€</div>
            <ul className="mt-6 space-y-2 text-slate-300">
              <li>• Audit limitati (per test)</li>
              <li>• Output completo dell’audit</li>
              <li>• Nessuno storico</li>
            </ul>
            <a href="/audit" className="mt-7 inline-block rounded-xl border border-slate-700 px-5 py-3 hover:bg-white/5">
              Prova ora
            </a>
          </div>

          <div className="rounded-3xl border border-[#0A66C2] bg-[#0A66C2]/10 p-7">
            <div className="text-sm text-slate-200/90">Pro</div>
            <div className="text-4xl font-bold mt-2">19,99€<span className="text-lg font-medium">/mese</span></div>
            <ul className="mt-6 space-y-2 text-slate-200">
              <li>• Audit illimitati</li>
              <li>• Storico dei post + consigli</li>
              <li>• Piano settimanale: cosa pubblicare per vendere di più</li>
              <li>• Suggerimenti visual e CTA</li>
            </ul>
            <a href="/login" className="mt-7 inline-block rounded-xl bg-white text-slate-900 px-5 py-3 font-semibold">
              Inizia (login)
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}