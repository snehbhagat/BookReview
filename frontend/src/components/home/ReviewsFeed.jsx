import React from 'react';
import StarRating from '../common/StarRating';

const RECENT = [
  {
    id: 1,
    reviewer: 'Alice Johnson',
    book: 'The Name of the Wind',
    rating: 4.5,
    snippet: 'A beautifully written tale with immersive world-building. Can’t wait to read the sequel!'
  },
  {
    id: 2,
    reviewer: 'Mark Chen',
    book: 'Project Hail Mary',
    rating: 4.2,
    snippet: 'Hard science + heartfelt storytelling. The pacing worked almost perfectly.'
  },
  {
    id: 3,
    reviewer: 'Priya Singh',
    book: 'The Midnight Library',
    rating: 3.8,
    snippet: 'Philosophical & tender. A few slow parts, but the message resonated with me.'
  },
  {
    id: 4,
    reviewer: 'Liam O’Connor',
    book: 'The Lies of Locke Lamora',
    rating: 4.7,
    snippet: 'Razor sharp dialogue and clever twists—loved the atmosphere.'
  }
];

export default function ReviewsFeed() {
  return (
    <section className="mt-14" aria-labelledby="recent-reviews-heading">
      <h2
        id="recent-reviews-heading"
        className="font-serif text-xl font-semibold text-[var(--gr-text)] mb-4"
      >
        Recent Community Reviews (Mock)
      </h2>
      <div className="space-y-4">
        {RECENT.map(r => (
          <article
            key={r.id}
            className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-4 shadow-sm hover:shadow transition"
            aria-label={`Review of ${r.book} by ${r.reviewer}`}
          >
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--gr-accent)]">
              <span className="font-semibold">{r.reviewer}</span>
              <span className="text-[var(--gr-text-soft)]">•</span>
              <span className="font-medium text-[var(--gr-text)]">{r.book}</span>
              <StarRating value={r.rating} size="text-[10px]" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--gr-text-soft)] line-clamp-3">
              {r.snippet}
            </p>
            <button className="mt-2 text-xs font-medium text-[var(--gr-accent)] hover:underline">
              Read more
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}