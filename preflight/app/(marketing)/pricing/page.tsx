import { plans } from "../../../lib/plans";

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
    </main>
  );
}

