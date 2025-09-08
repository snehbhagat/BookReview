import React from 'react';

export default function BookCardSkeleton({ count = 8, horizontal = false }) {
  const items = Array.from({ length: count });
  const containerClass = horizontal
    ? 'flex gap-4 overflow-x-auto pb-2'
    : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4';

  return (
    <div className={containerClass} aria-hidden="true">
      {items.map((_, i) => (
        <div
          key={i}
            className="w-40 shrink-0 rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-2 shadow-sm"
        >
          <div className="aspect-[3/4] w-full rounded skeleton-shimmer" />
          <div className="mt-2 h-3 w-3/4 rounded skeleton-shimmer" />
          <div className="mt-2 h-3 w-1/2 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}