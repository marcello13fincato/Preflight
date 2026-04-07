"use client";

import CopyButton from "@/components/shared/CopyButton";

export default function JsonOutputCard({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <div className="json-output-card fade-in">
      <div className="json-output-header">
        <h3 className="json-output-title">{title}</h3>
        <CopyButton text={text} />
      </div>
      <pre className="json-output-pre">{text}</pre>
    </div>
  );
}
