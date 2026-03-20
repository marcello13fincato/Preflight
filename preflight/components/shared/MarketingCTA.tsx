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
      <Link href="/app/onboarding" aria-label="Configura il tuo sistema" className="btn-primary px-6 py-3 text-sm font-semibold shadow-sm">Configura il tuo sistema (5 min)</Link>
      {!hideSecondary && (
        <Link href="/login" aria-label="Accedi" className="btn-secondary px-5 py-3 text-sm shadow-sm">Accedi</Link>
      )}
      {!hideTertiary && (
        <Link href="/app" aria-label="Vai all'app" className="text-sm text-muted underline">Vai all&apos;app</Link>
      )}
    </div>
  );
}
