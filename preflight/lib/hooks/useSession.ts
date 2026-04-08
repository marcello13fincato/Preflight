"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

type SessionData = {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
} | null;

/**
 * Resolve the stable user ID from the server.
 * The server does a prisma.user.upsert and returns the Prisma cuid.
 * We cache it in sessionStorage to avoid repeated calls.
 */
async function resolveUserId(supabaseUid: string): Promise<string> {
  if (typeof window === "undefined") return supabaseUid;
  const cacheKey = `preflight:resolved-uid:${supabaseUid}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch("/api/auth/resolve-id");
    if (res.ok) {
      const data = await res.json();
      if (data.userId) {
        sessionStorage.setItem(cacheKey, data.userId);
        return data.userId;
      }
    }
  } catch {
    // Server unreachable — fall back to Supabase UID
  }
  return supabaseUid;
}

/**
 * Drop-in replacement for next-auth/react useSession.
 * Returns { data: session, status } with Supabase auth.
 * Resolves the stable Prisma user ID to keep client/server consistent.
 */
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data }: { data: { user: User | null } }) => {
      if (cancelled) return;
      setUser(data.user);
      if (data.user) {
        const stableId = await resolveUserId(data.user.id);
        if (!cancelled) {
          setResolvedId(stableId);
          setStatus("authenticated");
        }
      } else {
        setStatus("unauthenticated");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (cancelled) return;
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const stableId = await resolveUserId(u.id);
        if (!cancelled) {
          setResolvedId(stableId);
          setStatus("authenticated");
        }
      } else {
        setResolvedId(null);
        setStatus("unauthenticated");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const session: SessionData = user
    ? {
        user: {
          id: resolvedId || user.id || null,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          email: user.email || null,
          image: user.user_metadata?.avatar_url || null,
        },
      }
    : null;

  return { data: session, status };
}
