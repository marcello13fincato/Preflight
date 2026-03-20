import Container from "@/components/shared/Container";
import Section from "@/components/shared/Section";
import Card from "@/components/shared/Card";
import BackButton from "@/components/shared/BackButton";
import MarketingCTA from "@/components/shared/MarketingCTA";
import IconBadge from "@/components/shared/IconBadge";
import { IconTarget, IconChart, IconSparkles } from "@/components/shared/icons";

export default function PercheFunzionaPage() {
  return (
    <main className="min-h-screen">
      <Section className="pt-28 md:pt-32 bg-gradient-to-b from-[rgba(10,102,194,0.04)] to-transparent">
        <Container>
          <div className="pt-8"><BackButton /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-4xl font-bold">Perch&eacute; Preflight funziona (quando altri approcci falliscono)</h1>
                <p className="mt-4 text-muted max-w-3xl">La maggior parte dei professionisti su LinkedIn non sa chi contattare, cosa scrivere e quando fare il passo successivo. Preflight ti d&agrave; un metodo chiaro per passare dal profilo al cliente, senza improvvisare e senza messaggi a freddo che finiscono nel vuoto.</p>
                <div className="mt-6"><MarketingCTA /></div>
              </div>
              <div className="hidden md:block relative">
                <div className="hero-illustration">
                  <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#0A66C2" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#0A66C2" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="600" height="400" rx="20" fill="url(#g1)" />
                    <circle cx="140" cy="120" r="48" fill="#fff" opacity="0.6" />
                    <path d="M220 260c40-60 120-80 180-40v120H0V240c60-40 140-28 220 20z" fill="#fff" opacity="0.06" />
                  </svg>
                </div>
              </div>
            </div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Il vero problema non &egrave; la piattaforma</h2>
          <ul className="mt-6 list-none grid gap-4 md:grid-cols-2">
            <li className="flex items-start gap-3">
              <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Non sai chi contattare tra migliaia di profili</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconBadge><IconChart className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">I tuoi messaggi vengono ignorati o suonano generici</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconBadge><IconSparkles className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Non riesci a passare dalla conversazione a una call</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
              <div>
                <div className="font-semibold">Perdi traccia dei contatti e non fai follow-up</div>
              </div>
            </li>
          </ul>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Cosa succede quando usi Preflight</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <div className="flex items-start gap-3">
                <IconBadge><IconChart className="w-5 h-5" /></IconBadge>
                <div>
                  <h3 className="font-semibold">Identifica</h3>
                  <p className="mt-2 text-muted">Ti dice chi vale la pena contattare e perch&eacute;.</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <IconBadge><IconSparkles className="w-5 h-5" /></IconBadge>
                <div>
                  <h3 className="font-semibold">Guida</h3>
                  <p className="mt-2 text-muted">Ti suggerisce il primo messaggio e i passi successivi.</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <IconBadge><IconTarget className="w-5 h-5" /></IconBadge>
                <div>
                  <h3 className="font-semibold">Converte</h3>
                  <p className="mt-2 text-muted">Ti accompagna fino alla call con follow-up mirati.</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="py-12 bg-soft border-b border-app">
        <Container>
          <h2 className="text-2xl font-semibold">Non &egrave; automazione. &Egrave; metodo.</h2>
          <p className="mt-4 text-muted max-w-3xl">Preflight non invia messaggi al posto tuo e non automatizza nulla. Ti d&agrave; una struttura: chi contattare, cosa scrivere, quando seguire. Tu decidi e personalizzi ogni passo.</p>
          <div className="mt-6"><MarketingCTA /></div>
        </Container>
      </Section>

      <Section className="py-12 bg-app text-app">
        <Container>
          <h2 className="text-2xl font-semibold">Cosa cambia concretamente</h2>
          <ul className="mt-6 list-disc list-inside space-y-2">
            <li>Sai sempre chi contattare e perch&eacute;</li>
            <li>Ogni messaggio ha uno scopo preciso</li>
            <li>Le conversazioni avanzano verso la call</li>
            <li>Non perdi pi&ugrave; contatti caldi per mancanza di follow-up</li>
          </ul>
        </Container>
      </Section>

      <Section className="py-12 bg-soft2 text-app">
        <Container className="text-center">
          <MarketingCTA />
        </Container>
      </Section>
    </main>
  );
}
