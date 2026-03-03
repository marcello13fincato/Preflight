"use client";

import Link from "next/link";
import React from "react";

type Props = {
  className?: string;
  hideSecondary?: boolean;
  hideTertiary?: boolean;
};

export default function MarketingCTA({ className = "", hideSecondary = false, hideTertiary = false }: Props) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <Link href="/audit" aria-label="Fai l’audit gratuito" className="btn-primary px-6 py-3 text-sm font-semibold shadow-sm">Fai l’audit gratuito</Link>
      {!hideSecondary && (
        <Link href="/login" aria-label="Accedi" className="btn-secondary px-5 py-3 text-sm shadow-sm">Accedi</Link>
      )}
      {!hideTertiary && (
        <Link href="/dashboard" aria-label="Vai alla dashboard" className="text-sm text-muted underline">Vai alla dashboard</Link>
      )}
    </div>
  );
}
