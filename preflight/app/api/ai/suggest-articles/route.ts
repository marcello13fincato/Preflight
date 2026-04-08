import { NextResponse } from "next/server";
import { z } from "zod";
import { callAI } from "@/lib/ai/aiEngine";
import { suggestArticlesSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  content: z.string().min(1),
  content_type: z.enum(["post", "articolo"]),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input non valido", details: parsed.error.flatten() }, { status: 400 });
  }

  const { content, content_type } = parsed.data;

  const taskPrompt = `COMPITO: Suggerisci 5 articoli online (blog post, comunicati stampa, articoli di settore) pertinenti al contenuto dell'utente.

L'utente ha scritto un ${content_type === "post" ? "post LinkedIn" : "articolo LinkedIn"}.
Suggerisci articoli reali e pertinenti che l'utente potrebbe:
- Condividere come contenuto complementare
- Usare come fonte o ispirazione
- Citare per rafforzare la propria autorevolezza

USA il contesto commerciale dell'utente per filtrare la rilevanza:
- Gli articoli devono essere pertinenti al SETTORE e al SERVIZIO dell'utente
- Le query di ricerca devono includere termini specifici del settore dell'utente
- Gli articoli suggeriti devono rafforzare il POSIZIONAMENTO dell'utente, non essere generici

Per ogni articolo suggerito, fornisci una query di ricerca Google che l'utente può usare per trovarlo.

Restituisci JSON:
{
  "articles": [
    {
      "titolo": "<titolo descrittivo dell'articolo suggerito — rilevante per il settore dell'utente>",
      "tipo": "<blog | comunicato stampa | report | case study | articolo di settore>",
      "descrizione": "<perché è rilevante per il posizionamento dell'utente, 1 frase>",
      "search_query": "<query Google specifica con termini del settore dell'utente>"
    }
  ]
}

Suggerisci 5 articoli di tipologie diverse (mix di blog, comunicati stampa, report, etc.).`;

  return callAI({
    taskType: "suggest_articles",
    schema: suggestArticlesSchema,
    taskPrompt,
    userInput: `Contenuto ${content_type}: ${content}`,
  });
}
