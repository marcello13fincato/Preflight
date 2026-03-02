// API route stub: not needed in mock environment
export const runtime = "nodejs";

export async function POST(req: Request) {
  return new Response(JSON.stringify({ error: "Non implementato nel mock" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

