import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured, salesRules, formatProfileContext } from "@/lib/ai/structured";
import { findClientsSchema } from "@/lib/sales/schemas";

export const runtime = "nodejs";

const requestSchema = z.object({
  tipo_cliente: z.string().min(1).max(2000),
  settore: z.string().max(500).optional(),
  dimensione: z.enum(["", "freelance", "startup", "PMI", "enterprise"]).optional(),
  area_geografica: z.string().max(500).optional(),
  profile: z.unknown().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input non valido", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { tipo_cliente, settore, dimensione, area_geografica, profile } = parsed.data;

    const prompt = `${salesRules}

Sei l'Assistente Preflight. L'utente vuole trovare potenziali clienti su LinkedIn.

Il tuo compito è aiutarlo a costruire una ricerca LinkedIn efficace. NON collegarti a LinkedIn. Genera un link di ricerca LinkedIn pronto all'uso e suggerisci keyword e filtri utili.

DATI FORNITI DALL'UTENTE:
- Tipo di cliente cercato: ${tipo_cliente}
${settore ? `- Settore: ${settore}` : ""}
${dimensione ? `- Dimensione azienda: ${dimensione}` : ""}
${area_geografica ? `- Area geografica: ${area_geografica}` : ""}
${formatProfileContext(profile) || ""}

Rispondi ESCLUSIVAMENTE in italiano. Sii chiara, concreta, naturale. Non essere aggressiva e non fare marketing.

Rispondi SOLO con un oggetto JSON con ESATTAMENTE questa struttura:
{
  "tipo_cliente_ideale": "<breve sintesi del profilo di cliente ideale basata su quello che ha descritto l'utente>",
  "come_cercarlo": "<lista di keyword utili per cercarlo su LinkedIn, separate da virgola>",
  "link_ricerca_linkedin": "<un URL di ricerca LinkedIn pronto, formato: https://www.linkedin.com/search/results/people/?keywords=...  — usa %20 per gli spazi nelle keyword>",
  "suggerimenti_filtri": "<suggerisci filtri LinkedIn utili come settore, località, titolo, connessioni di secondo grado, ecc.>",
  "profili_simili": "<suggerisci ruoli simili o alternativi che l'utente potrebbe cercare>",
  "cosa_fare_dopo": "<step concreti numerati: 1. apri alcuni profili 2. salva quelli interessanti 3. analizzali con Preflight 4. usa la funzione Analizza questo profilo>"
}`;

    const output = await generateStructured({ prompt, schema: findClientsSchema });
    return NextResponse.json(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error("[find-clients] AI error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
