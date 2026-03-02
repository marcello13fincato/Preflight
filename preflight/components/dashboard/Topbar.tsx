"use client";

import { ReactNode } from "react";
import { signOut } from "next-auth/react";

export default function Topbar({ children }: { children?: ReactNode }) {
  return (
    <header className="w-full bg-background shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-text-primary">Dashboard</div>
      <div className="flex items-center gap-3">
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
