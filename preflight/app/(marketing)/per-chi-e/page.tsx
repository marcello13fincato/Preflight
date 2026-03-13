import Link from "next/link";

/* ── Dati pagina ── */

const targets = [
  {
    emoji: "🎯",
    title: "Consulenti",
    desc: "Strategici, fiscali, HR, IT: hai competenze di alto livello, ma le relazioni su LinkedIn restano superficiali. Ti serve un metodo per trasformare interazioni in mandati.",
  },
  {
    emoji: "🛠",
    title: "Freelance",
    desc: "Designer, developer, copywriter: il tuo lavoro parla da solo. Ma trovare il prossimo cliente non dovrebbe dipendere dal passaparola o dalla fortuna.",
  },
  {
    emoji: "🎓",
    title: "Coach e Formatori",
    desc: "Offri percorsi ad alto valore. Pubblichi, costruisci autorità. Ma i commenti non diventano sessioni di coaching, e i post non generano iscrizioni.",
  },
  {
    emoji: "⚡",
    title: "Fractional Manager",
    desc: "CFO, CMO, CTO part-time: gestisci più mandati in parallelo. Ti serve un flusso costante di nuove opportunità senza dedicare ore alla ricerca.",
  },
  {
    emoji: "📈",
    title: "Professionisti B2B",
    desc: "Account manager, business developer, sales: usi LinkedIn come canale commerciale ma ti manca una struttura per passare dalla connessione alla call.",
  },
  {
    emoji: "🏢",
    title: "Micro-agenzie",
    desc: "Team da 2-10 persone che vendono servizi B2B. LinkedIn è il vostro canale principale, ma nessuno ha tempo di gestirlo con metodo.",
  },
];

const problems = [
  "Pubblichi su LinkedIn ma non ricevi richieste concrete di lavoro",
  "Non sai quali profili contattare tra migliaia di risultati di ricerca",
  "I tuoi messaggi in DM vengono ignorati o suonano troppo commerciali",
  "Le conversazioni si fermano dopo il primo scambio di battute",
  "Non hai un metodo per passare dal commento alla conversazione privata",
  "Perdi traccia dei contatti e non fai follow-up al momento giusto",
  "Non sai quando è il momento di proporre una call",
  "Usi LinkedIn ogni giorno ma non riesci a collegarlo a risultati commerciali",
];

const notFor = [
  "Chi cerca lavoro come dipendente",
  "Recruiter e HR che cercano candidati",
  "Chi vuole crescere come influencer o creator",
  "Chi cerca uno strumento di social media management",
  "Chi vuole automazioni e messaggi di massa",
  "Aziende enterprise con team commerciali già strutturati",
  "Chi vende prodotti fisici al consumatore finale",
  "Chi non è disposto a dedicare 20 minuti al giorno a LinkedIn",
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
            Per chi è Preflight.<br />
            <span className="hp-hero-title-accent">E per chi no.</span>
          </h1>
          <p className="hp-hero-subtitle">
            Preflight è un sistema di acquisizione clienti su LinkedIn.<br />
            Funziona per chi vende servizi e competenze — non per tutti.
          </p>
        </div>
      </section>

      {/* ── TARGET CARDS ── */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Chi aiutiamo</div>
          <h2 className="hp-section-title">Costruito per chi vende competenze e servizi ad alto valore</h2>
          <p className="hp-section-subtitle">
            Ogni funzionalità di Preflight è pensata per professionisti che usano LinkedIn
            come canale principale di acquisizione clienti.
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
          <h2 className="hp-section-title">Se ti riconosci in almeno due di queste situazioni, Preflight è per te</h2>
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
            Meglio saperlo prima. Se ti riconosci in una di queste situazioni, probabilmente non è lo strumento giusto per te.
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
          <h2 className="hp-section-title hp-title-white">Come funziona il sistema</h2>
          <p className="hp-section-subtitle hp-subtitle-light">
            Configuri il tuo contesto commerciale una volta.<br />
            Da lì, ogni indicazione è calibrata sulla tua realtà.
          </p>
          <div className="pce-ai-grid">
            <div className="pce-ai-card">
              <span className="pce-ai-step">1</span>
              <h3 className="pce-ai-title">Imposta il tuo sistema commerciale</h3>
              <p className="pce-ai-desc">Definisci cosa vendi, a chi, e quale problema risolvi. Il sistema parte da qui.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">2</span>
              <h3 className="pce-ai-title">Ricevi indicazioni operative</h3>
              <p className="pce-ai-desc">Chi contattare, come scrivere il primo messaggio, quando fare follow-up — tutto basato sul tuo profilo commerciale.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">3</span>
              <h3 className="pce-ai-title">Porta le conversazioni a risultato</h3>
              <p className="pce-ai-desc">Pipeline, follow-up, prossimi passi: ogni conversazione ha una direzione chiara verso la call.</p>
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
            Se vendi servizi su LinkedIn,<br />
            ti serve un sistema, non più tempo
          </h2>
          <p className="hp-final-subtitle">
            Preflight ti dà metodo e direzione.<br />
            Tu ci metti la competenza.
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
