import { z } from "zod";

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export async function generateWithLLM(prompt: string, fallbackJson: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("[AI] OPENAI_API_KEY not configured — returning static fallback response");
    return fallbackJson;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  console.log(`[AI] → OpenAI (model: ${model}) | prompt: ${prompt.length} chars`);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[AI] OpenAI HTTP ${res.status}:`, errText.slice(0, 500));
      return fallbackJson;
    }

    const data = (await res.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content ?? "";
    console.log("[AI] ← OpenAI response (first 300 chars):", content.slice(0, 300));
    return content || fallbackJson;
  } catch (err) {
    console.error("[AI] fetch error:", err);
    return fallbackJson;
  }
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
  console.log("[AI] generateStructured — full prompt:\n", params.prompt);

  const first = await generateWithLLM(params.prompt, JSON.stringify(params.fallback));
  const firstParsed = safeJsonParse(first);
  const firstValid = params.schema.safeParse(firstParsed);
  if (firstValid.success) {
    console.log("[AI] Schema validation: OK (attempt 1)");
    return firstValid.data;
  }

  console.warn("[AI] Schema validation failed (attempt 1):", JSON.stringify(firstValid.error.flatten()));

  const retryPrompt = `${params.prompt}\n\nReturn valid JSON matching schema exactly.`;
  const second = await generateWithLLM(retryPrompt, JSON.stringify(params.fallback));
  const secondParsed = safeJsonParse(second);
  const secondValid = params.schema.safeParse(secondParsed);
  if (secondValid.success) {
    console.log("[AI] Schema validation: OK (attempt 2)");
    return secondValid.data;
  }

  console.error("[AI] Schema validation failed (attempt 2) — using static fallback:", JSON.stringify(secondValid.error.flatten()));
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
