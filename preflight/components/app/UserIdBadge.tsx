"use client";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function UserIdBadge({ onUserId }: { onUserId?: (userId: string) => void }) {
  const { userId, session } = useRequireAuth();
  if (onUserId && userId) onUserId(userId);

  const display = session?.user?.email || session?.user?.name || userId || "...";
  return <div className="text-xs text-muted">Account: {display}</div>;
}
