import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="homepage-root fade-in">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-glow" aria-hidden="true" />
        <div className="hp-container hp-hero-inner">
          <div className="hp-badge">
            <span className="hp-badge-dot" aria-hidden="true" />
            Il percorso completo
          </div>
          <h1 className="hp-hero-title">
            Ti guidiamo passo dopo passo,<br />
            <span className="hp-hero-title-accent">dal primo contatto alla call.</span>
          </h1>
          <p className="hp-hero-subtitle">
            Preflight non è una lista di strumenti da imparare.<br />
            È un percorso che ti dice cosa fare ogni giorno su LinkedIn per trovare clienti.
          </p>
          <div className="hp-hero-ctas">
            <Link href="/app/onboarding" className="hp-cta-primary">
              Inizia il tuo percorso
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link href="/app" className="hp-cta-ghost">
              Guarda la dashboard
            </Link>
          </div>
          {/* Mini flow visivo */}
          <div className="hp-miniflow">
            {["POST", "COMMENTI", "MESSAGGI", "CALL", "CLIENTE"].map((s, i) => (
              <span key={s} className="hp-miniflow-item">
                <span className={`hp-miniflow-badge${i === 4 ? " hp-miniflow-badge-green" : ""}`}>{s}</span>
                {i < 4 && (
                  <svg className="hp-miniflow-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                )}
              </span>
            ))}
          </div>
          <p className="hp-hero-trust">✓ Per freelance e consulenti &nbsp;&nbsp; ✓ In italiano &nbsp;&nbsp; ✓ Nessuna integrazione complicata</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. LA VERITÀ
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il vero problema</div>
          <h2 className="hp-section-title">Non ti mancano gli strumenti. Ti manca sapere cosa fare.</h2>
          <p className="hp-section-subtitle">
            La maggior parte dei professionisti apre LinkedIn senza un piano.
            Pubblica senza intento, conversa senza direzione, e non sa mai quando è il momento di proporre una call.
          </p>
          <p className="hp-section-subtitle" style={{ marginTop: "0.5rem" }}>
            Preflight cambia questo: ogni giorno ti dice su cosa concentrarti.
          </p>

          <div className="hiw-versus-grid">
            {/* Senza sistema */}
            <div className="hiw-versus-card hiw-versus-card-negative">
              <p className="hiw-versus-label">Senza sistema</p>
              <div className="hiw-versus-flow">
                {["POST", "LIKE", "FINE"].map((s, i, a) => (
                  <span key={s} className="hiw-versus-step-wrap">
                    <span className={`hiw-versus-step${i === a.length - 1 ? " hiw-versus-step-red" : ""}`}>{s}</span>
                    {i < a.length - 1 && <span className="hiw-versus-sep">→</span>}
                  </span>
                ))}
              </div>
            </div>
            {/* Con Preflight */}
            <div className="hiw-versus-card hiw-versus-card-positive">
              <p className="hiw-versus-label hiw-versus-label-blue">Con Preflight</p>
              <div className="hiw-versus-flow">
                {["POST", "COMMENTO", "MESSAGGIO", "CALL", "CLIENTE"].map((s, i, a) => (
                  <span key={s} className="hiw-versus-step-wrap">
                    <span className={`hiw-versus-step hiw-versus-step-blue${i === a.length - 1 ? " hiw-versus-step-fill" : ""}`}>{s}</span>
                    {i < a.length - 1 && <span className="hiw-versus-sep hiw-versus-sep-blue">→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2.5. DATI FREELANCE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">Dati</div>
          <h2 className="hp-section-title">LinkedIn funziona già. Serve il percorso giusto per usarlo.</h2>
          <div className="hp-stats-grid hp-stats-grid-2">
            {[
              { value: "97%", label: "dei professionisti B2B lo considera tra le prime 3 fonti di clienti", sub: "Il canale c'è già. Serve qualcuno che ti guidi" },
              { value: "57%", label: "afferma che è la fonte principale di clienti di qualità", sub: "Non contatti generici — persone pronte a comprare" },
            ].map((s) => (
              <div key={s.value} className="hp-stat-card hp-stat-card-lg">
                <div className="hp-stat-value">{s.value}</div>
                <div className="hp-stat-label">{s.label}</div>
                <div className="hp-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <p className="hp-piattaforma-body">
            Non è la piattaforma che manca. È qualcuno che ti dica: contatta questo profilo, con questo messaggio, per questa ragione.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2.6. DATI LINKEDIN
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-stats-grid">
            {[
              { value: "1B+", label: "professionisti su LinkedIn nel mondo", sub: "Il più grande bacino B2B che esiste" },
              { value: "23M", label: "iscritti in Italia", sub: "I tuoi prossimi clienti sono già lì" },
              { value: "5–8", label: "interazioni prima di una vendita B2B", sub: "Post, commenti, messaggi, follow-up: serve un percorso" },
            ].map((s) => (
              <div key={s.value} className="hp-stat-card">
                <div className="hp-stat-value">{s.value}</div>
                <div className="hp-stat-label">{s.label}</div>
                <div className="hp-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. IL METODO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-dark">
        <div className="hp-container">
          <div className="hp-section-label hp-section-label-light">Il percorso</div>
          <h2 className="hp-section-title hp-title-white">
            Cinque fasi. Ogni giorno sai cosa fare.
          </h2>

          <div className="hiw-method-grid">
            {[
              {
                number: "01",
                title: "Configuri chi sei e per chi lavori",
                text: "Racconti il tuo servizio, il tuo cliente ideale e il problema che risolvi. Ci vogliono 5 minuti — il sistema parte da qui.",
                modules: ["Configurazione", "Profilo commerciale"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                ),
              },
              {
                number: "02",
                title: "Scopri chi contattare e perché",
                text: "Il sistema ti indica categorie di professionisti da contattare, con ricerche LinkedIn pronte. Non devi inventarti nulla.",
                modules: ["Chi contattare", "Ricerche LinkedIn"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ),
              },
              {
                number: "03",
                title: "Analizzi ogni profilo prima di scrivere",
                text: "Per ogni persona, sai se vale la pena contattarla. Il sistema ti dice chi è, perché è interessante e come iniziare.",
                modules: ["Analisi profilo", "Valutazione fit"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ),
              },
              {
                number: "04",
                title: "Post, commenti e messaggi: tutto guidato",
                text: "Per ogni situazione — pubblicare un post, rispondere a un commento, scrivere un DM, fare follow-up — il sistema ti dice cosa scrivere e perché.",
                modules: ["Risposte ai commenti", "Messaggi", "Consulenza situazionale"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
              },
              {
                number: "05",
                title: "Le conversazioni diventano call e clienti",
                text: "Pipeline, prossimi passi, follow-up: ogni contatto ha una direzione. Nessuna conversazione si perde per strada.",
                modules: ["Pipeline clienti", "Follow-up", "Piano giornaliero"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ),
              },
            ].map((block) => (
              <article key={block.number} className="hiw-method-card">
                <div className="hiw-method-header">
                  <span className="hiw-method-icon">{block.icon}</span>
                  <span className="hiw-method-num">{block.number}</span>
                </div>
                <h3 className="hiw-method-title">{block.title}</h3>
                <p className="hiw-method-text">{block.text}</p>
                <div className="hiw-method-modules">
                  {block.modules.map((m) => (
                    <span key={m} className="hiw-method-module">{m}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. COME NASCE UN CLIENTE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il percorso giorno per giorno</div>
          <h2 className="hp-section-title hiw-timeline-heading">Cosa fai concretamente, ogni giorno</h2>

          <div className="hiw-timeline">
            {[
              { step: "1", label: "Configuri il tuo profilo commerciale", desc: "Descrivi il tuo servizio, il tuo cliente ideale e il problema che risolvi.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>) },
              { step: "2", label: "Scopri chi contattare oggi", desc: "Ricevi categorie di prospect e ricerche LinkedIn pronte da usare.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>) },
              { step: "3", label: "Valuti ogni profilo prima di scrivere", desc: "Per ogni persona, sai se vale la pena contattarla e come.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) },
              { step: "4", label: "Pubblichi, commenti e scrivi con guida", desc: "Post, commenti, DM: il sistema ti dice cosa scrivere e quando.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>) },
              { step: "5", label: "Proponi la call al momento giusto", desc: "Con il messaggio giusto, al momento giusto. Senza forzare.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>) },
              { step: "6", label: "Nessuna conversazione si perde", desc: "Pipeline e follow-up: ogni contatto ha un prossimo passo chiaro.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>) },
            ].map((item) => (
              <div key={item.step} className="hiw-timeline-item">
                <div className="hiw-timeline-number">
                  <span>{item.step}</span>
                </div>
                <div className="hiw-timeline-card">
                  <div className="hiw-timeline-icon">{item.icon}</div>
                  <div>
                    <h4 className="hiw-timeline-label">{item.label}</h4>
                    <p className="hiw-timeline-desc">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. COSA TROVI DENTRO PREFLIGHT
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">Cosa trovi dentro</div>
          <h2 className="hp-section-title">Ogni strumento ha un ruolo preciso nel tuo percorso</h2>
          <p className="hp-section-subtitle">
            Non sono funzionalità separate. Lavorano insieme per guidarti dal primo contatto al cliente.
          </p>

          <div className="hiw-features-grid">
            {[
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>), title: "Configurazione", desc: "Racconti chi sei e cosa offri. Il sistema parte da qui." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>), title: "Chi contattare", desc: "Categorie di prospect e ricerche LinkedIn pronte da usare." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>), title: "Analisi profilo", desc: "Capisci se una persona è in target prima di scriverle." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>), title: "Commenti guidati", desc: "Ti dice come rispondere ai commenti per aprire conversazioni." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>), title: "Messaggi e DM", desc: "Indicazioni per scrivere il primo messaggio e i successivi." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), title: "Piano giornaliero", desc: "Ogni giorno sai chi contattare, cosa pubblicare e chi seguire." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>), title: "Pipeline clienti", desc: "Ogni contatto ha un percorso chiaro e visuale verso la call." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>), title: "Simulazione conversazioni", desc: "Allenati a rispondere a obiezioni e domande, prima di farlo dal vivo." },
            ].map((card) => (
              <article key={card.title} className="hiw-feature-card">
                <div className="hiw-feature-icon">{card.icon}</div>
                <h3 className="hiw-feature-title">{card.title}</h3>
                <p className="hiw-feature-desc">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. RISULTATO FINALE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-blue">
        <div className="hp-container">
          <div className="hp-profile-grid">
            <div className="hp-profile-content">
              <div className="hp-section-label hp-section-label-light">Il risultato</div>
              <h2 className="hp-section-title hp-title-white">
                Non apri LinkedIn &ldquo;per vedere&rdquo;.
              </h2>
              <p className="hp-profile-subtitle">
                Entri sapendo esattamente cosa fare. Il sistema ti ha già preparato il percorso.
              </p>
              <ul className="hp-profile-list">
                  {["Chi contattare oggi", "Cosa scrivere e perché", "Quando fare follow-up", "Come arrivare alla call"].map((item) => (
                  <li key={item} className="hp-profile-list-item">
                    <span className="hp-check-icon" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/app/onboarding" className="hp-cta-white">
                Prova il sistema
              </Link>
            </div>
            <div className="hp-profile-mock-wrap" aria-hidden="true">
              <div className="hp-profile-mock">
                <div className="hp-profile-mock-header">
                  <div className="hp-profile-mock-avatar" />
                  <div className="hp-profile-mock-info">
                    <div className="hp-mock-line hp-mock-line-w60 hp-pmock-line hp-pmock-line-lg" />
                    <div className="hp-mock-line hp-mock-line-w40 hp-pmock-line hp-pmock-line-sm" />
                  </div>
                </div>
                <div className="hp-profile-mock-lines">
                  <div className="hp-mock-line hp-mock-line-w80 hp-pmock-line" />
                  <div className="hp-mock-line hp-mock-line-w60 hp-pmock-line" />
                  <div className="hp-mock-line hp-mock-line-full hp-pmock-line" />
                  <div className="hp-mock-line hp-mock-line-w50 hp-pmock-line" />
                </div>
                <div className="hp-profile-mock-score">
                  <span className="hp-profile-mock-score-val">✓</span>
                  <span className="hp-profile-mock-score-label">Sistema attivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. CTA FINALE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-final-cta">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner">
          <h2 className="hp-final-title">
            Un percorso completo: dal primo contatto alla call,<br />guidato passo dopo passo.
          </h2>
          <p className="hp-final-subtitle">
            Configurazione → Targeting → Analisi → Post e messaggi → Conversazione → Call.
          </p>
          <Link href="/app/onboarding" className="hp-cta-primary hp-cta-large">
            Inizia il tuo percorso
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
