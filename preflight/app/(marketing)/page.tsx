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
            Preflight unisce un metodo commerciale strutturato e un&apos;intelligenza artificiale
            specializzata per aiutarti a identificare, comprendere e contattare
            i clienti giusti con chiarezza.
          </p>
          <p className="hp-hero-bridge">
            Non è un tool per generare contenuti o automatizzare messaggi.
            È un sistema che ti dà direzione commerciale su LinkedIn:
            chi cercare, come valutarlo, cosa scrivere e quando muoverti.
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
          2. PRODUCT PREVIEW — Cosa fai con Preflight
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Cosa fai con Preflight</div>
          <h2 className="hp-section-title">
            Trova clienti, analizza profili, muoviti con criterio.
          </h2>
          <p className="hp-section-subtitle">
            Preflight ti aiuta a capire chi cercare, se vale la pena contattarlo
            e come portare avanti una conversazione su LinkedIn.
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
                Ti guidiamo verso categorie di profili sensati da contattare su LinkedIn.
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
                Capisci se un profilo è in target e come iniziare la conversazione.
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
                Descrivi una situazione reale e ricevi indicazioni operative.
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
      <section className="hp-section hp-section-soft">
        <div className="hp-container hp-support-block">
          <div className="hp-section-label">Il sistema</div>
          <h2 className="hp-section-title">
            Un sistema di acquisizione clienti, non l&apos;ennesimo tool.
          </h2>
          <p className="hp-section-subtitle hp-support-desc">
            Il problema su LinkedIn non è la mancanza di strumenti.
            È l&apos;assenza di una direzione chiara: chi contattare, cosa scrivere, quando insistere.
            Preflight riduce la dispersione e ti dà lucidità strategica
            in ogni fase del processo commerciale.
          </p>
          <div className="hp-support-points">
            {[
              { icon: "🎯", text: "Sai chi cercare e perché" },
              { icon: "🧭", text: "Hai chiarezza su priorità e prossimi passi" },
              { icon: "💬", text: "Le conversazioni partono dal contesto, non dall'improvvisazione" },
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
      <section className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Il metodo</div>
          <h2 className="hp-section-title">Come funziona nella pratica</h2>
          <p className="hp-section-subtitle">
            Un flusso strutturato che rispecchia il modo in cui
            si sviluppa davvero una relazione commerciale su LinkedIn.
          </p>
          <div className="hp-method-flow">
            {[
              {
                step: "1",
                title: "Imposti il tuo sistema",
                desc: "Definisci chi sei, cosa offri e che tipo di clienti cerchi. Il sistema parte da qui.",
              },
              {
                step: "2",
                title: "Identifichi categorie di clienti",
                desc: "Ottieni categorie di prospect e ricerche LinkedIn pronte, basate sul tuo posizionamento reale.",
              },
              {
                step: "3",
                title: "Analizzi profili specifici",
                desc: "L'IA legge profili e segnali per dirti se vale la pena contattare qualcuno e come farlo.",
              },
              {
                step: "4",
                title: "Ricevi indicazioni operative",
                desc: "Messaggi, commenti, follow-up: ogni azione ha un contesto e una direzione chiara.",
              },
              {
                step: "5",
                title: "Porti le conversazioni verso opportunità",
                desc: "Gestisci la pipeline e trasformi contatti in call e call in clienti.",
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
      <section className="hp-section hp-section-soft">
        <div className="hp-container hp-ai-positioning">
          <div className="hp-section-label">L&apos;intelligenza artificiale</div>
          <h2 className="hp-section-title">
            Un&apos;IA addestrata su processi commerciali reali.
          </h2>
          <p className="hp-section-subtitle hp-ai-pos-desc">
            L&apos;IA di Preflight non è un assistente generico riadattato.
            È costruita per supportare decisioni commerciali:
            interpreta segnali da LinkedIn, valuta profili,
            e ti aiuta a decidere cosa fare — riducendo il tempo perso
            su contatti sbagliati.
          </p>
          <div className="hp-ai-pos-grid">
            {[
              {
                title: "Addestrata su processi reali",
                desc: "Conosce le dinamiche di vendita consulenziale, non ripete formule generiche. Ogni suggerimento parte dal tuo contesto.",
              },
              {
                title: "Supporto alle decisioni",
                desc: "Ti dice se un profilo è interessante, perché e cosa fare. Non genera testo a caso: ti aiuta a scegliere.",
              },
              {
                title: "Riduce il tempo perso",
                desc: "Meno scroll, meno messaggi a vuoto, meno dubbi. Più chiarezza su dove concentrare i tuoi 20 minuti al giorno.",
              },
              {
                title: "Interpreta segnali LinkedIn",
                desc: "Post, cambi di ruolo, assunzioni, commenti: l'IA legge questi segnali e li trasforma in indicazioni operative.",
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
      <section id="assistente" className="hp-section hp-section-light">
        <div className="hp-container">
          <div className="hp-section-label">Provalo ora</div>
          <h2 className="hp-section-title">Prova il sistema su un caso reale</h2>
          <p className="hp-section-subtitle">
            Analizza un profilo LinkedIn o chiedi un consiglio su una situazione commerciale concreta.
          </p>
          <QuickAssistant />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. PER CHI È
      ═══════════════════════════════════════════════════════════ */}
      <section className="hp-section hp-section-target">
        <div className="hp-container">
          <div className="hp-section-label">Per chi è</div>
          <h2 className="hp-section-title hp-target-title">Per professionisti che usano LinkedIn per trovare clienti.</h2>

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
      <section className="hp-final-cta">
        <div className="hp-final-glow" aria-hidden="true" />
        <div className="hp-container hp-final-inner">
          <h2 className="hp-final-title">
            LinkedIn funziona. Ti manca il sistema per usarlo come canale clienti.
          </h2>
          <p className="hp-final-subtitle">
            Preflight ti dà metodo, direzione e chiarezza.
            Tu ci metti competenza e 20 minuti al giorno.
          </p>
          <Link href="/signup" className="hp-cta-primary hp-cta-large">
            Configura il tuo sistema
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
          <p className="hp-final-trust">Setup in 5 minuti · Nessuna carta di credito · Inizia gratis</p>
        </div>
      </section>

    </div>
  );
}
