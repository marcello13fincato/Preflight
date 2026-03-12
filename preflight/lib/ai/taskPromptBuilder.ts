import { getSystemPrompt } from "./systemPrompt";
import { type AIContext, formatContext } from "./contextBuilder";

export type TaskType = "analyze_profile" | "find_clients" | "ask_advice";

const TASK_INSTRUCTIONS: Record<TaskType, string> = {
  analyze_profile: `COMPITO: Analizza il profilo LinkedIn del prospect indicato.

Valuta:
1. Chi è questa persona (ruolo, settore, posizionamento)
2. Perché potrebbe essere un buon contatto per l'utente
3. Strategia di contatto personalizzata
4. Primo messaggio pronto all'uso
5. Follow-up consigliato
6. Segnali da osservare e errori da evitare

Rispondi con un JSON con ESATTAMENTE questi campi:
{
  "chi_e": "<chi è, ruolo, settore>",
  "ruolo_contesto": "<ruolo nel dettaglio, contesto aziendale>",
  "perche_buon_contatto": "<motivi di allineamento con l'utente>",
  "strategia_contatto": "<approccio consigliato dettagliato>",
  "primo_messaggio": "<messaggio personalizzato pronto da usare>",
  "followup_consigliato": "<follow-up se non risponde, con tempistica>",
  "step_successivi": "<passi concreti dopo il primo contatto>",
  "segnali_da_osservare": "<segnali positivi e negativi>",
  "errori_da_evitare": "<errori comuni con questo tipo di contatto>",
  "client_heat_level": "<Cold | Warm | Hot>",
  "priority_signal": "<high | medium | low>"
}`,

  find_clients: `COMPITO: Identifica le categorie di persone più utili da contattare su LinkedIn adesso.

NON generare una singola ricerca troppo specifica.
Genera 3 CATEGORIE di prospect (1 prioritaria + 2 alternative), ognuna con un link di ricerca LinkedIn.
Aggiungi guida alla selezione profili, strategia di contatto e primo messaggio.

REGOLE PER I LINK LINKEDIN:
- Formato: https://www.linkedin.com/search/results/people/?keywords=...
- Usa SOLO ruolo + 1-2 qualificatori + geografia se rilevante
- NON concatenare tutto — la ricerca deve restituire risultati reali
- Se troppo stretto, allarga: sinonimo ruolo, regione invece di città

Rispondi con un JSON con ESATTAMENTE questi campi:
{
  "categoria_prioritaria": { "titolo": "<nome categoria>", "descrizione": "<chi sono>", "perche_ora": "<perché contattarli ora>", "link_ricerca_linkedin": "<URL>" },
  "categorie_alternative": [
    { "titolo": "<nome>", "descrizione": "<chi sono>", "perche_ora": "<perché>", "link_ricerca_linkedin": "<URL>" },
    { "titolo": "<nome>", "descrizione": "<chi sono>", "perche_ora": "<perché>", "link_ricerca_linkedin": "<URL>" }
  ],
  "come_scegliere_profili": { "ruolo_decisionale": "<criteri>", "chiarezza_profilo": "<criteri>", "attivita_recente": "<segnali>", "rilevanza_problema": "<criteri>", "contesto_aziendale": "<criteri>", "chi_evitare": "<chi non contattare>" },
  "strategia_contatto": { "approccio": "<step concreti>", "primo_messaggio": "<messaggio breve e naturale>", "angolo_followup": "<angolo per il follow-up>" },
  "prossimo_step": "<suggerimento chiaro su cosa fare dopo>"
}`,

  ask_advice: `COMPITO: L'utente chiede un consiglio strategico su una situazione commerciale.

Analizza la situazione e fornisci:
1. Lettura della situazione
2. Strategia consigliata
3. Risposta suggerita (se applicabile)
4. Follow-up consigliato
5. Prossimi passi
6. Errori da evitare

Rispondi con un JSON con ESATTAMENTE questi campi:
{
  "lettura_situazione": "<analisi della situazione>",
  "strategia_consigliata": "<strategia dettagliata>",
  "risposta_suggerita": "<risposta pronta da usare se applicabile>",
  "followup_consigliato": "<follow-up con tempistica>",
  "step_successivi": "<passi concreti>",
  "errori_da_evitare": "<errori comuni>",
  "client_heat_level": "<Cold | Warm | Hot>"
}`,
};

/**
 * Builds a complete prompt for the AI provider.
 * Combines system prompt + context + task instructions + user input.
 */
export function buildTaskPrompt(
  taskType: TaskType,
  context: AIContext,
  userInput: string,
): string {
  const systemPrompt = getSystemPrompt();
  const formattedContext = formatContext(context);
  const taskInstruction = TASK_INSTRUCTIONS[taskType];

  return `${systemPrompt}

---

CONTESTO:
${formattedContext}

---

${taskInstruction}

---

INPUT UTENTE:
${userInput}`;
}
