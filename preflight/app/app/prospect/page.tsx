"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";

export default function ProspectPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [pastedProfileText, setPastedProfileText] = useState(params.get("pasted_profile_text") || "");
  const [output, setOutput] = useState<ProspectAnalyzerJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profile.onboarding, pasted_profile_text: pastedProfileText }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = prospectAnalyzerSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "prospect", pastedProfileText, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Analizza un potenziale cliente</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Scopri bisogni, punti di ingresso e domande giuste per ogni prospect.
        </p>
      </div>

      {/* Guide box */}
      <div className="callout">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> analizzi il profilo di un potenziale cliente</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> testo del profilo LinkedIn della persona</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> bisogni probabili, apertura conversazione e domande utili</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> invia richiesta connessione personalizzata</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* INPUT */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
            Input
          </h3>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Profilo LinkedIn del contatto</span>
            <textarea rows={9} className="input w-full resize-none" placeholder="Headline, about, ruolo, azienda, ultimi post rilevanti..." value={pastedProfileText} onChange={(e) => setPastedProfileText(e.target.value)} />
          </label>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generazione in corso…" : "Analizza prospect →"}
          </button>
        </div>

        {/* OUTPUT */}
        <div>
          {error ? (
            <div className="callout-danger rounded-xl p-5">
              <p className="font-semibold mb-1">⚠️ Errore AI</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : output ? (
            <div
              className="rounded-xl p-5 space-y-4"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-muted)" }}>
                  Intelligenza cliente
                </h3>
                <CopyButton text={`${output.connection_opener}\n\n${output.dm1}`} />
              </div>

              {/* Heat + Priority */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className="rounded-lg p-3 text-sm flex items-center gap-2"
                  style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
                >
                  <span className="font-medium">🌡️ Livello interesse:</span>
                  <span className={`badge ${output.client_heat_level === "Hot" ? "badge-red" : output.client_heat_level === "Warm" ? "badge-amber" : "badge-blue"}`}>
                    {output.client_heat_level}
                  </span>
                </div>
                <div
                  className="rounded-lg p-3 text-sm flex items-center gap-2"
                  style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
                >
                  <span className="font-medium">📊 Priorità:</span>
                  <span className={`badge ${output.priority_signal === "high" ? "badge-red" : output.priority_signal === "medium" ? "badge-amber" : "badge-blue"}`}>
                    {output.priority_signal}
                  </span>
                </div>
              </div>

              <OutputCard title="🔍 Problemi probabili" text={output.likely_pains.join("\n")} />
              <OutputCard title="💡 Angoli conversazione" text={output.angles.join("\n")} />
              <OutputCard title="🤝 Messaggio connessione" text={output.connection_opener} accent />
              <OutputCard title="✉️ Primo DM" text={output.dm1} accent />
              <OutputCard title="❓ Domande qualificanti" text={output.smart_questions.join("\n")} />

              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_action}
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-8 flex flex-col items-center justify-center text-center h-full"
              style={{
                background: "var(--color-soft-2)",
                border: "1.5px dashed var(--color-border)",
                minHeight: "320px",
              }}
            >
              <p className="text-4xl mb-3">🔎</p>
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Il risultato apparirà qui
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Incolla il profilo LinkedIn e clicca &quot;Analizza prospect&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="font-semibold mb-3">Storico</h3>
        <HistoryList userId={userId} type="prospect" />
      </div>
    </div>
  );
}

function OutputCard({ title, text, accent }: { title: string; text: string; accent?: boolean }) {
  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{
        background: accent ? "var(--color-soft)" : "var(--color-soft-2)",
        border: `1px solid ${accent ? "var(--color-primary)" : "var(--color-border)"}`,
      }}
    >
      <div className="font-semibold mb-1">{title}</div>
      <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}
