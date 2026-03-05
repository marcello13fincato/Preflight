"use client";

import CopyButton from "@/components/shared/CopyButton";

export default function JsonOutputCard({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <div className="rounded-lg border border-app p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <CopyButton text={text} />
      </div>
      <pre className="overflow-auto rounded bg-soft2 p-3 text-xs">{text}</pre>
    </div>
  );
}
