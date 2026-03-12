import prisma from "@/lib/prisma";

type WriteMemoryParams = {
  userId: string;
  taskType: string;
  inputSummary: string;
  outputSummary: string;
  fullOutput: Record<string, unknown>;
  prospectData?: {
    linkedinUrl: string;
    name?: string;
    role?: string;
    company?: string;
    sector?: string;
    heatLevel?: string;
    priority?: string;
    summary?: string;
  };
};

/**
 * Persists AI interaction results to the database.
 * 1. Creates an AIActivity record
 * 2. Upserts Prospect if prospect data is provided
 * 3. Links activity to prospect
 */
export async function writeMemory(params: WriteMemoryParams): Promise<void> {
  const {
    userId,
    taskType,
    inputSummary,
    outputSummary,
    fullOutput,
    prospectData,
  } = params;

  let prospectId: string | undefined;

  // Upsert prospect if analysis task with prospect data
  if (prospectData?.linkedinUrl) {
    const prospect = await prisma.prospect.upsert({
      where: {
        userId_linkedinUrl: {
          userId,
          linkedinUrl: prospectData.linkedinUrl,
        },
      },
      create: {
        userId,
        linkedinUrl: prospectData.linkedinUrl,
        name: prospectData.name || "",
        role: prospectData.role || "",
        company: prospectData.company || "",
        sector: prospectData.sector || "",
        heatLevel: prospectData.heatLevel || "Cold",
        priority: prospectData.priority || "low",
        summary: prospectData.summary || "",
        lastAnalysis: JSON.stringify(fullOutput),
      },
      update: {
        name: prospectData.name || undefined,
        role: prospectData.role || undefined,
        company: prospectData.company || undefined,
        sector: prospectData.sector || undefined,
        heatLevel: prospectData.heatLevel || undefined,
        priority: prospectData.priority || undefined,
        summary: prospectData.summary || undefined,
        lastAnalysis: JSON.stringify(fullOutput),
      },
    });
    prospectId = prospect.id;
  }

  // Insert activity record
  await prisma.aIActivity.create({
    data: {
      userId,
      taskType,
      inputSummary: inputSummary.slice(0, 500),
      outputSummary: outputSummary.slice(0, 500),
      fullOutput: JSON.stringify(fullOutput),
      prospectId: prospectId || null,
    },
  });
}

/**
 * Extracts a short input summary from the user request.
 */
export function summarizeInput(taskType: string, input: Record<string, unknown>): string {
  switch (taskType) {
    case "analyze_profile":
      return `Analisi profilo: ${input.linkedin_url || "profilo sconosciuto"}`;
    case "find_clients":
      return `Ricerca clienti: ${input.ruolo_target || input.tipo_cliente || input.query || "ricerca generica"}`;
    case "ask_advice":
      return `Consiglio: ${String(input.situation || input.query || "").slice(0, 100)}`;
    default:
      return `${taskType}: ${JSON.stringify(input).slice(0, 100)}`;
  }
}

/**
 * Extracts a short output summary from the AI response.
 */
export function summarizeOutput(taskType: string, output: Record<string, unknown>): string {
  switch (taskType) {
    case "analyze_profile":
      return `${output.chi_e || "Profilo analizzato"} — ${output.client_heat_level || "N/A"}`;
    case "find_clients": {
      const cat = output.categoria_prioritaria as Record<string, unknown> | undefined;
      return String(cat?.titolo || "Categorie prospect identificate");
    }
    case "ask_advice":
      return String(output.lettura_situazione || "Consiglio fornito").slice(0, 200);
    default:
      return JSON.stringify(output).slice(0, 200);
  }
}
