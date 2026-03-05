import * as React from "react";

type HeatLevel = "Cold" | "Warm" | "Hot" | string;

const HEAT_CONFIG: Record<string, { label: string; className: string; icon: string; desc: string }> = {
  Cold: { label: "❄️ Cold", className: "badge-cold", icon: "❄️", desc: "Non ancora pronto: continua a costruire fiducia." },
  Warm: { label: "🔥 Warm", className: "badge-warm", icon: "🔥", desc: "Interessato: sposta in DM o proponi una call." },
  Hot:  { label: "🚀 Hot",  className: "badge-hot",  icon: "🚀", desc: "Molto interessato: proponi subito una call!" },
};

export function HeatLevelBadge({ level, showDesc = false }: { level: HeatLevel; showDesc?: boolean }) {
  const cfg = HEAT_CONFIG[level] || { label: level, className: "badge-primary", icon: "📊", desc: "" };
  return (
    <span className={`badge ${cfg.className}`} title={cfg.desc}>
      {cfg.label}
      {showDesc && cfg.desc && <span className="ml-1 font-normal opacity-80">– {cfg.desc}</span>}
    </span>
  );
}

interface RiskWarningProps {
  message: string;
}

export function RiskWarning({ message }: RiskWarningProps) {
  const isPositive = /apre|conversation|buon|ottimo|perfett/i.test(message);
  return (
    <div className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm ${isPositive ? "callout-success" : "callout-warning"}`}>
      <span className="flex-shrink-0 text-base">{isPositive ? "✅" : "⚠️"}</span>
      <span>{message}</span>
    </div>
  );
}
