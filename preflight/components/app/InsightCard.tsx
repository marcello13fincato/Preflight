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
  icon?: React.ReactNode;
  label: string;
  text: string;
  variant?: InsightVariant;
  copyable?: boolean;
}) {
  return (
    <div className={`bg-white border border-slate-100 rounded-[14px] p-5 insight-${variant} fade-in`}>
      <div className="flex items-center gap-2 mb-3.5 fade-in-delay">
        <div className="flex items-center gap-2">
          {icon && <span className="insight-icon">{icon}</span>}
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">AI</span>
        </div>
        {copyable && <CopyButton text={text} />}
      </div>
      <div className="text-[13.5px] text-slate-700 leading-[1.7] fade-in">
        <SmartText text={text} />
      </div>
    </div>
  );
}

/* ── Section divider between card groups ── */
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4 fade-in">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
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
  icon: React.ReactNode;
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
    <div className="flex items-center gap-2 mb-3.5">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex-1">{title}</h3>
      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">AI</span>
      {copyText && <CopyButton text={copyText} />}
    </div>
  );
}
