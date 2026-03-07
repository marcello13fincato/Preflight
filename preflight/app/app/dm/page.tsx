"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import CopyButton from "@/components/shared/CopyButton";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { dmAssistantSchema, type DmAssistantJson } from "@/lib/sales/schemas";

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
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
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
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = dmAssistantSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      repo.interaction.addInteraction(userId, "dm", pastedChatThread, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  const heatColors: Record<string, string> = {
    Cold: "badge-blue",
    Warm: "badge-amber",
    Hot: "badge-red",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Gestisci i messaggi DM</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Rispondi in modo strategico per arrivare alla call.
        </p>
      </div>

      {/* Guide box */}
      <div className="callout">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> gestisci conversazioni DM per qualificare i lead</div>
          <div><span className="font-semibold">📋 Cosa inserire:</span> conversazione DM e profilo contatto</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> risposta consigliata, versione breve, diretta, follow-up</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> proponi una call o aggiungi in pipeline</div>
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
            <span className="mb-1 block font-medium">Conversazione DM</span>
            <textarea
              rows={7}
              className="input w-full resize-none"
              placeholder="Es. Ciao Marco, grazie per la connessione. Ho visto che lavori sulla crescita SaaS."
              value={pastedChatThread}
              onChange={(e) => setPastedChatThread(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Obiettivo conversazione</span>
            <select
              className="input w-full"
              value={conversationGoal}
              onChange={(e) => setConversationGoal(e.target.value as typeof conversationGoal)}
            >
              <option value="understand_fit">Capire se è un cliente in target</option>
              <option value="continue_conversation">Continuare conversazione</option>
              <option value="move_to_dm">Spostare la conversazione in DM</option>
              <option value="propose_call">Proporre una call</option>
              <option value="follow_up">Fare follow-up</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">
              Profilo contatto{" "}
              <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(opzionale)</span>
            </span>
            <textarea
              rows={4}
              className="input w-full resize-none"
              value={prospectProfileText}
              onChange={(e) => setProspectProfileText(e.target.value)}
            />
          </label>
          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Generazione in corso…" : "Genera risposta →"}
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
                  Risultato
                </h3>
                <CopyButton text={`${output.best_reply}\n\n${output.alternatives.short}\n\n${output.alternatives.assertive}`} />
              </div>

              {/* Heat + risk */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  className="rounded-lg p-3 text-sm flex items-center gap-2"
                  style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
                >
                  <span className="font-medium">🌡️ Livello interesse:</span>
                  <span className={`badge ${heatColors[output.client_heat_level] || "badge-blue"}`}>
                    {output.client_heat_level}
                  </span>
                </div>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    output.message_risk_warning && output.message_risk_warning !== "nessuno"
                      ? "callout-warning"
                      : ""
                  }`}
                  style={
                    !output.message_risk_warning || output.message_risk_warning === "nessuno"
                      ? {
                          background: "var(--color-soft-2)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-sm)",
                        }
                      : {}
                  }
                >
                  <span className="font-medium">⚠️ Rischio: </span>
                  <span>{output.message_risk_warning || "nessuno"}</span>
                </div>
              </div>

              <OutputCard title="✉️ Risposta consigliata" text={output.best_reply} accent />

              <div className="grid gap-3 sm:grid-cols-2">
                <OutputCard title="📝 Versione breve" text={output.alternatives.short} />
                <OutputCard title="🎯 Versione diretta" text={output.alternatives.assertive} />
              </div>

              <OutputCard title="❓ Domande qualificanti" text={output.qualifying_questions.join("\n")} />

              <div>
                <div className="mb-2 text-sm font-semibold">Follow-up programmati</div>
                <div className="grid gap-2 md:grid-cols-3">
                  <OutputCard title="⏱ 48 ore" text={output.followups["48h"]} />
                  <OutputCard title="📅 5 giorni" text={output.followups["5d"]} />
                  <OutputCard title="🗓 10 giorni" text={output.followups["10d"]} />
                </div>
              </div>

              <div className="callout-success text-sm rounded-lg">
                <span className="font-semibold">➡️ Prossima azione: </span>
                {output.next_action}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/app/pipeline" className="btn-primary">
                  + Aggiungi in Pipeline
                </Link>
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
              <p className="text-4xl mb-3">✉️</p>
              <p className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Il risultato apparirà qui
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                Incolla la conversazione DM e clicca &quot;Genera risposta&quot;
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
        <HistoryList userId={userId} type="dm" />
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
