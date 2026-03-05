import * as React from "react";

const FACTS = [
  "LinkedIn ha oltre 1 miliardo di membri nel mondo.",
  "In Italia LinkedIn conta circa 23 milioni di iscritti.",
  "Nelle vendite B2B spesso servono più punti di contatto: contenuti + conversazioni + follow-up.",
];

interface Props {
  factIndex?: number;
  className?: string;
}

export default function LinkedInFactCallout({ factIndex = 0, className = "" }: Props) {
  const text = FACTS[factIndex % FACTS.length];
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-[#DDEAF6] bg-[#E8F3FF] px-4 py-3 ${className}`}>
      <span className="mt-0.5 flex-shrink-0 text-[#0A66C2]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </span>
      <p className="text-sm text-[#004182]">{text}</p>
    </div>
  );
}
