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
      className="text-xs rounded-xl border border-border px-3 py-1.5 text-text-primary hover:bg-background transition"
    >
      {copied ? "Copiato!" : "Copia"}
    </button>
  );
}
