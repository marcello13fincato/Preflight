"use client";

import { useSession } from "@/lib/hooks/useSession";

export default function UserIdBadge({ onUserId }: { onUserId?: (userId: string) => void }) {
  const { data: session } = useSession();
  const userId = (session?.user?.id || "local-user").toString();
  if (onUserId) onUserId(userId);

  return <div className="text-xs text-muted">Workspace utente: {userId}</div>;
}
