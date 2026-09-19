import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemePreference, ActiveTheme, ThemeColors, DARK_THEME_COLORS, LIGHT_THEME_COLORS } from './tokens';

interface ThemeContextValue {
  preference: ThemePreference;
  activeTheme: ActiveTheme;
  isDark: boolean;
  colors: ThemeColors;
  setPreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'manobal_theme_preference';
const LEGACY_STORAGE_KEY = 'manobah_theme_preference';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemePreference;
    }
  } catch {
    // In case localStorage is restricted
  }
  return 'system';
}

function resolveActiveTheme(pref: ThemePreference): ActiveTheme {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => getInitialPreference());
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Legacy fallback
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const activeTheme: ActiveTheme = useMemo(() => {
    if (preference === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemIsDark]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // Storage error ignored
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferenceState((prev: ThemePreference) => {
      const currentActive = resolveActiveTheme(prev);
      const next: ThemePreference = currentActive === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage error ignored
      }
      return next;
    });
  }, []);

  // Synchronize with document element attributes and classes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = '#07090B';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#EAEFEA';
    }
  }, [activeTheme]);

  const colors = activeTheme === 'dark' ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      preference,
      activeTheme,
      isDark: activeTheme === 'dark',
      colors,
      setPreference,
      toggleTheme,
    }),
    [preference, activeTheme, colors, setPreference, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
