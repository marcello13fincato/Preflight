"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function InboundPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Contenuti</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: ti aiuta a creare contenuti che aprono conversazioni.</p>
        <p><strong>Cosa usare</strong>: i temi e gli hook del tuo piano commerciale.</p>
        <p><strong>Cosa ottieni</strong>: idee pronte e passaggio diretto a &quot;Scrivi un post&quot;.</p>
      </div>
      {!profile.plan && <p className="text-sm text-muted">Nessun piano disponibile. Completa onboarding.</p>}

      {profile.plan?.content_plan.map((item, idx) => (
        <div key={`${item.week}-${idx}`} className="rounded-lg border border-app p-4">
          <div className="text-sm text-muted">Settimana {item.week} · {item.post_type}</div>
          <h3 className="font-semibold">{item.topic}</h3>
          <p className="text-sm mt-2">Hook: {item.hook}</p>
          <p className="text-sm">CTA: {item.cta}</p>
          <Link
            href={`/app/post?draft_post=${encodeURIComponent(`${item.hook}\n\n${item.topic}`)}&objective=inbound&dm_keyword=${encodeURIComponent(item.cta)}`}
            className="mt-3 inline-block btn-secondary px-3 py-1.5"
          >
            Genera post
          </Link>
        </div>
      ))}

      {profile.plan?.plan_14_days && (
        <div className="rounded-lg border border-app p-4">
          <h3 className="font-semibold">Checklist 14 giorni</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {profile.plan.plan_14_days.map((day) => (
              <div key={day.day} className="rounded border border-app p-3 text-sm">
                <div className="font-semibold">Day {day.day}</div>
                <div>Contenuti: {day.inbound}</div>
                <div>Conversazioni: {day.outbound}</div>
                <div>Follow-up: {day.followup}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
