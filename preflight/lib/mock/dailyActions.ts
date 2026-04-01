import type { DailyAction } from "@/components/app/DailyActionCard";

export const demoDailyActions: DailyAction[] = [
  {
    tipo: "commento",
    priorita: "alta",
    contesto: {
      chi: "Marco Bianchi — Founder di una SaaS B2B (CRM per PMI), 2.400 follower su LinkedIn",
      situazione:
        'Ha pubblicato ieri un post in cui racconta che sta assumendo 2 sales per espandere il team commerciale. Il post ha 87 like e 14 commenti, quasi tutti generici ("complimenti!", "in bocca al lupo").',
    },
    perche_ora:
      "Se sta costruendo un team sales, ha un problema imminente: generare pipeline. Il fatto che assuma ora indica budget allocato e urgenza. Un commento intelligente oggi ti posiziona come esperto prima che inizi a cercare soluzioni esterne.",
    azione_concreta:
      "Vai sul post di Marco Bianchi sull'assunzione sales. Scrivi un commento che aggiunge valore reale — non complimenti. Parla della sfida di dare ai nuovi sales una pipeline calda dal giorno 1. Non vendere nulla, condividi un'esperienza concreta.",
    messaggio_suggerito:
      "Marco, costruire il team sales è il passo giusto — ma il vero game changer è che abbiano lead caldi dal giorno 1, non che partano a freddo.\n\nQuando ho lavorato con team in fase di scaling, la differenza l'ha fatta avere un sistema di generazione pipeline attivo PRIMA dell'onboarding.\n\nCurioso di sapere come stai strutturando il loro ramp-up!",
    outcome_atteso:
      "Marco ti nota come qualcuno che capisce il suo problema reale (pipeline, non HR). Alta probabilità che visiti il tuo profilo. Se il commento genera risposte, diventa una conversazione pubblica che ti posiziona.",
    prossimo_step:
      "Se Marco risponde o mette like → aspetta 24h poi invia una richiesta di connessione personalizzata. Se non risponde → commenta un suo prossimo post entro 5 giorni per consolidare la presenza.",
  },
  {
    tipo: "outreach",
    priorita: "alta",
    contesto: {
      chi: "Sara Ferri — Head of Sales in un'azienda di consulenza B2B (50-200 dipendenti), connessione di 2° grado",
      situazione:
        "Ha interagito con 3 tuoi post nell'ultimo mese (2 like, 1 commento breve). Non avete mai parlato in DM. Il suo profilo mostra che gestisce un team di 8 persone e il loro sito indica che stanno lanciando un nuovo servizio.",
    },
    perche_ora:
      "Tre interazioni in un mese sono un segnale di interesse passivo forte. Il lancio di un nuovo servizio significa che hanno bisogno di nuovi clienti per quel servizio — il timing per proporre una conversazione è ideale. Ogni settimana che passa raffredda il segnale.",
    azione_concreta:
      "Invia una richiesta di connessione a Sara con nota personalizzata. Fai riferimento alla sua interazione recente e al nuovo servizio. Non vendere, proponi uno scambio di idee.",
    messaggio_suggerito:
      "Ciao Sara, ho notato che segui alcuni dei miei contenuti su LinkedIn — grazie!\n\nHo visto che state lanciando un nuovo servizio. Lavorando con team sales B2B vedo spesso che il lancio è il momento in cui la pipeline si stressa di più.\n\nTi va uno scambio di 15 min su come altri team gestiscono questa fase? Nessun pitch, solo idee.",
    outcome_atteso:
      "Tasso di accettazione stimato: 60-70% (warm lead per le interazioni pregresse). Se accetta, hai un'apertura naturale per una conversazione consultiva che può sfociare in una demo.",
    prossimo_step:
      "Se accetta la connessione → aspetta che accetti, poi invia il messaggio. Se non risponde in 7 giorni → commenta un suo post per restare visibile, poi riprova.",
  },
  {
    tipo: "followup",
    priorita: "media",
    contesto: {
      chi: "Luca Martini — CEO di un'agenzia digital (15 persone), hai avuto una call esplorativa 10 giorni fa",
      situazione:
        "Nella call ha detto che il problema principale è convertire i lead inbound in clienti (tasso di chiusura al 12%). Ha chiesto di risentirvi 'tra un paio di settimane'. Non ha risposto al tuo recap post-call.",
    },
    perche_ora:
      "Sono passati 10 giorni — siamo nella finestra che ha indicato lui. Il fatto che non abbia risposto al recap non è necessariamente negativo: i CEO sono occupati. Ma se aspetti oltre 14 giorni, la conversazione si raffredda e ripartire diventa molto più difficile.",
    azione_concreta:
      "Invia un messaggio DM su LinkedIn (non email — LinkedIn ha un tasso di apertura più alto per lui). Non ri-proporre la call. Condividi un micro-insight legato al suo problema specifico (conversion rate) per riattivare l'interesse.",
    messaggio_suggerito:
      "Ciao Luca, dopo la nostra chiacchierata mi è venuto in mente un dato che potrebbe interessarti.\n\nLavorando con agenzie simili alla tua, il punto dove si perde di più nella conversione non è il primo contatto ma il follow-up tra il giorno 3 e il giorno 7 — è lì che il 40% dei deal muore.\n\nSe vuoi ne parliamo 10 minuti questa settimana. Altrimenti nessun problema, so che il periodo è intenso!",
    outcome_atteso:
      "Riattivi la conversazione senza sembrare insistente. Il micro-insight dimostra competenza e dà a Luca un motivo concreto per rispondere. Probabilità di risposta: 40-50%.",
    prossimo_step:
      "Se risponde → fissa una seconda call focalizzata sulla diagnosi del suo funnel. Se non risponde entro 5 giorni → ultimo tentativo con un contenuto utile (es. un articolo/case study), poi pausa di 30 giorni.",
  },
  {
    tipo: "contenuto",
    priorita: "media",
    contesto: {
      chi: "Il tuo network LinkedIn — in particolare i 150+ decision-maker tra i tuoi contatti",
      situazione:
        "Non pubblichi un post da 4 giorni. L'algoritmo LinkedIn penalizza i profili inattivi. Il tuo ultimo post ha avuto buone performance (1.200 impression, 34 like). C'è momentum da mantenere.",
    },
    perche_ora:
      "4 giorni senza pubblicare significa che stai perdendo visibilità nel feed dei tuoi contatti. Il post precedente ha performato bene → l'algoritmo è 'caldo' su di te. Pubblicare oggi massimizza la portata. Inoltre, i contenuti pubblicati il martedì/mercoledì mattina hanno il 23% in più di engagement nel B2B.",
    azione_concreta:
      "Pubblica il post preparato nella sezione 'Post del giorno'. Pubblica tra le 8:00 e le 9:30. Nei primi 30 minuti dopo la pubblicazione, rispondi a ogni commento entro 5 minuti per attivare l'algoritmo.",
    messaggio_suggerito:
      "La maggior parte dei team sales B2B perde il 40% dei deal nella stessa fase.\n\nNon è il primo contatto.\nNon è la negoziazione.\nÈ il follow-up tra il giorno 3 e il giorno 7.\n\nÈ la terra di nessuno: troppo presto per insistere, troppo tardi per essere top-of-mind.\n\nHo visto team passare dal 12% al 28% di conversion rate con una sola modifica: un sistema di micro-touchpoint (non email automatiche — interazioni reali) in quella finestra.\n\nQual è la fase del tuo processo di vendita dove perdi più deal?",
    outcome_atteso:
      "Stima: 1.000-1.500 impression, 20-40 like, 5-10 commenti. Ogni commento è un potenziale inizio di conversazione con un prospect. Il post ti posiziona come esperto di sales process, non come venditore.",
    prossimo_step:
      "Rispondi a ogni commento con una domanda per approfondire. Se un decision-maker commenta → segna come prospect caldo e pianifica un outreach personalizzato domani.",
  },
  {
    tipo: "ricerca",
    priorita: "bassa",
    contesto: {
      chi: "Nuovi prospect nel settore SaaS/tech B2B con team sales 5-20 persone",
      situazione:
        "Hai lavorato 3 prospect questa settimana, ma tutti erano nel settore consulenza. Diversificare il pipeline riduce il rischio. Il settore SaaS ha un ciclo di vendita più breve e budget più prevedibili.",
    },
    perche_ora:
      "Un pipeline concentrato su un solo settore è fragile. Se il settore consulenza rallenta (tipico nei periodi estivi), resti senza deal attivi. Aggiungere 2-3 prospect SaaS oggi ti dà una copertura per i prossimi 30 giorni.",
    azione_concreta:
      "Usa LinkedIn Sales Navigator (o la ricerca avanzata). Filtra per: ruolo = 'Head of Sales' OR 'VP Sales' OR 'CRO', settore = 'Software' OR 'SaaS', dimensione azienda = 11-200, area = Italia. Salva i primi 5 profili interessanti. Per ognuno, controlla: ultimo post (< 30 giorni = attivo), dimensione team, segnali di crescita.",
    messaggio_suggerito:
      "Non serve un messaggio per questa azione. Prepara invece una nota per ogni profilo trovato:\n\n• Nome e ruolo\n• Ultimo post o attività rilevante\n• Possibile angolo di contatto (es. 'sta assumendo', 'ha commentato su X', 'il suo team è cresciuto del 40%')\n\nQuesti appunti saranno la base per l'outreach di domani.",
    outcome_atteso:
      "5 nuovi profili qualificati nel CRM. Almeno 2 con un segnale di timing concreto (assunzione, lancio, funding). Questo ti dà materiale per 2-3 outreach mirati nei prossimi giorni.",
    prossimo_step:
      "Domani: scegli i 2 profili con il segnale più forte e prepara un outreach personalizzato per ciascuno. Se trovi qualcuno che ha pubblicato un post rilevante → commenta oggi stesso per scaldarti il contatto.",
  },
];
