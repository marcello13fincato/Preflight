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
          <div className="hp-badge">
            <span className="hp-badge-dot" aria-hidden="true" />
            LinkedIn è il canale. Ti manca il sistema.
          </div>
          <h1 className="hp-hero-title">
            Trasforma LinkedIn in un sistema<br />
            <span className="hp-hero-title-accent">prevedibile di acquisizione clienti.</span>
          </h1>
          <p className="hp-hero-subtitle">
            La maggior parte dei professionisti pubblica, commenta e aspetta.
            Preflight introduce metodo: sai chi contattare, cosa scrivere e come portare ogni conversazione verso una call.
          </p>
          <div className="hp-hero-ctas">
            <a href="#assistente" className="hp-cta-primary">
              Prova l&apos;assistente
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <Link href="/how-it-works" className="hp-cta-ghost">
              Come funziona
            </Link>
          </div>
          <p className="hp-hero-trust">✓ Gratis per iniziare &nbsp;&nbsp; ✓ Nessuna carta di credito &nbsp;&nbsp; ✓ Setup in 5 minuti</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. DATI LINKEDIN
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container hp-dato-principale">
          <h2 className="hp-dato-title">
            La maggior parte dei professionisti usa LinkedIn senza un sistema.<br />Pubblicano senza intento commerciale. Conversano senza direzione.
          </h2>
        </div>
      </section>

      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">I numeri</div>
          <div className="hp-stats-grid hp-stats-grid-3">
            {[
              { value: "80%", label: "dei lead B2B dai social arriva da LinkedIn", sub: "Ma solo se sai come muoverti" },
              { value: "5–8", label: "touchpoint servono prima di una vendita", sub: "Servono conversazioni strutturate, non interazioni casuali" },
              { value: "23M", label: "professionisti su LinkedIn in Italia", sub: "Il problema non è trovare persone. È sapere quali contattare" },
            ].map((stat) => (
              <div key={stat.value} className="hp-stat-card hp-stat-card-lg">
                <div className="hp-stat-value">{stat.value}</div>
                <div className="hp-stat-label">{stat.label}</div>
                <div className="hp-stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
          <p className="hp-dato-body" style={{ textAlign: "center", marginTop: "2rem" }}>
            Il problema non è LinkedIn. È l&apos;assenza di un metodo per trasformare<br />
            contenuti e conversazioni in un percorso che porta al cliente.
          </p>
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
          4. AI PERSONALIZZATA
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">Il metodo</div>
          <h2 className="hp-section-title">Non è uno strumento. È un sistema che parte da te.</h2>
          <p className="hp-section-subtitle">
            Configuri il tuo posizionamento, il tuo servizio e il tipo di clienti che cerchi.
            Da lì, ogni indicazione ha una direzione precisa.
          </p>
          <div className="hp-ai-explain-grid">
            <div className="hp-ai-explain-text">
              <ul className="hp-ai-explain-list">
                <li><span className="hp-ai-explain-check">✓</span>Il servizio che offri</li>
                <li><span className="hp-ai-explain-check">✓</span>Il tipo di clienti che vuoi raggiungere</li>
                <li><span className="hp-ai-explain-check">✓</span>Il problema che risolvi per loro</li>
                <li><span className="hp-ai-explain-check">✓</span>Il tempo che puoi dedicare a LinkedIn</li>
              </ul>
              <p className="hp-ai-explain-note">Più il sistema conosce il tuo contesto, più le indicazioni sono precise e azionabili.</p>
              <Link href="/app/onboarding" className="hp-cta-primary" style={{ marginTop: "1rem" }}>
                Configura il tuo sistema
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
            <div className="hp-ai-explain-visual">
              <div className="hp-ai-explain-card">
                <div className="hp-ai-explain-card-icon">⚙️</div>
                <div className="hp-ai-explain-card-label">Il tuo profilo commerciale</div>
                <div className="hp-mock-lines" style={{ padding: "8px 0" }}>
                  <div className="hp-mock-line hp-mock-line-w70" />
                  <div className="hp-mock-line hp-mock-line-w50" />
                  <div className="hp-mock-line hp-mock-line-w80" />
                </div>
              </div>
              <div className="hp-ai-explain-arrow" aria-hidden="true">→</div>
              <div className="hp-ai-explain-card hp-ai-explain-card-accent">
                <div className="hp-ai-explain-card-icon">🤖</div>
                <div className="hp-ai-explain-card-label">Indicazioni operative</div>
                <div className="hp-mock-lines" style={{ padding: "8px 0" }}>
                  <div className="hp-mock-line hp-mock-line-w80" />
                  <div className="hp-mock-line hp-mock-line-w60" />
                </div>
              </div>
            </div>
          </div>
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
          5. COME FUNZIONA
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Come funziona</div>
          <h2 className="hp-section-title">Un metodo in tre fasi</h2>
          <div className="hp-problem-grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ),
                title: "Identifica chi contattare",
                desc: "Definisci il tuo target e ottieni categorie di prospect con ricerche LinkedIn pronte.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
                title: "Gestisci ogni conversazione",
                desc: "Analizza profili, rispondi a commenti e messaggi con indicazioni precise su come muoverti.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                ),
                title: "Arriva alla call",
                desc: "Follow-up, pipeline e prossimi passi: sai sempre cosa fare per chiudere.",
              },
            ].map((item) => (
              <article key={item.title} className="hp-problem-card">
                <div className="hp-problem-icon">{item.icon}</div>
                <h3 className="hp-problem-card-title">{item.title}</h3>
                <p className="hp-problem-card-desc">{item.desc}</p>
              </article>
            ))}
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
