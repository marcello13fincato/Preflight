"use client";

import CopyButton from "@/components/shared/CopyButton";

export default function JsonOutputCard({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <div
      className="fade-in"
      style={{
        borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "0.875rem", letterSpacing: "-0.01em" }}>{title}</h3>
        <CopyButton text={text} />
      </div>
      <pre
        style={{
          overflow: "auto",
          borderRadius: "10px",
          background: "rgba(0,0,0,0.025)",
          padding: "0.875rem",
          fontSize: "0.75rem",
          lineHeight: 1.6,
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        }}
      >
        {text}
      </pre>
    </div>
  );
}
