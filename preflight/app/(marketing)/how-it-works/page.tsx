import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="homepage-root">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-glow" aria-hidden="true" />
        <div className="hp-container hp-hero-inner">
          <div className="hp-badge">
            <span className="hp-badge-dot" aria-hidden="true" />
            Il metodo completo
          </div>
          <h1 className="hp-hero-title">
            Come funziona<br />
            <span className="hp-hero-title-accent">Preflight</span>
          </h1>
          <p className="hp-hero-subtitle">
            Non è un insieme di strumenti separati.<br />
            È un sistema operativo per trasformare LinkedIn in un canale di acquisizione clienti.
          </p>
          <div className="hp-hero-ctas">
            <Link href="/app/onboarding" className="hp-cta-primary">
              Crea il tuo sistema clienti
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
          <p className="hp-hero-trust">✓ Pensato per freelance e consulenti &nbsp;&nbsp; ✓ In italiano &nbsp;&nbsp; ✓ Nessuna integrazione complicata</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. LA VERITÀ
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il problema</div>
          <h2 className="hp-section-title">Il problema non è LinkedIn. È l&apos;assenza di metodo.</h2>
          <p className="hp-section-subtitle">
            La maggior parte dei professionisti pubblica contenuti senza intento commerciale,
            conversa senza direzione e non sa quando è il momento di proporre una call.
          </p>
          <p className="hp-section-subtitle" style={{ marginTop: "0.5rem" }}>
            Il risultato: tempo investito, nessun ritorno prevedibile.
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
          <h2 className="hp-section-title">Perché LinkedIn funziona per chi vende servizi</h2>
          <div className="hp-stats-grid hp-stats-grid-2">
            {[
              { value: "97%", label: "dei professionisti B2B considera LinkedIn tra le prime 3 fonti di clienti", sub: "Il canale c&apos;è. Serve il metodo per usarlo" },
              { value: "57%", label: "afferma che è la fonte principale di clienti di qualità", sub: "Non contatti generici, ma clienti reali" },
            ].map((s) => (
              <div key={s.value} className="hp-stat-card hp-stat-card-lg">
                <div className="hp-stat-value">{s.value}</div>
                <div className="hp-stat-label">{s.label}</div>
                <div className="hp-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
          <p className="hp-piattaforma-body">
            LinkedIn è già il canale. Il problema non è la piattaforma — è l&apos;assenza di un sistema per passare dal contatto al cliente.
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
              { value: "1B+", label: "membri su LinkedIn nel mondo", sub: "La più grande piattaforma B2B al mondo" },
              { value: "23M", label: "iscritti in Italia", sub: "Un bacino enorme di potenziali clienti" },
              { value: "5–8", label: "punti di contatto medi prima di una vendita B2B", sub: "Servono contenuti, conversazioni e follow-up" },
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
          <div className="hp-section-label hp-section-label-light">Il metodo</div>
          <h2 className="hp-section-title hp-title-white">
            Cinque fasi. Un percorso operativo completo.
          </h2>

          <div className="hiw-method-grid">
            {[
              {
                number: "01",
                title: "Imposti il tuo sistema commerciale",
                text: "Definisci il tuo servizio, il tuo cliente ideale e il problema che risolvi. Il sistema parte dal tuo contesto reale.",
                modules: ["Configurazione", "Profilo commerciale"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                ),
              },
              {
                number: "02",
                title: "Identifichi le categorie di clienti giusti",
                text: "Il sistema analizza il tuo posizionamento e ti indica quali categorie di professionisti contattare, con ricerche LinkedIn pronte.",
                modules: ["Chi contattare", "Ricerche LinkedIn"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ),
              },
              {
                number: "03",
                title: "Analizzi profili specifici",
                text: "Prima di contattare qualcuno, capisci se vale la pena scrivergli. Il sistema valuta il profilo e ti dice come muoverti.",
                modules: ["Analisi profilo", "Valutazione fit"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ),
              },
              {
                number: "04",
                title: "Ricevi indicazioni strategiche personalizzate",
                text: "Per ogni situazione — commento, messaggio, DM, follow-up — il sistema ti indica cosa scrivere e quale passo fare dopo.",
                modules: ["Risposte ai commenti", "Messaggi", "Consulenza situazionale"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
              },
              {
                number: "05",
                title: "Porti le conversazioni verso call e opportunità",
                text: "Pipeline, follow-up e prossimi passi: ogni contatto ha una direzione. Nessuna conversazione si perde.",
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
          <div className="hp-section-label">Il percorso</div>
          <h2 className="hp-section-title hiw-timeline-heading">Il percorso operativo completo</h2>

          <div className="hiw-timeline">
            {[
              { step: "1", label: "Configuri il sistema", desc: "Inserisci il tuo servizio, il cliente ideale e il problema che risolvi.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>) },
              { step: "2", label: "Identifichi chi contattare", desc: "Ottieni categorie di prospect e ricerche LinkedIn pronte.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>) },
              { step: "3", label: "Analizzi prima di scrivere", desc: "Per ogni profilo, capisci se vale la pena contattarlo e come.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) },
              { step: "4", label: "Gestisci ogni conversazione", desc: "Commenti, messaggi, DM: il sistema ti indica cosa scrivere e quando.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>) },
              { step: "5", label: "Proponi la call", desc: "Con il messaggio giusto al momento giusto. Nessuna forzatura.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>) },
              { step: "6", label: "Gestisci pipeline e follow-up", desc: "Ogni contatto ha un prossimo passo. Nessuna conversazione si perde.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>) },
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
          <div className="hp-section-label">Funzionalità</div>
          <h2 className="hp-section-title">Tutti gli strumenti del sistema</h2>
          <p className="hp-section-subtitle">
            Ogni strumento ha un ruolo preciso nel percorso da contatto a cliente.
          </p>

          <div className="hiw-features-grid">
            {[
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>), title: "Configurazione sistema", desc: "Definisci il tuo contesto commerciale. Tutto parte da qui." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>), title: "Chi contattare", desc: "Categorie di prospect e ricerche LinkedIn pronte da usare." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>), title: "Analisi profilo", desc: "Capisci se un contatto è in target prima di scrivergli." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>), title: "Risposte ai commenti", desc: "Indicazioni per trasformare i commenti in conversazioni." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>), title: "Messaggi e DM", desc: "Template e indicazioni per aprire e continuare conversazioni." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), title: "Piano giornaliero", desc: "Ogni giorno sai chi contattare, cosa pubblicare e chi ricontattare." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>), title: "Pipeline clienti", desc: "Gestisci tutti i tuoi contatti in un percorso chiaro e visuale." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>), title: "Simulazione conversazioni", desc: "Allenati a rispondere a obiezioni e domande prima di farlo dal vivo." },
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
              <div className="hp-section-label hp-section-label-light">Risultato</div>
              <h2 className="hp-section-title hp-title-white">
                Non entri su LinkedIn per &ldquo;vedere cosa succede&rdquo;.
              </h2>
              <p className="hp-profile-subtitle">
                Entri con un sistema. Sai esattamente cosa fare.
              </p>
              <ul className="hp-profile-list">
                {["Chi contattare", "Cosa scrivere", "Quando ricontattare", "Come arrivare alla call"].map((item) => (
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
            Un metodo completo per trasformare LinkedIn<br />in un canale di acquisizione clienti.
          </h2>
          <p className="hp-final-subtitle">
            Configurazione → Targeting → Analisi → Conversazione → Call.
          </p>
          <Link href="/app/onboarding" className="hp-cta-primary hp-cta-large">
            Crea il tuo sistema clienti
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
