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
      <div>
        <h2 className="text-2xl font-bold">Contenuti</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          Crea contenuti strategici che aprono conversazioni con clienti ideali.
        </p>
      </div>

      {/* Guide box */}
      <div className="callout">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold">✅ Cosa fai:</span> crei contenuti che attraggono clienti</div>
          <div><span className="font-semibold">📋 Cosa usare:</span> i temi e gli hook del tuo piano commerciale</div>
          <div><span className="font-semibold">🎯 Cosa ottieni:</span> idee pronte e passaggio diretto a &quot;Scrivi un post&quot;</div>
          <div><span className="font-semibold">➡️ Prossima mossa:</span> genera e pubblica un post</div>
        </div>
      </div>

      {!profile.plan && (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: "var(--color-soft-2)", border: "1.5px dashed var(--color-border)" }}
        >
          <p className="text-3xl mb-3">📝</p>
          <p className="font-semibold" style={{ color: "var(--color-primary)" }}>Nessun piano disponibile</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            Completa l&apos;onboarding per generare il tuo piano contenuti.
          </p>
        </div>
      )}

      {/* Content plan cards */}
      {profile.plan?.content_plan && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide mb-3" style={{ color: "var(--color-muted)" }}>
            Piano contenuti
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {profile.plan.content_plan.map((item, idx) => (
              <div
                key={`${item.week}-${idx}`}
                className="rounded-xl p-5 space-y-3"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="badge badge-blue">Settimana {item.week}</span>
                  <span className="badge" style={{ background: "var(--color-soft-2)", color: "var(--color-muted)" }}>
                    {item.post_type}
                  </span>
                </div>
                <h4 className="font-semibold">{item.topic}</h4>
                <div className="space-y-1 text-sm" style={{ color: "var(--color-muted)" }}>
                  <p><span className="font-medium" style={{ color: "var(--color-text)" }}>🪝 Hook:</span> {item.hook}</p>
                  <p><span className="font-medium" style={{ color: "var(--color-text)" }}>📣 CTA:</span> {item.cta}</p>
                </div>
                <Link
                  href={`/app/post?draft_post=${encodeURIComponent(`${item.hook}\n\n${item.topic}`)}&objective=inbound&dm_keyword=${encodeURIComponent(item.cta)}`}
                  className="btn-primary inline-block text-sm"
                >
                  Genera post →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14-day checklist */}
      {profile.plan?.plan_14_days && (
        <div>
          <h3 className="font-semibold text-sm uppercase tracking-wide mb-3" style={{ color: "var(--color-muted)" }}>
            Checklist 14 giorni
          </h3>
          <div className="grid gap-2 md:grid-cols-2">
            {profile.plan.plan_14_days.map((day) => (
              <div
                key={day.day}
                className="rounded-xl p-4 space-y-1.5"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "var(--color-primary)", color: "white" }}
                  >
                    {day.day}
                  </span>
                  <span className="font-semibold text-sm">Giorno {day.day}</span>
                </div>
                <div className="text-sm space-y-1" style={{ color: "var(--color-muted)" }}>
                  <div><span className="font-medium" style={{ color: "var(--color-text)" }}>📝 Contenuti:</span> {day.inbound}</div>
                  <div><span className="font-medium" style={{ color: "var(--color-text)" }}>💬 Conversazioni:</span> {day.outbound}</div>
                  <div><span className="font-medium" style={{ color: "var(--color-text)" }}>🔄 Follow-up:</span> {day.followup}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
