import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import BackButton from "@/components/shared/BackButton";
import MarketingCTA from "@/components/shared/MarketingCTA";
import IconBadge from "@/components/shared/IconBadge";
import { IconTarget, IconChart, IconSparkles, IconCompass } from "@/components/shared/icons";

export default function HowItWorks() {
  return (
    <main className="min-h-screen">
      <Section className="pt-28 md:pt-32 bg-gradient-to-b from-[rgba(10,102,194,0.04)] to-transparent">
        <Container>
          <div className="pt-8"><BackButton /></div>
          <h1 className="text-4xl font-bold">Come funziona Preflight</h1>
          <p className="mt-4 text-muted max-w-2xl">Dal testo grezzo a un post pronto da pubblicare in pochi secondi.</p>
          <div className="mt-6"><MarketingCTA /></div>
        </Container>
      </Section>
        <Section className="pt-28 md:pt-32 hero-gradient">
          <Container>
            <div className="pt-8"><BackButton /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-4xl font-bold">Come funziona Preflight</h1>
                <p className="mt-4 text-muted max-w-2xl">Dal testo grezzo a un post pronto da pubblicare in pochi secondi.</p>
                <div className="mt-6"><MarketingCTA /></div>
              </div>
              <div className="hidden md:block relative">
                <div className="hero-illustration">
                  <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                    <defs>
                      <linearGradient id="g2" x1="0" x2="1">
                        <stop offset="0%" stop-color="#0A66C2" stop-opacity="0.1" />
                        <stop offset="100%" stop-color="#0A66C2" stop-opacity="0.02" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="600" height="400" rx="20" fill="url(#g2)" />
                    <circle cx="420" cy="80" r="38" fill="#fff" opacity="0.6" />
                    <path d="M0 200c60-40 140-60 220-30 80 30 160 10 240-30v160H0V200z" fill="#fff" opacity="0.05" />
                  </svg>
                </div>
              </div>
            </div>
          </Container>
        </Section>

      <Section className="bg-soft">
        <Container>
          <h2 className="text-3xl font-bold text-center">Passaggi</h2>
          <p className="mt-4 text-muted text-center max-w-2xl mx-auto">Segui questi semplici passi per trasformare la tua bozza in un post che genera conversazioni.</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mt-6 grid gap-6 md:grid-cols-1">
            <div className="p-6 bg-surface rounded-2xl flex items-start gap-4">
              <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
              <div>
                <h3 className="font-semibold">Incolla il tuo post</h3>
                <p className="mt-2 text-muted">Può essere una bozza o un contenuto già pronto.</p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl flex items-start gap-4">
              <IconBadge><IconChart className="w-5 h-5" /></IconBadge>
              <div>
                <h3 className="font-semibold">Analisi immediata</h3>
                <p className="mt-2 text-muted">Preflight valuta struttura, chiarezza, prova e CTA.</p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl flex items-start gap-4">
              <IconBadge><IconSparkles className="w-5 h-5" /></IconBadge>
              <div>
                <h3 className="font-semibold">Report visuale</h3>
                <p className="mt-2 text-muted">Punteggi e suggerimenti prioritari.</p>
              </div>
            </div>

            {/* Insert CTA after step 3 */}
            <div className="col-span-full mt-4 text-center"><MarketingCTA /></div>

            <div className="p-6 bg-surface rounded-2xl flex items-start gap-4">
              <IconBadge><IconCompass className="w-5 h-5" /></IconBadge>
              <div>
                <h3 className="font-semibold">Riscrittura completa</h3>
                <p className="mt-2 text-muted">Una nuova versione pronta copy/paste.</p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl flex items-start gap-4">
              <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
              <div>
                <h3 className="font-semibold">Pubblica con sicurezza</h3>
                <p className="mt-2 text-muted">Sai cosa aspettarti prima di pubblicare.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft2">
        <Container className="text-center">
          <MarketingCTA />
        </Container>
      </Section>
    </main>
  );
}
