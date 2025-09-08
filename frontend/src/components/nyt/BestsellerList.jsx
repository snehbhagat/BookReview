import React from 'react';
import BestsellerCard from './BestsellerCard';

export default function BestsellerList({ entries }) {
  if (!entries || entries.length === 0) {
    return <p className="text-sm text-[var(--gr-text-soft)]">No entries.</p>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(e => (
        <BestsellerCard key={e.primary_isbn13 || e.title + e.rank} entry={e} />
      ))}
    </div>
  );
}