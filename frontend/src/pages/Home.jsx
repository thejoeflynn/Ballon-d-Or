import { Link } from 'react-router-dom';

function tournamentStatus() {
  const now = new Date();
  const phases = [
    { start: new Date('2026-06-11'), label: 'Group Stage',    detail: 'Knockouts begin June 28' },
    { start: new Date('2026-06-28'), label: 'Round of 32',    detail: 'Round of 16 begins July 5' },
    { start: new Date('2026-07-05'), label: 'Round of 16',    detail: 'Quarterfinals July 11' },
    { start: new Date('2026-07-11'), label: 'Quarterfinals',  detail: 'Semifinals July 15' },
    { start: new Date('2026-07-15'), label: 'Semifinals',     detail: 'Final July 19' },
    { start: new Date('2026-07-19'), label: 'Final Day',      detail: 'FIFA World Cup 2026™ Final' },
  ];
  const kickoff = new Date('2026-06-11');
  const end     = new Date('2026-07-20');

  if (now < kickoff) {
    const days = Math.ceil((kickoff - now) / 86400000);
    return { phase: 'Countdown', detail: `Tournament kicks off in ${days} day${days === 1 ? '' : 's'}` };
  }
  if (now >= end) {
    return { phase: 'Concluded', detail: 'FIFA World Cup 2026™ has ended' };
  }
  let current = phases[0];
  for (const p of phases) {
    if (now >= p.start) current = p;
  }
  return { phase: current.label, detail: current.detail };
}

const NAV_CARDS = [
  {
    to: '/teams',
    title: 'Teams',
    description: 'All 48 nations competing at FIFA World Cup 2026™',
    icon: <IconTeams />,
  },
  {
    to: '/standings',
    title: 'Standings',
    description: 'Live group tables, bracket, and qualification projections',
    icon: <IconStandings />,
  },
  {
    to: '/matches',
    title: 'Matches',
    description: 'Full match schedule and results across all groups',
    icon: <IconMatches />,
  },
  {
    to: '/venues',
    title: 'Venues',
    description: '16 host stadiums across the USA, Canada, and Mexico',
    icon: <IconVenues />,
  },
];

const STATS = [
  { value: '48', label: 'Teams' },
  { value: '12', label: 'Groups' },
  { value: '16', label: 'Host cities' },
  { value: '104', label: 'Matches' },
  { value: '3',  label: 'Host nations' },
];

export default function Home() {
  const { phase, detail } = tournamentStatus();

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-hero surface-card">
        <h1 className="page-title">Ballon d'Or</h1>
        <p className="page-subtitle">Your guide to the FIFA World Cup 2026™</p>
        <div className="home-status-band">
          <span className="home-status-phase">{phase}</span>
          <span className="home-status-sep">·</span>
          <span className="home-status-detail">{detail}</span>
        </div>
      </div>

      {/* Quick-nav cards */}
      <div className="home-nav-grid">
        {NAV_CARDS.map(card => (
          <Link key={card.to} to={card.to} className="home-nav-card">
            <span className="home-nav-icon" aria-hidden="true">{card.icon}</span>
            <strong className="home-nav-title">{card.title}</strong>
            <p className="home-nav-desc">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Stat band */}
      <div className="home-stats surface-card">
        {STATS.map((s, i) => (
          <div key={i} className="home-stat">
            <span className="home-stat-value">{s.value}</span>
            <span className="home-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconTeams() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4"/><circle cx="17" cy="9" r="3"/>
      <path d="M1 21v-2a6 6 0 0 1 11.78-1.6"/><path d="M16 21v-2a4 4 0 0 1 4.78-3.9"/>
    </svg>
  );
}
function IconStandings() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
function IconMatches() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  );
}
function IconVenues() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
