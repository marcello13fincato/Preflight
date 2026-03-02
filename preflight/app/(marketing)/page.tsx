import Link from "next/link";
import { IconArrowRight, IconZap, IconEdit3, IconList } from "@/components/shared/icons";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* hero */}
      <section className="relative bg-gradient-to-r from-primary to-primary-hover text-white py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Trasforma i tuoi post LinkedIn in conversazioni e clienti.
          </h1>
          <p className="mt-4 max-w-2xl text-lg">
            Incolla un post (o una bozza): Preflight lo analizza con un framework “da
            consulente”, ti mostra cosa non sta funzionando con punteggi e grafici, e ti
            consegna una riscrittura completa pronta da pubblicare.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/audit"
              className="rounded-xl bg-white text-primary px-8 py-4 font-semibold shadow-lg hover:bg-white/90 transition"
            >
              Fai l’audit gratis
            </Link>
            <Link
              href="/examples"
              className="rounded-xl border border-white px-8 py-4 text-white hover:bg-white/20 transition"
            >
              Vedi esempi reali
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">Nessun login</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Risultato in 8–12 secondi</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Consigli pratici + riscrittura copy/paste
            </span>
          </div>
        </div>
      </section>

      {/* proof bar */}
      <section className="bg-background-alt py-6">
        <div className="container mx-auto px-6 text-center text-text-primary text-sm">
          Basato su un framework in 40 controlli (Hook, chiarezza, prova, tono, CTA,
          struttura, leggibilità). Output sempre uguale e confrontabile: punteggi →
          motivazioni → azioni → riscrittura.
        </div>
      </section>

      {/* cosa facciamo */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">Cosa fa Preflight (davvero)</h2>
          <p className="mt-4 text-center text-text-secondary max-w-2xl mx-auto">
            La maggior parte dei post fallisce non perché “scrivi male”, ma perché manca
            una cosa: un percorso chiaro per chi legge. Preflight ti dice dove si rompe
            quel percorso e come sistemarlo.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-background-alt rounded-2xl shadow-sm">
              <IconZap className="w-10 h-10 text-primary" />
              <h3 className="mt-4 font-semibold">Diagnosi (con numeri)</h3>
              <p className="mt-2 text-text-secondary">
                Misuriamo Hook, chiarezza, credibilità, struttura e CTA. Ti diamo un
                punteggio per sezione e il motivo.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background-alt rounded-2xl shadow-sm">
              <IconEdit3 className="w-10 h-10 text-primary" />
              <h3 className="mt-4 font-semibold">Riscrittura completa</h3>
              <p className="mt-2 text-text-secondary">
                Ricevi 1 versione “pronta da pubblicare” + varianti di hook, CTA e
                snippet.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background-alt rounded-2xl shadow-sm">
              <IconList className="w-10 h-10 text-primary" />
              <h3 className="mt-4 font-semibold">Piano d’azione</h3>
              <p className="mt-2 text-text-secondary">
                Top 3 interventi prioritari + suggerimenti su cosa pubblicare dopo per
                aumentare risposte e DM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* pain section */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-center">
            Perché molti post LinkedIn non generano nulla
          </h2>
          <ul className="mt-6 list-disc list-inside space-y-2 text-text-secondary">
            <li>Hook debole: non crea curiosità nei primi 2–3 secondi</li>
            <li>Troppo “io”: manca il problema del lettore (cliente)</li>
            <li>Zero prova: numeri, esempi, risultati, contesto</li>
            <li>Struttura piatta: muri di testo, senza ritmo e scannabilità</li>
            <li>CTA confusa: chi legge non capisce cosa fare dopo</li>
          </ul>
          <p className="mt-4 text-center text-text-secondary">
            Preflight evidenzia questi errori in modo misurabile e ti dà una
            riscrittura che li corregge.
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-center">Come funziona in pratica</h2>
          <div className="mt-10 space-y-8">
            <div className="flex items-start gap-4">
              <IconArrowRight className="w-6 h-6 text-primary mt-1" />
              <div>
                <div className="font-semibold">Incolla il testo</div>
                <div className="text-text-secondary text-sm">Post pronto o bozza.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconArrowRight className="w-6 h-6 text-primary mt-1" />
              <div>
                <div className="font-semibold">Ricevi analisi + grafici</div>
                <div className="text-text-secondary text-sm">
                  Punteggio totale, breakdown per sezione, cosa migliorare prima.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <IconArrowRight className="w-6 h-6 text-primary mt-1" />
              <div>
                <div className="font-semibold">Copia la riscrittura</div>
                <div className="text-text-secondary text-sm">
                  Versione ottimizzata + alternative di hook e CTA.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* examples section */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Prima / Dopo (cosa cambia davvero)</h2>
          <p className="mt-4 text-text-secondary">
            Non “consigli generici”: qui vedi come cambiano hook, struttura e CTA.
          </p>
          <Link
            href="/examples"
            className="mt-6 inline-block rounded-xl bg-primary px-8 py-4 font-semibold text-text-primary shadow-lg hover:bg-primary-hover transition"
          >
            Guarda gli esempi
          </Link>
        </div>
      </section>

      {/* final CTA */}
      <section className="relative bg-gradient-to-r from-primary to-primary-hover text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Vuoi pubblicare con più sicurezza (e più risultati)?
          </h2>
          <p className="mt-4 max-w-xl mx-auto">
            Fai un audit gratuito: capisci cosa migliorare e ottieni una riscrittura pronta da
            pubblicare.
          </p>
          <Link
            href="/audit"
            className="mt-8 inline-block rounded-xl bg-white text-primary px-8 py-4 font-semibold shadow-lg hover:bg-white/90 transition"
          >
            Fai l’audit gratis
          </Link>
        </div>
      </section>
    </main>
  );
}
