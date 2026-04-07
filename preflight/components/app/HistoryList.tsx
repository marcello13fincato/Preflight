"use client";

import { useMemo } from "react";
import type { InteractionType } from "@/lib/sales/schemas";
import { getRepositoryBundle } from "@/lib/sales/repositories";

const TYPE_META: Record<string, { icon: string; label: string }> = {
  prospect: { icon: "👤", label: "Analisi profilo" },
  dm: { icon: "💬", label: "Messaggio DM" },
  consiglio: { icon: "💡", label: "Consiglio" },
  post: { icon: "✏️", label: "Post" },
  articolo: { icon: "📄", label: "Articolo" },
  "find-clients": { icon: "🔍", label: "Ricerca clienti" },
};

export default function HistoryList({ userId, type }: { userId: string; type?: InteractionType }) {
  const repo = useMemo(() => getRepositoryBundle(), []);
  const records = repo.interaction.listInteractions(userId, type).slice(0, 5);

  if (!records || records.length === 0) {
    return (
      <div className="history-empty">
        <p className="history-empty-text">Nessuna interazione salvata.</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      {records.map((record, idx) => {
        const meta = TYPE_META[record.type] || { icon: "📋", label: record.type };
        return (
          <details
            key={record.id}
            className={`history-item fade-in${idx > 0 ? " fade-in-delay" : ""}`}
          >
            <summary className="history-summary">
              <span className="history-icon">{meta.icon}</span>
              <span className="history-label">{meta.label}</span>
              <span className="history-date">
                {new Date(record.createdAt).toLocaleString("it-IT", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </summary>
            <pre className="history-detail">
              {JSON.stringify(record, null, 2)}
            </pre>
          </details>
        );
      })}
    </div>
  );
}
