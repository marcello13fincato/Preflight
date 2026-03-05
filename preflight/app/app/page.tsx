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

  const followupLead = repo
    .lead
    .listLeads(userId)
    .filter((x) => x.status !== "Client")
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
      <div>
        <h2 className="text-3xl font-bold">Oggi, fai avanzare la vendita.</h2>
        <p className="mt-2 text-muted">15–30 minuti. Tre azioni. Una conversazione in più.</p>
      </div>

      {!profile.onboarding_complete && (
        <div className="rounded-lg border border-app bg-soft p-4">
          <p className="text-sm">Completa onboarding per generare il piano 14 giorni.</p>
          <Link href="/app/onboarding" className="mt-2 inline-block btn-primary px-4 py-2">Vai a onboarding</Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <TaskCard title="Inbound" text={today?.inbound || "Genera il tuo piano per vedere le azioni di oggi."} ctaHref="/app/inbound" />
        <TaskCard title="Outbound" text={today?.outbound || "Apri 2 conversazioni con prospect in target."} ctaHref="/app/prospect" />
        <TaskCard title="Follow-up" text={today?.followup || "Invia 1 follow-up su chat aperta."} ctaHref="/app/dm" />
      </div>

      <div className="rounded-lg border border-app p-4">
        <h3 className="font-semibold">Quick Assist</h3>
        <p className="text-sm text-muted">Incolla testo e salta direttamente nel modulo corretto.</p>
        <div className="mt-3 flex flex-col gap-3">
          <select value={quickType} onChange={(e) => setQuickType(e.target.value)} className="input">
            <option value="post">Post</option>
            <option value="comment">Comment</option>
            <option value="dm">DM</option>
            <option value="prospect">Prospect</option>
          </select>
          <textarea value={quickText} onChange={(e) => setQuickText(e.target.value)} rows={4} className="input" />
          <button onClick={jumpQuickAssist} className="btn-primary px-4 py-2 w-fit">Apri modulo</button>
        </div>
      </div>

      <div className="rounded-lg border border-app p-4">
        <h3 className="font-semibold">Pipeline snapshot</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {Object.entries(leadsByStatus).map(([status, leads]) => (
            <div key={status} className="rounded border border-app p-3 text-sm">
              <div className="text-muted">{status}</div>
              <div className="text-xl font-bold">{leads.length}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm">
          1 follow-up consigliato oggi: {followupLead ? `${followupLead.name} (${followupLead.status})` : "Nessuno"}
        </p>
      </div>
    </div>
  );
}

function TaskCard({ title, text, ctaHref }: { title: string; text: string; ctaHref: string }) {
  return (
    <div className="rounded-lg border border-app p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
      <Link href={ctaHref} className="mt-3 inline-block btn-secondary px-3 py-1.5">Genera</Link>
    </div>
  );
}
