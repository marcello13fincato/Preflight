import Link from "next/link";

export default function Examples() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-text-primary text-center">Esempi reali</h1>
        <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-center">
          Vedi con i tuoi occhi come piccoli aggiustamenti aumentino reazioni e commenti.
          I seguenti mock mostrano originali e versioni ottimizzate generate da Preflight.
        </p>
        <div className="mt-8 space-y-12">
          <section className="space-y-4">
            <div className="text-sm text-text-secondary">Originale</div>
            <div className="rounded-lg border border-border bg-background-alt p-6">
              <p>Oggi voglio parlare del mio nuovo progetto che sto per lanciare...</p>
            </div>
            <div className="text-sm text-text-secondary">Riscrittura suggerita</div>
            <div className="rounded-lg border border-border bg-accent/10 p-6">
              <p>🚀 Scopri come il mio progetto trasforma le vendite B2B in meno di 30 giorni...</p>
            </div>
          </section>
          {/* altri esempi mock */}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/audit"
            className="rounded-xl bg-primary px-8 py-4 font-semibold text-text-primary shadow-lg hover:bg-primary-hover transition"
          >
            Prova un audit gratuito
          </Link>
        </div>
      </div>
    </main>
  );
}
