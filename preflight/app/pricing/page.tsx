export default function Pricing() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="mt-10 text-4xl font-bold text-text-primary">Prezzi</h1>
        <p className="mt-3 text-text-secondary max-w-2xl">
          Free per provare. Pro per usare davvero la piattaforma: storico, piano settimanale e audit illimitati.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-border bg-background-alt p-8 shadow-premium transition-shadow duration-200 ease hover:shadow-lg">
            <div className="text-sm text-text-secondary">Free</div>
            <div className="text-4xl font-bold mt-2 text-text-primary">0€</div>
            <ul className="mt-6 space-y-2 text-text-secondary">
              <li>• Audit limitati (per test)</li>
              <li>• Output completo dell’audit</li>
              <li>• Nessuno storico</li>
            </ul>
            <a href="/audit" className="mt-7 inline-block rounded-xl border border-border px-5 py-3 text-text-primary hover:bg-primary-hover transition-colors duration-200 ease">
              Prova ora
            </a>
          </div>

          <div className="rounded-3xl border border-primary bg-background-alt p-8 shadow-premium transition-shadow duration-200 ease hover:shadow-lg">
            <div className="text-sm text-text-primary">Pro</div>
            <div className="text-4xl font-bold mt-2 text-text-primary">19,99€<span className="text-lg font-medium">/mese</span></div>
            <ul className="mt-6 space-y-2 text-text-primary">
              <li>• Audit illimitati</li>
              <li>• Storico dei post + consigli</li>
              <li>• Piano settimanale: cosa pubblicare per vendere di più</li>
              <li>• Suggerimenti visual e CTA</li>
            </ul>
            <a href="/login" className="mt-7 inline-block rounded-xl bg-primary text-text-primary px-5 py-3 font-semibold hover:bg-primary-hover transition-colors duration-200 ease">
              Inizia (login)
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}