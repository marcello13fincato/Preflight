import { z } from "zod";

export async function generateWithLLM(prompt: string, fallbackJson: string): Promise<string> {
  // TODO: plug in a real provider (OpenAI/Anthropic) when credentials are available.
  void prompt;
  return fallbackJson;
}

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

export async function generateStructured<T>(params: {
  prompt: string;
  schema: z.ZodType<T>;
  fallback: T;
}): Promise<T> {
  const first = await generateWithLLM(params.prompt, JSON.stringify(params.fallback));
  const firstParsed = safeJsonParse(first);
  const firstValid = params.schema.safeParse(firstParsed);
  if (firstValid.success) return firstValid.data;

  const retryPrompt = `${params.prompt}\n\nReturn valid JSON matching schema exactly.`;
  const second = await generateWithLLM(retryPrompt, JSON.stringify(params.fallback));
  const secondParsed = safeJsonParse(second);
  const secondValid = params.schema.safeParse(secondParsed);
  if (secondValid.success) return secondValid.data;

  return params.schema.parse(params.fallback);
}

export const salesRules = [
  "You are a LinkedIn Sales Strategist focused on client acquisition for freelancers and consultants.",
  "Messages must stay short (max 500 chars when possible).",
  "No hard pitch on first contact. Ask one smart question.",
  "Always include a next action comment->DM->call progression.",
  "For objections, respond calm and invite discussion.",
  "Align every output with offer, ICP and known objections.",
].join(" ");
