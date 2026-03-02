import { plans } from "../../../lib/plans";
import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";

export default function Pricing() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="mt-10 text-4xl font-bold text-text-primary">Prezzi</h1>
        <p className="mt-3 text-text-secondary max-w-2xl">
          Free per provare. Pro per usare davvero la piattaforma: storico, piano settimanale e audit illimitati.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border ${
                plan.name === "Pro" ? "border-primary bg-background-alt" : "border-border bg-background-alt"
              } p-8 shadow-premium transition-shadow duration-200 ease hover:shadow-lg`}
            >
              <div
                className={`text-sm ${
                  plan.name === "Pro" ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {plan.name}
              </div>
              <div className="text-4xl font-bold mt-2 text-text-primary">
                {plan.price}
                {plan.period && <span className="text-lg font-medium">{plan.period}</span>}
              </div>
              <ul
                className={`mt-6 space-y-2 ${
                  plan.name === "Pro" ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                className={`mt-7 inline-block rounded-xl ${
                  plan.name === "Pro" ? "bg-primary text-text-primary" : "border border-border text-text-primary"
                } px-5 py-3 font-semibold hover:bg-primary-hover transition-colors duration-200 ease`}
              >
                {plan.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>

      <Section className="bg-background-alt">
        <Container>
          <h2 className="text-3xl font-bold text-center">Quanto vale 1 post che genera conversazioni?</h2>
          <p className="mt-4 text-text-secondary text-center max-w-2xl mx-auto">
            Se anche solo 1 conversazione porta un’opportunità, il piano si ripaga da solo.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <dl className="mt-4 space-y-4">
            <dt className="font-semibold">Come faccio a pagare?</dt>
            <dd className="text-text-secondary">Carte, bonifico o altri metodi saranno supportati in produzione.</dd>
            <dt className="font-semibold">Posso cancellare il piano Pro?</dt>
            <dd className="text-text-secondary">Sì, è possibile cancellare in qualsiasi momento senza penali.</dd>
            <dt className="font-semibold">Cosa succede ai miei dati?</dt>
            <dd className="text-text-secondary">Non conserviamo post pubblicati e non accediamo al tuo profilo LinkedIn.</dd>
          </dl>
        </Container>
      </Section>
    </main>
  );
}

