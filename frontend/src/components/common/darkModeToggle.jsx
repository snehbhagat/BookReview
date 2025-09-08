import React from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function DarkModeToggle({ className = '' }) {
  const { dark, toggle } = useDarkMode();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] px-2 py-1 text-xs font-medium text-[var(--gr-text)] hover:bg-[var(--gr-bg)] transition ${className}`}
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}