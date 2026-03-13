import { NextResponse } from "next/server";
import { z } from "zod";
import { orchestrate } from "@/lib/ai/orchestrator";
import { findClientsSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  tipo_cliente: z.string().min(1).max(2000),
  settore: z.string().max(500).optional().default(""),
  dimensione: z.enum(["", "freelance", "startup", "PMI", "enterprise"]).optional().default(""),
  area_geografica: z.string().max(500).optional().default(""),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { tipo_cliente, settore, dimensione, area_geografica } = parsed.data;

  // Build user input text for the prompt
  const inputParts: string[] = [`Tipo di cliente cercato: ${tipo_cliente}`];
  if (settore) inputParts.push(`Settore: ${settore}`);
  if (dimensione) inputParts.push(`Dimensione azienda: ${dimensione}`);
  if (area_geografica) inputParts.push(`Area geografica: ${area_geografica}`);

  return orchestrate({
    taskType: "find_clients",
    userInput: inputParts.join("\n"),
    schema: findClientsSchema,
    contextOptions: {
      includeStrategicSummary: true,
      recentActivityLimit: 5,
    },
    inputRecord: parsed.data as Record<string, unknown>,
  });
}
