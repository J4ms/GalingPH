import { createContext, useContext, useEffect, useState } from 'react';
import { readStorage, subscribeToStorage, writeStorage } from './storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = readStorage('galingph-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage('galingph-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = subscribeToStorage((key, value) => {
      if (key === 'galingph-theme' && typeof value === 'string' && (value === 'light' || value === 'dark')) {
        setTheme(value);
      }
    });
    return unsubscribe;
  }, []);

  const toggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}