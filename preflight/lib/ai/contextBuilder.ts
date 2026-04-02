import prisma from "@/lib/prisma";

export type AIContextOptions = {
  prospectId?: string;
  linkedinUrl?: string;
  recentActivityLimit?: number;
  includeStrategicSummary?: boolean;
};

export type AIContext = {
  systemProfile: {
    servizio: string;
    clienteIdeale: string;
    problemaCliente: string;
    risultatoCliente: string;
    linkedinLinks: string[];
    tempoSettimanale: string;
    tipoServizio: string;
    elevatorPitch: string;
    differenziatore: string;
    settore: string;
    dimensioneAzienda: string;
    segnaliInteresse: string;
    obiezioneFrequente: string;
    modelloVendita: string;
    ticketMedio: string;
    cicloVendita: string;
    ctaPreferita: string;
    statoLinkedin: string;
    linkedinUrl: string;
    sitoWeb: string;
  } | null;
  strategicSummary: string | null;
  recentActivity: Array<{
    taskType: string;
    inputSummary: string;
    outputSummary: string;
    createdAt: string;
  }>;
  prospect: {
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

/**
 * Builds a structured AI context from server-side data.
 * Returns summarized data — never raw DB objects.
 */
export async function buildAIContext(
  userId: string,
  options: AIContextOptions = {},
): Promise<AIContext> {
  const {
    prospectId,
    linkedinUrl,
    recentActivityLimit = 10,
    includeStrategicSummary = true,
  } = options;

  // Load in parallel: profile, strategic memory, recent activity, prospect
  const [profile, memory, activities, prospect] = await Promise.all([
    prisma.systemProfile.findUnique({ where: { userId } }),
    includeStrategicSummary
      ? prisma.strategicMemory.findUnique({ where: { userId } })
      : null,
    prisma.aIActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: recentActivityLimit,
      select: {
        taskType: true,
        inputSummary: true,
        outputSummary: true,
        createdAt: true,
      },
    }),
    prospectId
      ? prisma.prospect.findFirst({ where: { id: prospectId, userId } })
      : linkedinUrl
        ? prisma.prospect.findFirst({ where: { userId, linkedinUrl } })
        : null,
  ]);

  return {
    systemProfile: profile
      ? {
          servizio: profile.servizio,
          clienteIdeale: profile.clienteIdeale,
          problemaCliente: profile.problemaCliente,
          risultatoCliente: profile.risultatoCliente,
          linkedinLinks: safeJsonArray(profile.linkedinLinks),
          tempoSettimanale: profile.tempoSettimanale,
          // Extended fields from new schema
          tipoServizio: profile.tipoServizio || "",
          elevatorPitch: profile.elevatorPitch || "",
          differenziatore: profile.differenziatore || "",
          settore: profile.settore || "",
          dimensioneAzienda: profile.dimensioneAzienda || "",
          segnaliInteresse: profile.segnaliInteresse || "",
          obiezioneFrequente: profile.obiezioneFrequente || "",
          modelloVendita: profile.modelloVendita || "",
          ticketMedio: profile.ticketMedio || "",
          cicloVendita: profile.cicloVendita || "",
          ctaPreferita: profile.ctaPreferita || "",
          statoLinkedin: profile.statoLinkedin || "",
          linkedinUrl: profile.linkedinUrl || "",
          sitoWeb: profile.sitoWeb || "",
        }
      : null,
    strategicSummary: memory?.summary || null,
    recentActivity: activities.map((a) => ({
      taskType: a.taskType,
      inputSummary: a.inputSummary,
      outputSummary: a.outputSummary,
      createdAt: a.createdAt.toISOString(),
    })),
    prospect: prospect
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

function safeJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Formats the AI context into a text block for prompt injection.
 * Controls context size by summarizing, not dumping raw data.
 */
export function formatContext(ctx: AIContext): string {
  const sections: string[] = [];

  if (ctx.systemProfile) {
    const p = ctx.systemProfile;
    const profileLines = [
      `- Servizio: ${p.servizio || "non specificato"}`,
      `- Cliente ideale: ${p.clienteIdeale || "non specificato"}`,
      `- Problema del cliente: ${p.problemaCliente || "non specificato"}`,
      `- Risultato promesso: ${p.risultatoCliente || "non specificato"}`,
      `- Tempo settimanale LinkedIn: ${p.tempoSettimanale || "non specificato"}`,
    ];
    if (p.tipoServizio) profileLines.push(`- Tipo servizio: ${p.tipoServizio}`);
    if (p.elevatorPitch) profileLines.push(`- Elevator pitch: ${p.elevatorPitch}`);
    if (p.differenziatore) profileLines.push(`- Differenziatore: ${p.differenziatore}`);
    if (p.settore) profileLines.push(`- Settore: ${p.settore}`);
    if (p.dimensioneAzienda) profileLines.push(`- Dimensione azienda target: ${p.dimensioneAzienda}`);
    if (p.segnaliInteresse) profileLines.push(`- Segnali di interesse: ${p.segnaliInteresse}`);
    if (p.obiezioneFrequente) profileLines.push(`- Obiezione frequente: ${p.obiezioneFrequente}`);
    if (p.modelloVendita) profileLines.push(`- Modello vendita: ${p.modelloVendita}`);
    if (p.ticketMedio) profileLines.push(`- Ticket medio: ${p.ticketMedio}`);
    if (p.cicloVendita) profileLines.push(`- Ciclo vendita: ${p.cicloVendita}`);
    if (p.ctaPreferita) profileLines.push(`- CTA preferita: ${p.ctaPreferita}`);
    if (p.statoLinkedin) profileLines.push(`- Stato LinkedIn: ${p.statoLinkedin}`);
    if (p.linkedinUrl) profileLines.push(`- Profilo LinkedIn: ${p.linkedinUrl}`);
    if (p.sitoWeb) profileLines.push(`- Sito web: ${p.sitoWeb}`);
    if (p.linkedinLinks.length > 0) {
      profileLines.push(`- Target LinkedIn: ${p.linkedinLinks.join(", ")}`);
    }
    sections.push(`PROFILO UTENTE:\n${profileLines.join("\n")}`);
  } else {
    sections.push("PROFILO UTENTE: non configurato");
  }

  if (ctx.strategicSummary) {
    sections.push(`MEMORIA STRATEGICA:\n${ctx.strategicSummary}`);
  }

  if (ctx.recentActivity.length > 0) {
    const activityLines = ctx.recentActivity
      .slice(0, 5)
      .map((a) => `- [${a.taskType}] ${a.inputSummary} → ${a.outputSummary}`)
      .join("\n");
    sections.push(`ATTIVITÀ RECENTE:\n${activityLines}`);
  }

  if (ctx.prospect) {
    const pr = ctx.prospect;
    const prospectLines = [
      `- Nome: ${pr.name || "sconosciuto"}`,
      `- Ruolo: ${pr.role || "sconosciuto"}`,
      `- Azienda: ${pr.company || "sconosciuta"}`,
      `- Settore: ${pr.sector || "sconosciuto"}`,
      `- LinkedIn: ${pr.linkedinUrl || "non disponibile"}`,
      `- Livello: ${pr.heatLevel}`,
      `- Priorità: ${pr.priority}`,
    ];
    if (pr.summary) {
      prospectLines.push(`- Riepilogo: ${pr.summary}`);
    }
    sections.push(`PROSPECT:\n${prospectLines.join("\n")}`);
  }

  return sections.join("\n\n");
}
