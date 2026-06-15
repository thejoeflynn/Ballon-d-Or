import { useEffect, useState } from 'react';
import { getHealth } from '../api/client.js';

/**
 * Landing page. Pings the backend so the architecture path is verifiable
 * end to end (React -> fetch -> CORS -> REST -> JSON).
 */
export default function Home() {
  const [status, setStatus] = useState('checking…');

  useEffect(() => {
    getHealth()
      .then((d) => setStatus(`online (${d.service})`))
      .catch(() => setStatus('offline — start the backend on :8080'));
  }, []);

  return (
    <section className="page">
      <h1>World Cup Tracker</h1>
      <p className="lede">React SPA + Spring Boot REST API — architecture skeleton.</p>
      <p className="status-line">
        Backend status: <span className="status-pill">{status}</span>
      </p>
      <p className="muted">
        Feature pages and API endpoints arrive in later phases — see PLAN.md.
      </p>
    </section>
  );
}
