"use client";

import { useEffect, useState } from "react";
import Card from "../../../components/shared/Card";

const DEFAULT_PLAYBOOKS = [
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
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_PLAYBOOKS;
    try {
      const raw = localStorage.getItem('preflight_playbooks');
      return raw ? JSON.parse(raw) : DEFAULT_PLAYBOOKS;
    } catch {
      return DEFAULT_PLAYBOOKS;
    }
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsText, setStepsText] = useState("");

  // initial state reads localStorage; no effect needed to load items

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("preflight_playbooks", JSON.stringify(items));
  }, [items]);

  const addPlaybook = () => {
    const steps = stepsText.split("\n").map((s) => s.trim()).filter(Boolean);
    const next = {
      id: `pb-${Date.now()}`,
      title: title || `Playbook ${items.length + 1}`,
      description,
      steps,
    };
    setItems([next, ...items]);
    setTitle("");
    setDescription("");
    setStepsText("");
  };

  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <div>
      <h1 className="text-3xl font-bold">Playbook</h1>
      <p className="mt-4 text-muted">Linee guida passo-passo per creare post che convertono.</p>

      <Card className="mt-6">
        <h3 className="font-semibold">Aggiungi un playbook</h3>
        <div className="mt-3 grid gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo" className="rounded border border-app bg-app p-2" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrizione" className="rounded border border-app bg-app p-2" />
          <textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} placeholder="Passi (una riga per passo)" className="rounded border border-app bg-app p-2 min-h-[120px]" />
          <div className="flex gap-2">
            <button onClick={addPlaybook} className="btn-primary rounded-full px-4 py-2">Aggiungi</button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {items.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-muted mt-2">{p.description}</p>
              </div>
              <div className="ml-4">
                <button onClick={() => remove(p.id)} className="text-sm text-red-600">Elimina</button>
              </div>
            </div>
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
