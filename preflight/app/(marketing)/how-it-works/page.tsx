import Link from "next/link";

const methodBlocks = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    number: "01",
    title: "Attirare clienti",
    text: "Crei contenuti che parlano ai problemi del cliente giusto e invitano alla conversazione.",
    modules: ["Contenuti", "Scrivi un post", "Trova opportunità"],
    mockLines: ["Piano contenuti personalizzato", "Idee post per il tuo ICP", "Opportunità da cogliere questa settimana"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    number: "02",
    title: "Parlare con i clienti",
    text: "Rispondi ai commenti, ai messaggi e analizza i profili per sapere sempre cosa dire e quando farlo.",
    modules: ["Rispondi ai commenti", "Rispondi ai messaggi", "Analizza un potenziale cliente", "Allenati alle conversazioni"],
    mockLines: ["Risposta al commento suggerita", "DM di follow-up pronto", "Profilo analizzato: interesse alto"],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
    number: "03",
    title: "Gestire i clienti",
    text: "Tieni traccia delle conversazioni, dei follow-up e delle call in modo semplice.",
    modules: ["Clienti in corso"],
    mockLines: ["Pipeline aggiornata", "Follow-up programmato", "Call confermata"],
  },
];

const timelineSteps = [
  { step: "1", label: "Pubblichi un contenuto", desc: "Scrivi un post mirato al tuo cliente ideale, guidato da Preflight." },
  { step: "2", label: "Ricevi un commento", desc: "Qualcuno risponde. È un segnale di interesse reale." },
  { step: "3", label: "Continui la conversazione", desc: "Preflight ti suggerisce la risposta giusta per approfondire." },
  { step: "4", label: "La porti nei messaggi", desc: "Quando è il momento, sposti la conversazione in privato." },
  { step: "5", label: "Proponi una call", desc: "Con il messaggio giusto al momento giusto, la call è naturale." },
  { step: "6", label: "Gestisci il cliente nella pipeline", desc: "Traccia ogni contatto, follow-up e prossimo passo." },
];

const featureCards = [
  { icon: "📋", title: "Piano contenuti", desc: "Un piano editoriale pensato per attrarre il tuo cliente ideale." },
  { icon: "💬", title: "Risposte ai commenti", desc: "Suggerimenti per rispondere in modo da trasformare i commenti in conversazioni." },
  { icon: "✉️", title: "Suggerimenti DM", desc: "Messaggi pronti da personalizzare per aprire e continuare conversazioni." },
  { icon: "🔥", title: "Heat level del lead", desc: "Capisce in che fase è ogni contatto e cosa fare al prossimo step." },
  { icon: "🔁", title: "Follow-up", desc: "Promemoria e messaggi per non perdere mai un contatto caldo." },
  { icon: "🔍", title: "Profili da cercare", desc: "Suggerisce chi cercare su LinkedIn in base al tuo target." },
  { icon: "📊", title: "Pipeline clienti", desc: "Gestisci tutti i tuoi contatti in una pipeline semplice e chiara." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">

      {/* SEZIONE 1 — HERO */}
      <section className="hero-gradient rounded-2xl border border-app bg-soft p-10 md:p-16 mb-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-white border border-app px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7v8l10-12h-7l0-8z"/></svg>
          Il metodo completo
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
          Come funziona davvero Preflight
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Preflight ti guida passo dopo passo per trasformare LinkedIn in un sistema che genera conversazioni, call e clienti.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app/onboarding" className="btn-primary px-6 py-3 text-sm font-semibold shadow-sm">
            Crea il tuo sistema clienti
          </Link>
          <Link href="/app" className="btn-secondary px-5 py-3 text-sm font-medium shadow-sm">
            Guarda la dashboard
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          <span>✔ Pensato per freelance e consulenti</span>
          <span>✔ In italiano</span>
          <span>✔ Nessuna integrazione complicata</span>
        </div>
      </section>

      {/* SEZIONE 2 — IL PROBLEMA */}
      <section className="mb-10 rounded-2xl border border-app bg-white p-8 md:p-12">
        <h2 className="text-3xl font-bold max-w-2xl leading-snug">
          Il problema non è pubblicare.<br />È non avere un sistema.
        </h2>
        <p className="mt-5 max-w-xl text-muted">
          Molti freelance pubblicano su LinkedIn senza ottenere risultati concreti.
        </p>
        <div className="mt-4 space-y-1 text-muted">
          <p>Fanno contenuti.</p>
          <p>Ricevono qualche like.</p>
          <p>Ogni tanto un commento.</p>
        </div>
        <p className="mt-4 text-muted">
          Ma raramente queste interazioni diventano clienti.<br />
          Perché manca un metodo per gestire tutto il percorso commerciale.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Schema senza sistema */}
          <div className="rounded-xl border border-app bg-soft p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Senza sistema</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["POST", "LIKE", "FINE"].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${i === arr.length - 1 ? "bg-red-50 text-red-500 border border-red-200" : "bg-white border border-app"}`}>{step}</span>
                  {i < arr.length - 1 && <span className="text-muted">→</span>}
                </span>
              ))}
            </div>
          </div>
          {/* Schema con Preflight */}
          <div className="rounded-xl border border-primary/20 bg-soft p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Con Preflight</p>
            <div className="flex items-center gap-2 flex-wrap">
              {["POST", "COMMENTO", "MESSAGGIO", "CALL", "CLIENTE"].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${i === arr.length - 1 ? "bg-primary text-white" : "bg-white border border-app text-primary"}`}>{step}</span>
                  {i < arr.length - 1 && <span className="text-primary font-bold">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE 2.5 — LinkedIn Stats */}
      <section className="mb-10 rounded-2xl border border-app bg-soft-2 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-primary">1 MLD+</div>
            <div className="mt-1 text-sm text-muted">membri su LinkedIn nel mondo</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary">23 MLN</div>
            <div className="mt-1 text-sm text-muted">iscritti in Italia</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-primary">5–8</div>
            <div className="mt-1 text-sm text-muted">punti di contatto medi prima di una vendita B2B</div>
          </div>
        </div>
      </section>

      {/* SEZIONE 3 — IL METODO PREFLIGHT */}
      <section className="mb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Un sistema semplice, guidato e pratico</h2>
          <p className="mt-3 text-muted max-w-xl mx-auto">Preflight si divide in tre aree che coprono tutto il percorso: dall&rsquo;attirare clienti al gestirli.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {methodBlocks.map((block) => (
            <div key={block.number} className="rounded-2xl border border-app bg-white p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-soft text-primary">
                  {block.icon}
                </span>
                <span className="text-xs font-bold text-muted">{block.number}</span>
              </div>
              <h3 className="text-xl font-bold">{block.title}</h3>
              <p className="text-sm text-muted">{block.text}</p>
              <div className="flex flex-wrap gap-2">
                {block.modules.map((mod) => (
                  <span key={mod} className="rounded-full bg-soft text-primary text-xs font-medium px-3 py-1">{mod}</span>
                ))}
              </div>
              {/* Mock screenshot blurred */}
              <div className="mt-2 rounded-lg border border-app bg-soft-2 p-4 select-none" style={{ filter: "blur(2px)", pointerEvents: "none" }}>
                <div className="space-y-2">
                  {block.mockLines.map((line) => (
                    <div key={line} className="h-4 rounded bg-primary/10 text-[0px]">{line}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEZIONE 4 — TIMELINE */}
      <section className="mb-10 rounded-2xl border border-app bg-soft p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-10">Come nasce un cliente su LinkedIn</h2>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
          <div className="space-y-6">
            {timelineSteps.map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center z-10">
                  {item.step}
                </div>
                <div className="rounded-xl border border-app bg-white p-5 flex-1 shadow-sm">
                  <h4 className="font-semibold">{item.label}</h4>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEZIONE 5 — COSA VEDE L'UTENTE */}
      <section className="mb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Cosa ricevi davvero quando usi Preflight</h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">Non solo suggerimenti di testo. Un sistema completo per trovare, gestire e convertire contatti LinkedIn.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-app bg-white p-5 shadow-sm flex gap-4">
              <span className="text-2xl flex-shrink-0">{card.icon}</span>
              <div>
                <h4 className="font-semibold">{card.title}</h4>
                <p className="mt-1 text-sm text-muted">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEZIONE 6 — RISULTATO */}
      <section className="mb-10 rounded-2xl border border-app bg-white p-8 md:p-12">
        <h2 className="text-3xl font-bold max-w-xl leading-snug">Alla fine, sai sempre cosa fare</h2>
        <p className="mt-5 max-w-xl text-muted">
          Con Preflight non entri su LinkedIn per &#x201C;vedere cosa succede&#x201D;.
        </p>
        <p className="mt-4 text-muted">Entri sapendo:</p>
        <ul className="mt-3 space-y-2 text-sm">
          {["cosa pubblicare", "a chi scrivere", "come rispondere", "chi ricontattare"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              {item}
            </li>
          ))}
        </ul>
        <Link href="/app/onboarding" className="mt-8 inline-block btn-primary px-6 py-3 text-sm font-semibold shadow-sm">
          Prova il sistema
        </Link>
      </section>

      {/* SEZIONE 7 — CTA FINALE */}
      <section className="mb-10 rounded-2xl bg-primary p-10 md:p-16 text-white text-center">
        <h2 className="text-3xl font-bold max-w-xl mx-auto leading-snug">
          Trasforma LinkedIn nella tua macchina commerciale
        </h2>
        <p className="mt-4 text-white/80 max-w-md mx-auto">
          Non servono ore al giorno.<br />Serve un sistema.
        </p>
        <Link href="/app/onboarding" className="mt-8 inline-block bg-white text-primary font-bold px-8 py-4 rounded-xl shadow-md hover:bg-soft transition-colors text-sm">
          Crea il tuo sistema clienti
        </Link>
      </section>

    </main>
  );
}
