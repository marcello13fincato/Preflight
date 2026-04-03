"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type SessionData = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
} | null;

/**
 * Drop-in replacement for next-auth/react useSession.
 * Returns { data: session, status } with Supabase auth.
 */
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setStatus(user ? "authenticated" : "unauthenticated");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "authenticated" : "unauthenticated");
    });

    return () => subscription.unsubscribe();
  }, []);

  const session: SessionData = user
    ? {
        user: {
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          email: user.email || null,
          image: user.user_metadata?.avatar_url || null,
        },
      }
    : null;

  return { data: session, status };
}
