import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    const { redirect } = await import("next/navigation");
    redirect("/app");
  }

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative hero-gradient rounded-3xl border border-app bg-soft overflow-hidden px-8 py-20 md:px-16 md:py-28 text-center">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-block mb-4 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            🚀 Il tuo sistema clienti su LinkedIn
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            LinkedIn non è un social.<br />
            <span className="text-primary">È la tua pagina di vendita.</span>
          </h1>
          <p className="mt-6 text-lg text-muted md:text-xl">
            Preflight ti aiuta a trasformare post, commenti e messaggi<br className="hidden md:block" />
            in conversazioni, call e clienti.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/app/onboarding"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold shadow-md transition hover:shadow-lg"
            >
              Crea il tuo sistema clienti →
            </Link>
            <Link
              href="/how-it-works"
              className="btn-secondary inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium"
            >
              Guarda come funziona
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">Nessuna carta richiesta · Setup in 5 minuti</p>
        </div>
      </section>

      {/* ─── 2. PROBLEMA ─────────────────────────────────────────────────── */}
      <section className="mt-20 mx-auto max-w-4xl px-4 text-center">
        <span className="inline-block mb-3 rounded-full bg-red-50 px-4 py-1 text-sm font-semibold text-red-600">
          Il problema
        </span>
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Pubblicare su LinkedIn non basta.
        </h2>
        <p className="mt-4 text-lg text-muted">
          Hai creato contenuti, ottimizzato il profilo, fatto like.<br />
          Ma i clienti non arrivano. <strong>Non è colpa tua.</strong>
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: "📢", title: "Pubblichi senza strategia", desc: "Post senza un obiettivo commerciale non generano lead, solo like." },
            { icon: "💬", title: "Commenti senza conversioni", desc: "Rispondi ai commenti senza sapere come portare la conversazione avanti." },
            { icon: "✉️", title: "I messaggi restano senza risposta", desc: "Non sai come scrivere DM che aprono porte, non quelli che vengono ignorati." },
          ].map((item) => (
            <div key={item.title} className="card rounded-2xl border border-app p-6 text-left shadow-sm">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 font-bold text-base">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. IL SISTEMA ───────────────────────────────────────────────── */}
      <section className="mt-20 rounded-3xl border border-app bg-soft-2 px-8 py-16 md:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block mb-3 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Il sistema
          </span>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Dal post al cliente: un flusso completo.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Preflight ti guida in ogni fase del processo commerciale su LinkedIn.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-0 md:flex-row md:justify-center md:gap-0">
          {[
            { step: "POST", icon: "✍️", desc: "Scrivi contenuti che attirano i tuoi clienti ideali" },
            { step: "COMMENTI", icon: "💬", desc: "Rispondi in modo strategico per iniziare conversazioni" },
            { step: "MESSAGGI", icon: "✉️", desc: "Invia DM personalizzati che ottengono risposte" },
            { step: "CALL", icon: "📞", desc: "Converti le conversazioni in appuntamenti qualificati" },
            { step: "CLIENTE", icon: "🎯", desc: "Chiudi clienti in modo naturale e ripetibile" },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex flex-col items-center md:flex-row">
              <div className="flex flex-col items-center rounded-2xl border border-app bg-white px-6 py-5 shadow-sm text-center w-40">
                <span className="text-3xl">{item.icon}</span>
                <span className="mt-2 text-xs font-extrabold uppercase tracking-wider text-primary">{item.step}</span>
                <p className="mt-1 text-xs text-muted leading-snug">{item.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <span className="my-2 text-2xl font-bold text-primary md:mx-2 md:my-0">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. DEMO PRODOTTO ────────────────────────────────────────────── */}
      <section className="mt-20 mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Il prodotto
          </span>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Strumenti AI per ogni fase del processo.
          </h2>
          <p className="mt-4 text-lg text-muted">Tutto ciò di cui hai bisogno, in un unico sistema integrato.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: "Generatore Post", icon: "✍️", desc: "Crea post ottimizzati per la tua offerta e il tuo ICP.", color: "bg-blue-50" },
            { title: "Risposte ai Commenti", icon: "💬", desc: "Trasforma ogni commento in una potenziale conversazione.", color: "bg-purple-50" },
            { title: "Assistente Messaggi", icon: "✉️", desc: "DM personalizzati che aprono porte e ottengono risposte.", color: "bg-green-50" },
            { title: "Trova Opportunità", icon: "🔍", desc: "Identifica i prospect più caldi e come approciarli.", color: "bg-orange-50" },
          ].map((item) => (
            <div key={item.title} className="relative overflow-hidden rounded-2xl border border-app shadow-sm">
              {/* mock screenshot blurred */}
              <div className={`${item.color} h-48 w-full flex items-center justify-center select-none`}>
                <div className="blur-sm w-full h-full flex flex-col gap-3 p-6">
                  <div className="h-4 rounded-full bg-gray-300 w-3/4" />
                  <div className="h-3 rounded-full bg-gray-200 w-full" />
                  <div className="h-3 rounded-full bg-gray-200 w-5/6" />
                  <div className="h-3 rounded-full bg-gray-200 w-4/5" />
                  <div className="mt-2 h-8 rounded-xl bg-primary/30 w-40" />
                </div>
              </div>
              <div className="p-5">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-2 font-bold text-base">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. ANALISI PROFILO LINKEDIN ─────────────────────────────────── */}
      <section className="mt-20 rounded-3xl border border-app bg-soft px-8 py-16 md:px-16">
        <div className="mx-auto max-w-4xl md:flex md:items-center md:gap-12">
          <div className="flex-1">
            <span className="inline-block mb-3 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Analisi profilo
            </span>
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Audit del tuo profilo LinkedIn gratuito.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Scopri quanto è efficace il tuo profilo per attirare clienti.
              Ottieni un punteggio dettagliato e suggerimenti concreti.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Analisi headline e sommario",
                "Valutazione sezione esperienza",
                "Ottimizzazione per i tuoi clienti ideali",
                "Piano di miglioramento prioritizzato",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/audit" className="mt-8 inline-flex items-center gap-2 btn-primary rounded-full px-8 py-4 font-bold shadow-md">
              Analizza il tuo profilo gratis →
            </Link>
          </div>

          {/* mock audit card */}
          <div className="mt-10 md:mt-0 md:w-72 shrink-0">
            <div className="relative rounded-2xl border border-app bg-white p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Punteggio profilo</span>
                <span className="text-2xl font-extrabold text-primary">78/100</span>
              </div>
              {[
                { label: "Headline", score: 90 },
                { label: "Sommario", score: 65 },
                { label: "Esperienza", score: 80 },
                { label: "Keyword ICP", score: 55 },
              ].map((bar) => (
                <div key={bar.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{bar.label}</span>
                    <span className="font-semibold">{bar.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${bar.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. DATI LINKEDIN ────────────────────────────────────────────── */}
      <section className="mt-20 mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Il mercato
          </span>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            L'opportunità è enorme. Ma solo chi ha un sistema la coglie.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { value: "1 miliardo+", label: "Utenti attivi su LinkedIn nel mondo", icon: "🌍" },
            { value: "23 milioni", label: "Profili LinkedIn in Italia", icon: "🇮🇹" },
            { value: "80%", label: "Delle vendite B2B nascono da conversazioni private", icon: "🤝" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-app bg-white p-8 text-center shadow-sm">
              <span className="text-4xl">{stat.icon}</span>
              <p className="mt-4 text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. FUNZIONI AVANZATE ────────────────────────────────────────── */}
      <section className="mt-20 rounded-3xl border border-app bg-soft-2 px-8 py-16 md:px-16">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <span className="inline-block mb-3 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Piano completo
          </span>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Funzioni avanzate per accelerare i risultati.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Strumenti pensati per chi vuole scalare il proprio business su LinkedIn.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Prospect Analyzer", icon: "🔬", desc: "Analizza il profilo di un prospect e genera messaggi ultra-personalizzati." },
            { title: "Pipeline CRM", icon: "📊", desc: "Gestisci i tuoi lead, stati e follow-up in un unico posto." },
            { title: "Piano 14 Giorni", icon: "📅", desc: "Un piano d'azione commerciale personalizzato per ogni tuo obiettivo." },
            { title: "Inbound Optimizer", icon: "🧲", desc: "Ottimizza il profilo per attrarre contatti in entrata automaticamente." },
            { title: "Call Simulator", icon: "🎯", desc: "Simula call di vendita per prepararti alle obiezioni dei clienti." },
            { title: "Storico AI", icon: "📝", desc: "Accedi a tutti i tuoi contenuti e messaggi generati con l'AI." },
          ].map((item) => (
            <div key={item.title} className="relative overflow-hidden rounded-2xl border border-app bg-white shadow-sm">
              {/* blurred content */}
              <div className="relative h-32 w-full overflow-hidden select-none">
                <div className="blur-md w-full h-full flex flex-col gap-2 p-5">
                  <div className="h-3 rounded-full bg-gray-200 w-4/5" />
                  <div className="h-3 rounded-full bg-gray-100 w-full" />
                  <div className="h-3 rounded-full bg-gray-200 w-3/4" />
                  <div className="h-6 rounded-xl bg-primary/20 w-28" />
                </div>
                {/* overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow">
                    🔒 Disponibile nel piano completo
                  </span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-2 font-bold text-base">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold shadow-md">
            Scopri il piano completo →
          </Link>
        </div>
      </section>

      {/* ─── 8. TESTIMONIANZE ────────────────────────────────────────────── */}
      <section className="mt-20 mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Testimonianze
          </span>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Chi usa Preflight ottiene risultati reali.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Marco B.",
              role: "Consulente marketing",
              quote: "In 2 settimane ho fissato 4 call con potenziali clienti. Prima non riuscivo a trasformare i like in conversazioni.",
              avatar: "MB",
              stars: 5,
            },
            {
              name: "Sara C.",
              role: "Coach e formatrice",
              quote: "I DM generati da Preflight sembrano scritti da me, ma molto meglio. Finalmente i messaggi ottengono risposta.",
              avatar: "SC",
              stars: 5,
            },
            {
              name: "Luca P.",
              role: "Freelance sviluppatore",
              quote: "L'analisi del profilo mi ha aperto gli occhi. Ho riscritto l'headline e in una settimana ho avuto 3 richieste di contatto.",
              avatar: "LP",
              stars: 5,
            },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border border-app bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex gap-0.5 text-yellow-400 text-sm">
                {"★".repeat(t.stars)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 9. CTA FINALE ───────────────────────────────────────────────── */}
      <section className="mt-20 mb-8 relative overflow-hidden rounded-3xl px-8 py-20 md:px-16 text-center" style={{ background: "linear-gradient(135deg, #0A66C2 0%, #004182 100%)" }}>
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white opacity-5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white opacity-5 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white md:text-5xl leading-tight">
            Inizia oggi a costruire<br />il tuo sistema clienti.
          </h2>
          <p className="mt-6 text-lg text-white/80">
            Setup in 5 minuti. Nessuna carta richiesta.<br />
            Il tuo piano LinkedIn personalizzato ti aspetta.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/app/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition hover:bg-soft"
            >
              Crea il tuo sistema clienti →
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/60">
            Già usato da consulenti, coach e freelance italiani.
          </p>
        </div>
      </section>

    </main>
  );
}
