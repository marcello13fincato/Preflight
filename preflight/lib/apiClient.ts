export async function apiGet<T = any>(path: string) {
  const res = await fetch(path.startsWith('/') ? path : `/api/${path}`);
  if (!res.ok) throw new Error(`API GET ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiPost<T = any>(path: string, body?: unknown) {
  const res = await fetch(path.startsWith('/') ? path : `/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API POST ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}
