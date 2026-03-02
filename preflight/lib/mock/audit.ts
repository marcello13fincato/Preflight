export interface AuditResult {
  overallScore: number;
  // breakdown per section for charts
  breakdown: { name: string; score: number }[];
  // miscellaneous metrics shown as cards
  metrics: {
    scannabilita: string;
    lunghezza: string;
    densitaIo: number;
    densitaTu: number;
    forzaCTA: string;
  };
  // prioritized fixes with problem / impact / fix
  topFixes: { problem: string; impact: string; fix: string }[];
  // full rewrite and variants
  mainRewrite: string;
  rewriteVariants: { label: string; text: string }[];
  // hook and cta suggestions
  hookVariants: string[];
  ctaSuggestions: string[];
  // next moves ideas
  nextMoves: string[];
}

export const mockAudit: AuditResult = {
  overallScore: 78,
  breakdown: [
    { name: "Hook", score: 60 },
    { name: "Chiarezza", score: 75 },
    { name: "Credibilità", score: 50 },
    { name: "Struttura", score: 85 },
    { name: "CTA", score: 65 },
  ],
  metrics: {
    scannabilita: "Media",
    lunghezza: "OK",
    densitaIo: 42,
    densitaTu: 58,
    forzaCTA: "Media",
  },
  topFixes: [
    {
      problem: "Hook debole",
      impact: "Il post non cattura l'attenzione nei primi secondi",
      fix: "Riprova con una domanda provocatoria o una promessa forte",
    },
    {
      problem: "Nessuna prova concreta",
      impact: "Il lettore non crede ai risultati esposti",
      fix: "Aggiungi numeri, case study o testimonianze",
    },
    {
      problem: "CTA vaga",
      impact: "La gente non sa cosa fare dopo aver letto",
      fix: "Specifica un'azione chiara (commenta, DM, visita il link)",
    },
  ],
  mainRewrite:
    "🎯 Scopri come attivare conversazioni reali con un semplice cambiamento di approccio. Inizia leggendo questo post e rispondi nei commenti con la tua esperienza!",
  rewriteVariants: [
    { label: "Versione più corta", text: "🎯 Cambia approccio, ottieni conversazioni. Leggi e commenta la tua esperienza!" },
    { label: "Versione più diretta", text: "🎯 Vuoi conversazioni? Fai questo. Leggi il post e commenta." },
  ],
  hookVariants: [
    "🎯 Vuoi più DM? Prova così…",
    "❗ Ecco l'errore che uccide i tuoi post LinkedIn",
    "👉 Scopri perché nessuno commenta i tuoi aggiornamenti",
    "🤔 Hai mai provato a iniziare con una domanda?",
    "💡 Cambia queste 3 parole e guarda cosa succede",
  ],
  ctaSuggestions: [
    "Metti like se sei d'accordo",
    "Commenta con la tua esperienza",
    "Inviami un DM per una consulenza gratuita",
    "Condividi se ti è stato utile",
    "Iscriviti alla newsletter per altri consigli",
  ],
  nextMoves: [
    "Post su come scegliere il giusto target",
    "Storia di un cliente che ha ottenuto risultati",
    "Checklist di 5 cose da evitare nei post LinkedIn",
  ],
};
