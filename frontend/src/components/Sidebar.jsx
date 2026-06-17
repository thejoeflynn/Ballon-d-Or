import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';

const links = [
  { to: '/',          label: 'Home',      end: true, icon: <IconHome /> },
  { to: '/teams',     label: 'Teams',     icon: <IconTeams /> },
  { to: '/matches',   label: 'Matches',   icon: <IconMatches /> },
  { to: '/standings', label: 'Standings', icon: <IconStandings /> },
  { to: '/venues',    label: 'Venues',    icon: <IconVenues /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus into drawer when opened
  useEffect(() => {
    if (open) drawerRef.current?.querySelector('a')?.focus();
  }, [open]);

  const navItems = (
    <nav aria-label="Main" className="sidebar-nav">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          aria-current={undefined}
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' is-active' : '')}
        >
          <span className="sidebar-icon" aria-hidden="true">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="sidebar" aria-label="Site navigation">
        <div className="sidebar-logo">
          <Logo size="md" withWordmark />
        </div>
        {navItems}
        <div className="sidebar-footer">capstone build · 2026</div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────── */}
      <div className="mobile-topbar">
        <Logo size="sm" withWordmark />
        <button
          className="hamburger"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile drawer + scrim ────────────────────────────────────── */}
      {open && (
        <div className="drawer-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={'sidebar sidebar--drawer' + (open ? ' is-open' : '')}
        aria-hidden={!open}
      >
        <div className="sidebar-logo">
          <Logo size="md" withWordmark />
          <button
            className="drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >✕</button>
        </div>
        {navItems}
        <div className="sidebar-footer">capstone build · 2026</div>
      </div>
    </>
  );
}

// ── Inline icons (lightweight SVGs) ─────────────────────────────────────────
function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function IconTeams() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/>
      <path d="M1 21v-2a6 6 0 0 1 11.78-1.6"/><path d="M16 21v-2a4 4 0 0 1 4.78-3.9"/>
    </svg>
  );
}
function IconMatches() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  );
}
function IconStandings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
function IconVenues() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
