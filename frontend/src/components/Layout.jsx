import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/teams', label: 'Teams' },
  { to: '/matches', label: 'Matches' },
  { to: '/venues', label: 'Venues' },
];

/**
 * Shared layout: header/nav + routed content + footer. This is the start of the
 * shared design system (PLAN.md Phase 0); reusable components live alongside it.
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">⚽ World Cup Tracker</div>
        <nav className="nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' is-active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">World Cup Tracker — capstone build</footer>
    </div>
  );
}
