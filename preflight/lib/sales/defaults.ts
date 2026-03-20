import type {
  CommentAssistantJson,
  DmAssistantJson,
  OnboardingInput,
  OpportunityFinderJson,
  PlanJson,
  PostBuilderJson,
  ProspectAnalyzerJson,
  SimulatorJson,
} from "./schemas";

export function createDefaultPlan(input: OnboardingInput): PlanJson {
  return {
    positioning: {
      one_liner: input.servizio,
      ideal_customer: input.cliente_ideale,
      problem: input.problema_cliente,
      promise: input.risultato_cliente,
    },
    linkedin_profile: {
      headline: `${input.cliente_ideale}: ${input.risultato_cliente}`,
      about: `Aiuto ${input.cliente_ideale} a ottenere ${input.risultato_cliente}.`,
      cta: "Scrivimi in DM per il prossimo step.",
    },
    plan_14_days: Array.from({ length: 14 }, (_, idx) => ({
      day: idx + 1,
      inbound: `Pubblica un contenuto su ${input.problema_cliente} con CTA verso DM.`,
      outbound: `Contatta 2 profili ${input.cliente_ideale} con domanda iniziale personalizzata.`,
      followup: "Segui 1 conversazione aperta con una domanda di qualificazione.",
    })),
    content_plan: [
      { week: 1, post_type: "educational" as const, topic: input.problema_cliente, hook: "Errore che blocca vendite su LinkedIn", cta: "Commenta per saperne di più" },
      { week: 1, post_type: "case-study" as const, topic: input.risultato_cliente, hook: "Da zero a conversazioni utili", cta: "Scrivimi in DM" },
      { week: 2, post_type: "opinion" as const, topic: input.problema_cliente, hook: "La verità sulle obiezioni in DM", cta: "Vuoi lo script?" },
      { week: 2, post_type: "educational" as const, topic: input.risultato_cliente, hook: "Framework in 3 step", cta: "Salva il post e scrivimi" },
    ],
    outbound_plan: {
      weekly_targets: { connections: 20, dms: 10, followups: 10 },
      linkedin_search_queries: input.linkedin_search_links.length > 0
        ? input.linkedin_search_links
        : [`${input.cliente_ideale}`],
      connection_message_templates: [
        `Ciao, ho visto che lavori su ${input.problema_cliente}. Ti va uno scambio rapido su come lo affrontate ora?`,
      ],
    },
    dm_templates: {
      connect: "Ciao, felice di connettermi. Ho letto il tuo profilo e mi ha colpito il focus sui risultati.",
      dm1: "Domanda veloce: oggi cosa ti blocca di più nel trasformare conversazioni LinkedIn in call?",
      followup48h: "Ti riprendo qui: vuoi che ti condivida un esempio pratico da usare questa settimana?",
      followup5d: "Se utile, posso inviarti uno schema breve per qualificare meglio i lead in DM.",
      followup10d: "Chiudo il loop: ha senso fare 15 minuti per capire se il mio metodo si adatta al tuo caso?",
    },
    comment_playbook: {
      lead_comment_reply: "Ottimo punto. La leve è chiarire problema e prossimo step nel primo blocco del post.",
      curious_comment_reply: "Bella domanda. Posso condividere un esempio concreto in DM se ti va.",
      objection_reply: "Obiezione legittima. Dipende da target e messaggio: posso spiegarti il criterio che uso.",
      pivot_to_dm: "Se vuoi, continuo in DM con un esempio sul tuo caso.",
    },
  };
}

export const defaultPostBuilder = (objective: string, dmKeyword: string): PostBuilderJson => ({
  hooks: [
    "Il problema non e LinkedIn: e il messaggio.",
    "Pubblichi tanto ma arrivano pochi clienti?",
    "3 errori che bloccano le conversazioni in DM.",
    "Il tuo post puo generare call senza essere virale.",
    "Se non chiedi il prossimo passo, perdi vendite.",
  ],
  post_versions: {
    clean: "Molti freelance pubblicano contenuti utili, ma senza una CTA chiara. Se vuoi clienti, trasforma il post in conversazione: problema concreto, prova breve, invito a DM.",
    direct: "Se i tuoi post non portano DM, non e colpa dell'algoritmo. Manca il ponte verso la conversazione. Chiudi con una CTA semplice e keyword unica.",
    authority: "Nelle ultime settimane ho notato un pattern: i post che convertono non sono i piu lunghi, ma quelli con promessa specifica e domanda finale. E li che nasce il DM.",
  },
  cta: `Se vuoi lo schema, commenta '${dmKeyword || "audit"}' e ti scrivo in DM.`,
  comment_starter: "Qual e oggi il punto piu difficile nel passare da commento a conversazione privata?",
  next_step: `Pubblica la versione direct e rispondi ai primi 3 commenti con domanda aperta. Obiettivo: 1 DM in 24h (${objective}).`,
  suggerimento_immagine: {
    tipo: "Foto reale: una foto di te mentre lavori o del tuo ambiente di lavoro. Le immagini autentiche funzionano meglio delle grafiche su LinkedIn.",
    perche_funziona: "Le foto reali aumentano la fiducia e l'engagement perché mostrano la persona dietro il contenuto.",
  },
});

export const defaultCommentAssistant: CommentAssistantJson = {
  comment_type: "curious",
  strategy: "Riconosci il commento, dai valore sintetico, poi apri un ponte in DM con domanda mirata.",
  client_heat_level: "Warm",
  message_risk_warning: "✅ This message opens a good conversation.",
  replies: {
    soft: "Grazie, ottima osservazione. Nel mio caso funziona partire da una domanda chiara per capire priorita e timing.",
    authority: "Concordo sul punto. Dalle conversazioni che vedo ogni settimana, la differenza la fa la qualificazione iniziale in 1 domanda.",
    dm_pivot: "Hai toccato un punto chiave. Se vuoi, ti condivido in DM lo script che uso per qualificare senza fare hard pitch.",
  },
  suggested_dm: "Grazie per il commento. Ti va se ti mando qui 2 righe pratiche su come impostare la prima risposta?",
  next_action: "Invia la versione dm_pivot e, se ricevi apertura, manda suggested_dm entro 10 minuti.",
};

export const defaultDmAssistant: DmAssistantJson = {
  best_reply: "Chiaro. Prima di proporti qualcosa, posso farti una domanda rapida su obiettivo e urgenza?",
  client_heat_level: "Warm",
  message_risk_warning: "✅ This message opens a good conversation.",
  alternatives: {
    short: "Capito. Qual e il risultato che vuoi ottenere entro 30 giorni?",
    assertive: "Perfetto, allineiamoci su priorita: qual e il costo oggi del problema che hai descritto?",
  },
  qualifying_questions: [
    "Qual e il tuo obiettivo principale nei prossimi 30 giorni?",
    "Cosa avete gia provato e perche non ha funzionato?",
    "Se risolviamo questo punto, quale impatto ha su vendite o tempo?",
  ],
  followups: {
    "48h": "Riprendo il messaggio: ha senso se ti condivido un esempio concreto adatto al tuo scenario?",
    "5d": "Ti aggiorno con una risorsa pratica in 3 step. Vuoi che te la mandi qui?",
    "10d": "Chiudo il thread: se vuoi, possiamo fare 15 minuti e capire se c'e fit.",
  },
  next_action: "Invia best_reply e attendi risposta. Se non risponde, usa followup 48h.",
};

export const defaultProspectAnalyzer: ProspectAnalyzerJson = {
  score: 65,
  chi_e: "Professionista del settore B2B con focus su crescita commerciale e gestione pipeline.",
  ruolo_contesto: "Fondatore o responsabile commerciale in un'azienda con 5-50 dipendenti. Gestisce il processo di acquisizione clienti su LinkedIn.",
  punti_forza: [
    "Esperienza consolidata nel settore B2B",
    "Rete di contatti ampia e attiva su LinkedIn",
    "Pubblica contenuti con regolarità",
  ],
  punti_deboli: [
    "Profilo non ottimizzato per la conversione",
    "Manca una call-to-action chiara nel sommario",
  ],
  perche_buon_contatto: "Ha un'esigenza concreta di sistematizzare il processo outbound. Il profilo mostra segnali di interesse verso tematiche di crescita e automazione.",
  strategia_contatto: "Approccio educativo: partire da un contenuto di valore legato al suo problema specifico. Evitare la vendita diretta nel primo messaggio.",
  nota_connessione: "Ho visto il tuo post sulla crescita commerciale — mi occupo dello stesso tema. Mi farebbe piacere connetterci.",
  primo_messaggio: "Ciao, ho letto il tuo profilo e il focus su crescita commerciale: ti va uno scambio rapido su come gestite oggi LinkedIn inbound/outbound?",
  followup_3g: "Riprendo il messaggio — ho un caso studio simile al tuo scenario. Ti interessa se te lo condivido?",
  followup_7g: "Chiudo il thread: se vuoi, possiamo fare 15 minuti e capire se c'è fit. Altrimenti nessun problema!",
  step_successivi: [
    "Invia il primo messaggio oggi",
    "Se accetta, aspetta 24h e poi manda un follow-up di valore",
    "Proponi una call di 15 minuti dopo il secondo scambio",
  ],
  segnali_da_osservare: "Risponde con domande specifiche (caldo). Visualizza senza rispondere (tiepido). Non accetta la connessione (freddo).",
  errori_da_evitare: "Non proporre subito una call. Non mandare messaggi troppo lunghi. Non parlare del proprio servizio nel primo messaggio.",
  client_heat_level: "Cold",
  priority_signal: "medium",
};

export const defaultOpportunityFinder: OpportunityFinderJson = {
  keywords_to_monitor: ["looking for", "any recommendations", "does anyone know"],
  post_types_to_search: [
    "Post con richieste di raccomandazioni",
    "Post con problema operativo aperto",
    "Post con domanda su tool o consulenti",
  ],
  ideal_profiles: [
    { role: "Founder di SaaS", sector: "Tecnologia B2B", company_size: "5–20 persone", why: "Ha bisogno di scalare senza aumentare il team" },
    { role: "Marketing Manager", sector: "Aziende B2B", company_size: "10–50 dipendenti", why: "Gestisce il budget e cerca soluzioni operative" },
    { role: "Consulente HR", sector: "PMI in crescita", company_size: "10–100 persone", why: "Affronta problemi di talent acquisition e retention" },
  ],
  useful_signals: [
    "Pubblica post su problemi operativi ricorrenti",
    "Cerca raccomandazioni su LinkedIn",
    "Commenta su contenuti del tuo settore",
    "Ha cambiato ruolo di recente",
  ],
  linkedin_search_queries: [
    "Founder SaaS B2B Milano",
    "Marketing Manager azienda tecnologia",
    "HR Consultant PMI crescita",
  ],
  conversation_opportunities: [
    "Commenta con una domanda utile e concreta",
    "Condividi mini-esempio pratico senza vendere",
    "Invita la persona a continuare in DM",
  ],
  next_action: "Scegli 1 keyword, trova 5 post oggi e commenta con approccio consulenziale.",
};

export const defaultSimulator: SimulatorJson = {
  prospect_reply: "Interessante. Come lavorate di solito con aziende come la mia?",
  feedback: [
    "Buona domanda iniziale",
    "Messaggio un po' lungo: prova una versione piu breve",
    "Chiudi con una domanda di qualificazione",
  ],
  message_risk_warning: "⚠ This message may sound too salesy.",
  next_action: "Rispondi in 2 frasi: valore + domanda qualificante.",
};
