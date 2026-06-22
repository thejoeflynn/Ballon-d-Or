import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useSettings } from '../context/SettingsContext.jsx';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const COUNTRIES = ['All', 'USA', 'Canada', 'Mexico'];

function markerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;background:${color};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.55)"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
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
  const { resolvedTheme } = useSettings();
  const tileUrl = resolvedTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

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
      <h1 className="page-title">Venue Explorer</h1>
      <p className="page-subtitle">{venues.length} official FIFA World Cup 2026™ stadiums</p>

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
              key={resolvedTheme}
              url={tileUrl}
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
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
  );
}
