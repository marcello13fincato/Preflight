"use client";

import CopyButton from "./CopyButton";

interface OutputCardProps {
  title: string;
  text: string;
  highlight?: boolean;
}

export default function OutputCard({ title, text, highlight = false }: OutputCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        highlight
          ? "border-[var(--color-primary)] bg-[var(--color-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-bold text-sm">{title}</span>
        <CopyButton text={text} />
      </div>
      <p className="text-sm whitespace-pre-wrap text-[var(--color-text)]">{text}</p>
    </div>
  );
}
