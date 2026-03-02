import Card from "../../../components/shared/Card";

const playbooks = [
  {
    id: "pb-1",
    title: "Hook + Prova + CTA",
    description: "Template rapido per creare un post che cattura l'attenzione e porta all'azione.",
    steps: [
      "Apertura: domanda o promessa (1 frase)",
      "Prova: dato, risultato o case study (1-2 frasi)",
      "Chiusura: CTA chiara (commenta / DM / visita link)",
    ],
  },
  {
    id: "pb-2",
    title: "Storytelling commerciale",
    description: "Racconta un piccolo caso reale e termina con la lezione/appello.",
    steps: [
      "Setup: contesto breve",
      "Conflitto: problema che il cliente aveva",
      "Soluzione: cosa hai fatto e risultato",
      "Takeaway: insegnamento + CTA",
    ],
  },
];

export default function PlaybookPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Playbook</h1>
      <p className="mt-4 text-muted">Linee guida passo-passo per creare post che convertono.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {playbooks.map((p) => (
          <Card key={p.id}>
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="text-sm text-muted mt-2">{p.description}</p>
            <ol className="mt-4 list-decimal list-inside text-sm space-y-2">
              {p.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </div>
  );
}
