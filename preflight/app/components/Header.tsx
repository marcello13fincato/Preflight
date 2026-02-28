"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [used, setUsed] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const val = Number(localStorage.getItem("audit_used") || 0);
    setUsed(val);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md shadow-md border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between flex-wrap">
        <div className="font-bold text-xl text-text-primary">Pre-Flight</div>
        <nav className="flex gap-6 text-sm text-text-primary">
        <Link className="transition-colors duration-200 ease hover:text-accent" href="/audit">
          Audit
        </Link>
        <Link className="transition-colors duration-200 ease hover:text-accent" href="/pricing">
          Prezzi
        </Link>
        <Link className="transition-colors duration-200 ease hover:text-accent" href="/dashboard">
          Dashboard
        </Link>
        <Link
          className="rounded-xl bg-primary px-4 py-2 text-text-primary font-semibold transition-colors duration-200 ease hover:bg-primary-hover"
          href="/login"
        >
          Accedi
        </Link>
      </nav>
        <div className="mt-2 text-xs text-text-secondary">
          Audit gratuiti usati: {used} / 3
        </div>
      </div>
    </header>
  );
}
