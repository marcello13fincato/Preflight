"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { computeSystemProgress } from "@/components/app/SystemBanner";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 7;

const timeOptions = [
  { label: "15–30 min / giorno", value: "meno_1h", hint: "Veloce, mirato" },
  { label: "1–3 ore / settimana", value: "1_3h", hint: "Costante, gestibile" },
  { label: "3–5 ore / settimana", value: "3_5h", hint: "Serio, strutturato" },
  { label: "5+ ore / settimana", value: "piu_5h", hint: "Intensivo" },
] as const;

const salesModelOptions = [
  { label: "Transazionale veloce", value: "fast", desc: "Ciclo breve, decisione rapida" },
  { label: "Educativo / Consulenziale", value: "consultative", desc: "Il cliente va guidato e formato" },
  { label: "Relazionale", value: "relationship", desc: "Fiducia costruita nel tempo" },
] as const;

const STEP_META: { num: number; label: string; section: string }[] = [
  { num: 1, label: "Offerta", section: "Caratteristiche della tua offerta" },
  { num: 2, label: "Buyer", section: "Chi compra davvero" },
  { num: 3, label: "Segnali", section: "Segnali osservabili del prospect" },
  { num: 4, label: "Modello", section: "Modello di interazione commerciale" },
  { num: 5, label: "Tempo", section: "Tempo reale disponibile" },
  { num: 6, label: "Ricerche", section: "Categorie di prospect su LinkedIn" },
  { num: 7, label: "Materiali", section: "Materiali reali" },
];

const initial: OnboardingInput = {
  servizio: "",
  cliente_ideale: "",
  problema_cliente: "",
  risultato_cliente: "",
  linkedin_search_links: [""],
  materiali_nomi: [],
  social_links: [""],
  tempo_settimanale: "1_3h",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingInput>(initial);

  async function submit() {
    setError("");
    const parsed = onboardingInputSchema.safeParse(data);
    if (!parsed.success) {
      setError("Compila i campi obbligatori prima di continuare.");
      return;
    }

    setLoading(true);
    try {
      repo.profile.saveOnboarding(userId, parsed.data);
      const res = await fetch("/api/ai/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarding: parsed.data }),
      });
      if (!res.ok) throw new Error("Errore generazione piano");
      const plan = await res.json();
      repo.profile.savePlan(userId, plan);
      repo.profile.setOnboardingComplete(userId);
      repo.interaction.addInteraction(userId, "onboarding", JSON.stringify(parsed.data), plan);
      router.push("/app");
    } catch {
      setError("Non sono riuscito a generare il piano. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  /* ── LinkedIn search links helpers ── */
  function addLink() {
    setData({ ...data, linkedin_search_links: [...data.linkedin_search_links, ""] });
  }
  function updateLink(idx: number, val: string) {
    const links = [...data.linkedin_search_links];
    links[idx] = val;
    setData({ ...data, linkedin_search_links: links });
  }
  function removeLink(idx: number) {
    const links = data.linkedin_search_links.filter((_, i) => i !== idx);
    setData({ ...data, linkedin_search_links: links.length === 0 ? [""] : links });
  }

  /* ── Social links helpers ── */
  function addSocialLink() {
    setData({ ...data, social_links: [...data.social_links, ""] });
  }
  function updateSocialLink(idx: number, val: string) {
    const links = [...data.social_links];
    links[idx] = val;
    setData({ ...data, social_links: links });
  }
  function removeSocialLink(idx: number) {
    const links = data.social_links.filter((_, i) => i !== idx);
    setData({ ...data, social_links: links.length === 0 ? [""] : links });
  }

  /* ── File upload handler ── */
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    setData({ ...data, materiali_nomi: [...data.materiali_nomi, ...names] });
  }
  function removeFile(idx: number) {
    const nomi = data.materiali_nomi.filter((_, i) => i !== idx);
    setData({ ...data, materiali_nomi: nomi });
  }

  const systemPct = computeSystemProgress(data as unknown as Record<string, unknown>);
  const currentMeta = STEP_META[step - 1];

  return (
    <div className="onb-engine">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="onb-engine-hero">
        <span className="onb-engine-eyebrow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          Configurazione motore commerciale
        </span>
        <h1 className="onb-engine-title">Configura il tuo sistema di acquisizione clienti</h1>
        <p className="onb-engine-subtitle">
          Queste informazioni permettono all&apos;AI di identificare prospect realistici,
          valutare i profili con precisione e suggerire strategie di contatto concrete.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════
          PROGRESS + SYSTEM COMPLETION
      ══════════════════════════════════════════════════ */}
      <div className="onb-engine-progress-wrap">
        <div className="onb-engine-steps">
          {STEP_META.map((s) => (
            <button
              key={s.num}
              type="button"
              className={`onb-step-pill${s.num === step ? " onb-step-active" : ""}${s.num < step ? " onb-step-done" : ""}`}
              onClick={() => setStep(s.num)}
            >
              <span className="onb-step-num">{s.num < step ? "✓" : s.num}</span>
              <span className="onb-step-label">{s.label}</span>
            </button>
          ))}
        </div>
        {systemPct > 0 && (
          <div className="onb-engine-completion">
            <div className="onb-engine-completion-track">
              <div
                className={`onb-engine-completion-fill${systemPct === 100 ? " onb-engine-completion-done" : ""}`}
                style={{ width: `${systemPct}%` }}
              />
            </div>
            <span className="onb-engine-completion-label">{systemPct}% configurato</span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION BLOCK
      ══════════════════════════════════════════════════ */}
      <section className="onb-section-block">
        <div className="onb-section-header">
          <span className="onb-section-number" aria-hidden="true">{String(step).padStart(2, "0")}</span>
          <div>
            <h2 className="onb-section-title">{currentMeta.section}</h2>
            <p className="onb-section-step">Passo {step} di {TOTAL_STEPS}</p>
          </div>
        </div>

        <div className="onb-section-body">

          {/* ── Step 1: Offer characteristics ── */}
          {step === 1 && (
            <>
              <OnbField
                label="Tipo di servizio"
                hint="Descrivi in modo concreto cosa offri. Non serve essere generici — più specifico è, meglio funziona."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={3}
                  placeholder="Consulenza LinkedIn per team commerciali B2B. Aiuto a strutturare il processo di acquisizione clienti via LinkedIn."
                  value={data.servizio}
                  onChange={(e) => setData({ ...data, servizio: e.target.value })}
                />
              </OnbField>
              <OnbField
                label="Risultato concreto per il cliente"
                hint="Cosa ottiene il cliente dopo aver lavorato con te? Pensa al risultato misurabile."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={3}
                  placeholder="Il team commerciale passa da 0 a 5+ call qualificate al mese generate da LinkedIn."
                  value={data.risultato_cliente}
                  onChange={(e) => setData({ ...data, risultato_cliente: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* ── Step 2: Real buyer definition ── */}
          {step === 2 && (
            <>
              <OnbField
                label="Chi è il tuo vero buyer?"
                hint="Ruoli specifici, contesto aziendale, situazione tipica di chi compra davvero."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={4}
                  placeholder="Head of Sales o VP Sales in aziende SaaS B2B (20-200 dipendenti) che hanno un team commerciale ma non usano LinkedIn in modo strutturato."
                  value={data.cliente_ideale}
                  onChange={(e) => setData({ ...data, cliente_ideale: e.target.value })}
                />
              </OnbField>
              <OnbField
                label="Situazione tipica prima di lavorare con te"
                hint="Che problema ha il buyer prima che arrivi tu? Quale frustrazione, blocco o inefficienza?"
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={3}
                  placeholder="Il team commerciale non ha un processo per generare lead da LinkedIn. I commerciali pubblicano contenuti generici senza strategia e non ottengono risultati."
                  value={data.problema_cliente}
                  onChange={(e) => setData({ ...data, problema_cliente: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* ── Step 3: Observable prospect signals ── */}
          {step === 3 && (
            <>
              <div className="onb-signal-intro">
                <p className="onb-signal-intro-text">
                  Indica i segnali concreti che puoi osservare su LinkedIn per capire se un profilo è un buon prospect.
                  L&apos;AI userà questi segnali per filtrare e valutare i profili.
                </p>
              </div>
              <OnbField
                label="Segnali di interesse osservabili"
                hint="Assunzioni in corso, contenuti pubblicati, crescita aziendale, cambiamenti di ruolo, richieste pubbliche..."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={4}
                  placeholder="Pubblica contenuti su sales o crescita aziendale. L'azienda sta assumendo commerciali. Ha cambiato ruolo di recente. Fa domande sulla gestione del team vendite."
                  value={(data as Record<string, unknown>).segnali_prospect as string || ""}
                  onChange={(e) => {
                    const next = { ...data } as Record<string, unknown>;
                    next.segnali_prospect = e.target.value;
                    setData(next as OnboardingInput);
                  }}
                />
              </OnbField>
            </>
          )}

          {/* ── Step 4: Sales interaction model ── */}
          {step === 4 && (
            <>
              <p className="onb-field-intro">
                Come funziona la tua dinamica di vendita? Questo determina il tono e la strategia
                dei messaggi suggeriti dall&apos;AI.
              </p>
              <div className="onb-model-grid">
                {salesModelOptions.map((opt) => {
                  const isActive = (data as Record<string, unknown>).modello_vendita === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`onb-model-card${isActive ? " onb-model-active" : ""}`}
                      onClick={() => {
                        const next = { ...data } as Record<string, unknown>;
                        next.modello_vendita = opt.value;
                        setData(next as OnboardingInput);
                      }}
                    >
                      <span className="onb-model-label">{opt.label}</span>
                      <span className="onb-model-desc">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Step 5: Available time ── */}
          {step === 5 && (
            <>
              <p className="onb-field-intro">
                Sii realistico. L&apos;AI calibra i piani giornalieri e le raccomandazioni
                in base al tempo che puoi effettivamente dedicare.
              </p>
              <div className="onb-time-grid">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`onb-time-card${data.tempo_settimanale === opt.value ? " onb-time-active" : ""}`}
                    onClick={() => setData({ ...data, tempo_settimanale: opt.value })}
                  >
                    <span className="onb-time-label">{opt.label}</span>
                    <span className="onb-time-hint">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Step 6: LinkedIn prospect categories ── */}
          {step === 6 && (
            <>
              <OnbField
                label="Ricerche LinkedIn salvate"
                hint="Incolla i link delle ricerche LinkedIn con i profili che vuoi contattare. Puoi aggiungerne quanti ne vuoi."
              >
                <div className="onb-links-list">
                  {data.linkedin_search_links.map((link, idx) => (
                    <div key={idx} className="onb-link-row">
                      <input
                        className="onb-input"
                        type="url"
                        placeholder="https://www.linkedin.com/search/results/people/?keywords=..."
                        value={link}
                        onChange={(e) => updateLink(idx, e.target.value)}
                      />
                      {data.linkedin_search_links.length > 1 && (
                        <button type="button" onClick={() => removeLink(idx)} className="onb-link-remove" aria-label="Rimuovi link">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addLink} className="onb-add-btn">
                  + Aggiungi un&apos;altra ricerca
                </button>
              </OnbField>
            </>
          )}

          {/* ── Step 7: Real materials ── */}
          {step === 7 && (
            <>
              <OnbField
                label="Sito web e profili social"
                hint="Sito web, profilo LinkedIn, altre presenze online dove possiamo capire il tuo lavoro."
              >
                <div className="onb-links-list">
                  {data.social_links.map((link, idx) => (
                    <div key={idx} className="onb-link-row">
                      <input
                        className="onb-input"
                        type="url"
                        placeholder="https://www.tuosito.com o https://linkedin.com/in/tuoprofilo"
                        value={link}
                        onChange={(e) => updateSocialLink(idx, e.target.value)}
                      />
                      {data.social_links.length > 1 && (
                        <button type="button" onClick={() => removeSocialLink(idx)} className="onb-link-remove" aria-label="Rimuovi link">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addSocialLink} className="onb-add-btn">
                  + Aggiungi un altro link
                </button>
              </OnbField>
              <OnbField
                label="Documenti e presentazioni"
                hint="Slide, PDF, offerte — tutto ciò che aiuta a capire come presenti il servizio. Facoltativo."
              >
                <label className="onb-file-upload">
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    multiple
                    className="onb-file-input"
                    onChange={handleFileUpload}
                  />
                  <span className="onb-file-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Scegli file (PDF, PPT, PPTX)
                  </span>
                </label>
                {data.materiali_nomi.length > 0 && (
                  <div className="onb-file-list">
                    {data.materiali_nomi.map((name, idx) => (
                      <div key={idx} className="onb-file-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span className="onb-file-name">{name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="onb-file-remove" aria-label="Rimuovi file">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </OnbField>
            </>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="onb-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="onb-nav">
          {step > 1 && (
            <button
              type="button"
              className="onb-nav-back"
              disabled={loading}
              onClick={() => setStep((s) => s - 1)}
            >
              ← Indietro
            </button>
          )}
          <div className="onb-nav-spacer" />
          {step < TOTAL_STEPS ? (
            <button
              type="button"
              className="onb-nav-next"
              disabled={loading}
              onClick={() => setStep((s) => s + 1)}
            >
              Continua →
            </button>
          ) : (
            <button
              type="button"
              className="onb-nav-next"
              disabled={loading}
              onClick={submit}
            >
              {loading ? "Generazione piano in corso…" : "Attiva il sistema →"}
            </button>
          )}
        </div>
      </section>

      {/* ── Reassurance ── */}
      <p className="onb-reassurance">
        Puoi modificare queste informazioni in qualsiasi momento dalle impostazioni.
      </p>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FIELD COMPONENT
═══════════════════════════════════════════════════════════ */
function OnbField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="onb-field">
      <label className="onb-field-label">{label}</label>
      {hint && <p className="onb-field-hint">{hint}</p>}
      {children}
    </div>
  );
}
