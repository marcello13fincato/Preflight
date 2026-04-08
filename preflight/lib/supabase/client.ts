import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a dummy client that won't crash during SSR prerender
    return createBrowserClient("https://placeholder.supabase.co", "placeholder");
  }

  return createBrowserClient(url, key);
}
