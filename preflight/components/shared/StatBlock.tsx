import * as React from "react";

interface StatBlockProps {
  value: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}

export default function StatBlock({ value, label, className = "" }: StatBlockProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl font-extrabold text-primary">{value}</div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </div>
  );
}
