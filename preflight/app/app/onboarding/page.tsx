"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { computeSystemProgress } from "@/components/app/SystemBanner";
import { onboardingInputSchema, type OnboardingInput } from "@/lib/sales/schemas";

const TOTAL_STEPS = 6;

const timeOptions = [
  { label: "Meno di 1 ora", value: "meno_1h" },
  { label: "1–3 ore", value: "1_3h" },
  { label: "3–5 ore", value: "3_5h" },
  { label: "Più di 5 ore", value: "piu_5h" },
] as const;

const initial: OnboardingInput = {
  servizio: "",
  cliente_ideale: "",
  problema_cliente: "",
  risultato_cliente: "",
  linkedin_search_links: [""],
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

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);
  const systemPct = computeSystemProgress(data as unknown as Record<string, unknown>);

  return (
    <div className="onb-page">

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="onb-hero">
        <h2 className="onb-hero-title">Imposta il tuo sistema</h2>
        <p className="onb-hero-subtitle">
          Preflight usa queste informazioni per darti consigli più precisi.
        </p>
        <p className="onb-hero-body">
          Rispondi a poche domande semplici. Nessun campo tecnico, nessuna astrazione.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════
          SYSTEM COMPLETION BAR
      ══════════════════════════════════════════════════ */}
      <div className="onb-completion">
        <div className="onb-completion-header">
          <h3 className="onb-completion-title">Completamento del tuo sistema</h3>
          <span className="onb-completion-pct">
            {systemPct === 100 ? "Sistema configurato correttamente" : `Sistema configurato al ${systemPct}%`}
          </span>
        </div>
        <div className="onb-completion-track">
          <div
            className={`onb-completion-fill${systemPct === 100 ? " onb-completion-fill-done" : ""}`}
            style={{ width: `${systemPct}%` }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FORM
      ══════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-xl space-y-6">

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
            Passo {step} di {TOTAL_STEPS}
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
            {progressPct}% completato
          </span>
        </div>
        <div
          className="h-2 w-full rounded-full overflow-hidden"
          style={{ background: "var(--color-soft)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, background: "var(--color-primary)" }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                style={{
                  background: i + 1 <= step ? "var(--color-primary)" : "var(--color-soft)",
                  color: i + 1 <= step ? "white" : "var(--color-muted)",
                  opacity: i + 1 > step ? 0.5 : 1,
                }}
              >
                {i + 1 < step ? "✓" : i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step cards */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* ── Step 1: Che servizio offri? ── */}
        {step === 1 && (
          <>
            <StepHeader
              emoji="💼"
              title="Che servizio offri?"
            />
            <label className="block text-sm">
              <p className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>Descrivi in una frase cosa fai per i tuoi clienti.</p>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Aiuto aziende B2B a trovare clienti tramite LinkedIn."
                value={data.servizio}
                onChange={(e) => setData({ ...data, servizio: e.target.value })}
              />
            </label>
          </>
        )}

        {/* ── Step 2: Che tipo di clienti cerchi? ── */}
        {step === 2 && (
          <>
            <StepHeader
              emoji="🎯"
              title="Che tipo di clienti cerchi?"
            />
            <label className="block text-sm">
              <p className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>Pensa alle persone che potrebbero davvero comprare il tuo servizio.</p>
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Founder di startup SaaS B2B."
                value={data.cliente_ideale}
                onChange={(e) => setData({ ...data, cliente_ideale: e.target.value })}
              />
            </label>
          </>
        )}

        {/* ── Step 3: Problema del cliente ── */}
        {step === 3 && (
          <>
            <StepHeader
              emoji="🧩"
              title="Che problema hanno i tuoi clienti prima di lavorare con te?"
            />
            <label className="block text-sm">
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Non riescono a trovare clienti tramite LinkedIn."
                value={data.problema_cliente}
                onChange={(e) => setData({ ...data, problema_cliente: e.target.value })}
              />
            </label>
          </>
        )}

        {/* ── Step 4: Risultato che porti ── */}
        {step === 4 && (
          <>
            <StepHeader
              emoji="🏆"
              title="Che risultato porti ai tuoi clienti?"
            />
            <label className="block text-sm">
              <textarea
                className="input w-full resize-none"
                rows={3}
                placeholder="Li aiuto a trasformare LinkedIn in una fonte di nuovi clienti."
                value={data.risultato_cliente}
                onChange={(e) => setData({ ...data, risultato_cliente: e.target.value })}
              />
            </label>
          </>
        )}

        {/* ── Step 5: Profili LinkedIn da contattare ── */}
        {step === 5 && (
          <>
            <StepHeader
              emoji="🔗"
              title="Che tipo di profili vuoi contattare su LinkedIn?"
            />
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              Inserisci uno o più link di ricerca LinkedIn con i profili che vuoi trovare.
            </p>
            <div className="space-y-3">
              {data.linkedin_search_links.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className="input w-full"
                    type="url"
                    placeholder="https://www.linkedin.com/search/results/people/?keywords=founder%20saas"
                    value={link}
                    onChange={(e) => updateLink(idx, e.target.value)}
                  />
                  {data.linkedin_search_links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: "var(--color-muted)", border: "1px solid var(--color-border)" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLink}
              className="text-sm font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              + Aggiungi un&apos;altra categoria
            </button>
          </>
        )}

        {/* ── Step 6: Tempo settimanale ── */}
        {step === 6 && (
          <>
            <StepHeader
              emoji="⏱"
              title="Quanto tempo puoi dedicare a LinkedIn ogni settimana?"
            />
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setData({ ...data, tempo_settimanale: opt.value })}
                  className="rounded-xl p-4 text-sm font-medium text-left transition-all duration-150"
                  style={{
                    background: data.tempo_settimanale === opt.value ? "var(--color-primary)" : "var(--color-soft-2)",
                    color: data.tempo_settimanale === opt.value ? "white" : "var(--color-text)",
                    border: `2px solid ${data.tempo_settimanale === opt.value ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="callout-danger rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              className="btn-secondary flex-1"
              disabled={loading}
              onClick={() => setStep((s) => s - 1)}
            >
              ← Indietro
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              type="button"
              className="btn-primary flex-1 py-3 text-base"
              disabled={loading}
              onClick={() => setStep((s) => s + 1)}
            >
              Avanti →
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary flex-1 py-3 text-base"
              disabled={loading}
              onClick={submit}
            >
              {loading ? "Salvataggio in corso…" : "Salva e continua →"}
            </button>
          )}
        </div>
      </div>

      {/* Reassurance */}
      <p className="text-center text-xs" style={{ color: "var(--color-muted)" }}>
        Puoi modificare queste informazioni in qualsiasi momento.
      </p>
      </div>
    </div>
  );
}

function StepHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-start gap-4 pb-2">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{ background: "var(--color-soft)", color: "var(--color-primary)" }}
      >
        {emoji}
      </div>
      <div>
        <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>{title}</h3>
      </div>
    </div>
  );
}
