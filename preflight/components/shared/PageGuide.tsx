import * as React from "react";

interface PageGuideProps {
  what: string;
  paste: string;
  get: string;
  next: string;
  className?: string;
}

export default function PageGuide({ what, paste, get, next, className = "" }: PageGuideProps) {
  return (
    <div className={`callout callout-info space-y-1.5 text-sm ${className}`}>
      <p><span className="font-bold text-[#0A66C2]">✅ Cosa fai qui:</span> {what}</p>
      <p><span className="font-bold text-[#0A66C2]">📋 Cosa incollare:</span> {paste}</p>
      <p><span className="font-bold text-[#0A66C2]">🎯 Cosa ottieni:</span> {get}</p>
      <p><span className="font-bold text-[#0A66C2]">➡️ Prossima mossa:</span> {next}</p>
    </div>
  );
}
