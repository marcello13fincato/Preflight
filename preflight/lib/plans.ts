export interface Plan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const plans: Plan[] = [
  {
    name: "Free",
    price: "0€",
    features: [
      "Audit limitati (per test)",
      "Output completo dell’audit",
      "Nessuno storico",
    ],
    ctaLabel: "Prova ora",
    ctaHref: "/audit",
  },
  {
    name: "Pro",
    price: "19,99€",
    period: "/mese",
    features: [
      "Audit illimitati",
      "Storico dei post + consigli",
      "Piano settimanale: cosa pubblicare per vendere di più",
      "Suggerimenti visual e CTA",
    ],
    ctaLabel: "Inizia (login)",
    ctaHref: "/login",
  },
];
