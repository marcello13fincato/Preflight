import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/perche-funziona", process.env.NEXTAUTH_URL || "http://localhost:3000"), 307);
}
