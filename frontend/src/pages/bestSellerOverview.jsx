import React from 'react';
import { useNytOverview } from '@/hooks/nyt/useNytOverview';
import BestsellerCard from '@/components/nyt/BestsellerCard';
import { Link } from 'react-router-dom';

export default function BestSellersOverview() {
  const { lists, loading, error, data } = useNytOverview('current');

  return (
    <div className="min-h-screen bg-[var(--gr-bg)] text-[var(--gr-text)] pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <h1 className="font-serif text-2xl font-semibold">NYT Best Sellers Overview</h1>
          <p className="mt-2 text-sm text-[var(--gr-text-soft)]">
            Showing top entries across lists (date: {data?.date || 'current'}).
          </p>
        </header>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-4 shadow-sm">
                <div className="h-6 w-1/2 animate-pulse rounded bg-[var(--gr-bg)] mb-4" />
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((__, j) => (
                    <div key={j} className="flex gap-3">
                      <div className="h-20 w-14 rounded bg-[var(--gr-bg)] animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-[var(--gr-bg)] animate-pulse" />
                        <div className="h-3 w-1/2 rounded bg-[var(--gr-bg)] animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map(list => (
              <section
                key={list.list_name}
                className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-4 shadow-sm flex flex-col"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold pr-4 leading-tight">
                    {list.display_name}
                  </h2>
                  <Link
                    to={`/best-sellers/list?list=${encodeURIComponent(list.list_name)}`}
                    className="text-xs font-medium text-[var(--gr-accent)] hover:underline whitespace-nowrap"
                  >
                    View full
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {list.entries.slice(0, 5).map(e => (
                    <BestsellerCard key={e.primary_isbn13 || e.title + e.rank} entry={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}