"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type ContextMeta = {
  contextComplete: boolean;
  contextScore: number;
  missingFields: string[];
};

/**
 * Displays a warning banner when the user's AI context is incomplete.
 * Reads _meta from the last AI response or fetches from /api/ai/context.
 */
export default function AIContextBanner() {
  const [meta, setMeta] = useState<ContextMeta | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/ai/context")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.completeness) {
          setMeta({
            contextComplete: data.completeness.complete,
            contextScore: data.completeness.score,
            missingFields: data.completeness.missingFields || [],
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!meta || meta.contextComplete || dismissed) return null;

  return (
    <div className="mx-4 mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            ⚠️ Profilo incompleto — i risultati AI saranno meno precisi
          </p>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Completa la configurazione per risultati personalizzati.
            {meta.missingFields.length > 0 && (
              <> Mancano: {meta.missingFields.slice(0, 3).join(", ")}
                {meta.missingFields.length > 3 && ` (+${meta.missingFields.length - 3})`}
              </>
            )}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-amber-200 dark:bg-amber-800">
              <div
                className="h-1.5 rounded-full bg-amber-500 transition-all"
                style={{ width: `${meta.contextScore}%` }}
              />
            </div>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
              {meta.contextScore}%
            </span>
          </div>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <Link
            href="/app/onboarding"
            className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
          >
            Configura
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-600 dark:text-amber-600 dark:hover:text-amber-400"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
