import { useState } from 'react';
import { TEAMS, GROUPS } from '../data/mockTeams.js';
import TeamCard from '../components/TeamCard.jsx';

export default function Teams() {
  const [activeGroup, setActiveGroup] = useState('ALL');

  const visible = activeGroup === 'ALL'
    ? TEAMS
    : TEAMS.filter((t) => t.group === activeGroup);

  return (
    <div className="page teams-page">
      <h1 className="teams-title">Teams</h1>
      <p className="lede">All 48 nations competing at FIFA World Cup 2026™</p>

      {/* Group filter */}
      <div className="group-filter">
        <button
          className={'group-pill' + (activeGroup === 'ALL' ? ' is-active' : '')}
          onClick={() => setActiveGroup('ALL')}
        >
          All
        </button>
        {GROUPS.map((g) => (
          <button
            key={g}
            className={'group-pill' + (activeGroup === g ? ' is-active' : '')}
            onClick={() => setActiveGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Team grid */}
      <div className="teams-grid">
        {visible.map((team) => (
          <TeamCard key={team.slug} team={team} />
        ))}
      </div>
    </div>
  );
}
