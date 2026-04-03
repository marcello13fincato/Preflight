"use client";

import { useState, useEffect, useCallback } from "react";

export type AIContextData = {
  servizio: string;
  tipoServizio: string;
  clienteIdeale: string;
  settore: string;
  problemaCliente: string;
  risultatoCliente: string;
  segnaliInteresse: string;
  differenziatore: string;
  elevatorPitch: string;
  modelloVendita: string;
  ticketMedio: string;
  statoLinkedin: string;
  linkedinUrl: string;
  sitoWeb: string;
  toneSamples: string[];
  setupComplete: boolean;
};

export type AIContextCompleteness = {
  complete: boolean;
  score: number;
  missingFields: string[];
};

export type UseAIContextReturn = {
  context: AIContextData | null;
  completeness: AIContextCompleteness | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

/**
 * Client-side hook to load the user's AI context from /api/ai/context.
 * Provides context data, completeness info, and a refresh function.
 * All tool pages should use this to inject context into AI calls.
 */
export function useAIContext(): UseAIContextReturn {
  const [context, setContext] = useState<AIContextData | null>(null);
  const [completeness, setCompleteness] = useState<AIContextCompleteness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContext = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/context");
      if (!res.ok) throw new Error(`Errore ${res.status}`);
      const data = await res.json();
      setContext(data.context || null);
      if (data.completeness) {
        setCompleteness({
          complete: data.completeness.complete,
          score: data.completeness.score,
          missingFields: data.completeness.missingFields || [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore caricamento contesto");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  return { context, completeness, loading, error, refresh: fetchContext };
}
