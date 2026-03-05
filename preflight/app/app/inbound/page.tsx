"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import PageGuide from "@/components/shared/PageGuide";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function InboundPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">📣 Contenuti</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Piano editoriale personalizzato per attirare i tuoi clienti ideali.</p>
      </div>

      <PageGuide
        what="pianifichi e crei contenuti che aprono conversazioni con i tuoi clienti ideali."
        paste="scegli il tema dal piano sotto e clicca 'Genera post'."
        get="piano di 14 giorni con temi, hook e CTA pronti da usare."
        next="scrivi il post, pubblicalo e monitora i commenti."
      />

      {!profile.plan && (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold">Piano non ancora generato</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">Completa il setup per avere un piano personalizzato</p>
          <Link href="/app/onboarding" className="btn-primary mt-4 px-5 py-2.5 inline-flex">
            ⚙️ Vai al setup →
          </Link>
        </div>
      )}

      {profile.plan?.content_plan && profile.plan.content_plan.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">📅 Piano contenuti</h2>
          {profile.plan.content_plan.map((item, idx) => (
            <div key={`${item.week}-${idx}`} className="card-premium p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">Settimana {item.week}</span>
                    <span className="badge badge-primary">{item.post_type}</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base">{item.topic}</h3>
                  <p className="text-sm text-[var(--color-muted)] mt-1">🎣 Hook: {item.hook}</p>
                  <p className="text-sm text-[var(--color-muted)]">📢 CTA: {item.cta}</p>
                </div>
                <Link
                  href={`/app/post?draft_post=${encodeURIComponent(`${item.hook}\n\n${item.topic}`)}&objective=inbound&dm_keyword=${encodeURIComponent(item.cta)}`}
                  className="btn-primary px-4 py-2 text-sm flex-shrink-0"
                >
                  ✍️ Genera post
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {profile.plan?.plan_14_days && profile.plan.plan_14_days.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">🗓️ Piano azioni 14 giorni</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {profile.plan.plan_14_days.map((day) => (
              <div key={day.day} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
                <div className="font-bold text-sm mb-2">Giorno {day.day}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2"><span className="text-[var(--color-muted)]">📣 Contenuti:</span> <span>{day.inbound}</span></div>
                  <div className="flex gap-2"><span className="text-[var(--color-muted)]">💬 Conversazioni:</span> <span>{day.outbound}</span></div>
                  <div className="flex gap-2"><span className="text-[var(--color-muted)]">🔁 Follow-up:</span> <span>{day.followup}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

