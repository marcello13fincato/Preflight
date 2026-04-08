import type { DailyPlanJson } from "@/lib/sales/schemas";

/**
 * Demo daily plan used for:
 * - "Vedi esempio" preview (visible to all users)
 * - Free trial generations fallback
 */
export const demoDailyPlan: DailyPlanJson = {
  focus_giornata:
    "Oggi il focus è costruire relazioni con prospect caldi: 2 outreach mirati, 1 follow-up strategico, 1 commento di valore e 1 post per posizionarti.",
  azioni: {
    azione_1: {
      tipo: "commento",
      priorita: "alta",
      contesto: {
        chi: "Marco Bianchi — Founder di una SaaS B2B (CRM per PMI), 2.400 follower su LinkedIn",
        situazione:
          "Ha pubblicato ieri un post in cui racconta che sta assumendo 2 sales per espandere il team commerciale. Il post ha 87 like e 14 commenti, quasi tutti generici.",
      },
      perche_ora:
        "Se sta costruendo un team sales, ha un problema imminente: generare pipeline. Un commento intelligente oggi ti posiziona come esperto prima che inizi a cercare soluzioni esterne.",
      azione_concreta:
        "Vai sul post di Marco Bianchi sull'assunzione sales. Scrivi un commento che aggiunge valore reale — non complimenti. Parla della sfida di dare ai nuovi sales una pipeline calda dal giorno 1.",
      messaggio_suggerito:
        "Marco, costruire il team sales è il passo giusto — ma il vero game changer è che abbiano lead caldi dal giorno 1, non che partano a freddo.\n\nQuando ho lavorato con team in fase di scaling, la differenza l'ha fatta avere un sistema di generazione pipeline attivo PRIMA dell'onboarding.\n\nCurioso di sapere come stai strutturando il loro ramp-up!",
      outcome_atteso:
        "Marco ti nota come qualcuno che capisce il suo problema reale. Alta probabilità che visiti il tuo profilo.",
      prossimo_step:
        "Se Marco risponde o mette like → aspetta 24h poi invia richiesta di connessione personalizzata.",
    },
    azione_2: {
      tipo: "outreach",
      priorita: "alta",
      contesto: {
        chi: "Sara Ferri — Head of Sales in un'azienda di consulenza B2B (50-200 dip.), connessione di 2° grado",
        situazione:
          "Ha interagito con 3 tuoi post nell'ultimo mese (2 like, 1 commento breve). Il suo profilo mostra che gestisce un team di 8 persone e stanno lanciando un nuovo servizio.",
      },
      perche_ora:
        "Tre interazioni in un mese sono un segnale di interesse passivo forte. Il lancio di un nuovo servizio = bisogno di nuovi clienti. Timing ideale.",
      azione_concreta:
        "Invia una richiesta di connessione a Sara con nota personalizzata. Fai riferimento alla sua interazione recente e al nuovo servizio.",
      messaggio_suggerito:
        "Ciao Sara, ho notato che segui alcuni dei miei contenuti su LinkedIn — grazie!\n\nHo visto che state lanciando un nuovo servizio. Lavorando con team sales B2B vedo spesso che il lancio è il momento in cui la pipeline si stressa di più.\n\nTi va uno scambio di 15 min su come altri team gestiscono questa fase? Nessun pitch, solo idee.",
      outcome_atteso:
        "Tasso di accettazione stimato: 60-70% (warm lead). Se accetta, apertura naturale per conversazione consultiva.",
      prossimo_step:
        "Se accetta → aspetta che accetti, poi invia il messaggio. Se non risponde in 7gg → commenta un suo post.",
    },
    azione_3: {
      tipo: "followup",
      priorita: "media",
      contesto: {
        chi: "Luca Martini — CEO di un'agenzia digital (15 persone), hai avuto una call esplorativa 10 giorni fa",
        situazione:
          "Nella call ha detto che il problema principale è convertire i lead inbound (tasso di chiusura al 12%). Ha chiesto di risentirvi 'tra un paio di settimane'.",
      },
      perche_ora:
        "Sono passati 10 giorni — siamo nella finestra che ha indicato lui. Se aspetti oltre 14 giorni, la conversazione si raffredda.",
      azione_concreta:
        "Invia un messaggio DM su LinkedIn. Non ri-proporre la call. Condividi un micro-insight legato al suo problema (conversion rate).",
      messaggio_suggerito:
        "Ciao Luca, dopo la nostra chiacchierata mi è venuto in mente un dato che potrebbe interessarti.\n\nLavorando con agenzie simili, il punto dove si perde di più non è il primo contatto ma il follow-up tra il giorno 3 e il giorno 7 — lì muore il 40% dei deal.\n\nSe vuoi ne parliamo 10 minuti questa settimana. Altrimenti nessun problema!",
      outcome_atteso:
        "Riattivi la conversazione senza sembrare insistente. Probabilità di risposta: 40-50%.",
      prossimo_step:
        "Se risponde → fissa seconda call. Se non risponde entro 5gg → ultimo tentativo con contenuto utile.",
    },
    azione_4: {
      tipo: "contenuto",
      priorita: "media",
      contesto: {
        chi: "Il tuo network LinkedIn — in particolare i 150+ decision-maker tra i tuoi contatti",
        situazione:
          "Non pubblichi un post da 4 giorni. L'algoritmo LinkedIn penalizza i profili inattivi. L'ultimo post ha avuto buone performance (1.200 impression, 34 like).",
      },
      perche_ora:
        "4 giorni senza pubblicare = stai perdendo visibilità. L'algoritmo è 'caldo' su di te dopo l'ultimo post. Pubblicare oggi massimizza la portata.",
      azione_concreta:
        "Pubblica il post preparato nella sezione 'Post del giorno'. Pubblica tra le 8:00 e le 9:30. Nei primi 30 min, rispondi a ogni commento entro 5 min.",
      messaggio_suggerito:
        "La maggior parte dei team sales B2B perde il 40% dei deal nella stessa fase.\n\nNon è il primo contatto. Non è la negoziazione. È il follow-up tra il giorno 3 e il giorno 7.\n\nHo visto team passare dal 12% al 28% di conversion rate con una sola modifica: micro-touchpoint reali in quella finestra.\n\nQual è la fase del tuo processo dove perdi più deal?",
      outcome_atteso:
        "Stima: 1.000-1.500 impression, 20-40 like, 5-10 commenti. Ogni commento è un potenziale prospect.",
      prossimo_step:
        "Rispondi a ogni commento con una domanda. Se un decision-maker commenta → segna come prospect caldo.",
    },
    azione_5: {
      tipo: "ricerca",
      priorita: "bassa",
      contesto: {
        chi: "Nuovi prospect nel settore SaaS/tech B2B con team sales 5-20 persone",
        situazione:
          "Hai lavorato 3 prospect questa settimana tutti nel settore consulenza. Diversificare il pipeline riduce il rischio.",
      },
      perche_ora:
        "Un pipeline concentrato su un solo settore è fragile. Aggiungere 2-3 prospect SaaS ti dà copertura per i prossimi 30 giorni.",
      azione_concreta:
        "Usa LinkedIn Sales Navigator. Filtra: ruolo = Head of Sales/VP Sales/CRO, settore = Software/SaaS, dimensione = 11-200, area = Italia. Salva i primi 5 profili.",
      messaggio_suggerito:
        "Non serve un messaggio. Prepara una nota per ogni profilo:\n• Nome e ruolo\n• Ultimo post o attività rilevante\n• Possibile angolo di contatto\n\nQuesti appunti saranno la base per l'outreach di domani.",
      outcome_atteso:
        "5 nuovi profili qualificati. Almeno 2 con segnale di timing concreto.",
      prossimo_step:
        "Domani: scegli i 2 profili con il segnale più forte e prepara outreach personalizzato.",
    },
  },
  messaggi_pronti: {
    primo_contatto:
      "Ciao Sara, ho notato che segui alcuni dei miei contenuti su LinkedIn — grazie!\n\nHo visto che state lanciando un nuovo servizio. Lavorando con team sales B2B vedo spesso che il lancio è il momento in cui la pipeline si stressa di più.\n\nTi va uno scambio di 15 min su come altri team gestiscono questa fase? Nessun pitch, solo idee.",
    primo_contatto_variante:
      "Ciao Sara, ho visto il tuo commento sul mio post sulla pipeline — mi ha fatto pensare.\n\nCon il lancio del vostro nuovo servizio immagino stiate ragionando su come accelerare i primi deal. Ho qualche insight fresco da condividere.\n\nHai 15 min per un caffè virtuale questa settimana?",
    followup:
      "Ciao Luca, dopo la nostra chiacchierata mi è venuto in mente un dato che potrebbe interessarti.\n\nIl punto dove si perde di più nella conversione non è il primo contatto ma il follow-up tra il giorno 3 e il giorno 7 — lì muore il 40% dei deal.\n\nSe vuoi ne parliamo 10 minuti. Altrimenti nessun problema, so che il periodo è intenso!",
    followup_variante:
      "Luca, un pensiero veloce: ho visto un case study dove un'agenzia come la tua è passata dal 12% al 28% di conversion rate lavorando solo su una fase del funnel.\n\nSe ti interessa te lo giro in 2 righe. Fammi sapere!",
    commento_post:
      "Marco, costruire il team sales è il passo giusto — ma il vero game changer è che abbiano lead caldi dal giorno 1.\n\nQuando ho lavorato con team in fase di scaling, la differenza l'ha fatta avere un sistema di generazione pipeline attivo PRIMA dell'onboarding.\n\nCurioso di sapere come stai strutturando il ramp-up!",
  },
  post_del_giorno: {
    hook: "La maggior parte dei team sales B2B perde il 40% dei deal nella stessa fase.",
    corpo: "Non è il primo contatto.\nNon è la negoziazione.\nÈ il follow-up tra il giorno 3 e il giorno 7.\n\nÈ la terra di nessuno: troppo presto per insistere, troppo tardi per essere top-of-mind.\n\nHo visto team passare dal 12% al 28% di conversion rate con una sola modifica: un sistema di micro-touchpoint (non email automatiche — interazioni reali) in quella finestra.",
    chiusura: "Qual è la fase del tuo processo di vendita dove perdi più deal?",
    testo_completo:
      "La maggior parte dei team sales B2B perde il 40% dei deal nella stessa fase.\n\nNon è il primo contatto.\nNon è la negoziazione.\nÈ il follow-up tra il giorno 3 e il giorno 7.\n\nÈ la terra di nessuno: troppo presto per insistere, troppo tardi per essere top-of-mind.\n\nHo visto team passare dal 12% al 28% di conversion rate con una sola modifica: un sistema di micro-touchpoint (non email automatiche — interazioni reali) in quella finestra.\n\nQual è la fase del tuo processo di vendita dove perdi più deal?",
    tipo_immagine: "Infografica con le 4 fasi del funnel sales e la 'zona rossa' evidenziata tra giorno 3-7",
  },
  link_ricerca_linkedin:
    "https://www.linkedin.com/search/results/people/?keywords=head%20of%20sales%20SaaS&origin=GLOBAL_SEARCH_HEADER",
};
