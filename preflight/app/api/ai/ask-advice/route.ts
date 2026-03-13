import { NextResponse } from "next/server";
import { z } from "zod";
import { orchestrate } from "@/lib/ai/orchestrator";
import { adviceSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  situation: z.string().min(1).max(5000),
  linkedin_url: z.string().max(2000).optional().default(""),
  website_url: z.string().max(2000).optional().default(""),
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

  const { situation, linkedin_url, website_url, pdf_text } = parsed.data;

  // Build user input text for the prompt
  const inputParts: string[] = [`Situazione: ${situation}`];
  if (linkedin_url) inputParts.push(`Profilo LinkedIn: ${linkedin_url}`);
  if (website_url) inputParts.push(`Sito web: ${website_url}`);
  if (pdf_text) inputParts.push(`Informazioni extra: ${pdf_text}`);

  return orchestrate({
    taskType: "ask_advice",
    userInput: inputParts.join("\n"),
    schema: adviceSchema,
    contextOptions: {
      linkedinUrl: linkedin_url || undefined,
      includeStrategicSummary: true,
      recentActivityLimit: 10,
    },
    inputRecord: parsed.data as Record<string, unknown>,
  });
}
