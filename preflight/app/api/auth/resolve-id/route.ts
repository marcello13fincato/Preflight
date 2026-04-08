import { NextResponse } from "next/server";
import getServerAuthSession from "@/lib/getServerAuthSession";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }
  return NextResponse.json({ userId: session.user.id });
}
