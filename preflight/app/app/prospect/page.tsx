"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import HistoryList from "@/components/app/HistoryList";
import PageGuide from "@/components/shared/PageGuide";
import OutputCard from "@/components/shared/OutputCard";
import { HeatLevelBadge } from "@/components/shared/HeatLevel";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { prospectAnalyzerSchema, type ProspectAnalyzerJson } from "@/lib/sales/schemas";
import { defaultProspectAnalyzer } from "@/lib/sales/defaults";

export default function ProspectPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [pastedProfileText, setPastedProfileText] = useState(params.get("pasted_profile_text") || "");
  const [output, setOutput] = useState<ProspectAnalyzerJson | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profile.onboarding, pasted_profile_text: pastedProfileText }),
      });
      const json = await res.json();
      const parsed = prospectAnalyzerSchema.safeParse(json);
      const valid = parsed.success ? parsed.data : defaultProspectAnalyzer;
      setOutput(valid);
      repo.interaction.addInteraction(userId, "prospect", pastedProfileText, valid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">🔎 Analizza un potenziale cliente</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Capisce chi è, cosa lo muove e come approcciarlo nel modo giusto.</p>
      </div>

      <PageGuide
        what="analizzi il profilo LinkedIn di un potenziale cliente per capire come approcciarlo."
        paste="il testo del profilo LinkedIn (copia headline, bio, ruolo, azienda, ultimi post)."
        get="problemi probabili, angoli di conversazione, messaggio di connessione, primo DM e domande intelligenti."
        next="invia il messaggio di connessione e, se è in target, aggiungilo in Pipeline."
      />

      <div className="card-premium p-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Profilo LinkedIn del contatto</span>
          <textarea
            rows={9}
            className="input w-full"
            placeholder="Incolla tutto ciò che vedi sul profilo: headline, bio, ruolo, azienda, ultimi post rilevanti..."
            value={pastedProfileText}
            onChange={(e) => setPastedProfileText(e.target.value)}
          />
        </label>
        <button onClick={generate} disabled={loading || !pastedProfileText.trim()} className="btn-primary px-6 py-3">
          {loading ? "⏳ Analisi in corso..." : "🔍 Analizza il profilo"}
        </button>
      </div>

      {output && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold">✅ Intelligenza cliente</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">🌡️ Calore del contatto</p>
              <HeatLevelBadge level={output.client_heat_level} showDesc />
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">⚡ Segnale priorità</p>
              <p className="text-sm font-medium">{output.priority_signal}</p>
            </div>
          </div>

          <OutputCard title="😣 Problemi probabili" text={output.likely_pains.join("\n")} />
          <OutputCard title="🎯 Angoli di conversazione" text={output.angles.join("\n")} />

          <div className="grid gap-4 md:grid-cols-2">
            <OutputCard title="🤝 Messaggio di connessione" text={output.connection_opener} highlight />
            <OutputCard title="✉️ Primo DM" text={output.dm1} highlight />
          </div>

          <OutputCard title="❓ Domande qualificanti" text={output.smart_questions.join("\n")} />

          <div className="callout callout-success flex items-start gap-3">
            <span className="text-lg">➡️</span>
            <div><strong>Prossima mossa:</strong> {output.next_action}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/app/pipeline" className="btn-primary px-4 py-2">📊 Aggiungi in Pipeline</Link>
            <Link href="/app/dm" className="btn-secondary px-4 py-2">✉️ Vai ai messaggi →</Link>
          </div>
        </section>
      )}

      <section className="card-premium p-5">
        <h3 className="font-bold mb-3">📁 Storico analisi</h3>
        <HistoryList userId={userId} type="prospect" />
      </section>
    </div>
  );
}

