export interface AuditResult {
  overallScore: number;
  sections: { name: string; score: number; advice: string }[];
  topFixes: string[];
  rewrites: { title: string; before: string; after: string }[];
}

export const mockAudit: AuditResult = {
  overallScore: 78,
  sections: [
    { name: "Tono", score: 65, advice: "Il tono è un po' neutro, punta a qualcosa di più deciso." },
    { name: "Struttura", score: 85, advice: "Ottima gerarchia, ma prova ad accorciare il paragrafo iniziale." },
    { name: "CTA", score: 50, advice: "La chiamata all'azione non è chiara: cosa vuoi che facciano?" },
  ],
  topFixes: [
    "Mantieni il focus su un unico messaggio",
    "Inserisci numeri o risultati concreti",
    "Aggiungi una domanda provocatoria all'inizio",
  ],
  rewrites: [
    {
      title: "Apertura",
      before: "Ciao a tutti, oggi vorrei condividere un pensiero su...",
      after: "🎯 Come trasformare un post in discussione? Ecco il metodo...",
    },
    {
      title: "CTA finale",
      before: "Fatemi sapere cosa ne pensate!",
      after: "👉 Commenta con il tuo punto di vista e contattami per una consulenza gratuita.",
    },
  ],
};
