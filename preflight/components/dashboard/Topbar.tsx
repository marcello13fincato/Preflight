"use client";

import { ReactNode } from "react";

export default function Topbar({ children }: { children?: ReactNode }) {
  return (
    <header className="w-full bg-background shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="text-lg font-semibold text-text-primary">Dashboard</div>
      <div>{children}</div>
    </header>
  );
}
