import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('checking…');
  useEffect(() => {
    fetch('/api/venues')
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline — start the backend on :8080'));
  }, []);
  return (
    <div className="page">
      <h1>Ballon d'Or</h1>
      <p className="lede">Your guide to FIFA World Cup 2026™ — teams, standings, venues, and more.</p>
      <p>Backend status: <strong>{status}</strong></p>
      <p className="muted">Use the sidebar to explore all 48 teams, group standings, match schedule, and host venues.</p>
    </div>
  );
}
