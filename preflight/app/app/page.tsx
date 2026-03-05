"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

const STATUSES_COLORS: Record<string, string> = {
  Nuovo: "badge-nuovo",
  "In conversazione": "badge-conversazione",
  Interessato: "badge-interessato",
  "Call proposta": "badge-call-proposta",
  "Call fissata": "badge-call-fissata",
  Cliente: "badge-cliente",
};

export default function AppTodayPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [quickType, setQuickType] = useState("comment");
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
  const followupLeads = repo.lead
    .listLeads(userId)
    .filter((x) => x.status !== "Cliente" && x.next_action_at)
    .sort((a, b) => String(a.next_action_at).localeCompare(String(b.next_action_at)))
    .slice(0, 3);

  function jumpQuickAssist() {
    const encoded = encodeURIComponent(quickText);
    if (quickType === "post") router.push(`/app/post?draft_post=${encoded}`);
    if (quickType === "comment") router.push(`/app/comments?received_comment=${encoded}`);
    if (quickType === "dm") router.push(`/app/dm?pasted_chat_thread=${encoded}`);
    if (quickType === "prospect") router.push(`/app/prospect?pasted_profile_text=${encoded}`);
  }

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#004182] p-6 sm:p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Dashboard · Oggi</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
          Oggi: crea nuove opportunità
        </h1>
        <p className="mt-2 text-sm sm:text-base opacity-85">
          Dedica <strong>15–30 minuti</strong> per far avanzare conversazioni verso call e clienti.
        </p>

        {/* Journey bar */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {[
            { label: "Post", icon: "✍️" },
            { label: "Commenti", icon: "💬" },
            { label: "Messaggi", icon: "✉️" },
            { label: "Call", icon: "📞" },
            { label: "Cliente", icon: "🏆" },
          ].map((step, i, arr) => (
            <span key={step.label} className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                {step.icon} {step.label}
              </span>
              {i < arr.length - 1 && <span className="text-white/50 text-xs">→</span>}
            </span>
          ))}
        </div>

        {!profile.onboarding_complete && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 px-4 py-3 text-sm">
            <span>⚠️ Completa il setup per attivare il tuo piano</span>
            <Link href="/app/onboarding" className="font-bold underline underline-offset-2 hover:no-underline">
              Inizia ora →
            </Link>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <KpiCard icon="💬" label="Conversazioni attive" value={activeConversations} color="blue" />
        <KpiCard icon="📅" label="Follow-up da fare oggi" value={followupLeads.length} color="amber" />
        <KpiCard icon="👥" label="Totale contatti" value={totalLeads} color="green" />
      </div>

      {/* 3 azioni di oggi */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">Le 3 azioni di oggi</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            emoji="📣"
            title="Attira"
            subtitle="Pubblica contenuto"
            description={today?.inbound || "Crea un post che apre conversazioni con i clienti giusti."}
            ctaHref="/app/inbound"
            ctaLabel="Vai ai contenuti"
            color="blue"
          />
          <ActionCard
            emoji="💬"
            title="Parla"
            subtitle="Rispondi e connetti"
            description={today?.outbound || "Rispondi a commenti e messaggi per iniziare nuove conversazioni."}
            ctaHref="/app/comments"
            ctaLabel="Rispondi ora"
            color="green"
          />
          <ActionCard
            emoji="🏆"
            title="Chiudi"
            subtitle="Avanza verso la call"
            description={today?.followup || "Invia un follow-up intelligente alle conversazioni più calde."}
            ctaHref="/app/pipeline"
            ctaLabel="Apri pipeline"
            color="amber"
          />
        </div>
      </div>

      {/* Quick assist */}
      <div className="card-premium p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold">⚡ Aha! – Risposta in 60 secondi</h2>
          <p className="text-sm text-[var(--color-muted)] mt-0.5">Incolla qualsiasi testo e ottieni subito una risposta.</p>
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {[
            { value: "comment", label: "💬 Commento" },
            { value: "dm", label: "✉️ Messaggio" },
            { value: "prospect", label: "🔎 Profilo cliente" },
            { value: "post", label: "✍️ Bozza post" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setQuickType(tab.value)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-150 ${
                quickType === tab.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <textarea
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          rows={4}
          className="input w-full"
          placeholder={
            quickType === "comment"
              ? "Incolla il commento ricevuto qui..."
              : quickType === "dm"
              ? "Incolla la conversazione DM qui..."
              : quickType === "prospect"
              ? "Incolla il testo del profilo LinkedIn qui..."
              : "Incolla la bozza del post qui..."
          }
        />
        <button
          onClick={jumpQuickAssist}
          disabled={!quickText.trim()}
          className="btn-primary mt-3 px-5 py-2.5"
        >
          🚀 Ottieni risposta
        </button>
      </div>

      {/* Da ricontattare oggi */}
      {followupLeads.length > 0 && (
        <div className="card-premium p-6">
          <h2 className="text-lg font-bold mb-1">📅 Da ricontattare oggi</h2>
          <p className="text-sm text-[var(--color-muted)] mb-4">Questi contatti aspettano un follow-up.</p>
          <div className="space-y-3">
            {followupLeads.map((lead) => (
              <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3">
                <div>
                  <p className="font-semibold text-sm">{lead.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{lead.company || "Azienda non indicata"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${STATUSES_COLORS[lead.status] || "badge-primary"}`}>{lead.status}</span>
                  <Link
                    href={`/app/dm?pasted_chat_thread=${encodeURIComponent(`Lead: ${lead.name}\nStato: ${lead.status}\nNote: ${lead.notes || ""}`)}`}
                    className="btn-primary px-3 py-1.5 text-xs"
                  >
                    Genera follow-up
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline overview */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">📊 Pipeline clienti</h2>
          <Link href="/app/pipeline" className="btn-secondary px-3 py-1.5 text-sm">Apri pipeline →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(leadsByStatus).map(([status, leads]) => (
            <div key={status} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft-2)] px-4 py-3">
              <div className="text-xs text-[var(--color-muted)] mb-1">{status}</div>
              <div className="text-2xl font-extrabold text-[var(--color-text)]">{leads.length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: "blue" | "green" | "amber" }) {
  const colorMap = {
    blue: "bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF]",
    green: "bg-[#F0FDF4] border-[#D1FAE5] text-[#065F46]",
    amber: "bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E]",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="text-xs font-medium mt-1 opacity-80">{label}</div>
    </div>
  );
}

function ActionCard({
  emoji, title, subtitle, description, ctaHref, ctaLabel, color,
}: {
  emoji: string; title: string; subtitle: string; description: string;
  ctaHref: string; ctaLabel: string; color: "blue" | "green" | "amber";
}) {
  const colorMap = {
    blue: { bg: "bg-[var(--color-soft)]", border: "border-[var(--color-border)]", btn: "btn-primary" },
    green: { bg: "bg-[#F0FDF4]", border: "border-[#D1FAE5]", btn: "btn-primary" },
    amber: { bg: "bg-[#FFFBEB]", border: "border-[#FEF3C7]", btn: "btn-primary" },
  };
  const cls = colorMap[color];
  return (
    <div className={`flex flex-col rounded-xl border ${cls.border} ${cls.bg} p-5 transition-all duration-150 hover:shadow-md`}>
      <div className="text-3xl mb-2">{emoji}</div>
      <h3 className="font-extrabold text-base">{title}</h3>
      <p className="text-xs text-[var(--color-muted)] font-medium mb-2">{subtitle}</p>
      <p className="text-sm text-[var(--color-text)] flex-1 mb-4">{description}</p>
      <Link href={ctaHref} className={`${cls.btn} px-4 py-2.5 text-sm w-full justify-center`}>
        {ctaLabel} →
      </Link>
    </div>
  );
}

