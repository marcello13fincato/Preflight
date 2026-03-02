export default function ScoreBars({
  breakdown,
}: {
  breakdown: { name: string; score: number }[];
}) {
  return (
    <div className="space-y-2">
      {breakdown.map((b) => {
        const pct = Math.min(Math.max(b.score, 0), 100);
        return (
          <div key={b.name} className="flex items-center">
            <div className="w-24 text-sm text-text-secondary">{b.name}</div>
            <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden ml-2">
              <div
                className="h-full bg-primary"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
            <div className="w-8 text-right text-sm font-semibold ml-2">{b.score}</div>
          </div>
        );
      })}
    </div>
  );
}
