"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import type { Lead, LeadStatus } from "@/lib/sales/schemas";

const statuses: LeadStatus[] = ["Nuovo", "In conversazione", "Interessato", "Call proposta", "Call fissata", "Cliente"];

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
  const [version, setVersion] = useState(0);

  const leads = repo.lead.listLeads(userId);
  const grouped = repo.lead.listByStatus(userId);

  function refresh() {
    setVersion((x) => x + 1);
  }

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
    setName("");
    setCompany("");
    setLinkedinUrl("");
    setStatus("Nuovo");
    setNotes("");
    setLastConversation("");
    setNextActionAt("");
    refresh();
  }

  function removeLead(id: string) {
    repo.lead.deleteLead(userId, id);
    refresh();
  }

  function updateLead(id: string, updates: Partial<Lead>) {
    repo.lead.updateLead(userId, id, updates);
    refresh();
  }

  return (
    <div className="space-y-5" key={version}>
      <h2 className="text-2xl font-bold">Clienti in corso</h2>
      <div className="rounded-lg border border-app bg-soft p-4 text-sm">
        <p><strong>Cosa fa questa pagina</strong>: tiene traccia delle conversazioni commerciali in corso.</p>
        <p><strong>Cosa inserire</strong>: nome cliente, stato, note e prossima azione.</p>
        <p><strong>Cosa ottieni</strong>: visione chiara di chi ricontattare e quando.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {statuses.map((s) => (
          <div key={s} className="rounded border border-app p-3 text-sm">
            <div className="text-muted">{s}</div>
            <div className="text-xl font-bold">{grouped[s].length}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-app p-4 space-y-3">
        <h3 className="font-semibold">Nuovo contatto</h3>
        <input className="input w-full" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input w-full" placeholder="Azienda" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input className="input w-full" placeholder="URL LinkedIn (opzionale)" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
        <select className="input w-full" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea className="input w-full" rows={3} placeholder="Note" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <textarea className="input w-full" rows={2} placeholder="Ultima conversazione" value={lastConversation} onChange={(e) => setLastConversation(e.target.value)} />
        <input className="input w-full" type="date" value={nextActionAt} onChange={(e) => setNextActionAt(e.target.value)} />
        <button onClick={addLead} className="btn-primary px-4 py-2">Salva contatto</button>
      </div>

      <div className="rounded-lg border border-app p-4">
        <h3 className="font-semibold">Conversazioni da riattivare</h3>
        <p className="mt-2 text-sm text-muted">
          {
            leads
              .filter((lead) => lead.status !== "Cliente" && !!lead.next_action_at)
              .sort((a, b) => String(a.next_action_at || "").localeCompare(String(b.next_action_at || "")))
              .slice(0, 3)
              .map((lead) => `${lead.name} (${lead.status})`)
              .join(" • ") || "Nessuna conversazione da riattivare oggi."
          }
        </p>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-lg border border-app p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{lead.name}</div>
                <div className="text-xs text-muted">{lead.company || "Azienda non indicata"}</div>
                <div className="text-xs text-muted">{lead.linkedin_url || "no linkedin url"}</div>
              </div>
              <div className="flex gap-2">
                <select className="input" value={lead.status} onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => router.push(`/app/dm?pasted_chat_thread=${encodeURIComponent(`Lead: ${lead.name}\nStato: ${lead.status}\nNote: ${lead.notes}`)}&objective=follow-up`)}
                  className="btn-secondary px-3 py-1.5"
                >
                  Genera follow-up
                </button>
                <button onClick={() => removeLead(lead.id)} className="btn-secondary px-3 py-1.5">Elimina</button>
              </div>
            </div>
            <textarea
              className="input mt-3 w-full"
              rows={3}
              value={lead.notes}
              onChange={(e) => updateLead(lead.id, { notes: e.target.value })}
            />
            <textarea
              className="input mt-3 w-full"
              rows={2}
              value={lead.last_conversation || ""}
              placeholder="Ultima conversazione"
              onChange={(e) => updateLead(lead.id, { last_conversation: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
