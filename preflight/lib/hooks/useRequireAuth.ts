"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/hooks/useSession";

/**
 * Hook that ensures the user is authenticated before the page renders.
 * Returns { userId, status, session }.
 * - While loading: userId is null, status is "loading"
 * - If unauthenticated: redirects to /auth/login, userId is null
 * - If authenticated: userId is the resolved stable ID (never "local-user")
 *
 * Usage pattern:
 *   const { userId, status, session } = useRequireAuth();
 *   // ... all hooks here ...
 *   if (!userId) return <Loading />;
 *   // userId is now `string` (narrowed by TS)
 */
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  const userId: string | null =
    status === "authenticated" && session?.user?.id
      ? session.user.id.toString()
      : null;

  return { userId, status, session };
}
