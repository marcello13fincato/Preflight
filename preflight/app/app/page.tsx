"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function AppTodayPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [quickType, setQuickType] = useState("post");
  const [quickText, setQuickText] = useState("");
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);
  const day = Math.min(14, Math.max(1, new Date().getDate() % 14 || 1));
  const today = profile.plan?.plan_14_days.find((d) => d.day === day) || profile.plan?.plan_14_days[0];
  const leadsByStatus = repo.lead.listByStatus(userId);
  const activeConversations =
    (leadsByStatus["In conversazione"]?.length || 0) +
    (leadsByStatus["Interessato"]?.length || 0) +
    (leadsByStatus["Call proposta"]?.length || 0);
  const totalLeads = repo.lead.listLeads(userId).length;
  const clienti = leadsByStatus["Cliente"]?.length || 0;

  const followupLead = repo
    .lead
    .listLeads(userId)
    .filter((x) => x.status !== "Cliente")
    .sort((a, b) => (a.next_action_at || "").localeCompare(b.next_action_at || ""))[0];

  function jumpQuickAssist() {
    const encoded = encodeURIComponent(quickText);
    if (quickType === "post") router.push(`/app/post?draft_post=${encoded}`);
    if (quickType === "comment") router.push(`/app/comments?received_comment=${encoded}`);
    if (quickType === "dm") router.push(`/app/dm?pasted_chat_thread=${encoded}`);
    if (quickType === "prospect") router.push(`/app/prospect?pasted_profile_text=${encoded}`);
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Buona giornata 👋 — ecco cosa fare oggi.
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Dedica 15–30 minuti per creare nuove opportunità commerciali su LinkedIn.
        </p>
      </div>

      {/* Onboarding prompt */}
      {!profile.onboarding_complete && (
        <div className="callout flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
              ⚙️ Configura il tuo sistema
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
              Completa l'onboarding per generare il piano 14 giorni personalizzato.
            </p>
          </div>
          <Link href="/app/onboarding" className="btn-primary px-4 py-2 text-sm">
            Vai a onboarding →
          </Link>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Conversazioni attive" value={activeConversations} accent />
        <KpiCard label="Lead in pipeline" value={totalLeads} />
        <KpiCard label="Clienti acquisiti" value={clienti} />
        <KpiCard
          label="Da ricontattare"
          value={
            repo.lead
              .listLeads(userId)
              .filter((l) => l.status !== "Cliente" && !!l.next_action_at).length
          }
        />
      </div>

      {/* 3 macro-areas: Attira / Parla / Chiudi */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
          Azioni quotidiane
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <MacroCard
            emoji="📣"
            title="Attira"
            color="var(--color-primary)"
            explanation="Pubblica contenuti che dimostrano il tuo valore e attirano clienti ideali."
            action={today?.inbound || "Genera il tuo piano per vedere l'azione di oggi."}
            ctaHref="/app/inbound"
            ctaLabel="Crea contenuto"
          />
          <MacroCard
            emoji="💬"
            title="Parla"
            color="#0B5CAD"
            explanation="Avvia conversazioni autentiche con potenziali clienti nei commenti e nei DM."
            action={today?.outbound || "Apri 2 conversazioni con contatti in target."}
            ctaHref="/app/comments"
            ctaLabel="Rispondi ai commenti"
          />
          <MacroCard
            emoji="🎯"
            title="Chiudi"
            color="#004182"
            explanation="La maggior parte dei clienti arriva dopo il 2°–3° messaggio. Invia follow-up strategici."
            action={today?.followup || "Invia 1 follow-up su chat aperta."}
            ctaHref="/app/dm"
            ctaLabel="Genera follow-up"
          />
        </div>
      </div>

      {/* Pipeline snapshot */}
      <div className="rounded-xl border border-app bg-surface p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="font-semibold">Pipeline — stato corrente</h3>
          <Link href="/app/pipeline" className="btn-ghost text-sm">Vai alla pipeline →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(leadsByStatus).map(([status, leads]) => (
            <div
              key={status}
              className="rounded-lg p-3 text-sm"
              style={{ background: "var(--color-soft-2)", border: "1px solid var(--color-border)" }}
            >
              <div className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{status}</div>
              <div className="text-2xl font-bold mt-0.5" style={{ color: "var(--color-primary)" }}>
                {leads.length}
              </div>
            </div>
          ))}
        </div>
        {followupLead && (
          <div className="mt-4 callout">
            <span className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
              ➡️ Prossimo follow-up consigliato:
            </span>{" "}
            <span className="text-sm">{followupLead.name}</span>{" "}
            <span className="badge badge-blue ml-1">{followupLead.status}</span>
          </div>
        )}
      </div>

      {/* Quick assist */}
      <div className="rounded-xl border border-app bg-surface p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
        <h3 className="font-semibold">⚡ Assistente rapido</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Incolla un testo e scegli il modulo giusto: verrai reindirizzato direttamente.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto]">
          <select
            value={quickType}
            onChange={(e) => setQuickType(e.target.value)}
            className="input sm:w-40"
          >
            <option value="post">Post</option>
            <option value="comment">Commento</option>
            <option value="dm">Messaggio DM</option>
            <option value="prospect">Profilo cliente</option>
          </select>
          <textarea
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="Incolla qui il testo..."
          />
          <button onClick={jumpQuickAssist} className="btn-primary self-end">
            Apri modulo →
          </button>
        </div>
      </div>

      {/* How to use */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-soft)", border: "1px solid var(--color-border)" }}
      >
        <h3 className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
          🗺️ Come funziona Preflight
        </h3>
        <ol className="mt-3 space-y-2 text-sm" style={{ color: "var(--color-text)" }}>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>1.</span>
            <span>Pubblica un post che mostra il tuo valore</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>2.</span>
            <span>Rispondi ai commenti per aprire conversazioni</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>3.</span>
            <span>Sposta la conversazione in DM per qualificare il lead</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: "var(--color-primary)" }}>4.</span>
            <span>Proponi una call e aggiungi il lead alla pipeline</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: accent ? "var(--color-primary)" : "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
        color: accent ? "white" : "var(--color-text)",
      }}
    >
      <div
        className="text-3xl font-bold"
        style={{ color: accent ? "white" : "var(--color-primary)" }}
      >
        {value}
      </div>
      <div
        className="mt-1 text-xs font-medium"
        style={{ color: accent ? "var(--color-primary-text-muted)" : "var(--color-muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

function MacroCard({
  emoji,
  title,
  color,
  explanation,
  action,
  ctaHref,
  ctaLabel,
}: {
  emoji: string;
  title: string;
  color: string;
  explanation: string;
  action: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-bold text-base" style={{ color }}>
          {title}
        </h3>
      </div>
      <p className="text-sm flex-1" style={{ color: "var(--color-muted)" }}>
        {explanation}
      </p>
      <p
        className="text-sm rounded-lg p-3"
        style={{ background: "var(--color-soft-2)", color: "var(--color-text)" }}
      >
        <span className="font-semibold">Oggi: </span>
        {action}
      </p>
      <Link
        href={ctaHref}
        className="btn-primary text-center"
        style={{ background: color }}
      >
        {ctaLabel} →
      </Link>
    </div>
  );
}
