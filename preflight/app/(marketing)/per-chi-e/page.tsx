import Link from "next/link";

/* ── Dati pagina ── */

const targets = [
  {
    emoji: "🎯",
    title: "Freelance",
    desc: "Designer, developer, copywriter, marketer: vendi competenze specifiche e hai bisogno di un flusso costante di clienti da LinkedIn.",
  },
  {
    emoji: "🎤",
    title: "Coach e Formatori",
    desc: "Costruisci autorevolezza con i contenuti e converti l'attenzione in sessioni di coaching, corsi o percorsi formativi.",
  },
  {
    emoji: "📋",
    title: "Consulenti",
    desc: "Strategici, fiscali, HR, IT: trasformi la tua expertise in progetti ad alto valore grazie a relazioni coltivate su LinkedIn.",
  },
  {
    emoji: "⚡",
    title: "Fractional Manager",
    desc: "CFO, CMO, CTO part-time: gestisci più mandati e hai bisogno di pipeline sempre attiva per nuovi incarichi.",
  },
  {
    emoji: "🏢",
    title: "Micro-agenzie",
    desc: "Team da 2-10 persone che usano LinkedIn come canale primario di acquisizione clienti per servizi B2B.",
  },
];

const problems = [
  "Pubblichi su LinkedIn ma non ricevi richieste concrete",
  "Non sai come rispondere ai commenti per creare conversazioni",
  "I tuoi messaggi in DM vengono ignorati o suonano troppo commerciali",
  "Non hai un metodo per trasformare i contatti in clienti",
  "Perdi traccia delle conversazioni e delle opportunità",
  "Non sai cosa pubblicare per attirare il tuo cliente ideale",
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
          <h2 className="hp-section-title hp-title-white">Un sistema AI che si adatta a te</h2>
          <p className="hp-section-subtitle hp-subtitle-light">
            Configuri il tuo profilo professionale, il tuo target e il tuo tono di voce.<br />
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
              <p className="pce-ai-desc">Post, commenti, messaggi, follow-up: tutto calibrato sul tuo profilo e obiettivi.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">3</span>
              <h3 className="pce-ai-title">Costruisci relazioni che convertono</h3>
              <p className="pce-ai-desc">Pipeline, prospect, opportunità: gestisci tutto da un unico punto di controllo.</p>
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
