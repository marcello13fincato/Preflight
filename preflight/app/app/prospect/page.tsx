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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Analizza un potenziale cliente.</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: analizza il profilo di un potenziale cliente.</p>
        <p><strong>Cosa incollare</strong>: testo del profilo LinkedIn della persona.</p>
        <p><strong>Cosa ottieni</strong>: bisogni probabili, apertura conversazione e domande utili.</p>
      </div>
      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Profilo LinkedIn del contatto</span>
          <textarea rows={9} className="input w-full" placeholder="Headline, about, ruolo, azienda, ultimi post rilevanti..." value={pastedProfileText} onChange={(e) => setPastedProfileText(e.target.value)} />
        </label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>

      {error && (
        <div className="callout-danger rounded-xl p-5">
          <p className="font-semibold mb-1">⚠️ Errore AI</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {output && (
        <section className="rounded-lg border border-app p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Intelligenza cliente</h3>
            <CopyButton text={`${output.connection_opener}\n\n${output.dm1}`} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-app p-3 text-sm"><strong>Client Heat Level:</strong> {output.client_heat_level}</div>
            <div className="rounded border border-app p-3 text-sm"><strong>Priorità:</strong> {output.priority_signal}</div>
          </div>
          <ResultCard title="Problemi probabili" text={output.likely_pains.join("\n")} />
          <ResultCard title="Angoli conversazione" text={output.angles.join("\n")} />
          <ResultCard title="Messaggio connessione" text={output.connection_opener} />
          <ResultCard title="Primo DM" text={output.dm1} />
          <ResultCard title="Domande qualificanti" text={output.smart_questions.join("\n")} />
          <div className="rounded border border-app bg-soft p-3 text-sm"><strong>Next action:</strong> {output.next_action}</div>
        </section>
      )}
      <section className="rounded-lg border border-app p-4"><h3 className="font-semibold mb-2">Storico</h3><HistoryList userId={userId} type="prospect" /></section>
    </div>
  );
}

function ResultCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded border border-app p-3 text-sm">
      <div className="font-semibold">{title}</div>
      <p className="mt-1 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
