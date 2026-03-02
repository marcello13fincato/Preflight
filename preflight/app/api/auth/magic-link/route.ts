// Stub auth route - not used in mock environment
export async function POST() {
  return new Response(JSON.stringify({ error: "Auth not implemented" }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  });
}

