import { NextResponse } from "next/server";
import { z } from "zod";
import { orchestrate } from "@/lib/ai/orchestrator";
import { prospectAnalyzerSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  linkedin_url: z.string().min(1).max(2000),
  website_url: z.string().max(2000).optional().default(""),
  context: z.string().max(5000).optional().default(""),
  pdf_text: z.string().max(10000).optional().default(""),
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

  const { linkedin_url, website_url, context, pdf_text } = parsed.data;

  // Build user input text for the prompt
  const inputParts: string[] = [`Profilo LinkedIn: ${linkedin_url}`];
  if (pdf_text) inputParts.push(`Informazioni extra dal PDF: ${pdf_text}`);
  if (website_url) inputParts.push(`Sito web: ${website_url}`);
  if (context) inputParts.push(`Contesto: ${context}`);

  return orchestrate({
    taskType: "analyze_profile",
    userInput: inputParts.join("\n"),
    schema: prospectAnalyzerSchema,
    contextOptions: {
      linkedinUrl: linkedin_url,
      includeStrategicSummary: true,
      recentActivityLimit: 5,
    },
    inputRecord: parsed.data as Record<string, unknown>,
    extractProspect: (output) => ({
      linkedinUrl: linkedin_url,
      name: "",
      role: String(output.ruolo_contesto || "").slice(0, 200),
      company: "",
      sector: "",
      heatLevel: String(output.client_heat_level || "Cold"),
      priority: String(output.priority_signal || "low"),
      summary: String(output.chi_e || "").slice(0, 500),
    }),
  });
}
