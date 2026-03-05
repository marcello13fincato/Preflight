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
      one_liner: input.offer_one_liner,
      ideal_customer: `${input.icp_role} in ${input.icp_industry}`,
      problem: input.icp_main_problem,
      promise: input.offer_outcome,
    },
    linkedin_profile: {
      headline: `${input.icp_role}: ${input.offer_outcome}`,
      about: `Aiuto ${input.icp_role} nel settore ${input.icp_industry} a ottenere ${input.offer_outcome} in ${input.offer_delivery_time}.`,
      cta: "Scrivimi 'audit' in DM per il prossimo step.",
    },
    plan_14_days: Array.from({ length: 14 }, (_, idx) => ({
      day: idx + 1,
      inbound: `Pubblica un contenuto su ${input.icp_main_problem} con CTA verso DM.`,
      outbound: `Contatta 2 profili ${input.icp_role} con domanda iniziale personalizzata.`,
      followup: "Segui 1 conversazione aperta con una domanda di qualificazione.",
    })),
    content_plan: [
      { week: 1, post_type: "educational", topic: input.icp_main_problem, hook: "Errore che blocca vendite su LinkedIn", cta: "Commenta 'audit'" },
      { week: 1, post_type: "case-study", topic: input.proof_case_study, hook: "Da zero a conversazioni utili", cta: "Scrivimi in DM" },
      { week: 2, post_type: "opinion", topic: `Obiezione: ${input.icp_top_objections[0] || "non ho tempo"}`, hook: "La verita sulle obiezioni in DM", cta: "Vuoi lo script?" },
      { week: 2, post_type: "educational", topic: input.offer_outcome, hook: "Framework in 3 step", cta: "Salva il post e scrivimi" },
    ],
    outbound_plan: {
      weekly_targets: { connections: 20, dms: 10, followups: 10 },
      linkedin_search_queries: [
        `${input.icp_role} ${input.icp_industry}`,
        `${input.icp_role} ${input.icp_company_size}`,
      ],
      connection_message_templates: [
        `Ciao, ho visto che lavori su ${input.icp_main_problem}. Ti va uno scambio rapido su come lo affrontate ora?`,
      ],
    },
    dm_templates: {
      connect: "Ciao, felice di connettermi. Ho letto il tuo profilo e mi ha colpito il focus sui risultati.",
      dm1: "Domanda veloce: oggi cosa ti blocca di piu nel trasformare conversazioni LinkedIn in call?",
      followup48h: "Ti riprendo qui: vuoi che ti condivida un esempio pratico da usare questa settimana?",
      followup5d: "Se utile, posso inviarti uno schema breve per qualificare meglio i lead in DM.",
      followup10d: "Chiudo il loop: ha senso fare 15 minuti per capire se il mio metodo si adatta al tuo caso?",
    },
    comment_playbook: {
      lead_comment_reply: "Ottimo punto. La leva e chiarire problema e prossimo step nel primo blocco del post.",
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
  likely_pains: [
    "Lead non qualificati in ingresso",
    "Conversazioni LinkedIn non convertite in call",
    "Processo outbound poco costante",
  ],
  angles: [
    "Framework di qualificazione in DM",
    "Piano 14 giorni con azioni giornaliere",
    "Messaggi basati su obiezioni reali",
  ],
  connection_opener: "Ciao, ho letto il tuo profilo e il focus su crescita commerciale: ti va uno scambio rapido su come gestite oggi LinkedIn inbound/outbound?",
  dm1: "Domanda diretta: qual e il collo di bottiglia principale tra commenti, DM e call prenotate?",
  smart_questions: [
    "Quante conversazioni LinkedIn aprite a settimana?",
    "Qual e il tasso attuale commento -> DM?",
    "Chi gestisce oggi follow-up e timing?",
    "Che tipo di prospect risponde meglio?",
    "Quale obiezione blocca piu spesso la call?",
  ],
  client_heat_level: "Cold",
  priority_signal: "medium",
  next_action: "Invia il connection_opener oggi e, dopo accettazione, manda dm1 entro 24 ore.",
};

export const defaultOpportunityFinder: OpportunityFinderJson = {
  post_types_to_search: [
    "Post con richieste di raccomandazioni",
    "Post con problema operativo aperto",
    "Post con domanda su tool o consulenti",
  ],
  keywords_to_monitor: ["looking for", "any recommendations", "does anyone know"],
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
