"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { IconClipboard, IconTarget, IconLogoPreflight, IconRefresh } from "@/components/shared/icons";
import { isAdminEmail } from "@/lib/admin";

export default function InboundPage() {
  const { userId, status, session } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);

  if (status === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  const profile = repo.profile.getProfile(userId);
  const isAdmin = isAdminEmail(session?.user?.email);

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
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-success,#22c55e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><polyline points="20 6 9 17 4 12"/></svg>Cosa fai:</span> crei contenuti che attraggono clienti</div>
          <div><span className="font-semibold"><IconClipboard size={13} className="guide-icon-inline" />Cosa usare:</span> i temi e gli hook del tuo piano commerciale</div>
          <div><span className="font-semibold"><IconTarget size={13} className="guide-icon-inline" />Cosa ottieni:</span> idee pronte e passaggio diretto a &quot;Scrivi un post&quot;</div>
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Prossima mossa:</span> genera e pubblica un post</div>
        </div>
      </div>

      {!profile.plan && !isAdmin && (
        <div
          className="pipe-empty"
        >
          <p className="text-3xl mb-3"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></p>
          <p className="pipe-empty-title">Nessun piano disponibile</p>
          <p className="pipe-empty-text">
            Completa l&apos;onboarding per generare il tuo piano contenuti.
          </p>
        </div>
      )}

      {/* Content plan cards */}
      {profile.plan?.content_plan && (
        <div>
          <h3 className="inbound-section-label">
            Piano contenuti
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {profile.plan.content_plan.map((item, idx) => (
              <div
                key={`${item.week}-${idx}`}
                className="inbound-card space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="badge badge-blue">Settimana {item.week}</span>
                  <span className="badge inbound-badge-type">
                    {item.post_type}
                  </span>
                </div>
                <h4 className="font-semibold">{item.topic}</h4>
                <div className="space-y-1 text-sm inbound-label-muted">
                  <p><span className="inbound-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><path d="M15.5 5.5C17 4 19.5 4 21 5.5s1.5 4 0 5.5L12 20l-9-9c-1.5-1.5-1.5-4 0-5.5s4-1.5 5.5 0"/><path d="M8 12.5l2 2 4-4"/></svg>Hook:</span> {item.hook}</p>
                  <p><span className="inbound-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>CTA:</span> {item.cta}</p>
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
          <h3 className="inbound-section-label">
            Checklist 14 giorni
          </h3>
          <div className="grid gap-2 md:grid-cols-2">
            {profile.plan.plan_14_days.map((day) => (
              <div
                key={day.day}
                className="inbound-card space-y-1.5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inbound-day-num"
                  >
                    {day.day}
                  </span>
                  <span className="font-semibold text-sm">Giorno {day.day}</span>
                </div>
                <div className="text-sm space-y-1 inbound-label-muted">
                  <div><span className="inbound-meta-label"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="guide-icon-inline"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Contenuti:</span> {day.inbound}</div>
                  <div><span className="inbound-meta-label"><IconLogoPreflight size={12} className="guide-icon-inline" />Conversazioni:</span> {day.outbound}</div>
                  <div><span className="inbound-meta-label"><IconRefresh size={12} className="guide-icon-inline" />Follow-up:</span> {day.followup}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
