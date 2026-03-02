"use client";

import { useEffect, useState } from "react";
import Card from "../../../components/shared/Card";
import CopyButton from "../../../components/shared/CopyButton";

const DEFAULT_TEMPLATES = [
  {
    id: "tpl-1",
    label: "Introduzione diretta",
    text: "🎯 Vuoi più risposte sui tuoi post? Prova questo approccio: [riassunto e invito].",
  },
  {
    id: "tpl-2",
    label: "Story + CTA",
    text: "Una breve storia + risultato. Concludi con: 'Commenta se vuoi la checklist'.",
  },
];

export default function TemplatesPage() {
  const [items, setItems] = useState(DEFAULT_TEMPLATES);
  const [label, setLabel] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("preflight_templates");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("preflight_templates", JSON.stringify(items));
  }, [items]);

  const addTemplate = () => {
    const next = { id: `tpl-${Date.now()}`, label: label || `Template ${items.length + 1}`, text };
    setItems([next, ...items]);
    setLabel("");
    setText("");
  };

  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));

  return (
    <div>
      <h1 className="text-3xl font-bold">Template</h1>
      <p className="mt-4 text-muted">Blocchi di testo pronti da copiare e incollare.</p>

      <Card className="mt-6">
        <h3 className="font-semibold">Aggiungi un template</h3>
        <div className="mt-3 grid gap-2">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Etichetta" className="rounded border border-app bg-app p-2" />
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Testo del template" className="rounded border border-app bg-app p-2 min-h-[100px]" />
          <div className="flex gap-2">
            <button onClick={addTemplate} className="btn-primary rounded-full px-4 py-2">Aggiungi</button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{t.label}</h3>
                <p className="text-sm text-muted mt-1">{t.text}</p>
              </div>
              <div className="ml-4 flex flex-col items-end gap-2">
                <CopyButton text={t.text} />
                <button onClick={() => remove(t.id)} className="text-sm text-red-600">Elimina</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
