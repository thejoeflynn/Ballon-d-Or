import { createContext, useContext, useEffect, useState } from 'react';

export const FONT_SCALES = [
  { label: '1', value: 0.9  },
  { label: '2', value: 1    },
  { label: '3', value: 1.15 },
  { label: '4', value: 1.3  },
];

export const THEMES = ['Light', 'Dark', 'System'];

const SettingsContext = createContext(null);

function readLocal(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function resolveDataTheme(theme) {
  if (theme === 'System') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme.toLowerCase();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', resolveDataTheme(theme));
}

export function SettingsProvider({ children }) {
  const [theme, setThemeState] = useState(() => readLocal('theme', 'System'));
  const [fontScale, setFontScaleState] = useState(
    () => parseFloat(readLocal('fontScale', '1')) || 1
  );

  function setTheme(t) {
    localStorage.setItem('theme', t);
    setThemeState(t);
  }
  function setFontScale(s) {
    localStorage.setItem('fontScale', s);
    setFontScaleState(s);
  }

  useEffect(() => { applyTheme(theme); }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
  }, [fontScale]);

  // Re-apply when OS preference changes (only relevant in System mode)
  useEffect(() => {
    if (theme !== 'System') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('System');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <SettingsContext.Provider value={{
      theme,
      setTheme,
      fontScale,
      setFontScale,
      resolvedTheme: resolveDataTheme(theme),
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
