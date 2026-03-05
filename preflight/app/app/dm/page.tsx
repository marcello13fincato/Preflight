"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import PageGuide from "@/components/shared/PageGuide";
import { HeatLevelBadge, RiskWarning } from "@/components/shared/HeatLevel";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">✉️ Rispondi ai messaggi</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Porta ogni conversazione DM verso una call o un cliente.</p>
      </div>

      <PageGuide
        what="gestisci i messaggi privati LinkedIn per arrivare a una call."
        paste="la conversazione DM (copia/incolla la chat) e, se vuoi, il profilo del contatto."
        get="risposta consigliata, versioni alternative, domande qualificanti e follow-up programmati."
        next="invia la risposta e aggiorna lo stato in Pipeline."
      />

      <div className="card-premium p-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">Conversazione DM</span>
          <textarea
            rows={7}
            className="input w-full"
            placeholder="Incolla la conversazione DM qui (copia tutto il thread)..."
            value={pastedChatThread}
            onChange={(e) => setPastedChatThread(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">🎯 Obiettivo della conversazione</span>
          <select className="input w-full" value={conversationGoal} onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}>
            <option value="understand_fit">🔍 Capire se è un cliente in target</option>
            <option value="continue_conversation">💬 Continuare la conversazione</option>
            <option value="move_to_dm">✉️ Spostare in DM</option>
            <option value="propose_call">📞 Proporre una call</option>
            <option value="follow_up">🔁 Fare follow-up</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">
            Profilo del contatto
            <span className="ml-1.5 font-normal text-[var(--color-muted)]">(opzionale – migliora la risposta)</span>
          </span>
          <textarea rows={3} className="input w-full" placeholder="Incolla headline/bio LinkedIn..." value={prospectProfileText} onChange={(e) => setProspectProfileText(e.target.value)} />
        </label>

        <button onClick={generate} disabled={loading || !pastedChatThread.trim()} className="btn-primary px-6 py-3">
          {loading ? "⏳ Generazione in corso..." : "🚀 Genera risposta"}
        </button>
      </div>

      {output && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold">✅ Risultati</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-muted)] mb-2">🌡️ Calore del contatto</p>
              <HeatLevelBadge level={output.client_heat_level} showDesc />
            </div>
          </div>

          <RiskWarning message={output.message_risk_warning} />

          <OutputCard title="✨ Risposta consigliata" text={output.best_reply} highlight />

          <div className="grid gap-4 md:grid-cols-2">
            <OutputCard title="📝 Versione breve" text={output.alternatives.short} />
            <OutputCard title="🎯 Versione diretta" text={output.alternatives.assertive} />
          </div>

          <OutputCard title="❓ Domande qualificanti" text={output.qualifying_questions.join("\n")} />

          <div>
            <h3 className="font-bold text-sm mb-3">🔁 Follow-up programmati</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <OutputCard title="⏰ Dopo 48 ore" text={output.followups["48h"]} />
              <OutputCard title="📅 Dopo 5 giorni" text={output.followups["5d"]} />
              <OutputCard title="🗓️ Dopo 10 giorni" text={output.followups["10d"]} />
            </div>
          </div>

          <div className="callout callout-success flex items-start gap-3">
            <span className="text-lg">➡️</span>
            <div><strong>Prossima mossa:</strong> {output.next_action}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/app/pipeline" className="btn-primary px-4 py-2">📊 Aggiungi in Pipeline</Link>
            <Link href="/app/prospect" className="btn-secondary px-4 py-2">🔎 Analizza il profilo →</Link>
          </div>
        </section>
      )}

      <section className="card-premium p-5">
        <h3 className="font-bold mb-3">📁 Storico messaggi</h3>
        <HistoryList userId={userId} type="dm" />
      </section>
    </div>
  );
}

function OutputCard({ title, text, highlight = false }: { title: string; text: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${highlight ? "border-[var(--color-primary)] bg-[var(--color-soft)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-bold text-sm">{title}</span>
        <CopyButton text={text} />
      </div>
      <p className="text-sm whitespace-pre-wrap text-[var(--color-text)]">{text}</p>
    </div>
  );
}

