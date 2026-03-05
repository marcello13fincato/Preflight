"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CopyButton from "@/components/shared/CopyButton";
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
  const [conversationGoal, setConversationGoal] = useState<"understand_fit" | "continue_conversation" | "move_to_dm" | "propose_call" | "follow_up">("understand_fit");
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
          conversation_goal: conversationGoal,
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
        <label className="block text-sm"><span className="mb-1 block text-muted">Conversazione</span><textarea rows={7} className="input w-full" placeholder="Hi Marco, thanks for connecting. I saw you're working on SaaS growth." value={pastedChatThread} onChange={(e) => setPastedChatThread(e.target.value)} /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Obiettivo conversazione</span>
          <select className="input w-full" value={conversationGoal} onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}>
            <option value="understand_fit">Capire se è un cliente in target</option>
            <option value="continue_conversation">Continuare conversazione</option>
            <option value="move_to_dm">Spostare la conversazione in DM</option>
            <option value="propose_call">Proporre una call</option>
            <option value="follow_up">Fare follow-up</option>
          </select>
        </label>
        <label className="block text-sm"><span className="mb-1 block text-muted">Profilo contatto (opzionale)</span><textarea rows={4} className="input w-full" value={prospectProfileText} onChange={(e) => setProspectProfileText(e.target.value)} /></label>
        <button onClick={generate} disabled={loading} className="btn-primary px-4 py-2">{loading ? "Generazione..." : "Genera"}</button>
      </div>

      {output && (
        <section className="rounded-lg border border-app p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">Risultato</h3>
            <CopyButton text={`${output.best_reply}\n\n${output.alternatives.short}\n\n${output.alternatives.assertive}`} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-app p-3 text-sm"><strong>Client Heat Level:</strong> {output.client_heat_level}</div>
            <div className="rounded border border-app p-3 text-sm"><strong>Valutazione messaggio:</strong> {output.message_risk_warning}</div>
          </div>
          <ResultCard title="Risposta consigliata" text={output.best_reply} />
          <div className="grid gap-3 md:grid-cols-2">
            <ResultCard title="Versione breve" text={output.alternatives.short} />
            <ResultCard title="Versione diretta" text={output.alternatives.assertive} />
          </div>
          <ResultCard title="Domande qualificanti" text={output.qualifying_questions.join("\n")} />
          <div className="grid gap-3 md:grid-cols-3">
            <ResultCard title="Follow-up 48h" text={output.followups["48h"]} />
            <ResultCard title="Follow-up 5d" text={output.followups["5d"]} />
            <ResultCard title="Follow-up 10d" text={output.followups["10d"]} />
          </div>
          <div className="rounded border border-app bg-soft p-3 text-sm"><strong>Next action:</strong> {output.next_action}</div>
          <Link href="/app/pipeline" className="inline-block btn-secondary px-3 py-1.5">Aggiungi questo contatto alla pipeline?</Link>
        </section>
      )}
      <section className="rounded-lg border border-app p-4"><h3 className="font-semibold mb-2">Storico</h3><HistoryList userId={userId} type="dm" /></section>
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
