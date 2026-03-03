import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import BackButton from "@/components/shared/BackButton";
import MarketingCTA from "@/components/shared/MarketingCTA";

export default function HowItWorks() {
  return (
    <main className="min-h-screen">
      <Section className="pt-24">
        <Container>
          <div className="pt-8"><BackButton /></div>
          <h1 className="text-4xl font-bold">Come funziona Preflight</h1>
          <p className="mt-4 text-muted max-w-2xl">Dal testo grezzo a un post pronto da pubblicare in pochi secondi.</p>
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
            <div className="p-6 bg-surface rounded-2xl">
              <h3 className="font-semibold">Incolla il tuo post</h3>
              <p className="mt-2 text-muted">Può essere una bozza o un contenuto già pronto.</p>
            </div>

            <div className="p-6 bg-surface rounded-2xl">
              <h3 className="font-semibold">Analisi immediata</h3>
              <p className="mt-2 text-muted">Preflight valuta struttura, chiarezza, prova e CTA.</p>
            </div>

            <div className="p-6 bg-surface rounded-2xl">
              <h3 className="font-semibold">Report visuale</h3>
              <p className="mt-2 text-muted">Punteggi e suggerimenti prioritari.</p>
            </div>

            {/* Insert CTA after step 3 */}
            <div className="col-span-full mt-4 text-center"><MarketingCTA /></div>

            <div className="p-6 bg-surface rounded-2xl">
              <h3 className="font-semibold">Riscrittura completa</h3>
              <p className="mt-2 text-muted">Una nuova versione pronta copy/paste.</p>
            </div>

            <div className="p-6 bg-surface rounded-2xl">
              <h3 className="font-semibold">Pubblica con sicurezza</h3>
              <p className="mt-2 text-muted">Sai cosa aspettarti prima di pubblicare.</p>
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
