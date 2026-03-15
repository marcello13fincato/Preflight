import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";
import QuickAssistant from "../../components/marketing/QuickAssistant";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    const { redirect } = await import("next/navigation");
    redirect("/app");
  }

  return (
    <div className="homepage-root">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-glow" aria-hidden="true" />
        <div className="hp-container hp-hero-inner">
          <h1 className="hp-hero-title">
            Trasforma LinkedIn in un sistema<br />
            <span className="hp-hero-title-accent">prevedibile di acquisizione clienti.</span>
          </h1>
          <p className="hp-hero-subtitle">
            Preflight unisce metodo commerciale e intelligenza artificiale specializzata
            per aiutarti a trovare, capire e contattare i clienti giusti
            con maggiore chiarezza e meno dispersione.
          </p>
          <p className="hp-hero-bridge">
            Molti professionisti sono attivi su LinkedIn senza una direzione commerciale chiara.
            L&apos;IA di Preflight è costruita intorno a processi di vendita reali e supporta
            ogni fase: dall&apos;identificazione dei profili alla gestione delle conversazioni.
          </p>
          <div className="hp-hero-ctas">
            <Link href="/signup" className="hp-cta-primary">
              Inizia a usare LinkedIn con un metodo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link href="/how-it-works" className="hp-cta-ghost">
              Scopri come funziona
            </Link>
          </div>
          <p className="hp-hero-trust">✓ Gratis per iniziare &nbsp;&nbsp; ✓ Nessuna carta di credito &nbsp;&nbsp; ✓ Setup in 5 minuti</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. SUPPORT BLOCK — Supporto decisionale
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container hp-support-block">
          <div className="hp-section-label">Posizionamento</div>
          <h2 className="hp-section-title">
            Non è un generatore di contenuti.<br />È un supporto decisionale.
          </h2>
          <p className="hp-section-subtitle hp-support-desc">
            La maggior parte del tempo perso su LinkedIn non dipende dalla mancanza di strumenti,
            ma dall&apos;assenza di una direzione chiara. Preflight riduce la dispersione
            e aumenta la lucidità strategica in ogni fase del processo commerciale:
            dalla scelta di chi contattare, alla gestione della conversazione,
            fino alla decisione sui prossimi passi.
          </p>
          <div className="hp-support-points">
            {[
              { icon: "🎯", text: "Meno tempo sprecato su profili non in target" },
              { icon: "🧭", text: "Più chiarezza su priorità e prossimi passi" },
              { icon: "💬", text: "Conversazioni guidate da contesto, non da impulso" },
            ].map((point) => (
              <div key={point.text} className="hp-support-point">
                <span className="hp-support-point-icon" aria-hidden="true">{point.icon}</span>
                <span>{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2b. AI POSITIONING BLOCK
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container hp-ai-positioning">
          <div className="hp-section-label">L&apos;intelligenza artificiale</div>
          <h2 className="hp-section-title">
            Un&apos;IA progettata per il contesto reale,<br />non per generare testi generici.
          </h2>
          <p className="hp-section-subtitle hp-ai-pos-desc">
            L&apos;intelligenza artificiale di Preflight non è un modello generico adattato al marketing.
            È costruita sulle dinamiche commerciali reali: interpreta situazioni,
            riconosce segnali di interesse, suggerisce approcci calibrati sul contesto
            e aiuta a prendere decisioni migliori in meno tempo.
          </p>
          <div className="hp-ai-pos-grid">
            {[
              {
                title: "Analisi contestuale",
                desc: "Legge profili, post e conversazioni per restituire indicazioni operative, non testo preconfezionato.",
              },
              {
                title: "Memoria strategica",
                desc: "Tiene traccia delle interazioni precedenti e del tuo posizionamento per suggerimenti sempre più mirati.",
              },
              {
                title: "Logica commerciale",
                desc: "Ragiona in termini di pipeline, priorità e prossimi passi — non di engagement o like.",
              },
            ].map((card) => (
              <div key={card.title} className="hp-ai-pos-card">
                <h3 className="hp-ai-pos-card-title">{card.title}</h3>
                <p className="hp-ai-pos-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2c. METHOD BLOCK — Il flusso operativo
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il metodo</div>
          <h2 className="hp-section-title">Come funziona nella pratica</h2>
          <p className="hp-section-subtitle">
            Preflight segue un flusso strutturato che rispecchia il modo in cui
            si sviluppa davvero una relazione commerciale su LinkedIn.
          </p>
          <div className="hp-method-flow">
            {[
              {
                step: "1",
                title: "Configura il tuo contesto",
                desc: "Definisci chi sei, cosa offri e che tipo di clienti cerchi. Il sistema parte da qui.",
              },
              {
                step: "2",
                title: "Identifica i profili giusti",
                desc: "Ottieni categorie di prospect e ricerche LinkedIn pronte, basate sul tuo posizionamento.",
              },
              {
                step: "3",
                title: "Analizza e comprendi",
                desc: "L'IA legge profili e conversazioni per darti contesto e suggerimenti su come muoverti.",
              },
              {
                step: "4",
                title: "Gestisci la relazione",
                desc: "Follow-up, messaggi, commenti strategici: ogni interazione ha una direzione chiara verso la call.",
              },
            ].map((item) => (
              <div key={item.step} className="hp-method-step">
                <div className="hp-method-step-num" aria-hidden="true">{item.step}</div>
                <div className="hp-method-step-content">
                  <h3 className="hp-method-step-title">{item.title}</h3>
                  <p className="hp-method-step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. DEMO — PROVA SUBITO L'ASSISTENTE
      ═══════════════════════════════════════════════════════════ */}
      <section id="assistente" className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Provalo ora</div>
          <h2 className="hp-section-title">Prova il sistema su un caso reale</h2>
          <QuickAssistant />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4b. TROVA CLIENTI (preview premium)
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Trova clienti</div>
          <h2 className="hp-section-title">Non sai chi cercare? Te lo dice il sistema.</h2>
          <p className="hp-section-subtitle">
            Descrivi il tipo di cliente che vuoi raggiungere e ottieni ricerche LinkedIn pronte, con keyword, filtri e strategia di approccio.
          </p>

          <div className="hp-premium-preview">
            <div className="hp-premium-preview-overlay">
              <div className="hp-premium-lock-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <p className="hp-premium-label">Disponibile nel piano completo.</p>
              <Link href="/pricing" className="hp-cta-primary" style={{ marginTop: "0.75rem" }}>
                Scopri i piani
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>

            <div className="hp-premium-preview-content" aria-hidden="true">
              <div className="hp-premium-mock-field">
                <div className="hp-premium-mock-label">Tipo di cliente</div>
                <div className="hp-premium-mock-input">Founder di startup SaaS B2B</div>
              </div>
              <div className="hp-premium-mock-field">
                <div className="hp-premium-mock-label">Settore</div>
                <div className="hp-premium-mock-input">Software / SaaS</div>
              </div>
              <div className="hp-premium-mock-field">
                <div className="hp-premium-mock-label">Area geografica</div>
                <div className="hp-premium-mock-input">Italia</div>
              </div>
              <div className="hp-premium-mock-btn">Trova clienti →</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. PER CHI È
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-target">
        <div className="hp-container">
          <div className="hp-section-label">Target</div>
          <h2 className="hp-section-title hp-target-title">Per chi usa LinkedIn come canale di acquisizione clienti.</h2>

          <div className="hp-target-grid">
            <article className="hp-target-card hp-target-card-positive">
              <h3 className="hp-target-card-title">Perfetto per:</h3>
              <ul className="hp-target-list">
                {[
                  "Consulenti",
                  "Freelance",
                  "Coach e formatori",
                  "Fractional manager",
                  "Agenzie B2B",
                  "Professionisti B2B",
                ].map((item) => (
                  <li key={item} className="hp-target-item hp-target-item-positive">
                    <span className="hp-target-icon hp-target-icon-positive" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="hp-target-card hp-target-card-neutral">
              <h3 className="hp-target-card-title">Non pensato per:</h3>
              <ul className="hp-target-list">
                {[
                  "Cercare lavoro",
                  "Recruiting",
                  "Crescita follower",
                  "Social media management",
                ].map((item) => (
                  <li key={item} className="hp-target-item hp-target-item-neutral">
                    <span className="hp-target-icon hp-target-icon-neutral" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
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
            LinkedIn funziona. Ti manca il sistema per trasformarlo in un canale clienti.
          </h2>
          <p className="hp-final-subtitle">
            Preflight ti dà metodo, direzione e chiarezza.
            Tu ci metti competenza e 20 minuti al giorno.
          </p>
          <a href="#assistente" className="hp-cta-primary hp-cta-large">
            Configura il tuo sistema
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
