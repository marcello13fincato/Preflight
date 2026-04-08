"use client";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function UserIdBadge({ onUserId }: { onUserId?: (userId: string) => void }) {
  const { userId } = useRequireAuth();
  if (onUserId && userId) onUserId(userId);

  return <div className="text-xs text-muted">Workspace utente: {userId || "..."}</div>;
}
