export default function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-app bg-surface p-4 text-center">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="font-semibold text-text-primary">{value}</div>
    </div>
  );
}
