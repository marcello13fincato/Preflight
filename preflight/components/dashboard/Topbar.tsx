"use client";

import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Topbar({ children }: { children?: ReactNode }) {
  const { data: session } = useSession();
  return (
    <header className="w-full bg-background shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-text-primary">Dashboard</div>
      <div className="flex items-center gap-3">
        {session && (
          <div className="text-sm text-muted">{session.user?.name || session.user?.email}</div>
        )}
        <button
          className="btn-secondary"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Esci
        </button>
        <div>{children}</div>
      </div>
    </header>
  );
}
