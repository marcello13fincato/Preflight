export default function Home() {
  return (
    <main className="min-h-screen">
      {/* layout already provides container & header */}
      <section className="mt-14 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Prima di pubblicare su LinkedIn,
              <span className="text-accent"> verifica se il post porterà conversazioni e clienti</span>.
            </h1>
            <p className="mt-5 text-text-secondary text-lg max-w-xl">
              Incolli il testo → Pre-Flight ti dice cosa stai sbagliando, l’impatto sul risultato,
              ti riscrive il post (copy/paste) e ti suggerisce cosa pubblicare dopo per vendere di più.
            </p>

            <div className="mt-10 flex gap-4 flex-wrap">
              <a
                href="/audit"
                className="rounded-xl bg-primary px-8 py-4 font-semibold text-text-primary shadow-premium transition duration-200 ease hover:bg-primary-hover hover:shadow-lg"
              >
                Fai un Audit ora
              </a>
              <a
                href="/pricing"
                className="rounded-xl border border-text-primary px-8 py-4 text-text-primary transition duration-200 ease hover:bg-white/10"
              >
                Vedi Pro (19,99€/mese)
              </a>
            </div>

            <div className="mt-6 text-sm text-text-secondary">
              Non leggiamo analytics LinkedIn. Valutiamo il tuo contenuto e la tua strategia (storico) per aumentare la probabilità di DM e call.
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background-alt p-8 shadow-premium transition-shadow duration-200 ease hover:shadow-lg">
            <div className="text-sm text-text-secondary">Cosa ottieni in 8–12 secondi</div>
            <ul className="mt-4 space-y-3 text-text-secondary">
              <li>✅ Verdetto: pubblicabile / ottimizza / non genererà conversazioni</li>
              <li>✅ Errore principale → impatto → correzione prioritaria (stile “chess.com”)</li>
              <li>✅ Riscrittura copy/paste + CTA coerente</li>
              <li>✅ Prossima mossa: cosa pubblicare per vendere di più</li>
              <li>✅ Suggerimento visual (immagine/grafica) come “plus”</li>
            </ul>
          </div>
        </section>
    </main>
  );
}