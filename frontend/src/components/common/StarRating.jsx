import React from 'react';

export default function StarRating({ value = 0, size = 'text-xs', className = '' }) {
  const safe = Math.max(0, Math.min(5, value));
  const full = Math.floor(safe);
  const half = safe - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const Star = ({ state }) => {
    if (state === 'half') {
      return (
        <span className="relative inline-block w-4 h-4" aria-hidden="true">
          <span className="absolute inset-0 text-amber-400 dark:text-amber-300">★</span>
          <span className="absolute inset-0 overflow-hidden w-1/2 text-amber-200 dark:text-amber-700/40">★</span>
        </span>
      );
    }
    if (state === 'full') {
      return <span className="text-amber-400 dark:text-amber-300" aria-hidden="true">★</span>;
    }
    return <span className="text-amber-200 dark:text-amber-700/40" aria-hidden="true">★</span>;
  };

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${size} ${className}`}
      aria-label={`Rating ${safe.toFixed(1)} out of 5`}
      role="img"
    >
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} state="full" />)}
      {half && <Star state="half" />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} state="empty" />)}
      <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-400">{safe.toFixed(1)}</span>
    </span>
  );
}