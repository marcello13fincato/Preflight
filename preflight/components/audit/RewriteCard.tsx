"use client";
import CopyButton from "../shared/CopyButton";

export default function RewriteCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-alt p-6 relative">
      <pre className="whitespace-pre-wrap text-text-primary">{text}</pre>
      <div className="absolute top-4 right-4">
        <CopyButton text={text} />
      </div>
    </div>
  );
}
