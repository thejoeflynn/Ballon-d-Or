import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import countryBorders from '../data/na-country-borders.json';
import ImmersiveHero from '../components/ImmersiveHero.jsx';

// Country outlines only (US / Canada / Mexico) — no states or provinces.
const COUNTRY_BORDER_STYLE = {
  color: '#5a4636',
  weight: 1.4,
  opacity: 0.7,
  fill: false,
  interactive: false,
};

const COUNTRIES = ['All', 'USA', 'Canada', 'Mexico'];

// Single light, high-visibility basemap (green land / blue water) used in both
// light and dark app themes. The "_background" variant is terrain with no baked-in
// place-name labels. Keyless on localhost; a free Stadia key is read from env for
// deployed builds.
const STADIA_KEY = import.meta.env.VITE_STADIA_KEY;
const TILE_URL =
  'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png' +
  (STADIA_KEY ? `?api_key=${STADIA_KEY}` : '');
const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> ' +
  '&copy; <a href="https://stamen.com/">Stamen Design</a> ' +
  '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function markerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;background:${color};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.65)"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

function FitBounds({ venues }) {
  const map = useMap();
  useEffect(() => {
    if (!venues.length) return;
    const bounds = L.latLngBounds(venues.map(v => [v.lat, v.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [venues, map]);
  return null;
}

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = filter === 'All' ? '/api/venues' : `/api/venues?country=${filter}`;
    fetch(url)
      .then(r => r.json())
      .then(data => { setVenues(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div className="venues-page">

      {/* ── Immersive stadium hero ── */}
      <ImmersiveHero className="venues-hero">
        <div className="venues-hero-head">
          <h1 className="venues-hero-title">Venue Explorer</h1>
          <p className="venues-hero-sub">{venues.length} official FIFA World Cup 2026™ stadiums</p>

          <div className="group-filter">
            {COUNTRIES.map(c => (
              <button
                key={c}
                className={`group-pill${filter === c ? ' is-active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </ImmersiveHero>

      {/* ── Below the hero (centered column) ── */}
      <div className="venues-below">
      <div className="venues-map-wrap">
        {loading ? (
          <div className="venues-map-loading">Loading map…</div>
        ) : (
          <MapContainer
            center={[37, -95]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
          >
            <TileLayer
              url={TILE_URL}
              attribution={TILE_ATTRIBUTION}
            />
            <GeoJSON data={countryBorders} style={COUNTRY_BORDER_STYLE} />
            <FitBounds venues={venues} />
            {venues.filter(v => v.lat != null && v.lng != null).map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={markerIcon(v.countryColor ?? '#FF6B35')}>
                <Popup>
                  <div className="venue-popup">
                    <div className="venue-popup-flag">{v.flag}</div>
                    <div className="venue-popup-name">{v.name}</div>
                    <div className="venue-popup-city">{v.city}</div>
                    <div className="venue-popup-cap">{(v.capacity ?? 0).toLocaleString()} seats</div>
                    <Link to={`/venues/${v.id}`} className="venue-popup-link">
                      View details →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <div className="venues-grid">
        {venues.map(v => (
          <Link key={v.id} to={`/venues/${v.id}`} className="venue-card">
            {v.imageUrl ? (
              <div className="venue-card-thumb">
                <img src={`${v.imageUrl}/1.jpg`} alt={v.name} className="venue-card-thumb-img" />
              </div>
            ) : (
              <div className="venue-card-thumb venue-card-thumb--empty">
                <span className="venue-card-thumb-flag">{v.flag}</span>
              </div>
            )}
            <div className="venue-card-body">
              <div className="venue-card-name">{v.name}</div>
              <div className="venue-card-city">{v.city}</div>
              <div className="venue-card-cap">{(v.capacity ?? 0).toLocaleString()} seats</div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </div>
  );
}
