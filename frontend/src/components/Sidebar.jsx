import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useSettings, THEMES, FONT_SCALES } from '../context/SettingsContext.jsx';

const links = [
  { to: '/',          label: 'Home',      end: true, icon: <IconHome /> },
  { to: '/teams',     label: 'Teams',     icon: <IconTeams /> },
  { to: '/matches',   label: 'Matches',   icon: <IconMatches /> },
  { to: '/standings', label: 'Standings', icon: <IconStandings /> },
  { to: '/venues',    label: 'Venues',    icon: <IconVenues /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const { theme, setTheme, fontScale, setFontScale } = useSettings();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close on Escape (drawer + settings)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (settingsOpen) { setSettingsOpen(false); settingsBtnRef.current?.focus(); }
        else if (open) setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, settingsOpen]);

  // Close settings on click-outside
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.settings-panel') && !e.target.closest('.settings-toggle')) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus first element in drawer when opened
  useEffect(() => {
    if (open) drawerRef.current?.querySelector('a')?.focus();
  }, [open]);

  // Focus first settings option when panel opens
  useEffect(() => {
    if (settingsOpen) {
      document.querySelector('.settings-panel button')?.focus();
    }
  }, [settingsOpen]);

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

  const settingsPanel = settingsOpen && (
    <div
      className="settings-panel"
      role="dialog"
      aria-label="Accessibility settings"
    >
      <div className="settings-section">
        <p className="settings-label">Theme</p>
        <div className="settings-row">
          {THEMES.map(t => (
            <button
              key={t}
              className={'settings-option' + (theme === t ? ' is-active' : '')}
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-section">
        <p className="settings-label">Text size</p>
        <div className="settings-row">
          {FONT_SCALES.map(s => (
            <button
              key={s.value}
              className={'settings-option' + (fontScale === s.value ? ' is-active' : '')}
              aria-pressed={fontScale === s.value}
              onClick={() => setFontScale(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="sidebar-footer">
      <span className="sidebar-footer-label">Ballon d'Or · 2026</span>
      <button
        ref={settingsBtnRef}
        className="settings-toggle"
        onClick={() => setSettingsOpen(v => !v)}
        aria-expanded={settingsOpen}
        aria-label="Accessibility settings"
      >
        <IconSettings />
      </button>
      {settingsPanel}
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="sidebar" aria-label="Site navigation">
        <div className="sidebar-logo">
          <Logo size="md" withWordmark />
        </div>
        {navItems}
        {footer}
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
        {footer}
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
function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
