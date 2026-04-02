import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import getServerAuthSession from "@/lib/getServerAuthSession";
import { loadUserAIContext, checkContextCompleteness } from "@/lib/ai/aiEngine";

export const runtime = "nodejs";

const saveSchema = z.object({
  servizio: z.string().optional(),
  tipoServizio: z.string().optional(),
  elevatorPitch: z.string().optional(),
  differenziatore: z.string().optional(),
  clienteIdeale: z.string().optional(),
  settore: z.string().optional(),
  dimensioneAzienda: z.string().optional(),
  problemaCliente: z.string().optional(),
  risultatoCliente: z.string().optional(),
  segnaliInteresse: z.string().optional(),
  obiezioneFrequente: z.string().optional(),
  modelloVendita: z.string().optional(),
  ticketMedio: z.string().optional(),
  cicloVendita: z.string().optional(),
  ctaPreferita: z.string().optional(),
  tempoSettimanale: z.string().optional(),
  statoLinkedin: z.string().optional(),
  linkedinUrl: z.string().optional(),
  sitoWeb: z.string().optional(),
  linkedinLinks: z.array(z.string()).optional(),
  materialiNomi: z.array(z.string()).optional(),
  toneSamples: z.array(z.string()).optional(),
});

/**
 * GET: Load current user AI context + completeness check.
 * POST: Save/update user AI context (upsert SystemProfile).
 */
export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
  const userId = session.user.email || session.user.name || "anonymous";

  const ctx = await loadUserAIContext(userId);
  const completeness = checkContextCompleteness(ctx);

  return NextResponse.json({ context: ctx, completeness });
}

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
  const userId = session.user.email || session.user.name || "anonymous";

  const body = await req.json();
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input non valido", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Build the update object, only including provided fields
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        updateData[key] = JSON.stringify(value);
      } else {
        updateData[key] = value;
      }
    }
  }

  // Mark setup as complete if all required fields are present
  const hasRequired =
    (data.servizio || "").trim().length > 0 &&
    (data.clienteIdeale || "").trim().length > 0 &&
    (data.problemaCliente || "").trim().length > 0 &&
    (data.risultatoCliente || "").trim().length > 0;

  if (hasRequired) {
    updateData.setupComplete = true;
  }

  await prisma.systemProfile.upsert({
    where: { userId },
    create: { userId, ...updateData } as any,
    update: updateData,
  });

  const ctx = await loadUserAIContext(userId);
  const completeness = checkContextCompleteness(ctx);

  return NextResponse.json({ context: ctx, completeness });
}
