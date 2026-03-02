"use client";
import CopyButton from "../shared/CopyButton";

export default function VariantsList({
  items,
}: {
  items: { label: string; text: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium">{it.label}</div>
            <div className="text-text-primary">{it.text}</div>
          </div>
          <div className="ml-4">
            <CopyButton text={it.text} />
          </div>
        </div>
      ))}
    </div>
  );
}
