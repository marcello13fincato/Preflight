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
            Come funziona davvero<br />
            <span className="hp-hero-title-accent">Preflight</span>
          </h1>
          <p className="hp-hero-subtitle">
            Non è un insieme di strumenti.<br />
            È un sistema guidato per trasformare LinkedIn in un canale clienti.
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
          <h2 className="hp-section-title">Pubblicare non basta.</h2>
          <p className="hp-section-subtitle">
            Su LinkedIn molti si fermano ai contenuti. Pubblicano. Ottengono qualche like.
            Ogni tanto un commento. E lì finisce tutto.
          </p>
          <p className="hp-section-subtitle" style={{ marginTop: "0.5rem" }}>
            Il problema non è la piattaforma.<br />
            Il problema è che manca un sistema.
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
          2.5. DATI LINKEDIN
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
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
            Tre fasi. Un solo obiettivo: il cliente.
          </h2>

          <div className="hiw-method-grid">
            {[
              {
                number: "01",
                title: "Attirare clienti",
                text: "Crei contenuti che parlano al cliente giusto e aprono conversazioni utili.",
                modules: ["Contenuti", "Scrivi un post", "Trova opportunità"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                ),
              },
              {
                number: "02",
                title: "Parlare con i clienti",
                text: "Gestisci commenti, messaggi e profili con più chiarezza, senza improvvisare.",
                modules: ["Rispondi ai commenti", "Rispondi ai messaggi", "Analizza un potenziale cliente", "Allenati alle conversazioni"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
              },
              {
                number: "03",
                title: "Gestire i clienti",
                text: "Segui le conversazioni, ricontatta le persone giuste e non perdi occasioni.",
                modules: ["Clienti in corso"],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
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
          <h2 className="hp-section-title hiw-timeline-heading">Come nasce un cliente su LinkedIn</h2>

          <div className="hiw-timeline">
            {[
              { step: "1", label: "Pubblichi un contenuto", desc: "Scrivi un post mirato al tuo cliente ideale, guidato da Preflight.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>) },
              { step: "2", label: "Ricevi un commento", desc: "Qualcuno risponde: è un segnale di interesse reale.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>) },
              { step: "3", label: "Continui la conversazione", desc: "Preflight ti suggerisce la risposta giusta per approfondire.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>) },
              { step: "4", label: "La porti nei messaggi", desc: "Quando è il momento, sposti la conversazione in privato.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>) },
              { step: "5", label: "Proponi una call", desc: "Con il messaggio giusto al momento giusto, la call è naturale.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>) },
              { step: "6", label: "Gestisci il follow-up", desc: "Traccia ogni contatto, follow-up e prossimo passo nella pipeline.", icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>) },
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
          <h2 className="hp-section-title">Cosa trovi dentro Preflight</h2>
          <p className="hp-section-subtitle">
            Non solo suggerimenti. Un sistema completo per trovare, gestire e convertire contatti LinkedIn.
          </p>

          <div className="hiw-features-grid">
            {[
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), title: "Piano contenuti", desc: "Un piano editoriale pensato per attrarre il tuo cliente ideale." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>), title: "Risposte ai commenti", desc: "Suggerimenti per trasformare i commenti in conversazioni." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>), title: "Messaggi guidati", desc: "Template per aprire e continuare conversazioni in modo naturale." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L3 14h7v8l10-12h-7l0-8z"/></svg>), title: "Temperatura del contatto", desc: "Capisce in che fase è ogni contatto e cosa fare dopo." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>), title: "Suggerimenti follow-up", desc: "Promemoria e messaggi per non perdere contatti caldi." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>), title: "Profili da esplorare", desc: "Suggerisce chi cercare su LinkedIn in base al tuo target." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>), title: "Pipeline clienti", desc: "Gestisci tutti i tuoi contatti in una pipeline semplice e chiara." },
              { icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>), title: "Simulazione conversazioni", desc: "Allenati a rispondere a obiezioni e domande di potenziali clienti." },
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
                Alla fine, sai sempre cosa fare.
              </h2>
              <p className="hp-profile-subtitle">
                Non entri su LinkedIn per &ldquo;vedere cosa succede&rdquo;.
                Entri con un sistema.
              </p>
              <ul className="hp-profile-list">
                {["Cosa pubblicare", "A chi scrivere", "Cosa rispondere", "Quando ricontattare"].map((item) => (
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
            Trasforma LinkedIn nella tua<br />macchina commerciale
          </h2>
          <p className="hp-final-subtitle">
            Non servono più ore. Serve più chiarezza.
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
