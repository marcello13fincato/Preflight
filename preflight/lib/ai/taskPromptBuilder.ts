import { getSystemPrompt } from "./systemPrompt";
import { type AIContext, formatContext } from "./contextBuilder";

export type TaskType = "analyze_profile" | "find_clients" | "ask_advice";

const TASK_INSTRUCTIONS: Record<TaskType, string> = {
  analyze_profile: `COMPITO: Analizza il profilo LinkedIn del prospect come un consulente commerciale senior con 15+ anni di esperienza.

NON scrivere come un'AI. Scrivi come un professionista che dà un parere diretto, concreto, utile.

Valuta:
1. Chi è questa persona (ruolo, settore, posizionamento)
2. Verdetto chiaro: vale la pena contattarlo? Con che priorità?
3. Segnali concreti con implicazione commerciale
4. Perché è un buon contatto (fit, timing, potenziale)
5. Angolo di attacco specifico (non generico)
6. Messaggio breve e contestuale
7. Follow-up con timing e obiettivo
8. Errori specifici da evitare
9. Prossimo step concreto

REGOLE DI STILE:
- Ogni segnale deve spiegare COSA significa e QUALE implicazione commerciale ha
- Il verdetto deve essere netto, non diplomatico
- L'angolo di attacco deve essere specifico al profilo, mai generico
- I messaggi devono essere brevi (max 3 righe) e contestuali
- Gli errori devono essere realistici e specifici, non ovvi

Rispondi con un JSON con ESATTAMENTE questi campi:
{
  "score": <0-100>,
  "chi_e": "<chi è, ruolo, settore — 1 frase>",
  "ruolo_contesto": "<ruolo nel dettaglio, contesto aziendale — 2 frasi max>",
  "verdetto": {
    "vale_la_pena": "<Sì | No | Debole>",
    "priorita": "<Alta | Media | Bassa>",
    "confidenza": "<Alta | Media | Bassa>",
    "sintesi": "<1 frase secca che spiega il perché>"
  },
  "segnali": [
    { "tipo": "<tipo segnale>", "significato": "<cosa significa>", "implicazione_commerciale": "<implicazione>" },
    ...almeno 2, max 5
  ],
  "perche": {
    "fit_con_target": "<perché il profilo è in target>",
    "timing": "<perché è il momento giusto>",
    "potenziale": "<qual è il potenziale commerciale>"
  },
  "angolo_attacco": {
    "tema": "<tema specifico da usare>",
    "leva": "<leva commerciale>",
    "cosa_evitare": "<cosa NON fare>"
  },
  "nota_connessione": "<messaggio breve per la richiesta di connessione, max 2 righe>",
  "primo_messaggio": "<messaggio dopo accettazione, max 3 righe, contestuale>",
  "followup": {
    "quando": "<dopo quanti giorni>",
    "cosa_citare": "<elemento specifico da citare>",
    "obiettivo": "<obiettivo del follow-up>",
    "messaggio": "<testo del follow-up>"
  },
  "errori_da_evitare": ["<errore specifico 1>", "<errore specifico 2>", "<errore specifico 3>"],
  "prossimo_step": "<azione concreta e semplice>",
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
