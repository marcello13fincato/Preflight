"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import JsonOutputCard from "@/components/app/JsonOutputCard";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { dmAssistantSchema, type DmAssistantJson } from "@/lib/sales/schemas";
import { defaultDmAssistant } from "@/lib/sales/defaults";

export default function DmPage() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  const [pastedChatThread, setPastedChatThread] = useState(params.get("pasted_chat_thread") || "");
  const [objective, setObjective] = useState<"qualify" | "propose call" | "follow-up">("qualify");
  const [prospectProfileText, setProspectProfileText] = useState(params.get("prospect_profile_text") || "");
  const [output, setOutput] = useState<DmAssistantJson | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile.onboarding,
          pasted_chat_thread: pastedChatThread,
          objective,
          prospect_profile_text: prospectProfileText,
        }),
      });
      const json = await res.json();
      const parsed = dmAssistantSchema.safeParse(json);
      const valid = parsed.success ? parsed.data : defaultDmAssistant;
      setOutput(valid);
      repo.interaction.addInteraction(userId, "dm", pastedChatThread, valid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestisci i messaggi.</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: ti aiuta a rispondere ai messaggi per arrivare a una call.</p>
        <p><strong>Cosa incollare</strong>: conversazione DM e, se vuoi, profilo del contatto.</p>
        <p><strong>Cosa ottieni</strong>: risposta consigliata, versione breve, versione diretta e follow-up.</p>
      </div>
      <div className="rounded-lg border border-app p-4 space-y-3">
        <label className="block text-sm"><span className="mb-1 block text-muted">Conversazione</span><textarea rows={7} className="input w-full" value={pastedChatThread} onChange={(e) => setPastedChatThread(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Obiettivo</span>
          <select className="input w-full" value={objective} onChange={(e) => setObjective(e.target.value as "qualify" | "propose call" | "follow-up")}>
            <option value="qualify">Qualificare</option>
            <option value="propose call">Proporre call</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Profilo contatto (opzionale)</span><textarea rows={4} className="input w-full" value={prospectProfileText} onChange={(e) => setProspectProfileText(e.target.value)} /></label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>
      {output && <JsonOutputCard title="Output pronto da usare" value={output} />}
      <section className="rounded-lg border border-app p-4"><h3 className="font-semibold mb-2">Storico</h3><HistoryList userId={userId} type="dm" /></section>
    </div>
  );
}
