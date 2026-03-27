"use client";

import Link from "next/link";
import { marketingNav } from "../../lib/routes";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

/* ── dropdown megamenu content per voce ── */
const megaPanels: Record<string, { title: string; desc: string; href: string }[]> = {};

export default function MarketingHeader() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  /* chiudi dropdown se click fuori */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function enterNav(href: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (megaPanels[href]) setActivePanel(href);
    else setActivePanel(null);
  }
  function leaveNav() {
    closeTimer.current = setTimeout(() => setActivePanel(null), 180);
  }
  function enterPanel() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }
  function leavePanel() {
    closeTimer.current = setTimeout(() => setActivePanel(null), 180);
  }

  return (
    <header ref={headerRef} className="mega-header fade-in-fast">
      <div className="mega-header-inner">
        {/* ── Logo ── */}
        <Link href="/" className="mega-logo">
          Preflight
        </Link>

        {/* ── Nav desktop ── */}
        <nav className="mega-nav fade-in">
          {marketingNav.map((item) => (
            <div
              key={item.href}
              className="mega-nav-item"
              onMouseEnter={() => enterNav(item.href)}
              onMouseLeave={leaveNav}
            >
              <Link href={item.href} className={`mega-nav-link${activePanel === item.href ? " mega-nav-link-active" : ""}`}>
                {item.label}
                {megaPanels[item.href] && (
                  <svg className="mega-nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* ── Right side ── */}
        <div className="mega-actions fade-in-fast">
          {session ? (
            <div className="mega-user">
              <span className="mega-user-name">{session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="mega-user-btn" aria-label="Esci">Esci</button>
            </div>
          ) : (
            <Link href="/app" className="mega-secondary" aria-label="Accedi">Accedi</Link>
          )}

          <Link href="/app" className="mega-cta fade-in-delay">
            Prova il sistema
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>

          {/* ── Hamburger mobile ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="mega-hamburger"
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Megamenu dropdown panels ── */}
      {activePanel && megaPanels[activePanel] && (
        <div
          className="mega-dropdown fade-in"
          onMouseEnter={enterPanel}
          onMouseLeave={leavePanel}
        >
          <div className="mega-dropdown-inner">
            {megaPanels[activePanel].map((card) => (
              <Link key={card.title} href={card.href} className="mega-card">
                <span className="mega-card-title">{card.title}</span>
                <span className="mega-card-desc">{card.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile panel ── */}
      {mobileOpen && (
        <div className="mega-mobile fade-in">
          {marketingNav.map((item) => (
            <Link key={item.href} href={item.href} className="mega-mobile-link" onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
          {session ? (
            <div className="mega-mobile-user">
              <span className="text-sm">{session.user?.name || session.user?.email}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="mega-user-btn">Esci</button>
            </div>
          ) : (
            <Link href="/app" className="mega-mobile-link" onClick={() => setMobileOpen(false)}>Accedi</Link>
          )}
          <Link href="/app" className="mega-mobile-cta" onClick={() => setMobileOpen(false)}>
            Prova il sistema
          </Link>
        </div>
      )}
    </header>
  );
}
