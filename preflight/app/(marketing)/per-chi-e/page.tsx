import Link from "next/link";

/* ── Dati pagina ── */

const targets = [
  {
    emoji: "🎯",
    title: "Consulenti",
    desc: "Hai competenze di alto livello, ma le relazioni su LinkedIn restano superficiali. Ti serve qualcuno che ti dica: contatta questa persona, con questo messaggio, per questa ragione.",
  },
  {
    emoji: "🛠",
    title: "Freelance",
    desc: "Sai fare bene il tuo lavoro, ma trovare il prossimo cliente non dovrebbe dipendere dal passaparola. Il sistema ti guida verso le persone giuste, ogni giorno.",
  },
  {
    emoji: "🎓",
    title: "Coach e Formatori",
    desc: "Pubblichi contenuti e costruisci autorità. Ma i commenti non diventano clienti da soli — ti serve un percorso chiaro dal post alla sessione di coaching.",
  },
  {
    emoji: "⚡",
    title: "Fractional Manager",
    desc: "Gestisci più mandati in parallelo e hai poco tempo. Il sistema ti mostra chi contattare oggi e ti prepara il messaggio — in 10 minuti sei operativo.",
  },
  {
    emoji: "📈",
    title: "Professionisti B2B",
    desc: "Usi LinkedIn come canale commerciale ma ti manca una struttura per passare dalla connessione alla conversazione, e dalla conversazione alla call.",
  },
  {
    emoji: "🏢",
    title: "Micro-agenzie",
    desc: "Team da 2-10 persone che vendono servizi B2B. Nessuno ha tempo di gestire LinkedIn con metodo — il sistema vi dà la direzione senza portarvi via giornate.",
  },
];

const problems = [
  "Apri LinkedIn ogni giorno ma non sai bene da dove partire",
  "Scrivi messaggi che vengono ignorati o suonano troppo commerciali",
  "Non sai quali profili contattare tra le centinaia che vedi",
  "Le conversazioni si fermano dopo il primo scambio e non sai come riprenderle",
  "Pubblichi post ma non riesci a collegare i commenti a conversazioni concrete",
  "Perdi traccia dei contatti e non fai follow-up quando dovresti",
  "Non sai quando è il momento giusto di proporre una call",
  "Senti che LinkedIn potrebbe funzionare, ma ti manca una guida passo passo",
];

const notFor = [
  "Chi cerca lavoro come dipendente — non è un tool per candidature",
  "Recruiter e HR — il sistema è per chi vende, non per chi assume",
  "Chi vuole crescere come influencer — qui si parla di clienti, non di follower",
  "Chi cerca automazioni e messaggi di massa — Preflight è l'opposto",
  "Aziende enterprise con team sales strutturati — non serve un sistema personale",
  "Chi vende prodotti fisici al consumatore finale — LinkedIn B2B è un altro mondo",
  "Chi non è disposto a dedicare 20 minuti al giorno — il sistema funziona solo se lo usi",
  "Chi vuole risultati senza fare nessuno sforzo — nessun sistema può farlo",
];

export default function PerChiEPage() {
  return (
    <div className="homepage-root fade-in">

      {/* ── HERO ── */}
      <section className="hp-hero fade-in">
        <div className="hp-hero-glow" aria-hidden="true" />
        <div className="hp-container hp-hero-inner fade-in-delay">
          <div className="hp-badge">
            <span className="hp-badge-dot" aria-hidden="true" />
            Per chi è
          </div>
          <h1 className="hp-hero-title fade-in">
            Un sistema pensato per chi vende.<br />
            <span className="hp-hero-title-accent">Non per tutti.</span>
          </h1>
          <p className="hp-hero-subtitle fade-in">
            Preflight guida passo passo professionisti che vogliono trovare clienti su LinkedIn.<br />
            Se vendi servizi e competenze, è costruito intorno al tuo modo di lavorare.
          </p>
        </div>
      </section>

      {/* ── TARGET CARDS ── */}
      <section className="hp-section hp-section-light fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Chi aiutiamo</div>
          <h2 className="hp-section-title fade-in-delay">Pensato per professionisti che vendono competenze e servizi</h2>
          <p className="hp-section-subtitle fade-in-delay">
            Ogni parte del sistema è costruita intorno a un obiettivo preciso:
            aiutarti a trovare i clienti giusti e a portare avanti le conversazioni con chiarezza.
          </p>
          <div className="pce-target-grid fade-in">
            {targets.map((t) => (
              <div key={t.title} className="pce-target-card fade-in-delay">
                <span className="pce-target-emoji" aria-hidden="true">{t.emoji}</span>
                <h3 className="pce-target-title">{t.title}</h3>
                <p className="pce-target-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMI RISOLTI ── */}
      <section className="hp-section hp-section-soft fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Ti riconosci?</div>
          <h2 className="hp-section-title fade-in-delay">Se ti ritrovi in almeno due di queste situazioni, Preflight fa per te</h2>
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
      <section className="hp-section hp-section-light fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Chiarezza</div>
          <h2 className="hp-section-title fade-in-delay">Per chi NON è pensato</h2>
          <p className="hp-section-subtitle fade-in-delay">
            Meglio saperlo subito. Se ti riconosci in una di queste situazioni, probabilmente non è lo strumento giusto per te — e va bene così.
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
      <section className="hp-section hp-section-dark fade-in">
        <div className="hp-container">
          <div className="hp-section-label hp-section-label-light">Il percorso</div>
          <h2 className="hp-section-title hp-title-white fade-in-delay">Cosa succede quando inizi</h2>
          <p className="hp-section-subtitle hp-subtitle-light fade-in-delay">
            Configuri il tuo profilo commerciale una volta.
            Da lì in poi, ogni giorno il sistema ti guida: chi contattare,
            cosa scrivere, come portare avanti le conversazioni.
          </p>
          <div className="pce-ai-grid fade-in">
            <div className="pce-ai-card fade-in-delay">
              <span className="pce-ai-step">1</span>
              <h3 className="pce-ai-title">Racconti cosa fai e per chi</h3>
              <p className="pce-ai-desc">Descrivi il tuo servizio, il tuo cliente ideale e il problema che risolvi. Ci vogliono 5 minuti — il sistema parte da qui.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">2</span>
              <h3 className="pce-ai-title">Ogni giorno sai cosa fare</h3>
              <p className="pce-ai-desc">Chi contattare, cosa commentare, quale messaggio inviare. Post, commenti, DM: tutto guidato dal contesto.</p>
            </div>
            <div className="pce-ai-card">
              <span className="pce-ai-step">3</span>
              <h3 className="pce-ai-title">Le conversazioni diventano clienti</h3>
              <p className="pce-ai-desc">Follow-up, pipeline, prossimi passi: ogni contatto ha una direzione chiara verso la call.</p>
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
      <section className="hp-final-cta fade-in">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner fade-in-delay">
          <h2 className="hp-final-title fade-in">
            Se vendi servizi su LinkedIn,<br />
            Preflight ti guida passo dopo passo
          </h2>
          <p className="hp-final-subtitle fade-in">
            Non servono più ore o più strumenti.<br />
            Serve il sistema giusto — e 20 minuti al giorno.
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
