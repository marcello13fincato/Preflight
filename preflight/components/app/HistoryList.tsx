"use client";

import { useMemo } from "react";
import type { InteractionType } from "@/lib/sales/schemas";
import { getRepositoryBundle } from "@/lib/sales/repositories";

export default function HistoryList({ userId, type }: { userId: string; type?: InteractionType }) {
  const repo = useMemo(() => getRepositoryBundle(), []);
  const records = repo.interaction.listInteractions(userId, type).slice(0, 5);

  if (!records.length) {
    return <p className="text-sm text-muted">Nessuna interazione salvata.</p>;
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div key={record.id} className="rounded-lg border border-app p-3">
          <div className="text-xs text-muted">{record.type} · {new Date(record.createdAt).toLocaleString()}</div>
          <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(record.outputJson, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
