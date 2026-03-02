import Link from "next/link";
import Card from "../../../components/shared/Card";

const mockPosts = [
  {
    id: "1",
    title: "Come aumentare le conversioni con copy mirati",
    date: "2026-02-20",
    score: 82,
    summary: "Audit rapido del post: headline, CTA e immagine ottimizzate per CTR.",
  },
  {
    id: "2",
    title: "Checklist SEO per pagine prodotto",
    date: "2026-01-15",
    score: 74,
    summary: "Suggerimenti pratici su meta, struttura e velocità per migliorare il traffico organico.",
  },
];

export default function AuditsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">I tuoi audit</h1>
      <p className="mt-4 text-muted">Qui trovi la cronologia degli audit eseguiti.</p>

      <div className="mt-6 grid gap-4">
        {mockPosts.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <div className="text-sm text-muted">{p.date}</div>
              </div>
              <div className="text-right">
                <div className="text-sm rounded-md bg-soft px-3 py-1 text-primary">Punteggio {p.score}</div>
                <Link href={`/dashboard/audits/${p.id}`} className="block mt-3 text-sm link-primary">Apri</Link>
              </div>
            </div>
            <p className="mt-3 text-muted">{p.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
