import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";
import {
  IconArrowRight,
  IconZap,
  IconEdit3,
  IconList,
  IconCheck,
  IconSparkles,
} from "@/components/shared/icons";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import StatBlock from "@/components/shared/StatBlock";
import GradientBand from "@/components/shared/GradientBand";
import Stepper from "@/components/shared/Stepper";
import MockPanel from "@/components/shared/MockPanel";
import Card from "@/components/shared/Card";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen">
      {/* hero */}
      <section className="relative bg-soft hero-gradient text-app py-32">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {/* subtle pattern */}
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <circle cx="10" cy="10" r="2" fill="white" />
            <circle cx="30" cy="30" r="2" fill="white" />
            <circle cx="50" cy="50" r="2" fill="white" />
            <circle cx="70" cy="70" r="2" fill="white" />
            <circle cx="90" cy="90" r="2" fill="white" />
          </svg>
        </div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto text-app">
            Trasforma i tuoi post <span className="text-primary font-bold">LinkedIn</span> in <span className="text-primary font-bold">conversazioni</span> e clienti.
          </h1>
          <p className="mt-4 max-w-2xl text-lg mx-auto">
            Se pubblichi e non succede nulla, non è “colpa dell’algoritmo”. È quasi sempre chiarezza, prova e CTA. Preflight analizza il tuo testo con un framework da consulente e ti consegna una riscrittura completa pronta da pubblicare.
          </p>

          <div className="mt-8"><MarketingCTA /></div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-soft px-3 py-1 rounded-full text-primary">Nessun login</span>
            <span className="bg-soft px-3 py-1 rounded-full text-primary">Risultato in 8–12 secondi</span>
            <span className="bg-soft px-3 py-1 rounded-full text-primary">
              Riscrittura completa + varianti
            </span>
          </div>

          {/* stat strip */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBlock
              value="3–5 secondi"
              label="È il tempo in cui chi scrolla decide se restare."
            />
            <StatBlock
              value="1 idea → 1 azione"
              label="Ti diciamo cosa cambiare prima, senza confusione."
            />
            <StatBlock
              value="Copy/Paste"
              label="Riscrittura pronta + hook e CTA alternative."
            />
          </div>
        </div>
      </section>

      {/* recognition section */}
      <section className="py-16 bg-soft border-t border-app">
        <Container className="text-app">
          <h2 className="text-3xl font-bold text-center flex items-center justify-center">
            <IconSparkles className="w-6 h-6 text-primary mr-2" />
            Se ti riconosci qui, Preflight è per te.
          </h2>
          <ul className="mt-8 max-w-2xl mx-auto space-y-4 text-app">
            <li className="flex items-start gap-2">
              <span className="bg-soft rounded-full p-2">
                <IconCheck className="w-4 h-4 text-primary" />
              </span>
              <span className="text-app">
                <strong>Pubblico ma non succede nulla</strong> (pochi commenti, zero DM).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-4 h-4 text-primary" /></span>
              <span className="text-app">
                <strong>La gente non capisce cosa vendo</strong> dopo 5 secondi sul post.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-4 h-4 text-primary" /></span>
              <span className="text-app">
                <strong>Ho idee, ma il testo non regge</strong>: hook debole, struttura piatta.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-4 h-4 text-primary" /></span>
              <span className="text-app">
                <strong>Mi manca prova</strong>: esempi, numeri, contesto, credibilità.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-soft rounded-full p-2"><IconCheck className="w-4 h-4 text-primary" /></span>
              <span className="text-app">
                <strong>Non so come chiudere</strong>: CTA confusa o assente.
              </span>
            </li>
          </ul>
        </Container>
      </section>

      {/* dashboard preview */}
      <Section>
        <Container>
          <h2 className="text-2xl font-semibold text-center">La tua Dashboard</h2>
          <p className="mt-2 text-center text-muted max-w-2xl mx-auto">
            Vedi audit recenti, punteggi e suggerimenti in un unico posto. Prova con questi esempi.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Come aumentare le conversioni con copy mirati</h3>
                  <div className="text-sm text-muted mt-1">20 Feb 2026</div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <div className="rounded-md bg-soft px-3 py-1 text-sm font-medium text-primary">Punteggio 82</div>
                </div>
              </div>
              <p className="mt-4 text-muted">Audit rapido: headline, CTA e struttura migliorate per aumentare il CTR.</p>
            </Card>

            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Checklist SEO per pagine prodotto</h3>
                  <div className="text-sm text-muted mt-1">15 Gen 2026</div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <div className="rounded-md bg-soft px-3 py-1 text-sm font-medium text-primary">Punteggio 74</div>
                </div>
              </div>
              <p className="mt-4 text-muted">Suggerimenti pratici su meta, struttura e velocità per aumentare il traffico organico.</p>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <a href="/dashboard" className="inline-block btn-primary rounded-xl px-6 py-3">Vai alla Dashboard</a>
          </div>
        </Container>
      </Section>

      {/* cosa facciamo */}
      <Section>
        <Container>
          <h2 className="text-3xl font-bold text-center">Cosa fa Preflight (davvero)</h2>
          <p className="mt-4 text-center text-muted max-w-2xl mx-auto">
            Non ti diamo consigli generici. Ti diamo un report: punteggi, motivazioni e una riscrittura completa.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl shadow-sm">
              <IconZap className="w-10 h-10 text-primary" />
              <h3 className="mt-4 font-semibold">Diagnosi con numeri</h3>
              <p className="mt-2 text-muted">
                Hook, chiarezza, credibilità, struttura e CTA: punteggio per sezione + motivazione.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl shadow-sm">
              <IconEdit3 className="w-10 h-10 text-primary" />
              <h3 className="mt-4 font-semibold">Riscrittura completa</h3>
              <p className="mt-2 text-muted">
                Una versione pronta da pubblicare + alternative (più corta / più diretta).
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-surface rounded-2xl shadow-sm">
              <IconList className="w-10 h-10 text-primary" />
              <h3 className="mt-4 font-semibold">Piano d’azione</h3>
              <p className="mt-2 text-muted">
                Top 3 fix prioritari + prossima mossa: cosa pubblicare dopo.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* how it works */}
      <Section className="bg-surface">
        <Container>
          <h2 className="text-3xl font-bold text-center">Come funziona in pratica</h2>
          <div className="mt-10">
            <Stepper
              steps={[
                {
                  icon: IconArrowRight,
                  title: "Incolla il testo",
                  description: "Post pronto o bozza.",
                },
                {
                  icon: IconArrowRight,
                  title: "Vedi l’analisi",
                  description: "Grafici, punteggi e punti deboli.",
                },
                {
                  icon: IconArrowRight,
                  title: "Copia e pubblica",
                  description: "Riscrittura completa + hook e CTA.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* perche section */}
      <Section className="bg-gradient-light">
        <Container>
          <h2 className="text-3xl font-bold text-center">Perché funziona (anche quando tu non ci sei)</h2>
          <p className="mt-4 text-muted max-w-3xl mx-auto text-center">
            LinkedIn lavora mentre sei in call, mentre dormi, mentre fai altro. Ma solo se il testo è chiaro e orientato a chi legge. Preflight fa il lavoro che di solito fai “a intuito”: misura, corregge, e ti dà una versione migliore.
          </p>
          <div className="mt-8 flex justify-center">
            <MockPanel title="Probabilità di risposta">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hook</span><span>40%</span>
                </div>
                <div className="h-2 bg-app border border-app rounded-full">
                  <div className="h-full bg-primary w-2/5"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Chiarezza</span><span>60%</span>
                </div>
                <div className="h-2 bg-app border border-app rounded-full">
                  <div className="h-full bg-primary w-3/5"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prova</span><span>30%</span>
                </div>
                <div className="h-2 bg-app border border-app rounded-full">
                  <div className="h-full bg-primary w-3/10"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CTA</span><span>50%</span>
                </div>
                <div className="h-2 bg-app border border-app rounded-full">
                  <div className="h-full bg-primary w-1/2"></div>
                </div>
                <div className="mt-2 text-xs">
                  <strong>Prima:</strong> confuso&nbsp;&nbsp;<strong>Dopo:</strong> chiaro
                </div>
              </div>
            </MockPanel>
          </div>
        </Container>
      </Section>

      {/* final CTA band */}
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
