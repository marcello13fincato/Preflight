import Card from "../../../components/shared/Card";
import Link from "next/link";

const invoices = [
  { id: "inv-2026-02", date: "2026-02-28", amount: "€49.00", status: "Paid" },
  { id: "inv-2026-01", date: "2026-01-31", amount: "€49.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Fatturazione</h1>
      <p className="mt-4 text-muted">Stato abbonamento e fatture recenti.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold">Piano attuale</h3>
          <div className="mt-2 text-muted">Free</div>
          <div className="mt-4">
            <Link href="/pricing" className="btn-primary rounded-full px-4 py-2">
              Passa a Pro
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Fatture recenti</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{inv.id}</div>
                  <div className="text-xs text-muted">{inv.date}</div>
                </div>
                <div className="text-right">
                  <div>{inv.amount}</div>
                  <div className="text-xs text-muted">{inv.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
