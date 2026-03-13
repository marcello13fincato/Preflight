import Link from "next/link";

const freeFeatures = [
  "Accesso alla dashboard",
  "Primi test dei moduli principali",
  "Visione generale del sistema",
  "Alcune risposte e suggerimenti (limitati)",
];

const proFeatures = [
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>), label: "Piano contenuti personalizzato" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>), label: "Analisi profilo cliente completa" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>), label: "Risposte ai commenti illimitate" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>), label: "Messaggi e follow-up guidati" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L3 14h7v8l10-12h-7l0-8z"/></svg>), label: "Temperatura del contatto" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>), label: "Analisi avanzata dei contatti" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>), label: "Pipeline clienti completa" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>), label: "Simulazione conversazioni" },
  { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>), label: "Opportunità da cercare su LinkedIn" },
];

const comparisonRows = [
  { label: "Piano contenuti personalizzato", free: false, pro: true },
  { label: "Scrittura post", free: "Limitata", pro: "Illimitata" },
  { label: "Risposte ai commenti", free: "Base", pro: "Illimitate" },
  { label: "Gestione messaggi", free: false, pro: true },
  { label: "Follow-up", free: false, pro: true },
  { label: "Analisi potenziali clienti", free: false, pro: true },
  { label: "Pipeline clienti", free: false, pro: true },
  { label: "Trova opportunità", free: false, pro: true },
  { label: "Allenamento conversazioni", free: false, pro: true },
];

const faqs = [
  { q: "Posso iniziare gratis?", a: "Sì. Puoi accedere alla dashboard e testare i moduli principali senza inserire una carta di credito. Il piano base ti permette di capire come funziona il sistema prima di sbloccare tutto." },
  { q: "Serve collegare LinkedIn?", a: "No. Preflight funziona con un semplice copia e incolla: incolla il commento, il messaggio o il profilo e il sistema ti suggerisce cosa fare. Nessuna integrazione tecnica richiesta." },
  { q: "È utile anche se parto da zero?", a: "Assolutamente sì. Preflight è pensato per freelance e consulenti che vogliono iniziare a usare LinkedIn in modo commerciale, anche senza esperienza pregressa." },
  { q: "Posso cambiare piano in seguito?", a: "Sì, puoi passare dal piano base al completo in qualsiasi momento. Nessun vincolo a lungo termine." },
  { q: "Il sistema scrive tutto da solo?", a: "No. Preflight ti guida e ti suggerisce cosa scrivere, ma sei sempre tu a decidere e personalizzare. L'obiettivo è renderti più efficace, non sostituirti." },
  { q: "È pensato per italiani?", a: "Sì. Tutto il sistema è in italiano: interfaccia, suggerimenti, contenuti e supporto. Preflight è costruito per il mercato italiano." },
  { q: "È utile solo per chi vende servizi?", a: "Preflight è progettato per chi usa LinkedIn come strumento commerciale per trovare clienti e vendere servizi o consulenze. Se il tuo obiettivo è vendere, è per te." },
];

export default function PricingPage() {
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
            Piani
          </div>
          <h1 className="hp-hero-title">
            Scegli come usare LinkedIn<br />
            <span className="hp-hero-title-accent">per trovare clienti con metodo</span>
          </h1>
          <p className="hp-hero-subtitle">
            Non stai pagando per dei contenuti.<br />
            Stai sbloccando un sistema per sapere chi contattare, cosa scrivere e quando fare il passo successivo.
          </p>
          <div className="hp-hero-ctas">
            <Link href="/app/onboarding" className="hp-cta-primary">
              Inizia ora
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
          {/* Mini flow visivo */}
          <div className="hp-miniflow">
            {["POST", "MESSAGGI", "CLIENTI"].map((s, i) => (
              <span key={s} className="hp-miniflow-item">
                <span className={`hp-miniflow-badge${i === 2 ? " hp-miniflow-badge-green" : ""}`}>{s}</span>
                {i < 2 && (
                  <svg className="hp-miniflow-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                )}
              </span>
            ))}
          </div>
          <p className="hp-hero-trust">✓ Gratis per iniziare &nbsp;&nbsp; ✓ Nessuna carta di credito &nbsp;&nbsp; ✓ Senza vincoli</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. COSA PUOI FARE SUBITO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Piano base</div>
          <h2 className="hp-section-title">Puoi iniziare a capire il sistema anche dal piano base</h2>
          <p className="hp-section-subtitle">
            Con il piano gratuito hai accesso a una versione ridotta di Preflight. Sufficiente per capire come funziona il metodo.
          </p>

          <div className="prc-base-wrap">
            <div className="prc-base-card">
              <div className="prc-base-header">
                <div>
                  <span className="prc-plan-badge">Piano Base</span>
                  <p className="prc-plan-price">Gratuito</p>
                </div>
                <span className="prc-plan-tag">Limitato</span>
              </div>
              <ul className="prc-base-list">
                {freeFeatures.map((f) => (
                  <li key={f} className="prc-base-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {/* Blurred locked preview */}
              <div className="prc-base-locked" aria-hidden="true">
                <div className="prc-base-locked-lines">
                  <div className="hp-mock-line hp-mock-line-w70" />
                  <div className="hp-mock-line hp-mock-line-w50" />
                  <div className="hp-mock-line hp-mock-line-w80" />
                </div>
                <div className="prc-base-locked-overlay">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <span>Disponibile in modo limitato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. COSA SI SBLOCCA DAVVERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-dark">
        <div className="hp-container">
          <div className="hp-section-label hp-section-label-light">Piano completo</div>
          <h2 className="hp-section-title hp-title-white">
            Quando sblocchi il piano completo, il sistema cambia livello
          </h2>
          <p className="hp-section-subtitle hp-subtitle-light">
            Qui inizi davvero a vendere meglio. Ogni modulo è pensato per aiutarti a trovare, gestire e convertire clienti da LinkedIn.
          </p>

          <div className="prc-pro-grid">
            {proFeatures.map((f) => (
              <div key={f.label} className="prc-pro-card">
                <span className="prc-pro-icon">{f.icon}</span>
                <p className="prc-pro-label">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="prc-pro-cta-box">
            <div className="prc-pro-cta-info">
              <span className="prc-plan-badge prc-plan-badge-light">Piano Pro</span>
              <p className="prc-pro-price">€19,99<span className="prc-pro-period">/mese</span></p>
              <p className="prc-pro-sub">Tutto incluso. Nessun extra.</p>
            </div>
            <Link href="/app/onboarding" className="hp-cta-primary">
              Inizia adesso
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. CONFRONTO CHIARO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Confronto</div>
          <h2 className="hp-section-title">Cosa cambia davvero</h2>
          <p className="hp-section-subtitle">
            Un confronto semplice tra il piano base e quello completo.
          </p>

          <div className="prc-compare-table-wrap">
            <table className="prc-compare-table">
              <thead>
                <tr>
                  <th className="prc-compare-th">Funzione</th>
                  <th className="prc-compare-th prc-compare-center">Base</th>
                  <th className="prc-compare-th prc-compare-center prc-compare-pro">Completo</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "prc-compare-even" : ""}>
                    <td className="prc-compare-td prc-compare-feature">{row.label}</td>
                    <td className="prc-compare-td prc-compare-center">
                      {row.free === false ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      ) : (
                        <span className="prc-compare-limited">{row.free}</span>
                      )}
                    </td>
                    <td className="prc-compare-td prc-compare-center">
                      {typeof row.pro === "string" ? (
                        <span className="prc-compare-full">{row.pro}</span>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. VALORE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-blue">
        <div className="hp-container">
          <div className="hp-profile-grid">
            <div className="hp-profile-content">
              <div className="hp-section-label hp-section-label-light">Il valore</div>
              <h2 className="hp-section-title hp-title-white">
                Un sistema clienti costa meno di un cliente perso
              </h2>
              <p className="hp-profile-subtitle">
                Bastano poche conversazioni gestite meglio per ripagare l&apos;abbonamento.
              </p>
              <p className="hp-profile-subtitle" style={{ marginTop: "0.5rem" }}>
                Il punto non è &ldquo;spendere meno&rdquo;.<br />
                Il punto è smettere di perdere opportunità per mancanza di metodo.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <div className="hp-stat-card" style={{ flex: "1", minWidth: "160px" }}>
                <div className="hp-stat-value">23M</div>
                <div className="hp-stat-label">persone su LinkedIn in Italia</div>
              </div>
              <div className="hp-stat-card" style={{ flex: "1", minWidth: "160px" }}>
                <div className="hp-stat-value">1</div>
                <div className="hp-stat-label">cliente trovato ripaga mesi di abbonamento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. FAQ
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">Domande frequenti</div>
          <h2 className="hp-section-title" style={{ textAlign: "center" }}>Domande reali, risposte dirette</h2>

          <div className="prc-faq-grid">
            {faqs.map((faq) => (
              <div key={faq.q} className="prc-faq-card">
                <h3 className="prc-faq-q">{faq.q}</h3>
                <p className="prc-faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6b. LINKEDIN COME CANALE CLIENTI
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container hp-dato-principale">
          <div className="hp-section-label">Il contesto</div>
          <h2 className="hp-section-title">Quando LinkedIn diventa il tuo canale per trovare clienti</h2>
          <p className="hp-dato-body">
            Consulenti e freelance che usano LinkedIn con metodo non aspettano che i clienti arrivino.<br />
            Sanno chi contattare, cosa scrivere e quando ricontattare.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. CTA FINALE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-final-cta">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner">
          <h2 className="hp-final-title">
            Scegli il piano e costruisci<br />il tuo sistema clienti
          </h2>
          <p className="hp-final-subtitle">
            Se usi LinkedIn per trovare clienti, il metodo fa la differenza.<br />
            Non un generatore di contenuti. Un sistema per arrivare alla call.
          </p>
          <Link href="/app/onboarding" className="hp-cta-primary hp-cta-large">
            Inizia adesso
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Inizia gratis · Sblocca tutto quando sei pronto</p>
        </div>
      </section>

    </div>
  );
}
