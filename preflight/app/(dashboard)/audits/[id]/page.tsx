import Card from "../../../../components/shared/Card";
import GaugeScore from "../../../../components/audit/GaugeScore";
import ScoreBars from "../../../../components/audit/ScoreBars";
import MetricCard from "../../../../components/audit/MetricCard";
import PriorityFixCard from "../../../../components/audit/PriorityFixCard";
import RewriteCard from "../../../../components/audit/RewriteCard";
import VariantsList from "../../../../components/audit/VariantsList";
import { mockAudit } from "../../../../lib/mock/audit";
import Link from "next/link";

type Props = { params: { id: string } };

export default function AuditDetail({ params }: Props) {
  const id = params.id;
  // In a real app we'd fetch the audit by id. Here we reuse mockAudit.
  const result = mockAudit;

  return (
    <main>
      <div className="mb-4">
        <Link href="/dashboard/audits" className="text-sm text-muted hover:text-app">← Torna agli audit</Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Audit #{id}</h1>
      <p className="text-muted mb-6">Risultato generato automaticamente (mock).</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <GaugeScore score={result.overallScore} />
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Breakdown</h3>
            <ScoreBars breakdown={result.breakdown} />
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Metriche</h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Scannabilità" value={result.metrics.scannabilita} />
              <MetricCard label="Lunghezza" value={result.metrics.lunghezza} />
              <MetricCard label="Densità io/tu" value={`${result.metrics.densitaIo}% / ${result.metrics.densitaTu}%`} />
              <MetricCard label="Forza CTA" value={result.metrics.forzaCTA} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-2">Top 3 interventi prioritari</h3>
            <div className="space-y-3">
              {result.topFixes.map((f, idx) => (
                <PriorityFixCard key={idx} problem={f.problem} impact={f.impact} fix={f.fix} />
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Riscrittura</h3>
            <RewriteCard text={result.rewriteVariants[0].text} />
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Varianti e CTA</h3>
            <VariantsList items={result.hookVariants.map((h, i) => ({ label: `#${i + 1}`, text: h }))} />
          </Card>
        </div>
      </div>
    </main>
  );
}
