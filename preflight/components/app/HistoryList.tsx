"use client";

import { useMemo } from "react";
import type { InteractionType } from "@/lib/sales/schemas";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function HistoryList({ userId, type }: { userId: string; type?: InteractionType }) {
  const repo = useMemo(() => getRepositoryBundle(), []);
  const records = repo.interaction.listInteractions(userId, type).slice(0, 5);

  if (!records || records.length === 0) {
    return (
      <div className="oggi-empty-state" style={{ padding: "2rem 1.5rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Nessuna interazione salvata.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {records.map((record, idx) => (
        <details
          key={record.id}
          className={"fade-in" + (idx > 0 ? " fade-in-delay" : "")}
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <summary
            style={{
              padding: "0.75rem 1rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--color-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "var(--color-soft)",
                color: "var(--color-primary)",
                fontSize: "0.7rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {record.type === "prospect"
                ? "👤"
                : record.type === "dm"
                ? "💬"
                : "📋"}
            </span>
            <span style={{ flex: 1 }}>
              {record.type} · {new Date(record.createdAt).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          </summary>
          <pre
            style={{
              padding: "0.85rem 1rem",
              margin: 0,
              overflow: "auto",
              fontSize: "0.72rem",
              lineHeight: 1.5,
              background: "var(--color-surface)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {JSON.stringify(record, null, 2)}
          </pre>
        </details>
      ))}
    </div>
  );
}
