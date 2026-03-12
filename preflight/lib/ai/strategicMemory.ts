import prisma from "@/lib/prisma";

const MAX_PATTERNS = 20;

/**
 * Updates long-term strategic memory based on accumulated AI interactions.
 * Extracts high-level patterns — never stores full conversations.
 *
 * Called after each AI response to keep the strategic picture current.
 */
export async function updateStrategicMemory(
  userId: string,
  aiResponse: Record<string, unknown>,
  taskType: string,
): Promise<void> {
  const existing = await prisma.strategicMemory.findUnique({
    where: { userId },
  });

  const currentPatterns: string[] = existing
    ? safeJsonArray(existing.patterns)
    : [];

  // Extract new pattern from the AI response
  const newPattern = extractPattern(taskType, aiResponse);
  if (newPattern) {
    currentPatterns.push(newPattern);
  }

  // Keep only the most recent patterns to control size
  const trimmedPatterns = currentPatterns.slice(-MAX_PATTERNS);

  // Derive a high-level summary from patterns
  const summary = deriveSummary(trimmedPatterns);

  // Derive current focus area from recent patterns
  const focusArea = deriveFocusArea(trimmedPatterns.slice(-5));

  await prisma.strategicMemory.upsert({
    where: { userId },
    create: {
      userId,
      summary,
      patterns: JSON.stringify(trimmedPatterns),
      focusArea,
    },
    update: {
      summary,
      patterns: JSON.stringify(trimmedPatterns),
      focusArea,
    },
  });
}

/**
 * Extracts a single-line pattern from the AI response based on task type.
 */
function extractPattern(
  taskType: string,
  response: Record<string, unknown>,
): string | null {
  const timestamp = new Date().toISOString().slice(0, 10);

  switch (taskType) {
    case "analyze_profile": {
      const role = response.ruolo_contesto || response.chi_e;
      const heat = response.client_heat_level || "N/A";
      if (role) {
        return `[${timestamp}] Analizzato: ${String(role).slice(0, 80)} (${heat})`;
      }
      return null;
    }
    case "find_clients": {
      const tipo = response.profilo_ideale;
      if (tipo) {
        return `[${timestamp}] Ricerca clienti: ${String(tipo).slice(0, 80)}`;
      }
      return null;
    }
    case "ask_advice": {
      const situazione = response.lettura_situazione;
      if (situazione) {
        return `[${timestamp}] Consiglio: ${String(situazione).slice(0, 80)}`;
      }
      return null;
    }
    default:
      return `[${timestamp}] ${taskType}: interazione registrata`;
  }
}

/**
 * Derives a concise strategic summary from accumulated patterns.
 * Pure function — no AI call, just pattern analysis.
 */
function deriveSummary(patterns: string[]): string {
  if (patterns.length === 0) return "Nessuna attività significativa ancora.";

  const analyzeCount = patterns.filter((p) => p.includes("Analizzato")).length;
  const searchCount = patterns.filter((p) => p.includes("Ricerca clienti")).length;
  const adviceCount = patterns.filter((p) => p.includes("Consiglio")).length;

  const parts: string[] = [];

  if (analyzeCount > 0) {
    parts.push(`${analyzeCount} profili analizzati`);
  }
  if (searchCount > 0) {
    parts.push(`${searchCount} ricerche clienti`);
  }
  if (adviceCount > 0) {
    parts.push(`${adviceCount} consulenze strategiche`);
  }

  const recent = patterns.slice(-3).join("; ");
  return `Attività: ${parts.join(", ")}. Recente: ${recent}`;
}

/**
 * Identifies the current strategic focus from the most recent patterns.
 */
function deriveFocusArea(recentPatterns: string[]): string {
  if (recentPatterns.length === 0) return "";

  // Check what the user has been doing most recently
  const lastPattern = recentPatterns[recentPatterns.length - 1];
  if (lastPattern.includes("Analizzato")) {
    return "Analisi profili prospect";
  }
  if (lastPattern.includes("Ricerca clienti")) {
    return "Identificazione nuovi clienti";
  }
  if (lastPattern.includes("Consiglio")) {
    return "Strategia commerciale";
  }
  return "Attività mista";
}

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
