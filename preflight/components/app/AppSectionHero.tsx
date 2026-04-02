"use client";

import type { ReactNode } from "react";

type Variant = "brand" | "light" | "subtle";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: Variant;
  actions?: ReactNode;
}

export default function AppSectionHero({
  eyebrow,
  title,
  subtitle,
  variant = "brand",
  actions,
}: Props) {
  return (
    <div className={`app-section-hero app-section-hero--${variant}`}>
      <div className="app-section-hero-copy">
        {eyebrow && <p className="app-section-hero-eyebrow">{eyebrow}</p>}
        <h2 className="app-section-hero-title">{title}</h2>
        {subtitle && <p className="app-section-hero-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="app-section-hero-actions">{actions}</div>}
    </div>
  );
}
