export default function PriorityFixCard({
  problem,
  impact,
  fix,
}: {
  problem: string;
  impact: string;
  fix: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background-alt p-4 space-y-2">
      <div className="text-sm font-semibold">{problem}</div>
      <div className="text-xs text-text-secondary">Impatto: {impact}</div>
      <div className="text-xs">Soluzione: {fix}</div>
    </div>
  );
}
