"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/hooks/useSession";
import { getRepositoryBundle } from "@/lib/sales/repositories";
import { IconClipboard, IconTarget } from "@/components/shared/icons";
import type { Lead, LeadStatus } from "@/lib/sales/schemas";

const statuses: LeadStatus[] = ["Nuovo", "In conversazione", "Interessato", "Call proposta", "Call fissata", "Cliente"];

function heatBadgeClass(status: LeadStatus): string {
  if (status === "Cliente" || status === "Call fissata") return "badge-red";
  if (status === "Call proposta" || status === "Interessato") return "badge-amber";
  return "badge-blue";
}

function heatLabel(status: LeadStatus): string {
  if (status === "Cliente" || status === "Call fissata") return "Hot";
  if (status === "Call proposta" || status === "Interessato") return "Warm";
  return "Cold";
}

function statusDotColor(status: LeadStatus): string {
  if (status === "Cliente" || status === "Call fissata") return "var(--color-danger)";
  if (status === "Call proposta" || status === "Interessato") return "var(--color-warning)";
  return "var(--color-primary)";
}

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
  const [addOpen, setAddOpen] = useState(!!(params.get("name")));

  const leads = repo.lead.listLeads(userId);
  const grouped = repo.lead.listByStatus(userId);

  const today = new Date().toISOString().slice(0, 10);
  const recontactToday = leads.filter(
    (l) => l.status !== "Cliente" && !!l.next_action_at && l.next_action_at <= today
  );

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
    setAddOpen(false);
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
    <div className="tool-page" key={version}>
      <div className="tool-page-hero">
        <h2>Pipeline — Clienti in corso</h2>
        <p>
          Tieni traccia di ogni conversazione commerciale e non perdere nessun follow-up.
        </p>
      </div>

      {/* Guide box */}
      <div className="tool-page-guide">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-success,#22c55e)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><polyline points="20 6 9 17 4 12"/></svg>Cosa fai:</span> gestisci lead e conversazioni commerciali</div>
          <div><span className="font-semibold"><IconClipboard size={13} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Cosa inserire:</span> nome, stato, note e data prossima azione</div>
          <div><span className="font-semibold"><IconTarget size={13} style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}} />Cosa ottieni:</span> visione chiara di chi ricontattare e quando</div>
          <div><span className="font-semibold"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><path d="M5 12h14M13 6l6 6-6 6"/></svg>Prossima mossa:</span> genera follow-up per i lead caldi</div>
        </div>
      </div>

      {/* "Da ricontattare oggi" banner */}
      {recontactToday.length > 0 && (
        <div className="callout-warning rounded-lg">
          <p className="text-sm font-semibold mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.25rem'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Da ricontattare oggi ({recontactToday.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {recontactToday.map((lead) => (
              <span key={lead.id} className="badge badge-amber">
                {lead.name} · {lead.status}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {statuses.map((s) => (
          <div
            key={s}
            className="rounded-lg p-3 text-sm"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: statusDotColor(s) }}
              />
              <span style={{ color: "var(--color-muted)" }}>{s}</span>
            </div>
            <div className="text-2xl font-bold mt-1" style={{ color: "var(--color-primary)" }}>
              {grouped[s]?.length || 0}
            </div>
          </div>
        ))}
      </div>

      {/* Add lead form (collapsible) */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
      >
        <button
          onClick={() => setAddOpen((v) => !v)}
          className="w-full flex items-center justify-between p-4 text-left font-semibold"
          style={{ background: "var(--color-surface)" }}
        >
          <span>+ Aggiungi nuovo contatto</span>
          <span style={{ color: "var(--color-muted)", fontSize: "1.2rem" }}>{addOpen ? "−" : "+"}</span>
        </button>
        {addOpen && (
          <div
            className="p-5 space-y-3 border-t border-app"
            style={{ background: "var(--color-soft-2)" }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Nome *</span>
                <input className="input w-full" placeholder="Es. Mario Rossi" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium">Azienda</span>
                <input className="input w-full" placeholder="Es. Acme Srl" value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">URL LinkedIn</span>
              <input className="input w-full" placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Stato</span>
              <select className="input w-full" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Note</span>
              <textarea className="input w-full" rows={3} placeholder="Contesto della conversazione..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Ultima conversazione</span>
              <textarea className="input w-full" rows={2} placeholder="Riassunto dell'ultima conversazione..." value={lastConversation} onChange={(e) => setLastConversation(e.target.value)} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Data prossima azione</span>
              <input className="input" type="date" value={nextActionAt} onChange={(e) => setNextActionAt(e.target.value)} />
            </label>
            <div className="flex gap-2 pt-1">
              <button onClick={addLead} className="btn-primary">Salva contatto</button>
              <button onClick={() => setAddOpen(false)} className="btn-secondary">Annulla</button>
            </div>
          </div>
        )}
      </div>

      {/* Lead list */}
      {leads.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: "var(--color-soft-2)", border: "1.5px dashed var(--color-border)" }}
        >
          <p className="text-3xl mb-3"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></p>
          <p className="font-semibold" style={{ color: "var(--color-primary)" }}>Nessun lead ancora</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            Aggiungi il primo contatto con il pulsante qui sopra.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl p-4"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
            >
              {/* Lead header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ background: "var(--color-soft)", color: "var(--color-primary)" }}
                  >
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold">{lead.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                      {lead.company || "Azienda non indicata"}
                      {lead.linkedin_url ? (
                        <> · <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-primary">LinkedIn</a></>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className={`badge ${heatBadgeClass(lead.status)}`}>
                        {heatLabel(lead.status)}
                      </span>
                      {lead.next_action_at && lead.next_action_at <= today && (
                        <span className="badge badge-amber"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:'0.2rem'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Ricontatta oggi</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="input text-sm"
                    style={{ width: "auto" }}
                    value={lead.status}
                    onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    onClick={() =>
                      router.push(
                        `/app/dm?pasted_chat_thread=${encodeURIComponent(
                          `Lead: ${lead.name}\nStato: ${lead.status}\nNote: ${lead.notes}`
                        )}&objective=follow-up`
                      )
                    }
                    className="btn-secondary text-sm"
                  >
                    Genera follow-up
                  </button>
                  <button
                    onClick={() => removeLead(lead.id)}
                    className="btn-ghost text-sm"
                    style={{ color: "var(--color-danger)" }}
                  >
                    Elimina
                  </button>
                </div>
              </div>

              {/* Notes + last conversation */}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>Note</label>
                  <textarea
                    className="input w-full text-sm"
                    rows={3}
                    value={lead.notes}
                    onChange={(e) => updateLead(lead.id, { notes: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>Ultima conversazione</label>
                  <textarea
                    className="input w-full text-sm"
                    rows={3}
                    value={lead.last_conversation || ""}
                    placeholder="Riassunto dell'ultima conversazione..."
                    onChange={(e) => updateLead(lead.id, { last_conversation: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
