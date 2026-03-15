"use client";

import CopyButton from "@/components/shared/CopyButton";

type InsightVariant =
  | "summary"
  | "evidence"
  | "strategy"
  | "action"
  | "message"
  | "warning"
  | "default";

/* ── Smart text renderer — detects bullets, paragraphs, line breaks ── */
function SmartText({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const bulletRe = /^[-•·*]\s/;
  const numberRe = /^\d+[.)]\s/;
  const bulletCount = lines.filter(
    (l) => bulletRe.test(l) || numberRe.test(l),
  ).length;

  if (lines.length > 1 && bulletCount >= lines.length * 0.6) {
    return (
      <ul className="insight-list">
        {lines.map((line, i) => (
          <li key={i}>
            {line.replace(bulletRe, "").replace(numberRe, "")}
          </li>
        ))}
      </ul>
    );
  }

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length > 1) {
    return (
      <div className="insight-paragraphs">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    );
  }

  if (lines.length > 1) {
    return (
      <div className="insight-lines">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  }

  return <p>{text}</p>;
}

/* ── InsightCard — structured result card ── */
export default function InsightCard({
  icon,
  label,
  text,
  variant = "default",
  copyable,
}: {
  icon?: string;
  label: string;
  text: string;
  variant?: InsightVariant;
  copyable?: boolean;
}) {
  return (
    <div className={`insight-card insight-${variant}`}>
      <div className="insight-header">
        <div className="insight-label">
          {icon && <span className="insight-icon">{icon}</span>}
          <span>{label}</span>
        </div>
        {copyable && <CopyButton text={text} />}
      </div>
      <div className="insight-body">
        <SmartText text={text} />
      </div>
    </div>
  );
}

/* ── Section divider between card groups ── */
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="insight-divider">
      <span>{label}</span>
    </div>
  );
}

/* ── Metric row — flex container for MetricBadge ── */
export function MetricRow({ children }: { children: React.ReactNode }) {
  return <div className="insight-metrics">{children}</div>;
}

/* ── MetricBadge — heat level / priority visual indicator ── */
export function MetricBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: "red" | "amber" | "blue" | "green";
}) {
  return (
    <div className={`insight-metric insight-metric-${color}`}>
      <span className="insight-metric-icon">{icon}</span>
      <span className="insight-metric-label">{label}</span>
      <span className="insight-metric-value">{value}</span>
    </div>
  );
}

/* ── ResultHeader — top of result panel ── */
export function ResultHeader({
  title,
  copyText,
}: {
  title: string;
  copyText?: string;
}) {
  return (
    <div className="result-header">
      <div className="result-header-bar" />
      <h3 className="result-header-title">{title}</h3>
      {copyText && <CopyButton text={copyText} />}
    </div>
  );
}
