import Link from "next/link";
import {
  IconZap,
  IconChart,
  IconSparkles,
  IconArrowRight,
  IconCheck,
} from "@/components/shared/icons";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import StatBlock from "@/components/shared/StatBlock";
import GradientBand from "@/components/shared/GradientBand";

export default function PerchePage() {
  return (
    <main className="min-h-screen">
      <Section className="pt-32 pb-16 bg-gradient-to-r from-primary to-primary-hover text-white">
        <Container className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto">
            Il tuo LinkedIn dovrebbe lavorare al posto tuo.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto">
            Chi decide se ascoltarti lo fa in pochi secondi. Se il tuo messaggio non è immediato, stai regalando attenzione (e opportunità). Preflight trasforma testo confuso in un post che si capisce e invita a rispondere.
          </p>
          <div className="mt-12">
            <StatBlock
              value="3–5 secondi"
              label="È quanto basta per perdere (o guadagnare) una conversazione."
            />
          </div>
        </Container>
      </Section>

      <Section className="bg-soft">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold flex items-center">
                <IconZap className="w-6 h-6 text-primary mr-2" />
                Perdi opportunità senza accorgertene
              </h2>
              <p className="text-muted mt-2">
                Non è che il contenuto è scarso. È che non arriva.
              </p>
            </div>
            <div className="">
              <h2 className="text-2xl font-semibold flex items-center">
                <IconChart className="w-6 h-6 text-primary mr-2" />
                La chiarezza batte la competenza
              </h2>
              <p className="text-muted mt-2">
                Se non si capisce subito, non conta quanto sei bravo.
              </p>
            </div>
            <div className="">
              <h2 className="text-2xl font-semibold flex items-center">
                <IconSparkles className="w-6 h-6 text-primary mr-2" />
                La prova crea fiducia
              </h2>
              <p className="text-muted mt-2">
                Numeri, esempi, contesto: la credibilità si costruisce così.
              </p>
            </div>
            <div className="">
              <h2 className="text-2xl font-semibold flex items-center">
                <IconArrowRight className="w-6 h-6 text-primary mr-2" />
                La CTA guida l’azione
              </h2>
              <p className="text-muted mt-2">
                Senza una chiusura chiara, chi legge non fa nulla.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <h2 className="text-3xl font-bold text-center">Cosa misura Preflight</h2>
          <ul className="mt-6 max-w-3xl mx-auto space-y-4 text-app">
            <li className="flex items-center gap-2">
              <span className="bg-soft rounded-full p-1">
                <IconCheck className="w-4 h-4 text-primary" />
              </span>
              <span><strong>Hook</strong>: fermo lo scroll o no?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-soft rounded-full p-1">
                <IconCheck className="w-4 h-4 text-primary" />
              </span>
              <span><strong>Chiarezza</strong>: si capisce per chi è?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-soft rounded-full p-1">
                <IconCheck className="w-4 h-4 text-primary" />
              </span>
              <span><strong>Prova</strong>: perché dovrei crederti?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-soft rounded-full p-1">
                <IconCheck className="w-4 h-4 text-primary" />
              </span>
              <span><strong>Struttura</strong>: si legge in 10 secondi?</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-soft rounded-full p-1">
                <IconCheck className="w-4 h-4 text-primary" />
              </span>
              <span><strong>CTA</strong>: cosa deve fare chi legge?</span>
            </li>
          </ul>
        </Container>
      </Section>

      <GradientBand>
        <Container className="text-center">
          <h2 className="text-3xl font-bold">Vuoi pubblicare con più sicurezza (e più risultati)?</h2>
          <p className="mt-4 max-w-xl mx-auto">
            Fai un audit gratuito: capisci cosa migliorare e ottieni una riscrittura pronta da pubblicare.
          </p>
          <Link
            href="/audit"
            className="mt-8 inline-block rounded-xl bg-surface text-primary px-8 py-4 font-semibold shadow-lg hover:bg-soft2 transition"
          >
            Fai l’audit gratis
          </Link>
        </Container>
      </GradientBand>
    </main>
  );
}
