export const JOURNEY_STEPS = [
  { label: "Post", icon: "✍️" },
  { label: "Commenti", icon: "💬" },
  { label: "Messaggi", icon: "✉️" },
  { label: "Call", icon: "📞" },
  { label: "Cliente", icon: "🏆" },
];

interface JourneyBarProps {
  variant?: "dark" | "light";
  className?: string;
}

export default function JourneyBar({ variant = "dark", className = "" }: JourneyBarProps) {
  const stepClass =
    variant === "dark"
      ? "inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white"
      : "rounded-full bg-[var(--color-primary)] text-white px-3 py-1 text-xs font-bold";
  const arrowClass = variant === "dark" ? "text-white/50 text-xs" : "text-[var(--color-muted)] font-bold";

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {JOURNEY_STEPS.map((step, i, arr) => (
        <span key={step.label} className="flex items-center gap-1.5">
          <span className={stepClass}>
            {step.icon} {step.label}
          </span>
          {i < arr.length - 1 && <span className={arrowClass}>→</span>}
        </span>
      ))}
    </div>
  );
}
