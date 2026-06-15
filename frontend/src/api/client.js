const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Thin fetch wrapper for the REST API (PLAN.md §1/§2.2).
 * Feature calls (one function per endpoint) are added by slice owners; this
 * module just establishes the client <-> backend wiring (base URL, JSON, errors).
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// Infrastructure check that the backend is reachable (proves CORS + JSON path).
export const getHealth = () => apiFetch('/health');
