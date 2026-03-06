import Link from "next/link";
import getServerAuthSession from "../../lib/getServerAuthSession";

/* ─── inline SVG icons ─────────────────────────────────────────────────────── */
function IcoPen() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}
function IcoMessage() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}
function IcoPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}
function IcoUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function IcoSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}
function IcoBarChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15V9"/><path d="M12 15V7"/><path d="M16 15V11"/>
    </svg>
  );
}
function IcoStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}
function IcoArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
    </svg>
  );
}
function IcoLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}
function IcoGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20"/>
    </svg>
  );
}

/* ─── reusable blurred product mock ────────────────────────────────────────── */
function ProductMock({ title, icon, lines, locked = false }: {
  title: string;
  icon: React.ReactNode;
  lines: string[];
  locked?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E4E9EE] bg-white shadow-md">
      {/* header bar */}
      <div className="flex items-center gap-2 border-b border-[#E4E9EE] bg-[#F3F8FF] px-4 py-3">
        <span className="text-[#0A66C2]">{icon}</span>
        <span className="text-sm font-semibold text-[#0B1220]">{title}</span>
      </div>
      {/* mock content */}
      <div className={`p-4 space-y-2 ${locked ? "blur-sm select-none" : "blur-[3px] select-none"}`}>
        {lines.map((l, i) => (
          <div
            key={i}
            className="h-3 rounded-full bg-[#E8F3FF]"
            style={{ width: l }}
          />
        ))}
        <div className="mt-3 h-20 rounded-xl bg-[#EEF5FF]" />
        <div className="h-3 rounded-full bg-[#E8F3FF] w-2/3" />
        <div className="h-3 rounded-full bg-[#E8F3FF] w-1/2" />
      </div>
      {/* overlay */}
      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/60 backdrop-blur-[2px]">
          <span className="text-[#0A66C2]"><IcoLock /></span>
          <span className="rounded-full bg-[#0A66C2] px-3 py-1 text-xs font-semibold text-white shadow">Disponibile nel piano completo</span>
        </div>
      )}
    </div>
  );
}

/* ─── stat box ──────────────────────────────────────────────────────────────── */
function StatBox({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#E4E9EE] bg-white p-7 text-center shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0A66C2]">{icon}</span>
      <p className="text-3xl font-extrabold text-[#0A66C2]">{value}</p>
      <p className="text-sm text-[#5E6A75] leading-snug">{label}</p>
    </div>
  );
}

/* ─── testimonial card ──────────────────────────────────────────────────────── */
function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E9EE] bg-white p-6 shadow-sm">
      <div className="flex gap-1 text-amber-400">
        {[1,2,3,4,5].map(i => <IcoStar key={i} />)}
      </div>
      <p className="text-sm text-[#0B1220] leading-relaxed">&ldquo;{text}&rdquo;</p>
      <div className="mt-auto flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3FF] font-bold text-[#0A66C2] text-sm">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-[#5E6A75]">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── main page ─────────────────────────────────────────────────────────────── */

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    const { redirect } = await import("next/navigation");
    redirect("/app");
  }

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0A66C2] px-8 py-20 text-white md:px-16 md:py-28">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest">
            🚀 Il sistema clienti per LinkedIn
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            LinkedIn non è un social.<br />
            <span className="text-[#A8D1FF]">È la tua pagina di vendita.</span>
          </h1>
          <p className="mt-6 text-lg text-white/85 md:text-xl">
            Preflight ti aiuta a trasformare post, commenti e messaggi in
            conversazioni, call e clienti.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/app/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-[#0A66C2] shadow-lg transition hover:bg-[#E8F3FF]"
            >
              Crea il tuo sistema clienti <IcoArrow />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Guarda come funziona
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEMA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-4xl px-4 text-center">
        <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
          Il problema
        </span>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          Pubblicare su LinkedIn non basta.
        </h2>
        <p className="mt-4 text-[#5E6A75] md:text-lg">
          Scrivi post, ottieni like e qualche commento… ma nessuna richiesta di lavoro.
          Non è colpa dei contenuti. È colpa del metodo.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { emoji: "📣", title: "Pubblichi ma nessuno ti scrive", desc: "I post ottengono reazioni, ma non portano conversazioni private con potenziali clienti." },
            { emoji: "💬", title: "I commenti restano lì", desc: "Non sai cosa rispondere per trasformare un commento in una conversazione di business." },
            { emoji: "📥", title: "I messaggi non convertono", desc: "Invii DM ma non riesci a portare le persone verso una call." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="rounded-2xl border border-[#E4E9EE] bg-white p-6 text-left shadow-sm">
              <p className="text-3xl">{emoji}</p>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[#5E6A75]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. IL SISTEMA ────────────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
            Il sistema
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Dal post al cliente, senza improvvisare.
          </h2>
          <p className="mt-3 text-[#5E6A75]">
            Preflight ti guida lungo ogni fase del funnel LinkedIn.
          </p>
        </div>

        {/* flow steps */}
        <div className="mt-12 flex flex-col items-center gap-3 md:flex-row md:justify-center">
          {[
            { icon: <IcoPen />, label: "POST", color: "#0A66C2", bg: "#E8F3FF" },
            { icon: <IcoMessage />, label: "COMMENTI", color: "#0A66C2", bg: "#E8F3FF" },
            { icon: <IcoMessage />, label: "MESSAGGI", color: "#0A66C2", bg: "#E8F3FF" },
            { icon: <IcoPhone />, label: "CALL", color: "#0A66C2", bg: "#E8F3FF" },
            { icon: <IcoUsers />, label: "CLIENTE", color: "#ffffff", bg: "#0A66C2" },
          ].map(({ icon, label, color, bg }, idx, arr) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
                  style={{ background: bg, color }}
                >
                  {icon}
                </div>
                <span className="text-xs font-bold tracking-widest" style={{ color: idx === arr.length - 1 ? "#0A66C2" : "#0B1220" }}>
                  {label}
                </span>
              </div>
              {idx < arr.length - 1 && (
                <span className="hidden text-[#0A66C2] md:block"><IcoArrow /></span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-5 text-center text-sm text-[#5E6A75]">
          {[
            "Scrivi post che attraggono i clienti giusti",
            "Rispondi ai commenti per avviare conversazioni",
            "Gestisci i DM con messaggi efficaci",
            "Porta la conversazione verso una call",
            "Converti il contatto in cliente pagante",
          ].map((desc, i) => (
            <p key={i}>{desc}</p>
          ))}
        </div>
      </section>

      {/* ── 4. DEMO PRODOTTO ─────────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
            Il prodotto
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Tutto quello che ti serve, in un unico posto.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ProductMock
            title="Generatore di post"
            icon={<IcoPen />}
            lines={["90%", "75%", "60%", "80%"]}
          />
          <ProductMock
            title="Risposte ai commenti"
            icon={<IcoMessage />}
            lines={["85%", "65%", "70%", "50%"]}
          />
          <ProductMock
            title="Assistente messaggi DM"
            icon={<IcoMessage />}
            lines={["80%", "60%", "75%", "55%"]}
          />
          <ProductMock
            title="Trova opportunità"
            icon={<IcoSearch />}
            lines={["70%", "85%", "60%", "65%"]}
          />
        </div>
      </section>

      {/* ── 5. ANALISI PROFILO LINKEDIN ──────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="rounded-3xl bg-[#F3F8FF] p-8 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
                Analisi profilo
              </span>
              <h2 className="mt-4 text-3xl font-bold">
                Il tuo profilo LinkedIn vale davvero?
              </h2>
              <p className="mt-3 text-[#5E6A75]">
                Preflight analizza il tuo profilo e ti dice cosa sta fermando i potenziali
                clienti. Headline, sommario, esperienza, social proof: tutto ottimizzato per
                convertire.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {[
                  "Punteggio complessivo del profilo",
                  "Suggerimenti specifici per ogni sezione",
                  "Riscrittura con IA orientata alla vendita",
                  "Confronto con i benchmark del tuo settore",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A66C2] text-white text-[10px] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/app/onboarding"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-bold text-white shadow hover:bg-[#004182] transition"
              >
                Analizza il tuo profilo <IcoArrow />
              </Link>
            </div>
            <div className="flex-1">
              <ProductMock
                title="Analisi profilo LinkedIn"
                icon={<IcoBarChart />}
                lines={["95%", "70%", "55%", "80%", "65%"]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. DATI LINKEDIN ─────────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4 text-center">
        <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
          Dati LinkedIn
        </span>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">
          L&apos;opportunità più grande del B2B è già qui.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <StatBox
            icon={<IcoGlobe />}
            value="1 miliardo"
            label="di utenti attivi su LinkedIn nel mondo"
          />
          <StatBox
            icon={<IcoUsers />}
            value="23 milioni"
            label="di profili LinkedIn in Italia"
          />
          <StatBox
            icon={<IcoMessage />}
            value="80%"
            label="delle vendite B2B nascono da conversazioni private"
          />
        </div>
        <p className="mt-6 text-[#5E6A75]">
          Il mercato è enorme. Ti manca solo il metodo per capitalizzarlo.
        </p>
      </section>

      {/* ── 7. FUNZIONI AVANZATE ─────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
            Piano completo
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Funzioni avanzate per chi vuole di più.
          </h2>
          <p className="mt-3 text-[#5E6A75]">
            Unlock the full system with the complete plan.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProductMock
            title="Pipeline clienti"
            icon={<IcoUsers />}
            lines={["85%", "60%", "75%"]}
            locked
          />
          <ProductMock
            title="Prospect Analyzer"
            icon={<IcoSearch />}
            lines={["70%", "90%", "55%"]}
            locked
          />
          <ProductMock
            title="Piano 14 giorni"
            icon={<IcoBarChart />}
            lines={["80%", "65%", "70%"]}
            locked
          />
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-[#0A66C2] px-6 py-3 text-sm font-semibold text-[#0A66C2] hover:bg-[#E8F3FF] transition"
          >
            Scopri tutti i piani <IcoArrow />
          </Link>
        </div>
      </section>

      {/* ── 8. TESTIMONIANZE ─────────────────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#E8F3FF] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#0A66C2]">
            Testimonianze
          </span>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Chi ha già un sistema, ottiene risultati.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <TestimonialCard
            name="Marco R."
            role="Consulente Marketing B2B"
            text="In tre settimane ho avuto 4 nuove call qualificate. Prima postavo senza risultati, ora ogni post genera conversazioni vere."
          />
          <TestimonialCard
            name="Giulia F."
            role="Freelance UX Designer"
            text="Finalmente so cosa scrivere nei DM. Preflight mi ha dato le parole giuste per portare i contatti verso una call senza sembrare spammosa."
          />
          <TestimonialCard
            name="Luca M."
            role="Fondatore SaaS"
            text="Ho chiuso 2 clienti in un mese usando solo il sistema DM di Preflight. Il ROI è stato immediato."
          />
        </div>
      </section>

      {/* ── 9. CTA FINALE ────────────────────────────────────────────────────── */}
      <section className="mx-auto mb-20 mt-20 max-w-3xl px-4 text-center">
        <div className="rounded-3xl bg-[#0A66C2] px-8 py-16 text-white shadow-lg">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Pronto a trasformare LinkedIn<br />nel tuo canale clienti?
          </h2>
          <p className="mt-4 text-white/80 md:text-lg">
            Inizia in 5 minuti. Nessuna carta di credito richiesta.
          </p>
          <Link
            href="/app/onboarding"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#0A66C2] shadow-xl transition hover:bg-[#E8F3FF]"
          >
            Crea il tuo sistema clienti <IcoArrow />
          </Link>
          <p className="mt-4 text-xs text-white/60">
            Setup in 5 minuti · Piano personalizzato · Nessun abbonamento iniziale
          </p>
        </div>
      </section>

    </main>
  );
}
