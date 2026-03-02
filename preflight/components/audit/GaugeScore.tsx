export default function GaugeScore({ score }: { score: number }) {
  const pct = Math.min(Math.max(score, 0), 100);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <svg width="120" height="120" className="mx-auto">
      <circle
        r={radius}
        cx="60"
        cy="60"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      <circle
        r={radius}
        cx="60"
        cy="60"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        className="fill-current"
      >
        {score}
      </text>
    </svg>
  );
}
