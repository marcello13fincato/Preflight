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
    <div className="homepage-root fade-in">

      {/* ═══════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-hero fade-in">
        <div className="hp-hero-glow" aria-hidden="true" />
        <div className="hp-container hp-hero-inner hp-hero-cols fade-in-delay">

          {/* ── COLONNA SINISTRA: copy ── */}
          <div className="hp-hero-left">
            <h1 className="hp-hero-title">
              Il sistema che ti dice cosa fare ogni giorno su LinkedIn per trovare clienti.
            </h1>
            <p className="hp-hero-subtitle">
              Non strumenti. Non teoria.<br />
              Un percorso guidato: da chi contattare → a cosa scrivere → alla call.
            </p>
            <div className="hp-hero-ctas fade-in">
              <Link href="/signup" className="hp-cta-primary fade-in-delay">
                Inizia gratis
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
            </div>
            <p className="hp-hero-trust">Setup in 5 minuti · Nessuna carta di credito</p>
          </div>

          {/* ── COLONNA DESTRA: mock preview ── */}
          <div className="hp-hero-right">
            <div className="hp-hero-mock">
              <div className="hp-hero-mock-header">
                <span className="hp-hero-mock-dot hp-hero-mock-dot--red" />
                <span className="hp-hero-mock-dot hp-hero-mock-dot--yellow" />
                <span className="hp-hero-mock-dot hp-hero-mock-dot--green" />
                <span className="hp-hero-mock-header-title">Preflight — Oggi</span>
              </div>

              <div className="hp-hero-mock-body">
                {/* Step 1 */}
                <div className="hp-hero-mock-step">
                  <span className="hp-hero-mock-step-badge hp-hero-mock-step-badge--active">1</span>
                  <div className="hp-hero-mock-step-content">
                    <span className="hp-hero-mock-step-label">Chi contattare oggi</span>
                    <span className="hp-hero-mock-step-value">Marco R. · CEO, SaaS B2B · Milano</span>
                  </div>
                </div>

                <div className="hp-hero-mock-connector" />

                {/* Step 2 */}
                <div className="hp-hero-mock-step">
                  <span className="hp-hero-mock-step-badge">2</span>
                  <div className="hp-hero-mock-step-content">
                    <span className="hp-hero-mock-step-label">Messaggio suggerito</span>
                    <span className="hp-hero-mock-step-value">&quot;Ho visto il tuo post sull&apos;hiring — ti scrivo perché…&quot;</span>
                  </div>
                </div>

                <div className="hp-hero-mock-connector" />

                {/* Step 3 */}
                <div className="hp-hero-mock-step">
                  <span className="hp-hero-mock-step-badge">3</span>
                  <div className="hp-hero-mock-step-content">
                    <span className="hp-hero-mock-step-label">Prossimo passo</span>
                    <span className="hp-hero-mock-step-value hp-hero-mock-step-value--cta">Proponi una call di 15 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── RIGA TARGET ── */}
      <div className="hp-hero-target fade-in">
        <p className="hp-hero-target-text">Per freelance, consulenti e professionisti B2B</p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          2. PRODUCT PREVIEW — Cosa fai con Preflight
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Cosa fai ogni giorno con Preflight</div>
          <h2 className="hp-section-title">
            Trova chi contattare, analizza il profilo, muoviti con un piano.
          </h2>
          <p className="hp-section-subtitle">
            Ogni giorno Preflight ti guida nelle tre azioni che contano:
            identificare i clienti giusti, capire se vale la pena scrivergli
            e sapere esattamente cosa fare dopo.
          </p>

          <div className="hp-preview-grid">

            {/* ── CARD 1 — TROVA CLIENTI (featured) ── */}
            <div className="hp-preview-card hp-preview-card-featured">
              <div className="hp-preview-card-header">
                <div className="hp-preview-card-icon hp-preview-card-icon-primary">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 className="hp-preview-card-title">Trova clienti</h3>
              </div>
              <p className="hp-preview-card-copy">
                Il sistema analizza il tuo posizionamento e ti indica chi cercare su LinkedIn: ruolo, settore, area geografica. Nessuna improvvisazione.
              </p>
              <div className="hp-preview-mock hp-preview-mock-trova">
                <div className="hp-preview-mock-row">
                  <span className="hp-preview-mock-label">Ruolo</span>
                  <span className="hp-preview-mock-value">CEO / Founder</span>
                </div>
                <div className="hp-preview-mock-row">
                  <span className="hp-preview-mock-label">Settore</span>
                  <span className="hp-preview-mock-value">SaaS B2B</span>
                </div>
                <div className="hp-preview-mock-row">
                  <span className="hp-preview-mock-label">Area</span>
                  <span className="hp-preview-mock-value">Italia · DACH</span>
                </div>
                <div className="hp-preview-mock-divider" />
                <div className="hp-preview-mock-results">
                  <div className="hp-preview-mock-result-row">
                    <span className="hp-preview-mock-result-badge">Categoria 1</span>
                    <span className="hp-preview-mock-result-text">Founder di SaaS in fase di scaling</span>
                  </div>
                  <div className="hp-preview-mock-result-row">
                    <span className="hp-preview-mock-result-badge">Categoria 2</span>
                    <span className="hp-preview-mock-result-text">VP Sales in aziende tech 20-100 dip.</span>
                  </div>
                </div>
                <div className="hp-preview-mock-cta-row">
                  <span className="hp-preview-mock-btn-primary">Apri la ricerca su LinkedIn →</span>
                </div>
              </div>
            </div>

            {/* ── CARD 2 — ANALIZZA PROFILO ── */}
            <div className="hp-preview-card">
              <div className="hp-preview-card-header">
                <div className="hp-preview-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="hp-preview-card-title">Analizza profilo</h3>
              </div>
              <p className="hp-preview-card-copy">
                Prima di scrivere a qualcuno, il sistema ti dice chi è, perché è interessante per te e qual è il modo migliore per aprire la conversazione.
              </p>
              <div className="hp-preview-mock hp-preview-mock-analizza">
                <div className="hp-preview-mock-input-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  <span className="hp-preview-mock-input-text">linkedin.com/in/marco-rossi</span>
                </div>
                <div className="hp-preview-mock-input-row hp-preview-mock-input-alt">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="hp-preview-mock-input-text">profilo.pdf · sito web</span>
                </div>
                <div className="hp-preview-mock-divider" />
                <div className="hp-preview-mock-section">
                  <span className="hp-preview-mock-section-label">Chi è</span>
                  <span className="hp-preview-mock-section-text">CEO di una SaaS B2B in fase di crescita, 35 dipendenti…</span>
                </div>
                <div className="hp-preview-mock-section">
                  <span className="hp-preview-mock-section-label">Perché è interessante</span>
                  <span className="hp-preview-mock-section-text">Sta assumendo in area sales, segnale di espansione…</span>
                </div>
                <div className="hp-preview-mock-section">
                  <span className="hp-preview-mock-section-label">Primo passo</span>
                  <span className="hp-preview-mock-section-text">Commenta il suo ultimo post sull&apos;hiring…</span>
                </div>
              </div>
            </div>

            {/* ── CARD 3 — CHIEDI UN CONSIGLIO ── */}
            <div className="hp-preview-card">
              <div className="hp-preview-card-header">
                <div className="hp-preview-card-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="hp-preview-card-title">Chiedi un consiglio</h3>
              </div>
              <p className="hp-preview-card-copy">
                Un prospect non risponde? Non sai come fare follow-up? Descrivi la situazione e ricevi indicazioni concrete su cosa fare adesso.
              </p>
              <div className="hp-preview-mock hp-preview-mock-consiglio">
                <div className="hp-preview-mock-textarea">
                  <span className="hp-preview-mock-textarea-text">
                    &quot;Ho avuto una prima call con un prospect ma non si è fatto più sentire.
                    Cosa faccio?&quot;
                  </span>
                </div>
                <div className="hp-preview-mock-divider" />
                <div className="hp-preview-mock-section">
                  <span className="hp-preview-mock-section-label">Lettura della situazione</span>
                  <span className="hp-preview-mock-section-text">Il silenzio post-call è normale. Non è un rifiuto…</span>
                </div>
                <div className="hp-preview-mock-section">
                  <span className="hp-preview-mock-section-label">Cosa fare</span>
                  <span className="hp-preview-mock-section-text">Riprendi il contatto con un messaggio breve…</span>
                </div>
                <div className="hp-preview-mock-section">
                  <span className="hp-preview-mock-section-label">Prossimi passi</span>
                  <span className="hp-preview-mock-section-text">1. Scrivi entro 48h · 2. Cita un punto della call · 3. Proponi…</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. SUPPORT BLOCK — Supporto decisionale
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft fade-in">
        <div className="hp-container hp-support-block">
          <div className="hp-section-label">Perché funziona</div>
          <h2 className="hp-section-title">
            Non ti serve un altro strumento.<br />Ti serve sapere cosa fare.
          </h2>
          <p className="hp-section-subtitle hp-support-desc">
            La maggior parte dei professionisti perde tempo su LinkedIn perché
            non ha una direzione chiara. Preflight ti toglie il dubbio:
            ogni giorno sai chi contattare, cosa scrivere — nei post, nei commenti,
            nei messaggi — e come portare avanti le conversazioni che contano.
          </p>
          <div className="hp-support-points">
            {[
              { icon: "🎯", text: "Sai chi contattare e perché è il momento giusto" },
              { icon: "✍️", text: "Hai post, commenti e messaggi guidati dal contesto" },
              { icon: "🧭", text: "Ogni conversazione ha un prossimo passo chiaro" },
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
          4. METHOD BLOCK — Il flusso operativo (5 steps)
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Il tuo percorso quotidiano</div>
          <h2 className="hp-section-title">Il sistema ti dice cosa fare, passo dopo passo</h2>
          <p className="hp-section-subtitle">
            Non devi pensare alla strategia ogni mattina. Apri Preflight
            e sai esattamente dove concentrare i tuoi 20 minuti su LinkedIn.
          </p>
          <div className="hp-method-flow">
            {[
              {
                step: "1",
                title: "Configuri chi sei e cosa offri",
                desc: "Racconti il tuo servizio, il tuo cliente ideale e il problema che risolvi. Lo fai una volta — il sistema parte da qui.",
              },
              {
                step: "2",
                title: "Scopri chi contattare",
                desc: "Il sistema ti suggerisce categorie di prospect sensate e ti prepara ricerche LinkedIn pronte da usare.",
              },
              {
                step: "3",
                title: "Analizzi ogni profilo prima di scrivere",
                desc: "Per ogni persona, sai se vale la pena contattarla, perché è interessante e come iniziare.",
              },
              {
                step: "4",
                title: "Pubblichi, commenti e scrivi con contesto",
                desc: "Post strategici, commenti che aprono conversazioni, messaggi personalizzati: ogni azione è guidata dal sistema.",
              },
              {
                step: "5",
                title: "Porti la conversazione fino alla call",
                desc: "Follow-up, gestione pipeline, prossimi passi: nessuna conversazione si perde per strada.",
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
          5. AI POSITIONING BLOCK
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-soft fade-in">
        <div className="hp-container hp-ai-positioning">
          <div className="hp-section-label">L&apos;IA che ti supporta</div>
          <h2 className="hp-section-title">
            Non genera testo a caso.<br />Ti aiuta a prendere decisioni migliori.
          </h2>
          <p className="hp-section-subtitle hp-ai-pos-desc">
            L&apos;IA di Preflight conosce le dinamiche di vendita consulenziale.
            Non ti scrive un messaggio generico: legge il contesto,
            interpreta i segnali e ti dice cosa ha senso fare adesso —
            con calma, con chiarezza.
          </p>
          <div className="hp-ai-pos-grid">
            {[
              {
                title: "Capisce il tuo contesto",
                desc: "Conosce il tuo servizio, i tuoi clienti ideali e il tuo modo di lavorare. Ogni suggerimento parte da lì.",
              },
              {
                title: "Ti dice cosa fare, non solo cosa scrivere",
                desc: "Quando commentare, quando mandare un messaggio, quando proporre una call. Decisioni, non solo parole.",
              },
              {
                title: "Riduce i dubbi quotidiani",
                desc: "Questo profilo è in target? Questo messaggio è giusto? L'IA ti dà risposte chiare per ogni situazione.",
              },
              {
                title: "Legge i segnali da LinkedIn",
                desc: "Post, cambi di ruolo, assunzioni: l'IA trasforma questi segnali in indicazioni operative concrete.",
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
          6. DEMO — PROVA SUBITO L'ASSISTENTE
      ═══════════════════════════════════════════════════════════ */}
      <section id="assistente" className="hp-section hp-section-light fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Provalo adesso</div>
          <h2 className="hp-section-title">Fai una prova su un caso tuo</h2>
          <p className="hp-section-subtitle">
            Incolla un profilo LinkedIn o descrivi una situazione che stai vivendo.
            Il sistema ti mostra come lavora — su un caso reale, il tuo.
          </p>
          <QuickAssistant />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. PER CHI È
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-target fade-in">
        <div className="hp-container">
          <div className="hp-section-label">Per chi è pensato</div>
          <h2 className="hp-section-title hp-target-title">Per chi vende servizi e competenze su LinkedIn.</h2>

          <div className="hp-target-grid">
            <article className="hp-target-card hp-target-card-positive">
              <h3 className="hp-target-card-title">Perfetto per:</h3>
              <ul className="hp-target-list">
                {[
                  "Consulenti che vendono servizi ad alto valore",
                  "Freelance che cercano clienti in modo diretto",
                  "Coach e formatori con offerte B2B",
                  "Fractional manager e advisor",
                  "Agenzie e micro-agenzie B2B",
                  "Professionisti che vendono competenza, non prodotti",
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
                  "Cercare lavoro o fare recruiting",
                  "Crescita follower o personal branding",
                  "Social media management",
                  "Automazione di massa",
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
          8. CTA FINALE
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-final-cta fade-in-delay">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner">
          <h2 className="hp-final-title">
            Non devi inventarti nulla.<br />Il sistema ti dice cosa fare.
          </h2>
          <p className="hp-final-subtitle">
            Configura il tuo profilo commerciale, segui il metodo
            e dedica 20 minuti al giorno a LinkedIn. Il resto lo guida Preflight.
          </p>
          <Link href="/signup" className="hp-cta-primary hp-cta-large fade-in-delay">
            Configura il tuo sistema
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
