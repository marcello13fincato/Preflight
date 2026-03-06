import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";

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
            Oltre 1 miliardo di profili LinkedIn. Quanti sono tuoi clienti?
          </div>
          <h1 className="hp-hero-title">
            LinkedIn non è un social.<br />
            <span className="hp-hero-title-accent">È la tua pagina di vendita.</span>
          </h1>
          <p className="hp-hero-subtitle">
            Preflight ti aiuta a trasformare post, commenti e messaggi in
            conversazioni, call e clienti.
          </p>
          <div className="hp-hero-ctas">
            <Link href="/app/onboarding" className="hp-cta-primary">
              Crea il tuo sistema clienti
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link href="/how-it-works" className="hp-cta-ghost">
              Guarda come funziona
            </Link>
          </div>
          <p className="hp-hero-trust">✓ Gratis per iniziare &nbsp;&nbsp; ✓ Nessuna carta di credito &nbsp;&nbsp; ✓ Setup in 5 minuti</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. PROBLEMA
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il problema</div>
          <h2 className="hp-section-title">Pubblicare su LinkedIn non basta.</h2>
          <p className="hp-section-subtitle">
            Ogni giorno migliaia di professionisti pubblicano contenuti di qualità.<br />
            Eppure i clienti non arrivano. Ecco perché.
          </p>
          <div className="hp-problem-grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ),
                title: "Contenuti senza strategia",
                desc: "Pubblichi, prendi like, ma nessuno ti chiede una call. I contenuti da soli non convertono.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
                title: "Conversazioni che muoiono",
                desc: "Rispondi ai commenti senza sapere cosa dire. I DM restano senza risposta o si freddano.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ),
                title: "Nessun sistema di prospecting",
                desc: "Non sai chi contattare, quando farlo, e cosa scrivere. Manca un metodo ripetibile.",
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
          3. IL SISTEMA
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-dark">
        <div className="hp-container">
          <div className="hp-section-label hp-section-label-light">Il sistema</div>
          <h2 className="hp-section-title hp-title-white">
            Dal post al cliente, passo dopo passo.
          </h2>
          <p className="hp-section-subtitle hp-subtitle-light">
            Preflight ti guida lungo l&apos;intero percorso commerciale su LinkedIn,
            trasformando ogni interazione in un&apos;opportunità.
          </p>
          <div className="hp-flow">
            {[
              { step: "POST", label: "Scrivi con strategia", desc: "Contenuti calibrati sul tuo ICP per attirare le persone giuste", color: "#0A66C2" },
              { step: "COMMENTI", label: "Rispondi con intenzione", desc: "Ogni commento è un'apertura: rispondi in modo da spingere verso la DM", color: "#0A66C2" },
              { step: "MESSAGGI", label: "Converti in conversazione", desc: "Template e AI per trasformare le interazioni in dialogo privato", color: "#0A66C2" },
              { step: "CALL", label: "Porta alla call", desc: "Messaggi studiati per arrivare alla discovery call senza forzare", color: "#0A66C2" },
              { step: "CLIENTE", label: "Chiudi il deal", desc: "Il sistema completo per trasformare LinkedIn in una macchina clienti", color: "#16a34a" },
            ].map((item, i) => (
              <div key={item.step} className="hp-flow-item">
                <div className="hp-flow-card" style={{ borderColor: item.color }}>
                  <span className="hp-flow-step" style={{ background: item.color }}>{item.step}</span>
                  <p className="hp-flow-label">{item.label}</p>
                  <p className="hp-flow-desc">{item.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hp-flow-arrow" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. DEMO PRODOTTO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Demo prodotto</div>
          <h2 className="hp-section-title">Tutto ciò che ti serve, in un&apos;unica piattaforma.</h2>
          <p className="hp-section-subtitle">
            Strumenti AI integrati per ogni fase del tuo percorso commerciale su LinkedIn.
          </p>
          <div className="hp-demo-grid">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                ),
                title: "Generatore Post",
                desc: "Post ottimizzati per il tuo ICP con struttura narrativa e CTA nascosta",
                mock: (
                  <div className="hp-mock hp-mock-post">
                    <div className="hp-mock-bar">
                      <span className="hp-mock-dot" /><span className="hp-mock-dot" /><span className="hp-mock-dot" />
                    </div>
                    <div className="hp-mock-lines">
                      <div className="hp-mock-line hp-mock-line-w80" />
                      <div className="hp-mock-line hp-mock-line-w60" />
                      <div className="hp-mock-line hp-mock-line-full" />
                      <div className="hp-mock-line hp-mock-line-w70" />
                      <div className="hp-mock-line hp-mock-line-w50" />
                    </div>
                    <div className="hp-mock-btn" />
                  </div>
                ),
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                ),
                title: "Risposte ai Commenti",
                desc: "Incolla il commento e ricevi la risposta perfetta per portare alla DM",
                mock: (
                  <div className="hp-mock hp-mock-comments">
                    <div className="hp-mock-bar">
                      <span className="hp-mock-dot" /><span className="hp-mock-dot" /><span className="hp-mock-dot" />
                    </div>
                    <div className="hp-mock-comment">
                      <div className="hp-mock-avatar" />
                      <div className="hp-mock-comment-body">
                        <div className="hp-mock-line hp-mock-line-w60" />
                        <div className="hp-mock-line hp-mock-line-w80" />
                      </div>
                    </div>
                    <div className="hp-mock-reply">
                      <div className="hp-mock-line hp-mock-line-full" />
                      <div className="hp-mock-line hp-mock-line-w70" />
                    </div>
                  </div>
                ),
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                ),
                title: "Messaggi DM",
                desc: "Template di outreach calibrati per ogni fase della conversazione",
                mock: (
                  <div className="hp-mock hp-mock-dm">
                    <div className="hp-mock-bar">
                      <span className="hp-mock-dot" /><span className="hp-mock-dot" /><span className="hp-mock-dot" />
                    </div>
                    <div className="hp-mock-dm-bubble hp-mock-dm-left">
                      <div className="hp-mock-line hp-mock-line-w70" />
                      <div className="hp-mock-line hp-mock-line-w50" />
                    </div>
                    <div className="hp-mock-dm-bubble hp-mock-dm-right">
                      <div className="hp-mock-line hp-mock-line-w60" />
                      <div className="hp-mock-line hp-mock-line-w40" />
                    </div>
                  </div>
                ),
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ),
                title: "Trova Opportunità",
                desc: "Analizza il feed e identifica le conversazioni calde da aggredire oggi",
                mock: (
                  <div className="hp-mock hp-mock-opp">
                    <div className="hp-mock-bar">
                      <span className="hp-mock-dot" /><span className="hp-mock-dot" /><span className="hp-mock-dot" />
                    </div>
                    <div className="hp-mock-opp-row">
                      <div className="hp-mock-avatar hp-mock-avatar-sm" />
                      <div className="hp-mock-opp-body">
                        <div className="hp-mock-line hp-mock-line-w60" />
                        <div className="hp-mock-line hp-mock-line-w80" />
                      </div>
                      <div className="hp-mock-score">🔥</div>
                    </div>
                    <div className="hp-mock-opp-row">
                      <div className="hp-mock-avatar hp-mock-avatar-sm" />
                      <div className="hp-mock-opp-body">
                        <div className="hp-mock-line hp-mock-line-w50" />
                        <div className="hp-mock-line hp-mock-line-w70" />
                      </div>
                      <div className="hp-mock-score">⚡</div>
                    </div>
                  </div>
                ),
              },
            ].map((tool) => (
              <div key={tool.title} className="hp-demo-card">
                <div className="hp-demo-mock-wrap">
                  {tool.mock}
                  <div className="hp-demo-blur-overlay" aria-hidden="true" />
                </div>
                <div className="hp-demo-info">
                  <div className="hp-demo-icon">{tool.icon}</div>
                  <div>
                    <h3 className="hp-demo-title">{tool.title}</h3>
                    <p className="hp-demo-desc">{tool.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. ANALISI PROFILO LINKEDIN
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-blue">
        <div className="hp-container">
          <div className="hp-profile-grid">
            <div className="hp-profile-content">
              <div className="hp-section-label hp-section-label-light">Analisi profilo</div>
              <h2 className="hp-section-title hp-title-white">
                Il tuo profilo LinkedIn è la tua vetrina.<br />
                <span className="hp-hero-title-accent">Stiamo sfruttandola al massimo?</span>
              </h2>
              <p className="hp-profile-subtitle">
                Preflight analizza il tuo profilo LinkedIn e ti dice esattamente cosa ottimizzare
                per attrarre il cliente ideale, non solo connessioni casuali.
              </p>
              <ul className="hp-profile-list">
                {[
                  "Titolo professionale ottimizzato per il cliente ideale",
                  "About che vende, non solo che descrive",
                  "Featured section con prove sociali",
                  "Esperienza strutturata come portfolio di risultati",
                ].map((item) => (
                  <li key={item} className="hp-profile-list-item">
                    <span className="hp-check-icon" aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/app/onboarding" className="hp-cta-white">
                Analizza il mio profilo
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
                  <div className="hp-mock-line hp-mock-line-w70 hp-pmock-line" />
                </div>
                <div className="hp-profile-mock-score">
                  <span className="hp-profile-mock-score-val">74<span className="hp-profile-mock-score-fraction">/100</span></span>
                  <span className="hp-profile-mock-score-label">Punteggio profilo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. DATI LINKEDIN
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il mercato</div>
          <h2 className="hp-section-title">L&apos;opportunità è enorme.<br />Non sprecarla.</h2>
          <div className="hp-stats-grid">
            {[
              { value: "1B+", label: "utenti LinkedIn nel mondo", sub: "La più grande piattaforma B2B al mondo" },
              { value: "23M", label: "profili LinkedIn in Italia", sub: "Un bacino immenso di potenziali clienti" },
              { value: "80%", label: "delle vendite B2B nascono da conversazioni private", sub: "Non da post pubblici, ma da DM e interazioni" },
              { value: "5×", label: "più clienti con un sistema vs senza", sub: "La differenza tra pubblicare e avere un metodo" },
            ].map((stat) => (
              <div key={stat.value} className="hp-stat-card">
                <div className="hp-stat-value">{stat.value}</div>
                <div className="hp-stat-label">{stat.label}</div>
                <div className="hp-stat-sub">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. FUNZIONI AVANZATE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft">
        <div className="hp-container">
          <div className="hp-section-label">Piano completo</div>
          <h2 className="hp-section-title">Funzioni avanzate per chi fa sul serio.</h2>
          <p className="hp-section-subtitle">
            Per i professionisti che vogliono risultati più rapidi e un sistema completamente automatizzato.
          </p>
          <div className="hp-advanced-grid">
            {[
              { title: "Pipeline Clienti", desc: "Gestisci lead, stati e follow-up in un'unica vista" },
              { title: "Piano 14 giorni", desc: "Azioni quotidiane prioritizzate per chiudere clienti" },
              { title: "Analisi Competitor", desc: "Scopri come si posizionano i tuoi competitor su LinkedIn" },
              { title: "Automazione Follow-up", desc: "Sequenze di messaggi automatizzate per non perdere un lead" },
              { title: "Report Performance", desc: "Metriche di engagement e conversione dettagliate" },
              { title: "Export Dati", desc: "Esporta la tua pipeline e i tuoi contatti in qualsiasi formato" },
            ].map((feat) => (
              <div key={feat.title} className="hp-advanced-card">
                <div className="hp-advanced-mock" aria-hidden="true">
                  <div className="hp-mock-lines" style={{ padding: "12px" }}>
                    <div className="hp-mock-line hp-mock-line-w70" />
                    <div className="hp-mock-line hp-mock-line-w50" />
                    <div className="hp-mock-line hp-mock-line-w80" />
                  </div>
                </div>
                <div className="hp-advanced-overlay">
                  <div className="hp-advanced-overlay-inner">
                    <div className="hp-lock-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </div>
                    <p className="hp-advanced-overlay-text">Disponibile nel piano completo</p>
                  </div>
                </div>
                <div className="hp-advanced-info">
                  <h3 className="hp-advanced-title">{feat.title}</h3>
                  <p className="hp-advanced-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="hp-advanced-cta">
            <Link href="/pricing" className="hp-cta-primary">
              Sblocca tutte le funzioni
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. TESTIMONIANZE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Testimonianze</div>
          <h2 className="hp-section-title">Chi ha già trasformato LinkedIn in un sistema clienti.</h2>
          <div className="hp-testimonials-grid">
            {[
              {
                quote: "In 3 settimane ho fissato 4 discovery call solo grazie al metodo di risposta ai commenti. Prima raccoglievo like, ora raccolgo clienti.",
                name: "Marco R.",
                role: "Consulente Marketing",
                initials: "MR",
              },
              {
                quote: "Non sapevo cosa scrivere nei DM. Con Preflight ho un template per ogni fase: apertura, follow-up, chiusura. Ho chiuso 2 clienti in un mese.",
                name: "Francesca B.",
                role: "Business Coach",
                initials: "FB",
              },
              {
                quote: "Il piano 14 giorni mi ha dato una struttura. Sapevo esattamente cosa fare ogni giorno. Il risultato? Pipeline piena per la prima volta.",
                name: "Luca T.",
                role: "Freelance UX Designer",
                initials: "LT",
              },
            ].map((t) => (
              <blockquote key={t.name} className="hp-testimonial-card">
                <div className="hp-testimonial-stars" aria-label="5 stelle">★★★★★</div>
                <p className="hp-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <footer className="hp-testimonial-author">
                  <div className="hp-testimonial-avatar" aria-hidden="true">{t.initials}</div>
                  <div>
                    <div className="hp-testimonial-name">{t.name}</div>
                    <div className="hp-testimonial-role">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. CTA FINALE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-final-cta">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner">
          <h2 className="hp-final-title">
            Pronto a trasformare LinkedIn<br />nel tuo sistema clienti?
          </h2>
          <p className="hp-final-subtitle">
            Unisciti a centinaia di professionisti che hanno smesso di pubblicare nel vuoto
            e hanno iniziato a ottenere clienti sistematicamente.
          </p>
          <Link href="/app/onboarding" className="hp-cta-primary hp-cta-large">
            Crea il tuo sistema clienti — è gratis
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
