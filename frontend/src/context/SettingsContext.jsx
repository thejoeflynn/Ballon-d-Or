import { createContext, useContext, useEffect, useState } from 'react';

export const FONT_SCALES = [
  { label: 'S',  value: 1.0  },
  { label: 'M',  value: 1.15 },
  { label: 'L',  value: 1.4  },
  { label: 'XL', value: 1.7  },
];

// Default to the second step — 1.0 already tested as too small.
const DEFAULT_FONT_SCALE = 1.15;

// Snap a persisted value that's outside the current preset set to the nearest valid step.
function normalizeFontScale(raw) {
  const v = parseFloat(raw);
  if (!v) return DEFAULT_FONT_SCALE;
  if (FONT_SCALES.some(s => s.value === v)) return v;
  return FONT_SCALES.reduce(
    (best, s) => (Math.abs(s.value - v) < Math.abs(best - v) ? s.value : best),
    FONT_SCALES[0].value,
  );
}

const SettingsContext = createContext(null);

function readLocal(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function SettingsProvider({ children }) {
  const [fontScale, setFontScaleState] = useState(
    () => normalizeFontScale(readLocal('fontScale', String(DEFAULT_FONT_SCALE)))
  );

  function setFontScale(s) {
    localStorage.setItem('fontScale', s);
    setFontScaleState(s);
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  return (
    <SettingsContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
