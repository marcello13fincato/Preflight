"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { IconClipboard, IconTarget, IconMessageCircle, IconRefresh } from "@/components/shared/icons";

export default function InboundPage() {
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);
  const profile = repo.profile.getProfile(userId);

  return (
    <div className="tool-page">
      <div className="tool-page-hero">
        <h2>Contenuti</h2>
        <p>
          Crea contenuti strategici che aprono conversazioni con clienti ideali.
        </p>
      </div>

      {/* Guide box */}
      <div className="tool-page-guide">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-success,#22c55e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><polyline points="20 6 9 17 4 12"/></svg>Cosa fai:</span> crei contenuti che attraggono clienti</div>
          <div><span className="font-semibold"><IconClipboard size={13} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Cosa usare:</span> i temi e gli hook del tuo piano commerciale</div>
          <div><span className="font-semibold"><IconTarget size={13} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Cosa ottieni:</span> idee pronte e passaggio diretto a &quot;Scrivi un post&quot;</div>
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg>Prossima mossa:</span> genera e pubblica un post</div>
        </div>
      </div>

      {!profile.plan && (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: "var(--color-soft-2)", border: "1.5px dashed var(--color-border)" }}
        >
          <p className="text-3xl mb-3"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></p>
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
                  <p><span className="font-medium" style={{ color: "var(--color-text)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><path d="M15.5 5.5C17 4 19.5 4 21 5.5s1.5 4 0 5.5L12 20l-9-9c-1.5-1.5-1.5-4 0-5.5s4-1.5 5.5 0"/><path d="M8 12.5l2 2 4-4"/></svg>Hook:</span> {item.hook}</p>
                  <p><span className="font-medium" style={{ color: "var(--color-text)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>CTA:</span> {item.cta}</p>
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
                  <div><span className="font-medium" style={{ color: "var(--color-text)" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Contenuti:</span> {day.inbound}</div>
                  <div><span className="font-medium" style={{ color: "var(--color-text)" }}><IconMessageCircle size={12} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Conversazioni:</span> {day.outbound}</div>
                  <div><span className="font-medium" style={{ color: "var(--color-text)" }}><IconRefresh size={12} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Follow-up:</span> {day.followup}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
