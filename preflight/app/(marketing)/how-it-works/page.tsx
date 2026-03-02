import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import MockPanel from "@/components/shared/MockPanel";

export default function HowItWorks() {
  return (
    <main className="min-h-screen">
      <Section className="pt-24">
        <Container>
          <h1 className="text-4xl font-bold text-text-primary">Non è magia. È metodo.</h1>
          <p className="mt-4 text-text-secondary max-w-2xl">
            Un audit in 40 controlli e una riscrittura pronta: ecco come operiamo dietro le quinte.
          </p>
        </Container>
      </Section>

      <Section className="bg-background-alt">
        <Container>
          <h2 className="text-3xl font-bold text-center">Un audit in 40 controlli</h2>
          <p className="mt-4 text-text-secondary text-center max-w-2xl mx-auto">
            Ogni post passa attraverso un framework che valuta Hook, Chiarezza, Prova, Struttura, Tono e CTA. Nulla è lasciato al caso.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl font-bold text-center">Dall’analisi alla riscrittura</h2>
          <ul className="mt-6 space-y-4 max-w-2xl mx-auto text-text-primary">
            <li>Punteggio totale</li>
            <li>Punti critici</li>
            <li>Riscrittura completa</li>
            <li>Varianti hook/CTA</li>
          </ul>
        </Container>
      </Section>

      <Section className="py-24">
        <Container className="text-center">
          <MockPanel title="Esempio report" className="max-w-md mx-auto">
            <p className="text-sm text-text-secondary">
              Punteggio totale, breakdown per sezione e suggerimenti specifici. + versione ottimizzata del post.
            </p>
          </MockPanel>
        </Container>
      </Section>
    </main>
  );
}
