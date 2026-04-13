"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

type ContextMeta = {
  contextComplete: boolean;
  contextScore: number;
  missingFields: string[];
};

/**
 * Try to read the onboarding profile from localStorage and sync it to the DB.
 * This covers the case where the user completed onboarding on SQLite
 * but the DB was later migrated to PostgreSQL (empty).
 */
function tryLocalStorageSync(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  // Find the localStorage key for the profile (format: preflight:{userId}:profile)
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("preflight:") && k.endsWith(":profile"));
  if (keys.length === 0) return Promise.resolve(false);

  const raw = localStorage.getItem(keys[0]);
  if (!raw) return Promise.resolve(false);

  try {
    const parsed = JSON.parse(raw);
    const o = parsed?.onboarding;
    if (!o || !o.servizio) return Promise.resolve(false);

    // Map snake_case localStorage → camelCase DB fields
    const mapped: Record<string, unknown> = {};
    if (o.servizio) mapped.servizio = o.servizio;
    if (o.tipo_servizio) mapped.tipoServizio = o.tipo_servizio;
    if (o.elevator_pitch) mapped.elevatorPitch = o.elevator_pitch;
    if (o.differenziatore) mapped.differenziatore = o.differenziatore;
    if (o.cliente_ideale) mapped.clienteIdeale = o.cliente_ideale;
    if (o.settore) mapped.settore = o.settore;
    if (o.dimensione_azienda) mapped.dimensioneAzienda = o.dimensione_azienda;
    if (o.problema_cliente) mapped.problemaCliente = o.problema_cliente;
    if (o.risultato_cliente) mapped.risultatoCliente = o.risultato_cliente;
    if (o.segnali_interesse) mapped.segnaliInteresse = o.segnali_interesse;
    if (o.obiezione_frequente) mapped.obiezioneFrequente = o.obiezione_frequente;
    if (o.modello_vendita) mapped.modelloVendita = o.modello_vendita;
    if (o.ticket_medio) mapped.ticketMedio = o.ticket_medio;
    if (o.ciclo_vendita) mapped.cicloVendita = o.ciclo_vendita;
    if (o.cta_preferita) mapped.ctaPreferita = o.cta_preferita;
    if (o.tempo_settimanale) mapped.tempoSettimanale = o.tempo_settimanale;
    if (o.stato_linkedin) mapped.statoLinkedin = o.stato_linkedin;
    if (o.linkedin_url) mapped.linkedinUrl = o.linkedin_url;
    if (o.sito_web) mapped.sitoWeb = o.sito_web;
    if (o.tone_samples?.length) mapped.toneSamples = o.tone_samples;
    if (o.linkedin_search_links?.length) mapped.linkedinLinks = o.linkedin_search_links;
    if (o.materiali_nomi?.length) mapped.materialiNomi = o.materiali_nomi;

    if (Object.keys(mapped).length < 3) return Promise.resolve(false);

    return fetch("/api/ai/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapped),
    }).then((r) => r.ok);
  } catch {
    return Promise.resolve(false);
  }
}

/**
 * Displays a warning banner when the user's AI context is incomplete.
 * Also auto-syncs the profile from localStorage → DB if needed.
 */
export default function AIContextBanner() {
  const [meta, setMeta] = useState<ContextMeta | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const syncAttempted = useRef(false);

  useEffect(() => {
    fetch("/api/ai/context")
      .then((r) => r.ok ? r.json() : null)
      .then(async (data) => {
        if (!data?.completeness) return;

        const isComplete = data.completeness.complete;
        const hasServizio = data.context?.servizio && data.context?.setupComplete;

        // If DB profile is empty/incomplete, try syncing from localStorage
        if (!hasServizio && !syncAttempted.current) {
          syncAttempted.current = true;
          const synced = await tryLocalStorageSync();
          if (synced) {
            // Re-fetch context after sync
            const r2 = await fetch("/api/ai/context");
            const d2 = await r2.json();
            if (d2?.completeness) {
              setMeta({
                contextComplete: d2.completeness.complete,
                contextScore: d2.completeness.score,
                missingFields: d2.completeness.missingFields || [],
              });
              return;
            }
          }
        }

        setMeta({
          contextComplete: isComplete,
          contextScore: data.completeness.score,
          missingFields: data.completeness.missingFields || [],
        });
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
