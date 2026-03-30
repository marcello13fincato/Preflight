"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(-10),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Scusa, non ho capito." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Si è verificato un errore. Riprova." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        className="chatbox-fab"
        aria-label="Apri chat Preflight"
        onClick={() => setOpen((v) => !v)}
        style={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000, background: "#fff", borderRadius: "50%", boxShadow: "0 4px 24px #0002", border: "none", padding: 0, width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <img src="/LOGO PREFLIGHT_Pittogramma.png" alt="Chat Preflight" style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
      </button>
      <button
        className="cb-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Chiudi assistente" : "Apri assistente Preflight"}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div className="cb-window">
          {/* header */}
          <div className="cb-header">
            <div className="cb-header-info">
              <span className="cb-header-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 0 1 4-4z"/><line x1="10" y1="17" x2="14" y2="17"/><line x1="10" y1="20" x2="14" y2="20"/></svg>
              </span>
              <div>
                <span className="cb-header-title">Assistente Preflight</span>
                <span className="cb-header-status">
                  {session ? `Ciao${session.user?.name ? `, ${session.user.name}` : ""}` : "Online"}
                </span>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)} aria-label="Chiudi chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* messages */}
          <div className="cb-messages">
            {messages.length === 0 && (
              <div className="cb-welcome">
                <p className="cb-welcome-title">Come posso aiutarti?</p>
                <p className="cb-welcome-sub">Chiedimi qualsiasi cosa su Preflight, LinkedIn o su come trovare clienti.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg cb-msg-${m.role}`}>
                <div className={`cb-bubble cb-bubble-${m.role}`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="cb-msg cb-msg-assistant">
                <div className="cb-bubble cb-bubble-assistant cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* input */}
          <div className="cb-input-area">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="cb-input"
              rows={1}
              placeholder="Scrivi un messaggio…"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="cb-send"
              aria-label="Invia messaggio"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
