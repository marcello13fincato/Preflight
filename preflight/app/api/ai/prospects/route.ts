import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getServerAuthSession from "@/lib/getServerAuthSession";

export const runtime = "nodejs";

/**
 * GET /api/ai/prospects — Returns the user's analyzed prospects for follow-up.
 * Used by the "Cosa fare oggi" page (Block 3 - Follow-up).
 */
export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const userId = session.user.id;

  const prospects = await prisma.prospect.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      role: true,
      company: true,
      sector: true,
      heatLevel: true,
      priority: true,
      summary: true,
      updatedAt: true,
    },
  });

  const now = Date.now();
  const mapped = prospects.map((p) => ({
    id: p.id,
    nome_ruolo: [p.name, p.role, p.company].filter(Boolean).join(" — ") || "Profilo anonimo",
    giorni_fa: Math.floor((now - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
    contesto: p.summary || "",
    heatLevel: p.heatLevel,
    priority: p.priority,
  }));

  return NextResponse.json({ prospects: mapped });
}
