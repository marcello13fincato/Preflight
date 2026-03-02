import Link from "next/link";
import {
  IconCheck,
} from "@/components/shared/icons";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import StatBlock from "@/components/shared/StatBlock";
import BackButton from "@/components/shared/BackButton";

export default function PerchePage() {
  return (
    <main className="min-h-screen">
      <Container>
        <div className="pt-8">
          <BackButton />
        </div>
      </Container>

      <Section className="pt-10 pb-8 bg-soft border-b border-app">
        <Container className="text-center text-app">
          <h1 className="text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto">
            Il tuo LinkedIn dovrebbe lavorare mentre tu fai altro.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-app">
            Ogni giorno perdi opportunità senza accorgertene: perché chi legge decide in pochi secondi se restare o scorrere. Preflight prende il tuo testo, lo misura con un framework e ti consegna una versione più chiara, credibile e orientata all’azione.
          </p>

          <div className="mt-8">
            <StatBlock value="3–5 secondi" label="È quanto basta per perdere (o guadagnare) una conversazione." />
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Cosa succede se non ottimizzi</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-5 h-5 text-primary" /></span>
              <div>
                <div className="font-semibold">Pubblicazioni che fanno impression, ma non aprono conversazioni.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-5 h-5 text-primary" /></span>
              <div>
                <div className="font-semibold">Messaggio confuso: chi legge non capisce cosa offri.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-5 h-5 text-primary" /></span>
              <div>
                <div className="font-semibold">Credibilità bassa: manca prova, esempi, contesto.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-5 h-5 text-primary" /></span>
              <div>
                <div className="font-semibold">CTA assente: anche chi è interessato non sa cosa fare.</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft border-b border-app text-app">
        <Container>
          <h2 className="text-2xl font-semibold">Perché Preflight è diverso</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div className="p-6 bg-surface rounded-2xl shadow-sm text-app text-center">
              <div className="text-lg font-semibold"><span className="text-primary font-bold">Misura, non indovina</span></div>
              <p className="mt-2 text-muted">Punteggi per sezione + motivazione. Sai cosa cambiare prima.</p>
            </div>

            <div className="p-6 bg-surface rounded-2xl shadow-sm text-app text-center">
              <div className="text-lg font-semibold"><span className="text-primary font-bold">Riscrive, non commenta</span></div>
              <p className="mt-2 text-muted">Ti dà un post completo copy/paste + varianti.</p>
            </div>

            <div className="p-6 bg-surface rounded-2xl shadow-sm text-app text-center">
              <div className="text-lg font-semibold"><span className="text-primary font-bold">Ti guida alla prossima mossa</span></div>
              <p className="mt-2 text-muted">Suggerisce cosa pubblicare dopo per aumentare risposte e DM.</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app">
        <Container>
          <h2 className="text-2xl font-semibold">Domande frequenti</h2>
          <div className="mt-6 space-y-4 max-w-3xl">
            <div>
              <div className="font-semibold">È solo un correttore di testo?</div>
              <div className="text-muted mt-1">No. Un correttore sistema la forma. Preflight lavora su conversione: hook, chiarezza, prova e CTA. Ti dice cosa non funziona e ti dà una riscrittura completa.</div>
            </div>

            <div>
              <div className="font-semibold">Funziona anche se non ho numeri o casi studio?</div>
              <div className="text-muted mt-1">Sì. Ti aiuta a costruire credibilità con contesto, esempi, processo e segnali di prova (anche senza “grandi numeri”).</div>
            </div>

            <div>
              <div className="font-semibold">Che differenza c’è tra “Generare conversazioni” e “Ottenere clienti”?</div>
              <div className="text-muted mt-1">Cambia la logica della CTA e della struttura. Conversazioni = domanda e commenti. Clienti = offerta chiara + invito a DM/call. Preflight adatta la riscrittura in base all’obiettivo.</div>
            </div>

            <div>
              <div className="font-semibold">Devo fare login?</div>
              <div className="text-muted mt-1">No. Puoi fare l’audit gratis senza login.</div>
            </div>

            <div>
              <div className="font-semibold">Quanto tempo ci vuole?</div>
              <div className="text-muted mt-1">Pochi secondi per il report. Poi puoi copiare la riscrittura e pubblicare subito.</div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft2 text-app">
        <Container className="text-center">
          <h2 className="text-2xl font-bold">Vuoi vedere cosa cambierei nel tuo post?</h2>
          <p className="mt-4 text-muted">Provalo con il tuo testo e ricevi un report gratuito.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="/audit" className="btn-primary rounded-xl px-6 py-3 font-semibold">Fai l’audit gratis</Link>
            <Link href="/how-it-works" className="link-primary">Come funziona</Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
