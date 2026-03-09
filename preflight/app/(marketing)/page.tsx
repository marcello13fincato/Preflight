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
            Oltre 1 miliardo di professionisti su LinkedIn. Con chi dovresti parlare?
          </div>
          <h1 className="hp-hero-title">
            Scopri chi contattare su LinkedIn<br />
            <span className="hp-hero-title-accent">e come iniziare la conversazione giusta.</span>
          </h1>
          <p className="hp-hero-subtitle">
            Analizza un profilo LinkedIn o descrivi una situazione reale.
            Preflight ti aiuta a capire come trasformarla in una conversazione che può portare a una call.
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
            LinkedIn è il posto dove nascono le conversazioni B2B.
          </h2>
        </div>
      </section>

      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">I dati</div>
          <div className="hp-stats-grid hp-stats-grid-3">
            {[
              { value: "80%", label: "dei lead B2B provenienti dai social arriva da LinkedIn", sub: "Il canale principale per il B2B" },
              { value: "89%", label: "dei marketer B2B usa LinkedIn per generare lead", sub: "La piattaforma più usata nel B2B" },
              { value: "1 mld+", label: "professionisti sulla piattaforma", sub: "Un bacino enorme di potenziali clienti" },
            ].map((stat) => (
              <div key={stat.value} className="hp-stat-card hp-stat-card-lg">
                <div className="hp-stat-value">{stat.value}</div>
                <div className="hp-stat-label">{stat.label}</div>
                <div className="hp-stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
          <p className="hp-dato-body" style={{ textAlign: "center", marginTop: "2rem" }}>
            Il problema non è pubblicare.<br />
            Il problema è capire con chi parlare e come iniziare la conversazione giusta.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. DEMO — PROVA SUBITO L'ASSISTENTE
      ═══════════════════════════════════════════════════════════ */}
      <section id="assistente" className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Assistente</div>
          <h2 className="hp-section-title">Prova subito l&apos;assistente</h2>
          <QuickAssistant />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. AI PERSONALIZZATA
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">AI personalizzata</div>
          <h2 className="hp-section-title">L&apos;AI funziona meglio quando conosce il tuo lavoro.</h2>
          <p className="hp-section-subtitle">
            Configurando il tuo sistema, Preflight può adattare i suggerimenti in base a:
          </p>
          <div className="hp-ai-explain-grid">
            <div className="hp-ai-explain-text">
              <ul className="hp-ai-explain-list">
                <li><span className="hp-ai-explain-check">✓</span>I servizi che offri</li>
                <li><span className="hp-ai-explain-check">✓</span>Il tipo di clienti che cerchi</li>
                <li><span className="hp-ai-explain-check">✓</span>Il tuo posizionamento</li>
                <li><span className="hp-ai-explain-check">✓</span>Il tempo che dedichi a LinkedIn</li>
              </ul>
              <p className="hp-ai-explain-note">Più l&apos;AI ti conosce, più i consigli saranno precisi.</p>
              <Link href="/app/onboarding" className="hp-cta-primary" style={{ marginTop: "1rem" }}>
                Configura il tuo sistema
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
            <div className="hp-ai-explain-visual">
              <div className="hp-ai-explain-card">
                <div className="hp-ai-explain-card-icon">⚙️</div>
                <div className="hp-ai-explain-card-label">Il tuo profilo</div>
                <div className="hp-mock-lines" style={{ padding: "8px 0" }}>
                  <div className="hp-mock-line hp-mock-line-w70" />
                  <div className="hp-mock-line hp-mock-line-w50" />
                  <div className="hp-mock-line hp-mock-line-w80" />
                </div>
              </div>
              <div className="hp-ai-explain-arrow" aria-hidden="true">→</div>
              <div className="hp-ai-explain-card hp-ai-explain-card-accent">
                <div className="hp-ai-explain-card-icon">🤖</div>
                <div className="hp-ai-explain-card-label">Suggerimenti personalizzati</div>
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
          5. COME FUNZIONA
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Come funziona</div>
          <h2 className="hp-section-title">Tre step per iniziare</h2>
          <div className="hp-problem-grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ),
                title: "Analizza una persona",
                desc: "Incolla un profilo LinkedIn e scopri se vale la pena contattarlo.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
                title: "Scopri come iniziare",
                desc: "Ricevi una strategia di contatto e un primo messaggio suggerito.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                ),
                title: "Porta avanti la conversazione",
                desc: "Ricevi consigli sui prossimi step fino alla call.",
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
          <h2 className="hp-section-title hp-target-title">Per chi usa LinkedIn per trovare clienti.</h2>

          <div className="hp-target-grid">
            <article className="hp-target-card hp-target-card-positive">
              <h3 className="hp-target-card-title">Perfetto per:</h3>
              <ul className="hp-target-list">
                {[
                  "Consulenti",
                  "Freelance",
                  "Coach",
                  "Fractional manager",
                  "Agenzie B2B",
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
            Pronto a scoprire chi contattare<br />e come iniziare la conversazione?
          </h2>
          <p className="hp-final-subtitle">
            Prova l&apos;assistente Preflight: analizza un profilo o chiedi un consiglio su una situazione reale.
          </p>
          <a href="#assistente" className="hp-cta-primary hp-cta-large">
            Prova l&apos;assistente
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
