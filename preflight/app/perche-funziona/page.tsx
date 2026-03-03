import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import Card from "@/components/shared/Card";
import BackButton from "@/components/shared/BackButton";
import MarketingCTA from "@/components/shared/MarketingCTA";

export default function PercheFunzionaPage() {
  return (
    <main className="min-h-screen">
      <Section>
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
          <ul className="mt-6 list-disc list-inside space-y-2">
            <li>Pubblicazioni viste ma senza conversazioni</li>
            <li>Profilo chiaro per te, confuso per chi legge</li>
            <li>Contenuti utili ma senza risposta</li>
            <li>Nessuna direzione per il lettore</li>
          </ul>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Cosa succede quando usi Preflight</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <h3 className="font-semibold">Analizza</h3>
              <p className="mt-2 text-muted">Punteggi su hook, chiarezza, prova e CTA.</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Spiega</h3>
              <p className="mt-2 text-muted">Capisci perché qualcosa non funziona.</p>
            </Card>
            <Card>
              <h3 className="font-semibold">Riscrive</h3>
              <p className="mt-2 text-muted">Ottieni un post completo pronto da pubblicare.</p>
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
