"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageGuide from "@/components/shared/PageGuide";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { Lead, LeadStatus } from "@/lib/sales/schemas";

const statuses: LeadStatus[] = ["Nuovo", "In conversazione", "Interessato", "Call proposta", "Call fissata", "Cliente"];

const STATUS_COLORS: Record<LeadStatus, string> = {
  Nuovo: "badge-nuovo",
  "In conversazione": "badge-conversazione",
  Interessato: "badge-interessato",
  "Call proposta": "badge-call-proposta",
  "Call fissata": "badge-call-fissata",
  Cliente: "badge-cliente",
};

const STATUS_BG: Record<LeadStatus, string> = {
  Nuovo: "bg-[#F1F5F9]",
  "In conversazione": "bg-[#DBEAFE]",
  Interessato: "bg-[#D1FAE5]",
  "Call proposta": "bg-[#FEF3C7]",
  "Call fissata": "bg-[#EDE9FE]",
  Cliente: "bg-[#D1FAE5]",
};

export default function PipelinePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session } = useSession();
  const userId = (session?.user?.email || session?.user?.name || "local-user").toString();
  const repo = useMemo(() => getRepositoryBundle(), []);

  const [name, setName] = useState(params.get("name") || "");
  const [company, setCompany] = useState(params.get("company") || "");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [status, setStatus] = useState<LeadStatus>("Nuovo");
  const [notes, setNotes] = useState("");
  const [lastConversation, setLastConversation] = useState(params.get("last") || "");
  const [nextActionAt, setNextActionAt] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [version, setVersion] = useState(0);

  const leads = repo.lead.listLeads(userId);
  const grouped = repo.lead.listByStatus(userId);

  function refresh() { setVersion((x) => x + 1); }

  function addLead() {
    if (!name.trim()) return;
    repo.lead.createLead(userId, {
      name: name.trim(),
      company: company.trim() || undefined,
      linkedin_url: linkedinUrl.trim() || undefined,
      status,
      notes,
      last_conversation: lastConversation || undefined,
      next_action_at: nextActionAt || undefined,
    });
    setName(""); setCompany(""); setLinkedinUrl(""); setStatus("Nuovo");
    setNotes(""); setLastConversation(""); setNextActionAt("");
    setShowForm(false);
    refresh();
  }

  function removeLead(id: string) { repo.lead.deleteLead(userId, id); refresh(); }

  function updateLead(id: string, updates: Partial<Lead>) { repo.lead.updateLead(userId, id, updates); refresh(); }

  const toReactivate = leads
    .filter((l) => l.status !== "Cliente" && l.next_action_at)
    .sort((a, b) => String(a.next_action_at).localeCompare(String(b.next_action_at)))
    .slice(0, 3);

  return (
    <div className="space-y-6" key={version}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">📊 Clienti in corso</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Il cuore del tuo sistema commerciale. Tieni traccia di ogni conversazione.</p>
      </div>

      <PageGuide
        what="tieni traccia di tutte le conversazioni commerciali in corso."
        paste="nome, azienda, stato attuale e note sull'ultima conversazione."
        get="visione chiara di chi è pronto per una call, chi seguire e quando ricontattare."
        next="aggiorna lo stato dopo ogni interazione e genera follow-up quando necessario."
      />

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {statuses.map((s) => (
          <div key={s} className={`rounded-xl border border-[var(--color-border)] ${STATUS_BG[s]} px-3 py-3 text-center`}>
            <div className="text-2xl font-extrabold text-[var(--color-text)]">{grouped[s].length}</div>
            <div className="text-[10px] font-semibold mt-1 leading-tight text-[var(--color-muted)]">{s}</div>
          </div>
        ))}
      </div>

      {/* Da ricontattare */}
      {toReactivate.length > 0 && (
        <div className="rounded-xl border border-[#FEF3C7] bg-[#FFFBEB] p-5">
          <h3 className="font-bold text-sm mb-3">📅 Da ricontattare presto</h3>
          <div className="space-y-2">
            {toReactivate.map((lead) => (
              <div key={lead.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{lead.name} — <span className={`badge ${STATUS_COLORS[lead.status]}`}>{lead.status}</span></span>
                <Link
                  href={`/app/dm?pasted_chat_thread=${encodeURIComponent(`Lead: ${lead.name}\nStato: ${lead.status}\nNote: ${lead.notes || ""}`)}`}
                  className="btn-primary px-3 py-1.5 text-xs"
                >
                  Genera follow-up
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add lead button / form */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-3">
          ➕ Aggiungi potenziale cliente
        </button>
      ) : (
        <div className="card-premium p-6 space-y-4">
          <h3 className="font-bold text-lg">➕ Nuovo contatto</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input w-full" placeholder="Nome *" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input w-full" placeholder="Azienda" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input className="input w-full" placeholder="URL profilo LinkedIn (opzionale)" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            <select className="input w-full" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <textarea className="input w-full" rows={3} placeholder="Note sull'ultima conversazione" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <textarea className="input w-full" rows={2} placeholder="Ultima cosa detta / ultimo messaggio scambiato" value={lastConversation} onChange={(e) => setLastConversation(e.target.value)} />
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Data prossima azione</label>
            <input className="input" type="date" value={nextActionAt} onChange={(e) => setNextActionAt(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={addLead} disabled={!name.trim()} className="btn-primary px-5 py-2.5">💾 Salva contatto</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary px-4 py-2.5">Annulla</button>
          </div>
        </div>
      )}

      {/* Lead list */}
      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-semibold text-[var(--color-text)]">Nessun contatto ancora</p>
          <p className="text-sm text-[var(--color-muted)] mt-1">Aggiungi il tuo primo potenziale cliente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="card-premium p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-bold text-base">{lead.name}</div>
                  <div className="text-xs text-[var(--color-muted)] mt-0.5">{lead.company || "Azienda non indicata"}</div>
                  {lead.linkedin_url && (
                    <div className="text-xs text-[var(--color-primary)] mt-0.5">{lead.linkedin_url}</div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="input text-sm py-1"
                    value={lead.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() => router.push(`/app/dm?pasted_chat_thread=${encodeURIComponent(`Lead: ${lead.name}\nStato: ${lead.status}\nNote: ${lead.notes}`)}&objective=follow-up`)}
                    className="btn-secondary px-3 py-1.5 text-sm"
                  >
                    🔁 Follow-up
                  </button>
                  <button onClick={() => removeLead(lead.id)} className="btn-secondary px-3 py-1.5 text-sm text-[var(--color-danger)]">
                    🗑️
                  </button>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <textarea
                  className="input w-full text-sm"
                  rows={2}
                  placeholder="Note..."
                  value={lead.notes}
                  onChange={(e) => updateLead(lead.id, { notes: e.target.value })}
                />
                <textarea
                  className="input w-full text-sm"
                  rows={2}
                  placeholder="Ultima conversazione..."
                  value={lead.last_conversation || ""}
                  onChange={(e) => updateLead(lead.id, { last_conversation: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

