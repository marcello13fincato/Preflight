export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div className="font-bold text-xl">Pre-Flight</div>
          <nav className="flex gap-3 text-sm text-slate-300">
            <a className="hover:text-white" href="/audit">Audit</a>
            <a className="hover:text-white" href="/pricing">Prezzi</a>
            <a className="hover:text-white" href="/dashboard">Dashboard</a>
            <a className="rounded-xl bg-[#0A66C2] px-4 py-2 text-white font-semibold" href="/login">Accedi</a>
          </nav>
        </header>

        <section className="mt-14 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Prima di pubblicare su LinkedIn,
              <span className="text-[#2a8cff]"> verifica se il post porterà conversazioni e clienti</span>.
            </h1>
            <p className="mt-5 text-slate-300 text-lg max-w-xl">
              Incolli il testo → Pre-Flight ti dice cosa stai sbagliando, l’impatto sul risultato,
              ti riscrive il post (copy/paste) e ti suggerisce cosa pubblicare dopo per vendere di più.
            </p>

            <div className="mt-8 flex gap-3 flex-wrap">
              <a href="/audit" className="rounded-xl bg-[#0A66C2] px-6 py-3 font-semibold hover:brightness-110">
                Fai un Audit ora
              </a>
              <a href="/pricing" className="rounded-xl border border-slate-700 px-6 py-3 hover:bg-white/5">
                Vedi Pro (19,99€/mese)
              </a>
            </div>

            <div className="mt-6 text-sm text-slate-400">
              Non leggiamo analytics LinkedIn. Valutiamo il tuo contenuto e la tua strategia (storico) per aumentare la probabilità di DM e call.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-white/5 p-6">
            <div className="text-sm text-slate-400">Cosa ottieni in 8–12 secondi</div>
            <ul className="mt-4 space-y-3 text-slate-200">
              <li>✅ Verdetto: pubblicabile / ottimizza / non genererà conversazioni</li>
              <li>✅ Errore principale → impatto → correzione prioritaria (stile “chess.com”)</li>
              <li>✅ Riscrittura copy/paste + CTA coerente</li>
              <li>✅ Prossima mossa: cosa pubblicare per vendere di più</li>
              <li>✅ Suggerimento visual (immagine/grafica) come “plus”</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}