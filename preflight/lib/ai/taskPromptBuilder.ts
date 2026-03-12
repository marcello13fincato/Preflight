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

  find_clients: `COMPITO: Aiuta l'utente a trovare potenziali clienti su LinkedIn.

Genera:
1. Profilo del cliente ideale basato sui dati dell'utente
2. Keyword per la ricerca LinkedIn
3. Link di ricerca LinkedIn pronto (formato: https://www.linkedin.com/search/results/people/?keywords=...)
4. Filtri consigliati
5. Ruoli alternativi da cercare
6. Prossimi passi concreti

Rispondi con un JSON con ESATTAMENTE questi campi:
{
  "profilo_ideale": "<descrizione precisa di chi contattare>",
  "ruoli_da_cercare": { "principali": ["<ruolo1>", "<ruolo2>"], "alternativi": ["<ruolo1>", "<ruolo2>"] },
  "keyword_consigliate": ["<keyword1>", "<keyword2>", "<keyword3>"],
  "filtri_linkedin": { "settore": "<settore>", "geografia": "<area>", "dimensione_azienda": "<dimensione>", "segnali": "<segnali>" },
  "ricerca_linkedin_pronta": "<query leggibile>",
  "link_ricerca_linkedin": "<URL LinkedIn pronto con %20 per spazi>",
  "come_scegliere_profili": { "ruolo_decisionale": "<criteri>", "segnali_attivita": "<segnali>", "allineamento_tematico": "<criteri>", "fit_servizio": "<criteri>" },
  "strategia_contatto": "<strategia in step>",
  "primo_messaggio": "<messaggio breve e naturale>",
  "prossimo_step": "<cosa fare dopo>"
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
