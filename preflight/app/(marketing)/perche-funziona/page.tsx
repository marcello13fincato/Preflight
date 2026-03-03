import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import Card from "@/components/shared/Card";
import BackButton from "@/components/shared/BackButton";
import MarketingCTA from "@/components/shared/MarketingCTA";
import IconBadge from "@/components/shared/IconBadge";
import { IconTarget, IconChart, IconSparkles } from "@/components/shared/icons";

export default function PercheFunzionaPage() {
  return (
    <main className="min-h-screen">
      <Section className="pt-28 md:pt-32">
        <Container>
          <div className="pt-8"><BackButton /></div>
          <h1 className="text-4xl font-bold">Perché Preflight funziona (quando altri strumenti falliscono)</h1>
          <p className="mt-4 text-muted max-w-3xl">La maggior parte dei post LinkedIn non fallisce per mancanza di competenze. Fallisce perché il messaggio non è immediatamente chiaro per chi legge. Preflight analizza il tuo contenuto come farebbe un consulente e lo trasforma in un post comprensibile, credibile e orientato all’azione.</p>
          <div className="mt-6"><MarketingCTA /></div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Il vero problema non è l’algoritmo</h2>
          <ul className="mt-6 list-none grid gap-4 md:grid-cols-2">
            <li className="flex items-start gap-3">
              <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Pubblicazioni viste ma senza conversazioni</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconBadge><IconChart className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Profilo chiaro per te, confuso per chi legge</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconBadge><IconSparkles className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Contenuti utili ma senza risposta</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Nessuna direzione per il lettore</div>
              </div>
            </li>
          </ul>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Cosa succede quando usi Preflight</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <div className="flex items-start gap-3">
                <IconBadge><IconChart className="w-5 h-5" /></IconBadge>
                <div>
                  <h3 className="font-semibold">Analizza</h3>
                  <p className="mt-2 text-muted">Punteggi su hook, chiarezza, prova e CTA.</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <IconBadge><IconSparkles className="w-5 h-5" /></IconBadge>
                <div>
                  <h3 className="font-semibold">Spiega</h3>
                  <p className="mt-2 text-muted">Capisci perché qualcosa non funziona.</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
                <div>
                  <h3 className="font-semibold">Riscrive</h3>
                  <p className="mt-2 text-muted">Ottieni un post completo pronto da pubblicare.</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Non è AI generica. È un framework.</h2>
          <p className="mt-4 text-muted max-w-3xl">Preflight non inventa contenuti. Applica una struttura testata su migliaia di post: attenzione iniziale, chiarezza del messaggio, credibilità e invito all’azione.</p>
          <div className="mt-6"><MarketingCTA /></div>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app">
        <Container>
          <h2 className="text-2xl font-semibold">Cosa cambia concretamente</h2>
          <ul className="mt-6 list-disc list-inside space-y-2">
            <li>Più commenti</li>
            <li>Più conversazioni</li>
            <li>Più messaggi privati</li>
            <li>Maggiore chiarezza percepita</li>
          </ul>
        </Container>
      </Section>

      <Section className="py-12 bg-soft2 text-app">
        <Container className="text-center">
          <MarketingCTA />
        </Container>
      </Section>
    </main>
  );
}
