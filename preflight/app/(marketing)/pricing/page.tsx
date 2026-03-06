import Link from "next/link";

const freeFeatures = [
  "Accesso alla dashboard",
  "Primi test dei moduli principali",
  "Visione generale del sistema",
  "Alcune risposte e suggerimenti (limitati)",
];

const proFeatures = [
  { label: "Piano contenuti personalizzato", icon: "📋" },
  { label: "Analisi profilo cliente completa", icon: "🔍" },
  { label: "Risposte ai commenti illimitate", icon: "💬" },
  { label: "Messaggi e follow-up guidati", icon: "✉️" },
  { label: "Client heat level (temperatura del lead)", icon: "🔥" },
  { label: "Prospect intelligence avanzata", icon: "🧠" },
  { label: "Pipeline clienti completa", icon: "📊" },
  { label: "Simulazione conversazioni", icon: "🎯" },
  { label: "Opportunità da cercare su LinkedIn", icon: "🔎" },
];

const comparisonRows = [
  { label: "Piano contenuti", free: false, pro: true },
  { label: "Risposte ai commenti", free: "Base", pro: "Illimitate" },
  { label: "Messaggi e follow-up", free: false, pro: true },
  { label: "Analisi profilo cliente", free: false, pro: true },
  { label: "Client heat level", free: false, pro: true },
  { label: "Pipeline clienti", free: false, pro: true },
  { label: "Simulazione conversazioni", free: false, pro: true },
  { label: "Opportunità da cercare", free: false, pro: true },
];

const faqs = [
  {
    q: "Posso iniziare gratis?",
    a: "Sì. Puoi accedere alla dashboard e testare i moduli principali senza inserire una carta di credito. Il piano base ti permette di capire come funziona il sistema prima di sbloccare tutto.",
  },
  {
    q: "Serve collegare LinkedIn?",
    a: "No. Preflight funziona con un semplice copia e incolla: incolla il commento, il messaggio o il profilo e il sistema ti suggerisce cosa fare. Nessuna integrazione tecnica richiesta.",
  },
  {
    q: "È adatto anche se parto da zero?",
    a: "Assolutamente sì. Preflight è pensato per freelance e consulenti che vogliono iniziare a usare LinkedIn in modo commerciale, anche senza esperienza pregressa.",
  },
  {
    q: "Posso cambiare piano?",
    a: "Sì, puoi passare dal piano base al completo in qualsiasi momento. Nessun vincolo a lungo termine.",
  },
  {
    q: "Il sistema scrive tutto da solo?",
    a: "No. Preflight ti guida e ti suggerisce cosa scrivere, ma sei sempre tu a decidere e personalizzare. L'obiettivo è renderti più efficace, non sostituirti.",
  },
  {
    q: "È pensato per italiani?",
    a: "Sì. Tutto il sistema è in italiano: interfaccia, suggerimenti, contenuti e supporto. Preflight è costruito per il mercato italiano.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen">

      {/* SEZIONE 1 — HERO */}
      <section className="hero-gradient rounded-2xl border border-app bg-soft p-10 md:p-16 mb-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-white border border-app px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>
          Piani e prezzi
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
          Scegli il piano per usare LinkedIn in modo più commerciale
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Non stai pagando per dei contenuti.<br />
          Stai sbloccando un sistema per trovare clienti in modo più chiaro, più costante e più efficace.
        </p>
        <div className="mt-8">
          <Link href="/app/onboarding" className="btn-primary px-6 py-3 text-sm font-semibold shadow-sm inline-block">
            Inizia ora
          </Link>
        </div>
      </section>

      {/* SEZIONE 2 — PIANO BASE */}
      <section className="mb-10 rounded-2xl border border-app bg-white p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-2">Puoi già iniziare a capire il sistema</h2>
        <p className="text-muted mb-8">Con il piano base hai accesso a una versione ridotta di Preflight. Sufficiente per capire come funziona il sistema.</p>
        <div className="max-w-md rounded-xl border border-app bg-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Piano Base</p>
              <p className="text-2xl font-extrabold mt-1">Gratuito</p>
            </div>
            <span className="rounded-full bg-white border border-app px-3 py-1 text-xs font-medium text-muted">Limitato</span>
          </div>
          <ul className="space-y-2">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                {f}
              </li>
            ))}
          </ul>
          {/* Blurred / locked features preview */}
          <div className="mt-4 rounded-lg border border-dashed border-app bg-white p-4 select-none" style={{ filter: "blur(3px)", pointerEvents: "none" }}>
            <div className="space-y-2">
              <div className="h-3 rounded bg-primary/10 w-3/4" />
              <div className="h-3 rounded bg-primary/10 w-1/2" />
              <div className="h-3 rounded bg-primary/10 w-5/6" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted text-center">🔒 Alcune funzioni sono disponibili solo con il piano completo</p>
        </div>
      </section>

      {/* SEZIONE 3 — PIANO COMPLETO */}
      <section className="mb-10 rounded-2xl border border-primary/20 bg-soft p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-2">Quando sblocchi il piano completo, il sistema cambia livello</h2>
        <p className="text-muted mb-8">Qui inizi davvero a vendere meglio. Ogni modulo è pensato per aiutarti a trovare, gestire e convertire clienti da LinkedIn.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proFeatures.map((f) => (
            <div key={f.label} className="rounded-xl border border-app bg-white p-5 flex items-start gap-3 shadow-sm">
              <span className="text-xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold">{f.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-white p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Piano Pro</p>
            <p className="text-4xl font-extrabold mt-1">€19,99<span className="text-lg font-normal text-muted">/mese</span></p>
            <p className="text-sm text-muted mt-1">Tutto incluso. Nessun extra.</p>
          </div>
          <Link href="/app/onboarding" className="btn-primary px-6 py-3 text-sm font-semibold shadow-sm inline-block">
            Inizia adesso
          </Link>
        </div>
      </section>

      {/* SEZIONE 4 — CONFRONTO */}
      <section className="mb-10 rounded-2xl border border-app bg-white p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-2">Cosa cambia davvero</h2>
        <p className="text-muted mb-8">Un confronto semplice tra il piano base e quello completo.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-app">
                <th className="text-left py-3 pr-6 font-semibold text-muted">Funzione</th>
                <th className="py-3 px-4 text-center font-semibold">Base</th>
                <th className="py-3 px-4 text-center font-semibold text-primary">Pro</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={row.label} className={`border-b border-app ${i % 2 === 0 ? "bg-soft-2" : ""}`}>
                  <td className="py-3 pr-6 font-medium">{row.label}</td>
                  <td className="py-3 px-4 text-center">
                    {row.free === false ? (
                      <span className="text-muted">🔒</span>
                    ) : (
                      <span className="text-primary text-xs font-medium">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.pro === "string" ? (
                      <span className="text-primary text-xs font-semibold">{row.pro}</span>
                    ) : (
                      <svg className="inline-block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SEZIONE 5 — PREZZO COME INVESTIMENTO */}
      <section className="mb-10 rounded-2xl border border-app bg-soft p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold leading-snug">Un sistema clienti costa meno di un cliente perso</h2>
            <p className="mt-4 text-muted">
              Bastano poche conversazioni gestite meglio per ripagare l&rsquo;abbonamento.
            </p>
            <p className="mt-3 text-muted">
              Non è un costo. È un investimento nel tuo sistema commerciale.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-app bg-white p-5 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-primary">23 MLN</div>
              <div className="mt-1 text-xs text-muted">persone su LinkedIn in Italia</div>
            </div>
            <div className="rounded-xl border border-app bg-white p-5 text-center shadow-sm">
              <div className="text-3xl font-extrabold text-primary">1 B2B</div>
              <div className="mt-1 text-xs text-muted">cliente trovato ripaga mesi di abbonamento</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE 6 — FAQ */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-8 text-center">Domande frequenti</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-app bg-white p-6 shadow-sm">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEZIONE 7 — CTA FINALE */}
      <section className="mb-10 rounded-2xl bg-primary p-10 md:p-16 text-white text-center">
        <h2 className="text-3xl font-bold max-w-xl mx-auto leading-snug">
          Scegli il piano e costruisci il tuo sistema clienti
        </h2>
        <p className="mt-4 text-white/80 max-w-md mx-auto">
          Inizia gratis. Sblocca tutto quando sei pronto.
        </p>
        <Link href="/app/onboarding" className="mt-8 inline-block bg-white text-primary font-bold px-8 py-4 rounded-xl shadow-md hover:bg-soft transition-colors text-sm">
          Inizia adesso
        </Link>
      </section>

    </main>
  );
}
