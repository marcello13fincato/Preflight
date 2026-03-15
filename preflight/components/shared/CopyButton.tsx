"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <button
      onClick={copy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: copied ? "var(--color-success)" : "var(--color-primary)",
        background: copied ? "var(--color-success-bg)" : "rgba(10,102,194,0.04)",
        border: `1.5px solid ${copied ? "rgba(22,163,74,0.2)" : "rgba(10,102,194,0.12)"}`,
        borderRadius: "8px",
        padding: "0.3rem 0.75rem",
        cursor: "pointer",
        transition: "all 150ms cubic-bezier(.4,0,.2,1)",
      }}
    >
      {copied ? "✓ Copiato" : "Copia"}
    </button>
  );
}
