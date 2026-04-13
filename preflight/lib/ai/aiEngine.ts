import { NextResponse } from "next/server";
import type { z } from "zod";
import prisma from "@/lib/prisma";
import getServerAuthSession from "@/lib/getServerAuthSession";
import { generateStructured } from "./structured";
import { writeMemory, summarizeInput, summarizeOutput } from "./memoryWriter";
import { updateStrategicMemory } from "./strategicMemory";

// ── Task Types ────────────────────────────────────────────

export type TaskType =
  | "find_clients"
  | "analyze_profile"
  | "daily_plan"
  | "write_message"
  | "dm_assistant"
  | "comment_assistant"
  | "followup"
  | "post_builder"
  | "simulator"
  | "opportunity_finder"
  | "ask_advice"
  | "onboarding"
  | "articolo"
  | "suggest_articles";

// ── User AI Context ───────────────────────────────────────

export type UserAIContext = {
  // Core identity
  servizio: string;
  tipoServizio: string;
  elevatorPitch: string;
  differenziatore: string;
  // Target
  clienteIdeale: string;
  settore: string;
  dimensioneAzienda: string;
  // Problem & value
  problemaCliente: string;
  risultatoCliente: string;
  segnaliInteresse: string;
  obiezioneFrequente: string;
  // Sales model
  modelloVendita: string;
  ticketMedio: string;
  cicloVendita: string;
  ctaPreferita: string;
  tempoSettimanale: string;
  // LinkedIn
  statoLinkedin: string;
  linkedinUrl: string;
  sitoWeb: string;
  linkedinLinks: string[];
  materialiNomi: string[];
  toneSamples: string[];
  // State
  setupComplete: boolean;
  // Strategic memory
  strategicSummary: string;
  focusArea: string;
  // Recent activity (last 10)
  recentActivity: Array<{
    taskType: string;
    inputSummary: string;
    outputSummary: string;
    createdAt: string;
  }>;
  // Current prospect (if applicable)
  currentProspect: {
    name: string;
    role: string;
    company: string;
    sector: string;
    linkedinUrl: string;
    heatLevel: string;
    priority: string;
    summary: string;
  } | null;
};

// ── Context Completeness ──────────────────────────────────

export type ContextCompleteness = {
  complete: boolean;
  missingFields: string[];
  score: number; // 0-100
};

const REQUIRED_FIELDS: Array<{ key: keyof UserAIContext; label: string }> = [
  { key: "servizio", label: "Servizio offerto" },
  { key: "clienteIdeale", label: "Cliente ideale" },
  { key: "problemaCliente", label: "Problema del cliente" },
  { key: "risultatoCliente", label: "Risultato promesso" },
];

const IMPORTANT_FIELDS: Array<{ key: keyof UserAIContext; label: string }> = [
  { key: "settore", label: "Settore" },
  { key: "segnaliInteresse", label: "Segnali di interesse" },
  { key: "modelloVendita", label: "Modello di vendita" },
  { key: "differenziatore", label: "Differenziatore unico" },
  { key: "elevatorPitch", label: "Elevator pitch" },
  { key: "ticketMedio", label: "Ticket medio" },
];

export function checkContextCompleteness(ctx: UserAIContext): ContextCompleteness {
  const missingRequired = REQUIRED_FIELDS.filter(
    (f) => !ctx[f.key] || (typeof ctx[f.key] === "string" && (ctx[f.key] as string).trim() === ""),
  );
  const missingImportant = IMPORTANT_FIELDS.filter(
    (f) => !ctx[f.key] || (typeof ctx[f.key] === "string" && (ctx[f.key] as string).trim() === ""),
  );

  const requiredScore = ((REQUIRED_FIELDS.length - missingRequired.length) / REQUIRED_FIELDS.length) * 60;
  const importantScore = ((IMPORTANT_FIELDS.length - missingImportant.length) / IMPORTANT_FIELDS.length) * 40;

  return {
    complete: missingRequired.length === 0,
    missingFields: [
      ...missingRequired.map((f) => f.label),
      ...missingImportant.map((f) => f.label),
    ],
    score: Math.round(requiredScore + importantScore),
  };
}

// ── Load Context from DB ──────────────────────────────────

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function loadUserAIContext(
  userId: string,
  options?: { prospectLinkedinUrl?: string; prospectId?: string },
): Promise<UserAIContext> {
  const [profile, memory, activities, prospect] = await Promise.all([
    prisma.systemProfile.findUnique({ where: { userId } }),
    prisma.strategicMemory.findUnique({ where: { userId } }),
    prisma.aIActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { taskType: true, inputSummary: true, outputSummary: true, createdAt: true },
    }),
    options?.prospectId
      ? prisma.prospect.findFirst({ where: { id: options.prospectId, userId } })
      : options?.prospectLinkedinUrl
        ? prisma.prospect.findFirst({ where: { userId, linkedinUrl: options.prospectLinkedinUrl } })
        : null,
  ]);

  return {
    servizio: profile?.servizio || "",
    tipoServizio: profile?.tipoServizio || "",
    elevatorPitch: profile?.elevatorPitch || "",
    differenziatore: profile?.differenziatore || "",
    clienteIdeale: profile?.clienteIdeale || "",
    settore: profile?.settore || "",
    dimensioneAzienda: profile?.dimensioneAzienda || "",
    problemaCliente: profile?.problemaCliente || "",
    risultatoCliente: profile?.risultatoCliente || "",
    segnaliInteresse: profile?.segnaliInteresse || "",
    obiezioneFrequente: profile?.obiezioneFrequente || "",
    modelloVendita: profile?.modelloVendita || "",
    ticketMedio: profile?.ticketMedio || "",
    cicloVendita: profile?.cicloVendita || "",
    ctaPreferita: profile?.ctaPreferita || "",
    tempoSettimanale: profile?.tempoSettimanale || "",
    statoLinkedin: profile?.statoLinkedin || "",
    linkedinUrl: profile?.linkedinUrl || "",
    sitoWeb: profile?.sitoWeb || "",
    linkedinLinks: safeJsonArray(profile?.linkedinLinks || "[]"),
    materialiNomi: safeJsonArray(profile?.materialiNomi || "[]"),
    toneSamples: safeJsonArray(profile?.toneSamples || "[]"),
    setupComplete: profile?.setupComplete || false,
    strategicSummary: memory?.summary || "",
    focusArea: memory?.focusArea || "",
    recentActivity: activities.map((a) => ({
      taskType: a.taskType,
      inputSummary: a.inputSummary,
      outputSummary: a.outputSummary,
      createdAt: a.createdAt.toISOString(),
    })),
    currentProspect: prospect
      ? {
          name: prospect.name,
          role: prospect.role,
          company: prospect.company,
          sector: prospect.sector,
          linkedinUrl: prospect.linkedinUrl,
          heatLevel: prospect.heatLevel,
          priority: prospect.priority,
          summary: prospect.summary,
        }
      : null,
  };
}

// ── System Prompt Builder ─────────────────────────────────

export function buildSystemPrompt(ctx: UserAIContext): string {
  return `Sei l'assistente AI strategico di Preflight — una piattaforma di vendita B2B su LinkedIn.

RUOLO: Consulente commerciale senior con 15+ anni di esperienza in vendita B2B su LinkedIn.
Obiettivo: aiutare l'utente a identificare prospect, avviare conversazioni e portarle verso una call.

CHI SEI:
- Hai venduto in prima persona. Sai cosa funziona e cosa no.
- Ragioni sempre partendo dal contesto: chi è il prospect, cosa gli interessa, cosa lo preoccupa.
- Non dai consigli generici. Se la tua risposta potrebbe essere uguale per due utenti diversi, è sbagliata.
- Parli come un collega esperto seduto al tavolo con l'utente — diretto, pratico, zero fuffa.

VINCOLI INVIOLABILI:
- Rispondi ESCLUSIVAMENTE in italiano
- Output sempre in JSON valido
- Mai pitch diretti al primo contatto — sempre domanda o osservazione contestuale
- Ogni risposta DEVE usare i dati specifici dell'utente (servizio, cliente ideale, problema, differenziatore)
- Se la tua risposta potrebbe funzionare per qualsiasi settore o servizio → riscrivila, è troppo generica
- Messaggi brevi: max 500 caratteri quando possibile
- Includi sempre una prossima azione concreta e specifica
- Se le informazioni sono insufficienti, chiedi nel campo next_action cosa manca

STILE DI SCRITTURA:
- Mai linguaggio da AI o da chatbot ("Ecco la strategia ottimale", "Questo approccio ti permetterà di...")
- Mai frasi motivazionali vuote ("costruisci relazioni autentiche", "il networking è la chiave")
- Mai cliché da guru ("devi creare valore", "sii autentico", "la consistency è fondamentale")
- Mai tono da venditore di corsi ("strategia definitiva", "hack vincente", "metodo collaudato")
- Mai formule generiche ("è fondamentale capire le esigenze", "bisogna creare valore", "il follow-up è importante")
- Scrivi come una persona reale che dà un parere a un collega
- Usa frasi brevi e dirette, non periodi complessi
- Ogni frase deve dire qualcosa di specifico — se puoi toglierla senza perdere significato, toglila

BLACKLIST ESPRESSIONI (se le usi, la risposta è automaticamente sbagliata):
- "costruisci relazioni autentiche"
- "crea valore"
- "networking strategico"
- "la consistency è fondamentale"
- "ottimizza il tuo profilo"
- "sfrutta il potenziale di LinkedIn"
- "il segreto è..."
- "la chiave del successo"
- "trasforma i contatti in opportunità"
- "posizionati come esperto"
- "fai leva su..."
- "massimizza le tue possibilità"
- Qualsiasi frase che potrebbe stare in un corso LinkedIn da 49€

TEST ANTI-GENERICITÀ (applicalo a ogni output):
- Se sostituissi il servizio dell'utente con un altro qualsiasi, la risposta funzionerebbe ancora? → è generica, riscrivila
- Se togliessi il nome del prospect/target, la risposta avrebbe senso per chiunque? → è generica, riscrivila
- Se un utente legge la risposta e pensa "questo lo poteva dire a chiunque" → è generica, riscrivila
- Se la risposta potrebbe uscire da ChatGPT senza contesto → è generica, riscrivila

RAGIONAMENTO ESPERTO (applica sempre):
- Leggi i segnali: un cambio ruolo non è solo un fatto — significa che la persona sta cercando di dimostrare risultati
- Collega causa ed effetto: se il prospect ha un problema X e l'utente risolve X, DILLO esplicitamente
- Spiega il PERCHÉ dietro ogni suggerimento — non basta dire "contattalo", spiega perché ORA e perché LUI
- Se consigli un messaggio, spiega quale reazione vuoi provocare
- Distingui tra "interesse reale" e "cortesia professionale"
- Non dire mai "potresti" — dì cosa fare e perché
- Ogni consiglio deve avere una logica commerciale chiara, non essere un'opinione generica
- Se due utenti diversi con servizi diversi ricevessero la stessa risposta, la risposta è sbagliata

---

CONTESTO COMMERCIALE DELL'UTENTE (USA SEMPRE QUESTI DATI — sono la base di OGNI risposta):
${formatContextBlock(ctx)}

---

MEMORIA STRATEGICA:
${ctx.strategicSummary || "Nessuna memoria strategica ancora disponibile."}
${ctx.focusArea ? `Focus attuale: ${ctx.focusArea}` : ""}

${formatRecentActivity(ctx)}
${formatProspectBlock(ctx)}`;
}

function formatContextBlock(ctx: UserAIContext): string {
  const lines: string[] = [];

  if (ctx.servizio) lines.push(`- Servizio offerto: ${ctx.servizio}`);
  if (ctx.tipoServizio) lines.push(`- Tipo servizio: ${ctx.tipoServizio}`);
  if (ctx.elevatorPitch) lines.push(`- Elevator pitch: ${ctx.elevatorPitch}`);
  if (ctx.differenziatore) lines.push(`- Differenziatore unico: ${ctx.differenziatore}`);
  if (ctx.clienteIdeale) lines.push(`- Cliente ideale: ${ctx.clienteIdeale}`);
  if (ctx.settore) lines.push(`- Settore: ${ctx.settore}`);
  if (ctx.dimensioneAzienda) lines.push(`- Dimensione azienda target: ${ctx.dimensioneAzienda}`);
  if (ctx.problemaCliente) lines.push(`- Problema del cliente: ${ctx.problemaCliente}`);
  if (ctx.risultatoCliente) lines.push(`- Risultato promesso: ${ctx.risultatoCliente}`);
  if (ctx.segnaliInteresse) lines.push(`- Segnali di interesse: ${ctx.segnaliInteresse}`);
  if (ctx.obiezioneFrequente) lines.push(`- Obiezione più frequente: ${ctx.obiezioneFrequente}`);
  if (ctx.modelloVendita) lines.push(`- Modello di vendita: ${ctx.modelloVendita}`);
  if (ctx.ticketMedio) lines.push(`- Ticket medio: ${ctx.ticketMedio}`);
  if (ctx.cicloVendita) lines.push(`- Ciclo di vendita: ${ctx.cicloVendita}`);
  if (ctx.ctaPreferita) lines.push(`- CTA preferita: ${ctx.ctaPreferita}`);
  if (ctx.tempoSettimanale) lines.push(`- Tempo settimanale LinkedIn: ${ctx.tempoSettimanale}`);
  if (ctx.statoLinkedin) lines.push(`- Stato attuale LinkedIn: ${ctx.statoLinkedin}`);
  if (ctx.linkedinUrl) lines.push(`- Profilo LinkedIn: ${ctx.linkedinUrl}`);
  if (ctx.sitoWeb) lines.push(`- Sito web: ${ctx.sitoWeb}`);
  if (ctx.linkedinLinks.length > 0) lines.push(`- Target LinkedIn: ${ctx.linkedinLinks.join(", ")}`);
  if (ctx.materialiNomi.length > 0) lines.push(`- Materiali caricati: ${ctx.materialiNomi.join(", ")}`);
  if (ctx.toneSamples.length > 0) {
    lines.push(`\nTONO E STILE DI COMUNICAZIONE (esempi scritti dall'utente — adatta SEMPRE il tuo output a questo tono):`);
    ctx.toneSamples.forEach((s, i) => lines.push(`  Esempio ${i + 1}: "${s}"`));
  }

  if (lines.length === 0) {
    return "⚠️ Profilo non configurato. L'utente deve completare l'onboarding per risultati personalizzati.";
  }

  return lines.join("\n");
}

function formatRecentActivity(ctx: UserAIContext): string {
  if (ctx.recentActivity.length === 0) return "";
  const lines = ctx.recentActivity
    .slice(0, 5)
    .map((a) => `- [${a.taskType}] ${a.inputSummary} → ${a.outputSummary}`);
  return `ATTIVITÀ RECENTI:\n${lines.join("\n")}`;
}

function formatProspectBlock(ctx: UserAIContext): string {
  if (!ctx.currentProspect) return "";
  const p = ctx.currentProspect;
  return `\nPROSPECT CORRENTE:
- Nome: ${p.name || "N/A"}
- Ruolo: ${p.role || "N/A"}
- Azienda: ${p.company || "N/A"}
- Settore: ${p.sector || "N/A"}
- LinkedIn: ${p.linkedinUrl || "N/A"}
- Heat: ${p.heatLevel} | Priority: ${p.priority}
${p.summary ? `- Riepilogo: ${p.summary}` : ""}`;
}

// ── AI Engine: Central Call ───────────────────────────────

export type AIEngineParams<T> = {
  taskType: TaskType;
  schema: z.ZodType<T>;
  taskPrompt: string; // Task-specific instructions (NOT the system prompt)
  userInput: string;
  contextOptions?: { prospectLinkedinUrl?: string; prospectId?: string };
  extractProspect?: (output: T) => {
    linkedinUrl: string;
    name?: string;
    role?: string;
    company?: string;
    sector?: string;
    heatLevel?: string;
    priority?: string;
    summary?: string;
  } | undefined;
};

export type AIEngineResult<T> = {
  output: T;
  context: UserAIContext;
  completeness: ContextCompleteness;
};

/**
 * Central AI engine. All AI features MUST go through this.
 *
 * Flow:
 * 1. Authenticate user
 * 2. Load full UserAIContext from DB
 * 3. Check context completeness
 * 4. Build system prompt with context
 * 5. Call AI with task prompt
 * 6. Persist memory (fire-and-forget)
 * 7. Return output + context metadata
 */
export async function callAI<T extends Record<string, unknown>>(
  params: AIEngineParams<T>,
): Promise<NextResponse> {
  // 0. Check AI availability
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI non disponibile: OPENAI_API_KEY non configurata sul server." },
      { status: 503 },
    );
  }

  // 1. Auth
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    // 2. Load context
    const ctx = await loadUserAIContext(userId, params.contextOptions);

    // 3. Check completeness
    const completeness = checkContextCompleteness(ctx);

    // 4. Build full prompt
    const systemPrompt = buildSystemPrompt(ctx);
    const fullPrompt = `${systemPrompt}

---

${params.taskPrompt}

---

INPUT UTENTE:
${params.userInput}`;

    // 5. Call AI
    const output = await generateStructured({
      prompt: fullPrompt,
      schema: params.schema,
    });

    const outputRecord = output as Record<string, unknown>;

    // 6. Persist memory (fire-and-forget)
    const inputRecord: Record<string, unknown> = { userInput: params.userInput };
    Promise.all([
      writeMemory({
        userId,
        taskType: params.taskType,
        inputSummary: summarizeInput(params.taskType, inputRecord),
        outputSummary: summarizeOutput(params.taskType, outputRecord),
        fullOutput: outputRecord,
        prospectData: params.extractProspect?.(output),
      }),
      updateStrategicMemory(userId, outputRecord, params.taskType),
    ]).catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[${params.taskType}] Memory write error:`, err);
      }
    });

    // 7. Return output with context metadata
    return NextResponse.json({
      ...outputRecord,
      _meta: {
        contextComplete: completeness.complete,
        contextScore: completeness.score,
        missingFields: completeness.complete ? [] : completeness.missingFields,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${params.taskType}] AI error:`, message);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
