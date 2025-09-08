import React from 'react';
import StarRating from '@/components/common/StarRating';

export default function BestsellerCard({ entry }) {
  return (
    <div
      className="relative flex gap-3 rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-3 shadow-sm hover:shadow transition focus-within:ring-2 focus-within:ring-emerald-600"
    >
      <div className="relative h-28 w-20 overflow-hidden rounded bg-[var(--gr-bg)] flex items-center justify-center">
        {entry.book_image ? (
          <img
            src={entry.book_image}
            alt={entry.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[11px] text-[var(--gr-text-soft)] px-1 text-center">No Image</span>
        )}
        <span className="absolute left-1 top-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
          #{entry.rank}
        </span>
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm font-semibold text-[var(--gr-text)]">{entry.title}</h3>
        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[var(--gr-accent)]">
          {entry.author}
        </p>
        <p className="mt-1 text-[11px] text-[var(--gr-text-soft)] line-clamp-2">
          {entry.publisher}
        </p>
        <div className="mt-auto pt-1">
          {/* Placeholder pseudo rating derived from weeks_on_list */}
          <StarRating
            value={3 + Math.min(2, (entry.weeks_on_list || 0) / 20)}
            size="text-[10px]"
          />
        </div>
      </div>
    </div>
  );
}