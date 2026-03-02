"use client";
import CopyButton from "../shared/CopyButton";

interface RewriteCardProps {
  text: string;
  className?: string;
}

export default function RewriteCard({ text, className = "" }: RewriteCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-background-alt p-6 relative ${className}`}>
      <pre className="whitespace-pre-wrap text-text-primary">{text}</pre>
      <div className="absolute top-4 right-4">
        <CopyButton text={text} />
      </div>
    </div>
  );
}
