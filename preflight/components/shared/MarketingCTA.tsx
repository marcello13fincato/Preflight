"use client";

import Link from "next/link";
import React from "react";

export default function MarketingCTA({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Link href="/audit" aria-label="Fai l’audit gratis" className="btn-primary rounded-xl px-6 py-3 font-semibold">Fai l’audit gratis</Link>
      <Link href="/login" aria-label="Accedi al tuo account" className="btn-secondary rounded-xl px-5 py-3">Accedi</Link>
      <Link href="/dashboard" aria-label="Vai alla dashboard" className="text-sm text-muted underline">Vai alla dashboard</Link>
    </div>
  );
}
