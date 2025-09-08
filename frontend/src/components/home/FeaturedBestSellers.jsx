import React, { useMemo } from 'react';
import { useNytOverview } from '@/hooks/nyt/useNytOverview';
import BestsellerCard from '@/components/nyt/BestsellerCard';

const PREFERRED_LIST_ORDER = [
  'Hardcover Fiction',
  'Hardcover Nonfiction',
  'Combined Print & E-Book Fiction',
  'Combined Print & E-Book Nonfiction',
  'Young Adult Hardcover',
  'Children’s Middle Grade Hardcover'
];

export default function FeaturedBestSellers({ layout = 'horizontal' }) {
  const { lists, loading, error, data } = useNytOverview('current');

  const curated = useMemo(() => {
    if (!lists?.length) return [];
    const map = new Map(lists.map(l => [l.display_name, l]));
    const ordered = [];
    for (const name of PREFERRED_LIST_ORDER) {
      if (map.has(name)) ordered.push(map.get(name));
    }
    for (const l of lists) {
      if (ordered.length >= 6) break;
      if (!ordered.includes(l)) ordered.push(l);
    }
    return ordered;
  }, [lists]);

  // Decide render mode
  const isGrid = layout === 'grid';

  return (
    <section className="mt-12" aria-labelledby="best-sellers-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="best-sellers-heading"
          className="font-serif text-xl font-semibold text-[var(--gr-text)]"
        >
          NYT Best Sellers
        </h2>
        <a
          href="/best-sellers"
          className="text-sm font-medium text-[var(--gr-accent)] hover:underline"
        >
          Overview
        </a>
      </div>

      {loading && <OverviewSkeleton grid={isGrid} />}

      {error && (
        <p className="text-sm text-red-600">
          Failed to load best sellers: {error}
        </p>
      )}

      {!loading && !error && curated.length === 0 && (
        <p className="text-sm text-[var(--gr-text-soft)]">
          No best seller data available right now.
        </p>
      )}

      {!loading && !error && curated.length > 0 && (
        isGrid ? (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          >
            {curated.map(list => (
              <ListPanel key={list.list_name} list={list} />
            ))}
          </div>
        ) : (
          <div
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pr-2 max-w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {curated.map(list => (
              <ListPanel horizontal key={list.list_name} list={list} />
            ))}
          </div>
        )
      )}

      {!loading && data?.date && (
        <p className="mt-3 text-[11px] text-[var(--gr-text-soft)]">
          Published date: {data.date}
        </p>
      )}
    </section>
  );
}

function ListPanel({ list, horizontal }) {
  return (
    <div
      className={`${
        horizontal ? 'w-72 shrink-0 snap-start' : ''
      } rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-4 shadow-sm hover:shadow transition flex flex-col`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-serif text-sm font-semibold leading-tight text-[var(--gr-text)]">
          {list.display_name}
        </h3>
        <a
          href={`/best-sellers/list?list=${encodeURIComponent(list.list_name)}`}
          className="text-[11px] font-medium text-[var(--gr-accent)] hover:underline whitespace-nowrap"
        >
          Full
        </a>
      </div>
      <div className="flex flex-col gap-3">
        {list.entries.slice(0, 3).map(entry => (
          <BestsellerCard
            key={entry.primary_isbn13 || entry.title + entry.rank}
            entry={entry}
          />
        ))}
      </div>
      <div className="mt-4">
        <a
          href={`/best-sellers/list?list=${encodeURIComponent(list.list_name)}`}
          className="inline-block rounded border border-[var(--gr-border)] bg-[var(--gr-bg)] px-3 py-1 text-[11px] font-medium text-[var(--gr-accent)] hover:border-emerald-600 hover:bg-emerald-50 transition"
        >
          View List →
        </a>
      </div>
    </div>
  );
}

function OverviewSkeleton({ grid = false }) {
  const wrapperClass = grid
    ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
    : 'flex gap-6 overflow-x-hidden';
  return (
    <div className={wrapperClass}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="w-72 max-w-full rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-4 shadow-sm"
        >
          <div className="h-4 w-3/5 rounded skeleton-shimmer mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((__, j) => (
              <div key={j} className="flex gap-3">
                <div className="h-28 w-20 rounded skeleton-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-4/5 rounded skeleton-shimmer" />
                  <div className="h-3 w-2/3 rounded skeleton-shimmer" />
                  <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-6 w-24 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}