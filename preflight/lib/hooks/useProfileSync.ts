"use client";

import { useEffect, useRef } from "react";
import type { OnboardingInput } from "@/lib/sales/schemas";

/**
 * Maps OnboardingInput (snake_case localStorage format) → SystemProfile DB fields.
 * Only includes fields that have a non-empty value.
 */
function mapOnboardingToContext(o: OnboardingInput): Record<string, unknown> {
  const m: Record<string, unknown> = {};
  if (o.servizio) m.servizio = o.servizio;
  if (o.tipo_servizio) m.tipoServizio = o.tipo_servizio;
  if (o.elevator_pitch) m.elevatorPitch = o.elevator_pitch;
  if (o.differenziatore) m.differenziatore = o.differenziatore;
  if (o.cliente_ideale) m.clienteIdeale = o.cliente_ideale;
  if (o.settore) m.settore = o.settore;
  if (o.dimensione_azienda) m.dimensioneAzienda = o.dimensione_azienda;
  if (o.problema_cliente) m.problemaCliente = o.problema_cliente;
  if (o.risultato_cliente) m.risultatoCliente = o.risultato_cliente;
  if (o.segnali_interesse) m.segnaliInteresse = o.segnali_interesse;
  if (o.obiezione_frequente) m.obiezioneFrequente = o.obiezione_frequente;
  if (o.modello_vendita) m.modelloVendita = o.modello_vendita;
  if (o.ticket_medio) m.ticketMedio = o.ticket_medio;
  if (o.ciclo_vendita) m.cicloVendita = o.ciclo_vendita;
  if (o.cta_preferita) m.ctaPreferita = o.cta_preferita;
  if (o.tempo_settimanale) m.tempoSettimanale = o.tempo_settimanale;
  if (o.stato_linkedin) m.statoLinkedin = o.stato_linkedin;
  if (o.linkedin_url) m.linkedinUrl = o.linkedin_url;
  if (o.sito_web) m.sitoWeb = o.sito_web;
  if (o.tone_samples && o.tone_samples.length > 0) m.toneSamples = o.tone_samples;
  if (o.linkedin_search_links && o.linkedin_search_links.length > 0) m.linkedinLinks = o.linkedin_search_links;
  if (o.materiali_nomi && o.materiali_nomi.length > 0) m.materialiNomi = o.materiali_nomi;
  return m;
}

/**
 * Auto-syncs the user's onboarding profile from localStorage to the database.
 *
 * This covers the case where the user completed onboarding when the app used
 * SQLite locally, but the DB was later migrated to PostgreSQL (empty).
 * It fires once per session and only writes if the DB profile is incomplete.
 */
export function useProfileSync(
  userId: string | undefined,
  onboardingData: OnboardingInput | null | undefined,
) {
  const synced = useRef(false);

  useEffect(() => {
    if (!userId || !onboardingData || synced.current) return;
    synced.current = true;

    // Check if the DB profile is already populated
    fetch("/api/ai/context")
      .then((r) => r.json())
      .then((data) => {
        const ctx = data?.context;
        // If DB already has the core fields filled, skip sync
        if (ctx?.servizio && ctx?.clienteIdeale && ctx?.problemaCliente && ctx?.setupComplete) {
          return;
        }

        // DB is empty or incomplete — push localStorage data
        const mapped = mapOnboardingToContext(onboardingData);
        if (Object.keys(mapped).length === 0) return;

        return fetch("/api/ai/context", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mapped),
        });
      })
      .catch((err) => {
        console.error("[useProfileSync] Sync failed:", err);
      });
  }, [userId, onboardingData]);
}
