export default function Examples() {
  return (
    <main className="min-h-screen">
      <h1 className="text-4xl font-bold text-text-primary">Esempi reali</h1>
      <p className="mt-4 text-text-secondary max-w-2xl">
        Vedi con i tuoi occhi come piccoli aggiustamenti aumentino reazioni e commenti.
        I seguenti mock mostrano originali e versioni ottimizzate generate da Preflight.
      </p>
      <div className="mt-8 space-y-8">
        <section className="space-y-2">
          <div className="text-sm text-text-secondary">Originale</div>
          <div className="rounded-lg border border-border bg-background-alt p-4">
            <p>Oggi voglio parlare del mio nuovo progetto che sto per lanciare...</p>
          </div>
          <div className="text-sm text-text-secondary">Riscrittura suggerita</div>
          <div className="rounded-lg border border-border bg-background-alt p-4 bg-accent/10">
            <p>🚀 Scopri come il mio progetto trasforma le vendite B2B in meno di 30 giorni...</p>
          </div>
        </section>
        {/* Add additional mock examples as needed */}
      </div>
    </main>
  );
}
