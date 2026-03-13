import Link from "next/link";

/* ── Dati pagina ── */

const targets = [
  {
    emoji: "🎯",
    title: "Freelance",
    desc: "Designer, developer, copywriter, marketer: sai fare il tuo lavoro, ma trovare nuovi clienti su LinkedIn è un problema diverso.",
  },
  {
    emoji: "🎤",
    title: "Coach e Formatori",
    desc: "Pubblichi contenuti, costruisci autorità. Ma i commenti non diventano sessioni di coaching né iscrizioni ai corsi.",
  },
  {
    emoji: "📋",
    title: "Consulenti",
    desc: "Strategici, fiscali, HR, IT: hai l\u2019expertise, ma le relazioni su LinkedIn non si trasformano in progetti.",
  },
  {
    emoji: "⚡",
    title: "Fractional Manager",
    desc: "CFO, CMO, CTO part-time: gestisci più mandati e ti serve un flusso costante di nuove opportunità.",
  },
  {
    emoji: "🏢",
    title: "Micro-agenzie",
    desc: "Team da 2-10 persone che usano LinkedIn per acquisire clienti B2B ma non hanno un processo strutturato.",
  },
];

const problems = [
  "Non sai chi contattare su LinkedIn tra migliaia di profili",
  "Pubblichi contenuti ma non ricevi richieste di lavoro concrete",
  "I tuoi messaggi in DM vengono ignorati o suonano troppo commerciali",
  "Non riesci a passare da un commento a una conversazione privata",
  "Perdi traccia delle conversazioni e non fai follow-up al momento giusto",
  "Non hai un metodo chiaro per trasformare un contatto LinkedIn in un cliente",
];

const notFor = [
  "Chi cerca follower e vanity metrics",
  "Chi vuole automazioni spam su LinkedIn",
  "Aziende enterprise con team commerciali strutturati",
  "Chi non è disposto a investire 20 minuti al giorno su LinkedIn",
  "Chi vende prodotti fisici al consumatore finale",
  "Chi cerca un bot che scriva al posto suo",
];

export default function PerChiEPage() {
  return (
    <div className="homepage-root">

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero-glow" aria-hidden="true" />
        <div className="hp-container hp-hero-inner">
          <div className="hp-badge">
            <span className="hp-badge-dot" aria-hidden="true" />
            Per chi è
          </div>
          <h1 className="hp-hero-title">
            Per chi è davvero<br />
            <span className="hp-hero-title-accent">Preflight</span>
          </h1>
          <p className="hp-hero-subtitle">
            Non è per tutti. È per professionisti che usano LinkedIn<br />
            per trovare clienti — e vogliono farlo con metodo.
          </p>
        </div>
      </section>

      {/* ── TARGET CARDS ── */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Chi aiutiamo</div>
          <h2 className="hp-section-title">Pensato per chi vende competenze, non prodotti</h2>
          <p className="hp-section-subtitle">
            Preflight è costruito per professionisti che offrono servizi ad alto valore
            e usano LinkedIn come canale principale di acquisizione.
          </p>
          <div className="pce-target-grid">
            {targets.map((t) => (
              <div key={t.title} className="pce-target-card">
                <span className="pce-target-emoji" aria-hidden="true">{t.emoji}</span>
                <h3 className="pce-target-title">{t.title}</h3>
                <p className="pce-target-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMI RISOLTI ── */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">Problemi risolti</div>
          <h2 className="hp-section-title">Se ti riconosci in almeno 2 di questi, Preflight è per te</h2>
          <div className="pce-problems-grid">
            {problems.map((p, i) => (
              <div key={i} className="pce-problem-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PER CHI NON È ── */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Trasparenza</div>
          <h2 className="hp-section-title">Per chi NON è Preflight</h2>
          <p className="hp-section-subtitle">
            Preferiamo dirtelo prima. Se ti riconosci in queste situazioni, probabilmente non è lo strumento giusto.
          </p>
          <div className="pce-notfor-grid">
            {notFor.map((item, i) => (
              <div key={i} className="pce-notfor-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PERSONALIZZATA ── */}
      <section className="hp-section hp-section-dark">
        <div className="hp-container">
          <div className="hp-section-label hp-section-label-light">Come funziona</div>
          <h2 className="hp-section-title hp-title-white">Un sistema che si adatta al tuo modo di lavorare</h2>
          <p className="hp-section-subtitle hp-subtitle-light">
            Configuri chi sei, cosa vendi e chi cerchi.<br />
            Da lì, ogni suggerimento è calibrato sulla tua realtà.
          </p>
          <div className="pce-ai-grid">
            <div className="pce-ai-card">
              <span className="pce-ai-step">1</span>
              <h3 className="pce-ai-title">Configura il sistema</h3>
              <p className="pce-ai-desc">Inserisci chi sei, cosa vendi, chi è il tuo cliente ideale e come vuoi comunicare.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">2</span>
              <h3 className="pce-ai-title">Ricevi suggerimenti personalizzati</h3>
              <p className="pce-ai-desc">Chi contattare, come scrivere il primo messaggio, quando fare follow-up: tutto basato sul tuo profilo e obiettivi.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">3</span>
              <h3 className="pce-ai-title">Converti contatti in clienti</h3>
              <p className="pce-ai-desc">Pipeline, follow-up, prossimi passi: sai sempre chi ricontattare e quando.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/app/onboarding" className="hp-cta-primary hp-cta-large">
              Configura il tuo sistema
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="hp-final-cta">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner">
          <h2 className="hp-final-title">
            Se usi LinkedIn per trovare clienti,<br />
            smetti di improvvisare
          </h2>
          <p className="hp-final-subtitle">
            Preflight ti dà il metodo.<br />
            Tu ci metti la competenza e 20 minuti al giorno.
          </p>
          <Link href="/app/onboarding" className="hp-cta-primary hp-cta-large">
            Inizia ora — è gratis
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Nessuna carta di credito · Annulli quando vuoi</p>
        </div>
      </section>
    </div>
  );
}
