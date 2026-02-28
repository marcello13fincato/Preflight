import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractText(resp: any): string {
  // SDK nuovo (Responses API): spesso c'è output_text
  if (typeof resp?.output_text === "string" && resp.output_text.trim()) {
    return resp.output_text.trim();
  }

  // Fallback: prova a leggere output[].content[].text
  const out = resp?.output;
  if (Array.isArray(out)) {
    const chunks: string[] = [];
    for (const item of out) {
      const content = item?.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          const t = c?.text;
          if (typeof t === "string") chunks.push(t);
        }
      }
    }
    const joined = chunks.join("\n").trim();
    if (joined) return joined;
  }

  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = (body?.text ?? "").toString().trim();

    if (!text) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY mancante in .env.local" },
        { status: 500 }
      );
    }

    const prompt = `Sei un revisore LinkedIn per business B2B.
Analizza il post e restituisci:

1) Diagnosi (hook, chiarezza offerta, proof, CTA, leggibilità)
2) 3 miglioramenti prioritari (bullet)
3) Riscrittura pronta da copiare
4) Prossimo contenuto consigliato per vendere di più (titolo + angolo + CTA)
5) Suggerimento visual (tipo immagine/grafica consigliata)

Post:
"""${text}"""`;

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const result = extractText(resp);

    // log utile in terminale
    console.log("AI result length:", result.length);

    if (!result) {
      return Response.json(
        { error: "Risposta vuota dall’AI (controlla quota/billing o modello)", raw: resp },
        { status: 200 }
      );
    }

    return Response.json({ result });
  } catch (e: any) {
    console.error("API /api/audit error:", e);
    return Response.json(
      { error: e?.message || "Errore server" },
      { status: 500 }
    );
  }
}