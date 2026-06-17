import { Link, useParams } from 'react-router-dom';
import { TEAMS } from '../data/mockTeams.js';
import Flag from '../components/Flag.jsx';
import Crest from '../components/Crest.jsx';

export default function TeamDetail() {
  const { slug } = useParams();
  const team = TEAMS.find((t) => t.slug === slug);

  if (!team) {
    return (
      <div className="page">
        <Link to="/teams" className="back-link">← All Teams</Link>
        <h1>Team not found</h1>
      </div>
    );
  }

  return (
    <div className="page team-detail">
      <Link to="/teams" className="back-link">← All Teams</Link>
      <div className="team-detail-hero">
        <Crest slug={team.slug} size="lg" alt={team.name} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Flag slug={team.slug} alt={team.name} />
            <span className="team-detail-group">Group {team.group}</span>
          </div>
          <h1 className="team-detail-name">{team.name}</h1>
          <p className="team-detail-abbr">{team.abbr}</p>
        </div>
      </div>
      <div className="coming-soon-card">
        <p className="coming-soon-label">World Cup history &amp; squad roster</p>
        <p className="muted">Coming soon — full team profile with appearances, best finish, and 26-player squad.</p>
      </div>
    </div>
  );
}
