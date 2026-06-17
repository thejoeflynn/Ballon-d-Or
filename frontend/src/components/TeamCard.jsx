import { Link } from 'react-router-dom';
import Flag from './Flag.jsx';
import Crest from './Crest.jsx';

export default function TeamCard({ team }) {
  return (
    <Link to={`/teams/${team.slug}`} className="team-card" aria-label={team.name}>
      <div className="team-card-crest">
        <Crest slug={team.slug} size="md" alt={team.name} />
      </div>
      <div className="team-card-body">
        <div className="team-card-flag">
          <Flag slug={team.slug} alt={team.name} />
        </div>
        <span className="team-card-name">{team.name}</span>
        <span className="team-card-group">Group {team.group}</span>
      </div>
    </Link>
  );
}
