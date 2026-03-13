import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  post_content: z.string().min(1),
});

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY non configurata." },
      { status: 500 },
    );
  }

  const body: unknown = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input non valido.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { post_content } = parsed.data;

  // Truncate post content to avoid overly long prompts
  const truncated = post_content.slice(0, 800);

  const imagePrompt = [
    "Create a clean, professional LinkedIn post illustration.",
    "The image should be modern, minimal, corporate-friendly, with a blue colour palette.",
    "No text or words in the image.",
    "Visual concept based on this post content:",
    truncated,
  ].join(" ");

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[generate-image] OpenAI error:", errText.slice(0, 300));
      return NextResponse.json(
        { error: `Errore generazione immagine (${res.status})` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      data?: Array<{ url?: string; revised_prompt?: string }>;
    };

    const imageUrl = data.data?.[0]?.url;
    const revisedPrompt = data.data?.[0]?.revised_prompt;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Nessuna immagine restituita dall'AI." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      image_url: imageUrl,
      revised_prompt: revisedPrompt ?? "",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[generate-image] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
