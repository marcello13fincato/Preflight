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

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-app text-app">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="mt-10 text-3xl font-bold">Dashboard</h1>
        <p className="mt-3 text-muted">
          Il tuo quartier generale: storici audit, playbook e suggerimenti per una strategia vincente.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {mockPosts.map((post) => (
            <Card key={post.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <div className="text-sm text-muted mt-1">{new Date(post.date).toLocaleDateString()}</div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <div className="rounded-md bg-soft px-3 py-1 text-sm font-medium text-primary">Punteggio {post.score}</div>
                  <Link href="/audits" className="mt-3 text-sm link-primary">
                    Vedi audit
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-muted">{post.summary}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}