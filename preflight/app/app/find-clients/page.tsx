"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import HistoryList from "@/components/app/HistoryList";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { findClientsSchema, type FindClientsJson } from "@/lib/sales/schemas";

const DIMENSIONE_OPTIONS = [
  { value: "", label: "Qualsiasi" },
  { value: "freelance", label: "Freelance" },
  { value: "startup", label: "Startup" },
  { value: "PMI", label: "PMI" },
  { value: "enterprise", label: "Enterprise" },
] as const;

const FASE_OPTIONS = [
  { value: "", label: "Non so" },
  { value: "early_stage", label: "Early stage" },
  { value: "crescita", label: "Crescita" },
  { value: "strutturata", label: "Strutturata" },
] as const;

const TARGETING_STORAGE_KEY = "preflight:last-targeting";

function saveTargetingResult(userId: string, result: FindClientsJson) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${TARGETING_STORAGE_KEY}:${userId}`,
    JSON.stringify({ result, savedAt: new Date().toISOString() }),
  );
}

/* ── Copy button inline (same pattern as oggi page) ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className={`oggi-copy-btn ${copied ? "oggi-copy-done" : ""}`}>
      {copied ? (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copiato</>
      ) : (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copia</>
      )}
    </button>
  );
}

/* ── Quick tool links (matches oggi page) ── */
const QUICK_TOOLS = [
  { href: "/app", title: "Cosa fare oggi", desc: "Piano quotidiano AI personalizzato." },
  { href: "/app/prospect", title: "Analizza profilo", desc: "Valuta fit e angolo di attacco." },
  { href: "/app/post", title: "Scrivi un post", desc: "Post con hook, CTA e immagine." },
  { href: "/app/articolo", title: "Scrivi un articolo", desc: "Articolo autorevole con SEO." },
];

export default function FindClientsPage() {
  const { userId, status } = useRequireAuth();
  const repo = useMemo(() => getRepositoryBundle(), []);

  const profile = userId ? repo.profile.getProfile(userId) : { onboarding: null, plan: null, onboarding_complete: false };
  const onboarding = profile.onboarding as Record<string, unknown> | null;

  const [ruoloTarget, setRuoloTarget] = useState("");
  const [settore, setSettore] = useState("");
  const [area, setArea] = useState("");
  const [citta, setCitta] = useState("");
  const [dimensione, setDimensione] = useState("");
  const [faseAzienda, setFaseAzienda] = useState("");
  const [problemaCliente, setProblemaCliente] = useState("");
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [searchMode, setSearchMode] = useState<"manual" | "profile">("manual");
  const [output, setOutput] = useState<FindClientsJson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);
  const [activeMsg, setActiveMsg] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!onboarding || prefilled) return;
    const ob = onboarding;
    if (ob.cliente_ideale && !ruoloTarget) setRuoloTarget(String(ob.cliente_ideale));
    if (ob.problema_cliente && !problemaCliente) setProblemaCliente(String(ob.problema_cliente));
    setPrefilled(true);
  }, [onboarding, prefilled, ruoloTarget, problemaCliente]);

  function toggleCheck(i: number) {
    setCheckedItems((prev) => { const next = [...prev]; next[i] = !next[i]; return next; });
  }

  async function generate() {
    if (searchMode === "manual" && !ruoloTarget.trim()) return;
    if (searchMode === "profile" && !linkedinProfileUrl.trim()) return;
    if (loading) return;
    setLoading(true);
    setError(null);
    setCheckedItems([false, false, false, false, false]);
    setLoadingStep(0);
    const stepTimer = setInterval(() => setLoadingStep((s) => Math.min(s + 1, 3)), 2500);
    try {
      let pdfText = "";
      if (pdfFile) {
        pdfText = `[PDF caricato: ${pdfFile.name}]`;
      }
      const res = await fetch("/api/ai/find-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruolo_target: searchMode === "profile"
            ? `Trova profili simili a questo profilo LinkedIn: ${linkedinProfileUrl.trim()}`
            : ruoloTarget.trim(),
          settore: settore.trim() || undefined,
          area_geografica: area.trim() || undefined,
          citta: citta.trim() || undefined,
          dimensione: dimensione || undefined,
          fase_azienda: faseAzienda || undefined,
          problema_cliente: problemaCliente.trim() || undefined,
          linkedin_profile_url: linkedinProfileUrl.trim() || undefined,
          pdf_text: pdfText || undefined,
          profile: onboarding || undefined,
        }),
      });
      const json: Record<string, unknown> = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : `Errore API (${res.status})`);
      }
      const parsed = findClientsSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Risposta AI non valida. Riprova.");
      }
      setOutput(parsed.data);
      saveTargetingResult(userId!, parsed.data);
      repo.interaction.addInteraction(userId!, "prospect", `Targeting: ${ruoloTarget}`, parsed.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto. Riprova.");
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  }

  const completedCount = checkedItems.filter(Boolean).length;
  const progressPct = Math.round((completedCount / 5) * 100);

  function resetSearch() {
    setOutput(null);
    setError(null);
    setCheckedItems([false, false, false, false, false]);
  }

  /* ═══════════════════════════════════════════
     AUTH LOADING GUARD
     ═══════════════════════════════════════════ */
  if (status === "loading" || !userId) {
    return <div className="tool-page"><div className="tool-page-hero"><p>Caricamento...</p></div></div>;
  }

  /* ═══════════════════════════════════════════
     RESULTS VIEW — Oggi-style flat layout
     ═══════════════════════════════════════════ */
  if (output) {
    return (
      <div className="oggi-v2-page pt-6 fade-in" style={{ background: "#EBF0FA", minHeight: "100vh" }}>
        {/* ── Hero — matching oggi-page hero ── */}
        <div className="relative overflow-hidden rounded-2xl p-7 mb-6 bg-gradient-to-br from-[#1E3A6E] via-[#1E4A8A] to-[#162F5C]">
          <div className="pointer-events-none">
            <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_65%)]" />
            <div className="absolute -bottom-16 left-2 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)]" />
            <div className="absolute top-4 left-44 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.13),transparent_70%)]" />
          </div>
          <div className="relative z-10">
            <button type="button" onClick={resetSearch} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/50 hover:text-white/80 transition mb-3 bg-transparent border-none cursor-pointer font-[inherit]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Nuova ricerca
            </button>
            <div className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
              Targeting AI — Risultati
            </div>
            <h1 className="text-[27px] font-extrabold text-white tracking-tight leading-tight mb-1">
              {output.categoria_prioritaria.titolo}
            </h1>
            <p className="text-[13.5px] text-white/50 mb-5">
              {output.riepilogo_strategia}
            </p>
            <div className="flex items-center border-t border-white/10 mt-5 pt-5">
              <div className="flex-1">
                <div className="text-[22px] font-extrabold text-white">{output.categorie_alternative.length + 1}</div>
                <div className="text-[11px] text-white/35 font-medium">Categorie target</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-green-400">4</div>
                <div className="text-[11px] text-white/35 font-medium">Messaggi pronti</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-white">{completedCount}/5</div>
                <div className="text-[11px] text-white/35 font-medium">Azioni completate</div>
              </div>
              <div className="flex-1 border-l border-white/10 pl-5">
                <div className="text-[22px] font-extrabold text-white">{progressPct}%</div>
                <div className="text-[11px] text-white/35 font-medium">Progresso</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Plan blocks — same structure as oggi ── */}
        <div className="space-y-6">

          {/* ═══ BLOCK 1 — Target prioritario ═══ */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Target prioritario
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Priorità #1
              </span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-[17px] font-extrabold text-slate-900 tracking-tight m-0 mb-1">{output.categoria_prioritaria.titolo}</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed m-0">{output.categoria_prioritaria.descrizione}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block mb-1">Perché ora</span>
                  <p className="text-[13px] text-slate-700 leading-relaxed m-0">{output.categoria_prioritaria.perche_ora}</p>
                </div>
                <div className="bg-amber-50/50 border border-amber-100/80 rounded-xl p-4">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block mb-1">Segnali da cercare</span>
                  <p className="text-[13px] text-slate-700 leading-relaxed m-0">{output.categoria_prioritaria.segnali_profilo}</p>
                </div>
              </div>
              <a href={output.categoria_prioritaria.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="fcp-linkedin-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Apri ricerca su LinkedIn
              </a>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Nota di connessione</span>
                    <CopyBtn text={output.categoria_prioritaria.messaggio_connessione} />
                  </div>
                  <p className="text-[13px] text-slate-700 leading-relaxed m-0 italic">{output.categoria_prioritaria.messaggio_connessione}</p>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Primo DM dopo accettazione</span>
                    <CopyBtn text={output.categoria_prioritaria.messaggio_dopo_accettazione} />
                  </div>
                  <p className="text-[13px] text-slate-700 leading-relaxed m-0 italic">{output.categoria_prioritaria.messaggio_dopo_accettazione}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ BLOCK 2 — Sequenza messaggi ═══ */}
          <section className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Sequenza messaggi
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                3 varianti pronte
              </span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <div className="border-l-[3px] border-l-indigo-400 bg-indigo-50/30 rounded-lg p-3 mb-4">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Approccio consigliato</span>
                <p className="text-[13px] text-slate-700 leading-relaxed m-0">{output.strategia_contatto.approccio_step}</p>
              </div>
              <div className="oggi-msg-tabs">
                {["Primo messaggio", "Follow-up 48h", "Follow-up 5 giorni"].map((label, i) => (
                  <button key={label} type="button" className={`oggi-msg-tab ${activeMsg === i ? "oggi-msg-tab--active" : ""}`} onClick={() => setActiveMsg(i)}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                    {activeMsg === 0 ? "Primo messaggio" : activeMsg === 1 ? "Follow-up 48h" : "Follow-up 5 giorni"}
                  </span>
                  <CopyBtn text={
                    activeMsg === 0 ? output.strategia_contatto.primo_messaggio :
                    activeMsg === 1 ? output.strategia_contatto.followup_48h :
                    output.strategia_contatto.followup_5g
                  } />
                </div>
                <p className="text-[13.5px] text-slate-700 leading-relaxed m-0 whitespace-pre-wrap">
                  {activeMsg === 0 ? output.strategia_contatto.primo_messaggio :
                   activeMsg === 1 ? output.strategia_contatto.followup_48h :
                   output.strategia_contatto.followup_5g}
                </p>
              </div>
            </div>
          </section>

          {/* ═══ BLOCK 3 — Categorie alternative ═══ */}
          <section className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Categorie alternative
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {output.categorie_alternative.length} profili
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {output.categorie_alternative.map((cat, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(37,99,235,0.06)] transition-all duration-200 animate-fadeup" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-[12px] font-extrabold flex items-center justify-center flex-shrink-0">{i + 2}</span>
                    <h4 className="text-[15px] font-extrabold text-slate-900 tracking-tight m-0">{cat.titolo}</h4>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed m-0">{cat.descrizione}</p>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Perché ora</span>
                    <p className="text-[12.5px] text-slate-600 leading-relaxed m-0">{cat.perche_ora}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">Segnali</span>
                    <p className="text-[12.5px] text-slate-600 leading-relaxed m-0">{cat.segnali_profilo}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={cat.link_ricerca_linkedin} target="_blank" rel="noopener noreferrer" className="fcp-linkedin-btn-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      LinkedIn
                    </a>
                    <CopyBtn text={cat.messaggio_connessione} />
                  </div>
                  <div className="border-l-[3px] border-l-blue-300 bg-blue-50/40 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block mb-1">Nota connessione</span>
                    <p className="text-[12.5px] text-slate-700 leading-relaxed m-0 italic">{cat.messaggio_connessione}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ BLOCK 4 — Criteri di selezione ═══ */}
          <section className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Criteri di selezione
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border border-emerald-100 rounded-xl p-4 bg-gradient-to-br from-emerald-50/50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Segnali positivi</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed m-0">{output.criteri_selezione.segnali_positivi}</p>
              </div>
              <div className="bg-white border border-red-100 rounded-xl p-4 bg-gradient-to-br from-red-50/30 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Red flags</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed m-0">{output.criteri_selezione.red_flags}</p>
              </div>
              <div className="bg-white border border-blue-100 rounded-xl p-4 bg-gradient-to-br from-blue-50/30 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Attività recente</span>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed m-0">{output.criteri_selezione.attivita_recente}</p>
              </div>
            </div>
          </section>

          {/* ═══ BLOCK 5 — Azioni da completare ═══ */}
          <section className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Azioni da completare
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {completedCount}/5 completate
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-[5px] bg-slate-100 rounded-full overflow-hidden">
                <div className="h-[5px] bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400">{progressPct}%</span>
            </div>
            <div className="space-y-2">
              {output.checklist_azioni.map((azione, i) => (
                <button key={i} type="button"
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left font-[inherit] ${
                    checkedItems[i]
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm"
                  }`}
                  onClick={() => toggleCheck(i)}
                >
                  <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[12px] font-bold transition-all ${
                    checkedItems[i]
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}>
                    {checkedItems[i] ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={`text-[13.5px] leading-relaxed ${checkedItems[i] ? "text-slate-400 line-through" : "text-slate-800"}`}>
                    {azione}
                  </span>
                </button>
              ))}
            </div>
            {completedCount === 5 && (
              <div className="flex items-center gap-3 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeup">
                <span className="text-xl">🏆</span>
                <div>
                  <strong className="text-[13.5px] text-slate-800 block">Tutte le azioni completate!</strong>
                  <p className="text-[12px] text-slate-500 m-0">Ottimo lavoro. Passa al prossimo step.</p>
                </div>
              </div>
            )}
          </section>

          {/* ═══ Prossimo step ═══ */}
          <section className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Prossimo step
              </span>
            </div>
            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">{output.prossimo_step}</p>
            <div className="grid grid-cols-3 gap-3">
              <Link href="/app/prospect" className="flex items-center gap-2 p-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-[13px] font-semibold no-underline hover:shadow-lg transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Analizza profilo
              </Link>
              <Link href="/app/articolo" className="flex items-center gap-2 p-3.5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-700 no-underline hover:border-blue-200 hover:shadow-sm transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Scrivi articolo
              </Link>
              <Link href="/app" className="flex items-center gap-2 p-3.5 bg-white border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-700 no-underline hover:border-blue-200 hover:shadow-sm transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Cosa fare oggi
              </Link>
            </div>
          </section>

          {/* ── Strumenti — matching oggi ── */}
          <section className="border-t border-slate-100 pt-4 mt-4 fade-in-delay">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
              Strumenti
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_TOOLS.map((t, i) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="bg-white border border-slate-100 rounded-[14px] p-4 flex flex-col gap-2 no-underline hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 animate-fadeup"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-[13px] font-extrabold text-slate-900 tracking-tight">{t.title}</span>
                  <span className="text-[12px] text-slate-500 leading-relaxed">{t.desc}</span>
                  <span className="text-[12px] font-semibold text-blue-700 mt-auto">Apri →</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="flex justify-center pt-2">
            <button type="button" onClick={resetSearch} className="btn-ghost">
              🔄 Nuova ricerca
            </button>
          </div>
        </div>

        <HistoryList userId={userId} type="prospect" />
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     INPUT VIEW — Oggi-style form experience
     ═══════════════════════════════════════════ */
  return (
    <div className="oggi-v2-page pt-6 fade-in" style={{ background: "#EBF0FA", minHeight: "100vh" }}>
      {/* ── Hero — matching oggi-page hero ── */}
      <div className="relative overflow-hidden rounded-2xl p-7 mb-6 bg-gradient-to-br from-[#1E3A6E] via-[#1E4A8A] to-[#162F5C]">
        <div className="pointer-events-none">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_65%)]" />
          <div className="absolute -bottom-16 left-2 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_65%)]" />
          <div className="absolute top-4 left-44 w-24 h-24 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.13),transparent_70%)]" />
        </div>
        <div className="relative z-10">
          <div className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
            Motore di targeting AI
          </div>
          <h1 className="text-[27px] font-extrabold text-white tracking-tight leading-tight mb-1">
            Trova i tuoi clienti
          </h1>
          <p className="text-[13.5px] text-white/50 mb-5">
            Descrivi il tuo target. L&apos;AI genera categorie, segnali, messaggi e strategia — tutto pronto da usare.
          </p>
          <div className="flex items-center gap-4 border-t border-white/10 mt-5 pt-5">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/55">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              3 categorie target
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/55">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              5 messaggi pronti
            </span>
            <span className="w-px h-3.5 bg-white/20" />
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/55">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              5 azioni checklist
            </span>
          </div>
        </div>
      </div>

      {/* ── Form section — hidden during loading (matches oggi pattern) ── */}
      {!loading && (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[17px] font-extrabold text-slate-900 tracking-tight m-0">Definisci il target</h2>
            <p className="text-[13px] text-slate-500 m-0 mt-0.5">Più dettagli dai, più precise saranno le categorie e i messaggi.</p>
          </div>
        </div>

        {prefilled && onboarding && (
          <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Alcuni campi precompilati dal tuo profilo.
          </div>
        )}

        {/* Mode toggle */}
        <div className="oggi-msg-tabs" style={{ marginBottom: "1.25rem" }}>
          <button type="button" className={`oggi-msg-tab ${searchMode === "manual" ? "oggi-msg-tab--active" : ""}`} onClick={() => setSearchMode("manual")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            {" "}Descrivi il target
          </button>
          <button type="button" className={`oggi-msg-tab ${searchMode === "profile" ? "oggi-msg-tab--active" : ""}`} onClick={() => setSearchMode("profile")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {" "}Da un profilo LinkedIn
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          {searchMode === "profile" ? (
            <>
              <div className="qa-field">
                <label className="qa-label">Link profilo LinkedIn <span className="fc-required">*</span></label>
                <input type="url" value={linkedinProfileUrl} onChange={(e) => setLinkedinProfileUrl(e.target.value)} className="qa-input"
                  placeholder="https://linkedin.com/in/nomecognome" />
                <p className="qa-field-hint">Incolla il link di un profilo e troveremo categorie di persone simili da contattare.</p>
              </div>
              <div className="qa-field">
                <label className="qa-label">PDF del profilo <span className="qa-label-opt">(facoltativo)</span></label>
                <label className="qa-file-upload">
                  <input type="file" accept=".pdf" className="qa-file-input" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                  <span className="qa-file-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {pdfFile ? pdfFile.name : "Carica PDF profilo"}
                  </span>
                </label>
              </div>
              <div className="qa-field">
                <label className="qa-label">Contesto aggiuntivo <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={problemaCliente} onChange={(e) => setProblemaCliente(e.target.value)} className="qa-input" rows={2}
                  placeholder="Es: Cerco profili simili ma nel mercato italiano" />
              </div>
            </>
          ) : (
            <>
              <div className="qa-field">
                <label className="qa-label">Chi vuoi contattare <span className="fc-required">*</span></label>
                <textarea
                  value={ruoloTarget}
                  onChange={(e) => setRuoloTarget(e.target.value)}
                  className="qa-input qa-input-lg"
                  rows={2}
                  placeholder="Founder SaaS B2B che stanno assumendo, CEO agenzia marketing in crescita"
                />
              </div>
              <div className="qa-field">
                <label className="qa-label">Settore <span className="qa-label-opt">(facoltativo)</span></label>
                <input type="text" value={settore} onChange={(e) => setSettore(e.target.value)} className="qa-input" placeholder="Software, consulenza, marketing, fintech" />
              </div>
              <div className="flex gap-3">
                <div className="qa-field" style={{ flex: 1 }}>
                  <label className="qa-label">Area geografica <span className="qa-label-opt">(facoltativo)</span></label>
                  <input type="text" value={area} onChange={(e) => setArea(e.target.value)} className="qa-input" placeholder="Italia, Europa, DACH" />
                </div>
                <div className="qa-field" style={{ flex: 1 }}>
                  <label className="qa-label">Città <span className="qa-label-opt">(facoltativo)</span></label>
                  <input type="text" value={citta} onChange={(e) => setCitta(e.target.value)} className="qa-input" placeholder="Milano, Roma, Berlino" />
                </div>
              </div>
              <div className="qa-field">
                <label className="qa-label">Dimensione azienda</label>
                <div className="fcp-pills">
                  {DIMENSIONE_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" className={`fcp-pill ${dimensione === opt.value ? "fcp-pill--active" : ""}`} onClick={() => setDimensione(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="qa-field">
                <label className="qa-label">Fase azienda</label>
                <div className="fcp-pills">
                  {FASE_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" className={`fcp-pill ${faseAzienda === opt.value ? "fcp-pill--active" : ""}`} onClick={() => setFaseAzienda(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="qa-field">
                <label className="qa-label">Problema che risolvi per loro <span className="qa-label-opt">(facoltativo)</span></label>
                <textarea value={problemaCliente} onChange={(e) => setProblemaCliente(e.target.value)} className="qa-input" rows={2} placeholder="Non riescono a generare pipeline su LinkedIn, il team sales non ha un processo outbound" />
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <button onClick={generate} disabled={loading || (searchMode === "manual" ? !ruoloTarget.trim() : !linkedinProfileUrl.trim())} className="fcp-launch-btn">
            {loading ? (
              <><span className="qa-spinner" aria-hidden="true" />Analizzo il target…</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l1.2 4.3L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.7L12 2Z" /></svg>
                Identifica chi contattare
              </>
            )}
          </button>
        </div>
      </div>
      )}

      {/* ── Loading state — dedicated section (matches oggi pattern) ── */}
      {loading && (
        <section className="oggi-loading-v2 fade-in-delay">
          <div className="oggi-loading-orb">
            <div className="oggi-orb-ring oggi-orb-ring-1" />
            <div className="oggi-orb-ring oggi-orb-ring-2" />
            <div className="oggi-orb-ring oggi-orb-ring-3" />
            <div className="oggi-orb-core">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
          </div>
          <h3 className="oggi-loading-title-v2">Analizzo il tuo mercato</h3>
          <div className="oggi-loading-steps">
            {["Analizzo target", "Creo categorie", "Genero messaggi", "Preparo strategia"].map((label, i) => (
              <span key={label} className={`oggi-loading-step ${loadingStep >= i ? "oggi-loading-step--active" : ""}`}>{label}</span>
            ))}
          </div>
        </section>
      )}

      {/* ── Callout onboarding ── */}
      {!loading && !profile.onboarding_complete && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </span>
          <div className="flex-1">
            <p className="text-[13px] text-slate-700 m-0">Configura il tuo sistema per risultati più precisi.</p>
            <Link href="/app/onboarding" className="text-[13px] font-bold text-amber-700 no-underline hover:underline">Configura il sistema →</Link>
          </div>
        </div>
      )}

      {/* ── What you'll get (replaces demo preview) ── */}
      {!loading && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <div>
              <h3 className="text-[15px] font-extrabold text-slate-900 m-0">Cosa otterrai</h3>
              <p className="text-[12px] text-slate-500 m-0">L&apos;AI analizza il tuo input e genera un piano di targeting completo.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "🎯", label: "1 target prioritario", desc: "Con messaggi e strategia di approccio" },
              { icon: "👥", label: "2 target alternativi", desc: "Per diversificare la tua pipeline" },
              { icon: "💬", label: "5 messaggi pronti", desc: "Connessione, DM, follow-up" },
              { icon: "✅", label: "5 azioni concrete", desc: "Checklist operativa step by step" },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 animate-fadeup" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-lg block mb-1.5">{item.icon}</span>
                <span className="text-[12px] font-bold text-slate-800 block mb-0.5">{item.label}</span>
                <span className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Strumenti — matching oggi (hidden during loading) ── */}
      {!loading && (
      <section className="border-t border-slate-100 pt-4 mt-4 fade-in-delay">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
          Strumenti
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_TOOLS.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              className="bg-white border border-slate-100 rounded-[14px] p-4 flex flex-col gap-2 no-underline hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 animate-fadeup"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-[13px] font-extrabold text-slate-900 tracking-tight">{t.title}</span>
              <span className="text-[12px] text-slate-500 leading-relaxed">{t.desc}</span>
              <span className="text-[12px] font-semibold text-blue-700 mt-auto">Apri →</span>
            </Link>
          ))}
        </div>
      </section>
      )}

      {!loading && <HistoryList userId={userId} type="prospect" />}
    </div>
  );
}
