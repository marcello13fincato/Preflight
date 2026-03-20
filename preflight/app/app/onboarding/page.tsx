"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { computeSystemProgress } from "@/components/app/SystemBanner";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 5;

/* ── Option sets ── */
const timeOptions = [
  { label: "15–30 min / giorno", value: "meno_1h", icon: "⚡", hint: "Veloce, mirato" },
  { label: "1–3 ore / settimana", value: "1_3h", icon: "🎯", hint: "Costante, gestibile" },
  { label: "3–5 ore / settimana", value: "3_5h", icon: "📈", hint: "Serio, strutturato" },
  { label: "5+ ore / settimana", value: "piu_5h", icon: "🚀", hint: "Intensivo" },
] as const;

const salesModelOptions = [
  { label: "Transazionale veloce", value: "fast", icon: "⚡", desc: "Ciclo breve, decisione rapida. Il prospect compra quasi subito." },
  { label: "Educativo / Consulenziale", value: "consultative", icon: "🎓", desc: "Il cliente va guidato e formato prima di decidere." },
  { label: "Relazionale", value: "relationship", icon: "🤝", desc: "La fiducia si costruisce nel tempo con interazioni ripetute." },
] as const;

const ticketOptions = [
  { label: "< €1.000", value: "under_1k" },
  { label: "€1k – €5k", value: "1k_5k" },
  { label: "€5k – €15k", value: "5k_15k" },
  { label: "€15k – €50k", value: "15k_50k" },
  { label: "> €50k", value: "over_50k" },
] as const;

const cicloOptions = [
  { label: "< 1 settimana", value: "under_1w" },
  { label: "1–4 settimane", value: "1_4w" },
  { label: "1–3 mesi", value: "1_3m" },
  { label: "> 3 mesi", value: "over_3m" },
] as const;

const dimensioneOptions = [
  { label: "1–10 persone", value: "1_10" },
  { label: "11–50", value: "11_50" },
  { label: "51–200", value: "51_200" },
  { label: "201–1000", value: "201_1000" },
  { label: "1000+", value: "1000_plus" },
] as const;

const ctaOptions = [
  { label: "Call conoscitiva", value: "call", icon: "📞" },
  { label: "Demo prodotto", value: "demo", icon: "💻" },
  { label: "Audit / Analisi gratuita", value: "audit", icon: "🔍" },
  { label: "Preventivo", value: "preventivo", icon: "📋" },
  { label: "Altro", value: "altro", icon: "✏️" },
] as const;

const STEP_META: { num: number; label: string; section: string; description: string; icon: string }[] = [
  { num: 1, label: "Posizionamento", section: "Chi sei e cosa offri", description: "L'AI usa queste informazioni per creare messaggi che parlano la lingua del tuo mercato.", icon: "🎯" },
  { num: 2, label: "Il tuo buyer", section: "A chi vendi davvero", description: "Definire il buyer reale permette all'AI di filtrare i prospect e personalizzare ogni messaggio.", icon: "👤" },
  { num: 3, label: "Segnali", section: "Come riconosci un buon prospect", description: "L'AI userà questi pattern per valutare i profili e suggerire chi contattare prima.", icon: "📡" },
  { num: 4, label: "Processo", section: "Il tuo modo di vendere", description: "Calibra il tono, la frequenza e la strategia dell'AI in base a come lavori davvero.", icon: "⚙️" },
  { num: 5, label: "Asset", section: "Da dove parti", description: "Il tuo profilo LinkedIn e le ricerche salvate sono il punto di partenza operativo.", icon: "🔗" },
];

const initial: OnboardingInput = {
  servizio: "",
  elevator_pitch: "",
  settore: "",
  differenziatore: "",
  cliente_ideale: "",
  dimensione_azienda: "51_200",
  problema_cliente: "",
  risultato_cliente: "",
  segnali_interesse: "",
  obiezione_frequente: "",
  modello_vendita: "consultative",
  ticket_medio: "5k_15k",
  ciclo_vendita: "1_4w",
  tempo_settimanale: "1_3h",
  cta_preferita: "call",
  linkedin_url: "",
  sito_web: "",
  linkedin_search_links: [""],
  materiali_nomi: [],
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
        <div className="onb-engine-hero-glow" aria-hidden="true" />
        <span className="onb-engine-eyebrow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          Configurazione motore commerciale
        </span>
        <h1 className="onb-engine-title">
          Costruisci il tuo sistema<br />di acquisizione clienti
        </h1>
        <p className="onb-engine-subtitle">
          5 domande mirate. L&apos;AI usa queste informazioni per trovare prospect reali,
          scrivere messaggi che convertono e pianificare le tue giornate operative.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════
          PROGRESS RAIL
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
              <span className="onb-step-icon" aria-hidden="true">{s.num < step ? "✓" : s.icon}</span>
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
          <span className="onb-section-icon" aria-hidden="true">{currentMeta.icon}</span>
          <div>
            <h2 className="onb-section-title">{currentMeta.section}</h2>
            <p className="onb-section-desc">{currentMeta.description}</p>
          </div>
          <span className="onb-section-badge">Passo {step}/{TOTAL_STEPS}</span>
        </div>

        <div className="onb-section-body">

          {/* ────────────────────────────────────────────────
              Step 1 — Posizionamento
          ──────────────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="onb-fields-grid">
                <OnbField
                  label="Il tuo servizio / prodotto"
                  hint="Cosa offri concretamente? Più specifico è, meglio l'AI calibra tutto."
                >
                  <textarea
                    className="onb-input onb-textarea"
                    rows={2}
                    placeholder="Consulenza LinkedIn per team commerciali B2B. Aiuto a strutturare il processo di acquisizione clienti via LinkedIn."
                    value={data.servizio}
                    onChange={(e) => setData({ ...data, servizio: e.target.value })}
                  />
                </OnbField>
                <OnbField
                  label="Settore principale"
                  hint="In che mercato operi? (es. SaaS, Formazione, Consulenza HR, Logistica...)"
                >
                  <input
                    className="onb-input"
                    placeholder="SaaS B2B, Consulenza, Formazione aziendale..."
                    value={data.settore}
                    onChange={(e) => setData({ ...data, settore: e.target.value })}
                  />
                </OnbField>
              </div>
              <OnbField
                label="Elevator pitch"
                hint="In 1-2 frasi: cosa fai e per chi? Immagina di presentarti a un evento."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={2}
                  placeholder="Aiuto i team commerciali B2B a generare 5+ call qualificate al mese da LinkedIn, senza cold calling."
                  value={data.elevator_pitch}
                  onChange={(e) => setData({ ...data, elevator_pitch: e.target.value })}
                />
              </OnbField>
              <OnbField
                label="Perché te e non un altro?"
                hint="Il tuo differenziatore unico. Cosa ti rende diverso dai competitor? Metodo, esperienza, risultati..."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={2}
                  placeholder="Metodo proprietario testato su 80+ team commerciali. ROI medio 4x nei primi 90 giorni."
                  value={data.differenziatore}
                  onChange={(e) => setData({ ...data, differenziatore: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* ────────────────────────────────────────────────
              Step 2 — Il tuo buyer
          ──────────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <OnbField
                label="Chi è il tuo vero buyer?"
                hint="Ruolo, contesto aziendale, situazione tipica di chi firma il contratto."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={3}
                  placeholder="Head of Sales o VP Sales in aziende SaaS B2B (20-200 dip.) che hanno un team commerciale ma non usano LinkedIn in modo strutturato."
                  value={data.cliente_ideale}
                  onChange={(e) => setData({ ...data, cliente_ideale: e.target.value })}
                />
              </OnbField>
              <div className="onb-fields-grid">
                <OnbField
                  label="Dimensione azienda target"
                  hint="La fascia più frequente tra i tuoi clienti."
                >
                  <div className="onb-chip-row">
                    {dimensioneOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`onb-chip${data.dimensione_azienda === opt.value ? " onb-chip-active" : ""}`}
                        onClick={() => setData({ ...data, dimensione_azienda: opt.value })}
                      >{opt.label}</button>
                    ))}
                  </div>
                </OnbField>
                <OnbField
                  label="Risultato concreto"
                  hint="Cosa ottiene il cliente dopo aver lavorato con te? Pensa al risultato misurabile."
                >
                  <textarea
                    className="onb-input onb-textarea"
                    rows={2}
                    placeholder="Il team passa da 0 a 5+ call qualificate al mese da LinkedIn."
                    value={data.risultato_cliente}
                    onChange={(e) => setData({ ...data, risultato_cliente: e.target.value })}
                  />
                </OnbField>
              </div>
              <OnbField
                label="Problema tipico prima di lavorare con te"
                hint="Frustrazione, blocco o inefficienza ricorrente."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={2}
                  placeholder="Il team pubblica contenuti generici senza strategia e non genera lead da LinkedIn."
                  value={data.problema_cliente}
                  onChange={(e) => setData({ ...data, problema_cliente: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* ────────────────────────────────────────────────
              Step 3 — Segnali & Obiezioni
          ──────────────────────────────────────────────── */}
          {step === 3 && (
            <>
              <div className="onb-callout onb-callout-blue">
                <span className="onb-callout-icon">💡</span>
                <p className="onb-callout-text">
                  Più i segnali sono specifici e osservabili, più l&apos;AI sarà precisa nel filtrare
                  e prioritizzare i prospect per te.
                </p>
              </div>
              <OnbField
                label="Segnali di interesse osservabili su LinkedIn"
                hint="Assunzioni, contenuti pubblicati, crescita aziendale, cambi di ruolo, domande pubbliche..."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={4}
                  placeholder="Pubblica contenuti su sales o crescita aziendale. L'azienda sta assumendo commerciali. Ha cambiato ruolo di recente. Fa domande sulla gestione del team vendite."
                  value={data.segnali_interesse}
                  onChange={(e) => setData({ ...data, segnali_interesse: e.target.value })}
                />
              </OnbField>
              <OnbField
                label="L'obiezione che senti più spesso"
                hint="Quando un prospect dice no, qual è il motivo più frequente? L'AI preparerà risposte specifiche."
              >
                <textarea
                  className="onb-input onb-textarea"
                  rows={3}
                  placeholder="&quot;Già ci proviamo internamente con LinkedIn, ma non funziona&quot;, &quot;Non abbiamo budget dedicato&quot;, &quot;Ci pensiamo noi&quot;"
                  value={data.obiezione_frequente}
                  onChange={(e) => setData({ ...data, obiezione_frequente: e.target.value })}
                />
              </OnbField>
            </>
          )}

          {/* ────────────────────────────────────────────────
              Step 4 — Il tuo processo
          ──────────────────────────────────────────────── */}
          {step === 4 && (
            <>
              <OnbField label="Modello di vendita" hint="Come funziona la tua dinamica commerciale? Determina il tono dei messaggi AI.">
                <div className="onb-model-grid">
                  {salesModelOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`onb-model-card${data.modello_vendita === opt.value ? " onb-model-active" : ""}`}
                      onClick={() => setData({ ...data, modello_vendita: opt.value })}
                    >
                      <span className="onb-model-icon">{opt.icon}</span>
                      <span className="onb-model-label">{opt.label}</span>
                      <span className="onb-model-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </OnbField>

              <div className="onb-fields-grid onb-fields-grid-3">
                <OnbField label="Ticket medio" hint="Valore medio di un contratto.">
                  <select
                    className="onb-input onb-select"
                    value={data.ticket_medio}
                    onChange={(e) => setData({ ...data, ticket_medio: e.target.value as OnboardingInput["ticket_medio"] })}
                  >
                    {ticketOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </OnbField>
                <OnbField label="Ciclo di vendita" hint="Quanto tempo dal primo contatto alla firma?">
                  <select
                    className="onb-input onb-select"
                    value={data.ciclo_vendita}
                    onChange={(e) => setData({ ...data, ciclo_vendita: e.target.value as OnboardingInput["ciclo_vendita"] })}
                  >
                    {cicloOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </OnbField>
                <OnbField label="Tempo su LinkedIn" hint="Quanto puoi dedicare davvero?">
                  <select
                    className="onb-input onb-select"
                    value={data.tempo_settimanale}
                    onChange={(e) => setData({ ...data, tempo_settimanale: e.target.value as OnboardingInput["tempo_settimanale"] })}
                  >
                    {timeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </OnbField>
              </div>

              <OnbField label="CTA preferita" hint="Cosa chiedi alla fine dell'interazione con un prospect?">
                <div className="onb-chip-row">
                  {ctaOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`onb-chip onb-chip-lg${data.cta_preferita === opt.value ? " onb-chip-active" : ""}`}
                      onClick={() => setData({ ...data, cta_preferita: opt.value })}
                    >
                      <span>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </OnbField>
            </>
          )}

          {/* ────────────────────────────────────────────────
              Step 5 — I tuoi asset
          ──────────────────────────────────────────────── */}
          {step === 5 && (
            <>
              <div className="onb-fields-grid">
                <OnbField
                  label="Il tuo profilo LinkedIn"
                  hint="L'URL del tuo profilo personale. Obbligatorio."
                  required
                >
                  <input
                    className="onb-input"
                    type="url"
                    placeholder="https://linkedin.com/in/tuoprofilo"
                    value={data.linkedin_url}
                    onChange={(e) => setData({ ...data, linkedin_url: e.target.value })}
                  />
                </OnbField>
                <OnbField
                  label="Sito web"
                  hint="Facoltativo — aiuta l'AI a capire il tuo tono di voce."
                >
                  <input
                    className="onb-input"
                    type="url"
                    placeholder="https://www.tuosito.com"
                    value={data.sito_web}
                    onChange={(e) => setData({ ...data, sito_web: e.target.value })}
                  />
                </OnbField>
              </div>

              <OnbField
                label="Ricerche LinkedIn salvate"
                hint="Incolla i link delle sales navigator o ricerche persone. Puoi aggiungerne quanti ne vuoi."
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

              <OnbField
                label="Documenti e presentazioni"
                hint="Slide, PDF, offerte. Facoltativo."
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
              className="onb-nav-next onb-nav-submit"
              disabled={loading}
              onClick={submit}
            >
              {loading ? (
                <>
                  <span className="onb-spinner" aria-hidden="true" />
                  Generazione piano in corso…
                </>
              ) : (
                "Attiva il sistema →"
              )}
            </button>
          )}
        </div>
      </section>

      {/* ── Reassurance ── */}
      <p className="onb-reassurance">
        ✏️ Puoi modificare queste informazioni in qualsiasi momento dalle impostazioni.
      </p>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FIELD COMPONENT
═══════════════════════════════════════════════════════════ */
function OnbField({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="onb-field">
      <label className="onb-field-label">
        {label}
        {required && <span className="onb-field-required">*</span>}
      </label>
      {hint && <p className="onb-field-hint">{hint}</p>}
      {children}
    </div>
  );
}
