import { useEffect, useState, useCallback } from 'react';

export function usePrefersDark() {
  const mq = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;
  const [pref, setPref] = useState(() => mq ? mq.matches : false);

  useEffect(() => {
    if (!mq) return;
    const handler = (e) => setPref(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mq]);

  return pref;
}

export function useDarkMode() {
  const prefers = usePrefersDark();
  const [enabled, setEnabled] = useState(() => {
    const stored = typeof localStorage !== 'undefined'
      ? localStorage.getItem('theme')
      : null;
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return prefers;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.classList.add('dark'); else root.classList.remove('dark');
  }, [enabled]);

  const toggle = useCallback(() => {
    setEnabled(v => {
      const next = !v;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { dark: enabled, toggle };
}