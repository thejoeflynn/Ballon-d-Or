import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VENUE_ATTRACTIONS from '../data/venueAttractions.js';

function Gallery({ images, label }) {
  const [idx, setIdx] = useState(0);
  const [errored, setErrored] = useState({});

  const validImages = images?.filter((_, i) => !errored[i]) ?? [];

  if (validImages.length === 0) {
    return (
      <div className="venue-gallery-empty">
        <span style={{ fontSize: '2rem', opacity: 0.3 }}>🏟️</span>
        <p>No {label} photos available</p>
      </div>
    );
  }

  const safeIdx = Math.min(idx, validImages.length - 1);
  const prev = () => setIdx(i => (i - 1 + validImages.length) % validImages.length);
  const next = () => setIdx(i => (i + 1) % validImages.length);

  return (
    <div className="venue-gallery">
      <div className="venue-gallery-hero">
        <img
          key={validImages[safeIdx]}
          src={validImages[safeIdx]}
          alt={`${label} photo ${safeIdx + 1}`}
          className="venue-gallery-img"
          onError={() => {
            const originalIdx = images.indexOf(validImages[safeIdx]);
            setErrored(e => ({ ...e, [originalIdx]: true }));
          }}
        />
        {validImages.length > 1 && (
          <>
            <button className="venue-gallery-btn venue-gallery-btn--prev" onClick={prev}>‹</button>
            <button className="venue-gallery-btn venue-gallery-btn--next" onClick={next}>›</button>
            <div className="venue-gallery-count">{safeIdx + 1} / {validImages.length}</div>
          </>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="venue-gallery-dots">
          {validImages.map((_, i) => (
            <button
              key={i}
              className={`venue-gallery-dot${i === safeIdx ? ' is-active' : ''}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WeatherWidget({ venueId }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/venues/${venueId}/weather`)
      .then(r => r.json())
      .then(data => { setWeather(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [venueId]);

  if (loading) return <div className="venue-weather-loading">Loading weather…</div>;
  if (!weather || Object.keys(weather).length === 0) {
    return <div className="venue-weather-error">Weather data unavailable</div>;
  }

  return (
    <div className="venue-weather">
      <span className="venue-weather-icon">{weather.icon}</span>
      <div className="venue-weather-info">
        <div className="venue-weather-temp">{Math.round(weather.tempF)}°F</div>
        <div className="venue-weather-label">{weather.label}</div>
        <div className="venue-weather-wind">Wind: {Math.round(weather.windMph)} mph</div>
      </div>
    </div>
  );
}

function AttractionsSection({ venueName }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const attractions = VENUE_ATTRACTIONS[venueName] || [];

  if (!attractions.length) return <p className="muted">No attractions listed for this venue.</p>;

  return (
    <div className="venue-attractions">
      <div className="venue-attractions-pills">
        {attractions.map((a, i) => (
          <button
            key={i}
            className={`group-pill${i === activeIdx ? ' is-active' : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            {a.icon} {a.name}
          </button>
        ))}
      </div>

      <div className="venue-attraction-detail">
        <div className="venue-attraction-meta">
          <span className="venue-attraction-icon">{attractions[activeIdx].icon}</span>
          <div>
            <div className="venue-attraction-name">{attractions[activeIdx].name}</div>
            <div className="venue-attraction-type">
              {attractions[activeIdx].type} · {attractions[activeIdx].dist}
            </div>
          </div>
        </div>
        <Gallery images={attractions[activeIdx].images || []} label={attractions[activeIdx].name} />
      </div>
    </div>
  );
}

const STATUS_MAP = { NS: 'SCHEDULED', TBD: 'SCHEDULED', SCHEDULED: 'SCHEDULED', FT: 'FINISHED', AET: 'FINISHED', PEN: 'FINISHED', FINISHED: 'FINISHED', AWD: 'FINISHED', WO: 'FINISHED' };

function MatchSchedule({ venueId }) {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    fetch(`/api/venues/${venueId}/matches`)
      .then(r => r.ok ? r.json() : [])
      .then(setMatches)
      .catch(() => setMatches([]));
  }, [venueId]);

  if (matches === null) return <p className="muted">Loading fixtures…</p>;
  if (matches.length === 0) return <p className="muted">No matches scheduled at this venue.</p>;

  const sorted = [...matches].sort((a, b) => {
    const da = a.kickoffTime ? new Date(a.kickoffTime + 'Z') : 0;
    const db = b.kickoffTime ? new Date(b.kickoffTime + 'Z') : 0;
    return da - db;
  });

  return (
    <div className="venue-match-list">
      {sorted.map(m => {
        const kickoff = m.kickoffTime ? new Date(m.kickoffTime + 'Z') : null;
        const status = STATUS_MAP[m.status?.toUpperCase()] ?? 'SCHEDULED';
        const hasScore = m.homeScore !== null && m.awayScore !== null;
        return (
          <Link key={m.id} to={`/matches/${m.id}`} className="venue-match-row">
            <div className="venue-match-date">
              {kickoff
                ? kickoff.toLocaleDateString([], { month: 'short', day: 'numeric' })
                : '—'}
              <span className="venue-match-time">
                {kickoff
                  ? kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </span>
            </div>
            <div className="venue-match-teams-cell">
              <span className="venue-match-team">{m.homeTeam?.name ?? '—'}</span>
              <span className="venue-match-score">
                {hasScore ? `${m.homeScore} – ${m.awayScore}` : 'vs'}
              </span>
              <span className="venue-match-team venue-match-team--away">{m.awayTeam?.name ?? '—'}</span>
            </div>
            <div className="venue-match-meta">
              <span className="venue-match-stage">{m.groupLabel ?? ''}</span>
              {status === 'FINISHED' && <span className="venue-match-ft">FT</span>}
              {status === 'LIVE' && <span className="venue-match-live">Live</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function VenueDetail() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [stadiumImages, setStadiumImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/venues/${id}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/venues/${id}/images`).then(r => r.json()).catch(() => []),
    ]).then(([v, imgs]) => {
      setVenue(v);
      setStadiumImages(imgs);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="page"><p className="muted">Loading…</p></div>;
  if (!venue) return <div className="page"><p className="muted">Venue not found.</p></div>;

  return (
    <div className="venue-detail-page">
      <Link to="/venues" className="back-link">← Venues</Link>

      <div className="venue-detail-header">
        <span className="venue-detail-flag">{venue.flag}</span>
        <div>
          <h1 className="venue-detail-name">{venue.name}</h1>
          <div className="venue-detail-meta">
            <span>{venue.city}</span>
            <span className="venue-detail-sep">·</span>
            <span>{venue.country}</span>
            <span className="venue-detail-sep">·</span>
            <span>{(venue.capacity ?? 0).toLocaleString()} seats</span>
          </div>
        </div>
      </div>

      <div className="venue-detail-grid">
        <div className="venue-detail-main">
          <section className="venue-section">
            <h2 className="venue-section-title">Stadium Gallery</h2>
            <Gallery images={stadiumImages} label={venue.name} />
          </section>

          <section className="venue-section">
            <h2 className="venue-section-title">Matches at this Venue</h2>
            <MatchSchedule venueId={id} />
          </section>

          <section className="venue-section">
            <h2 className="venue-section-title">Nearby Attractions</h2>
            <AttractionsSection venueName={venue.name} />
          </section>
        </div>

        <aside className="venue-detail-sidebar">
          <div className="venue-info-card">
            <div className="venue-section-title" style={{ marginBottom: '1rem' }}>Venue Info</div>
            <div className="venue-stat">
              <span className="venue-stat-label">City</span>
              <span className="venue-stat-value">{venue.city}</span>
            </div>
            <div className="venue-stat">
              <span className="venue-stat-label">Country</span>
              <span className="venue-stat-value">{venue.flag} {venue.country}</span>
            </div>
            <div className="venue-stat">
              <span className="venue-stat-label">Capacity</span>
              <span className="venue-stat-value">{(venue.capacity ?? 0).toLocaleString()}</span>
            </div>
            <div className="venue-stat">
              <span className="venue-stat-label">Coordinates</span>
              <span className="venue-stat-value" style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                {venue.lat}°, {venue.lng}°
              </span>
            </div>
          </div>

          <div className="venue-info-card">
            <div className="venue-section-title" style={{ marginBottom: '1rem' }}>Live Weather</div>
            <WeatherWidget venueId={id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
