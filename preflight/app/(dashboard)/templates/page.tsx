import Card from "../../../components/shared/Card";
import CopyButton from "../../../components/shared/CopyButton";

const templates = [
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
  return (
    <div>
      <h1 className="text-3xl font-bold">Template</h1>
      <p className="mt-4 text-muted">Blocchi di testo pronti da copiare e incollare.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {templates.map((t) => (
          <Card key={t.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{t.label}</h3>
                <p className="text-sm text-muted mt-1">{t.text}</p>
              </div>
              <div className="ml-4">
                <CopyButton text={t.text} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
