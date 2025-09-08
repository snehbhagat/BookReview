import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNytList } from '@/hooks/nyt/useNytList';
import { useNytListNames } from '@/hooks/nyt/useNytListNames';
import BestsellerList from '@/components/nyt/BestsellerList';
import ListTabs from '@/components/nyt/ListTabs';

const PAGE_SIZE = 15; // NYT returns 15 or 20 depending on list; offset increments by 20. We'll just move by 20.

export default function BestSellerListPage() {
  const [params, setParams] = useSearchParams();
  const listParam = params.get('list') || 'hardcover-fiction';
  const offsetParam = parseInt(params.get('offset') || '0', 10);
  const [offset, setOffset] = useState(offsetParam);

  useEffect(() => {
    setOffset(offsetParam);
  }, [offsetParam]);

  const { data, entries, loading, error } = useNytList({ name: listParam, date: 'current', offset });
  const { listNames } = useNytListNames();

  function changeList(newList) {
    const p = new URLSearchParams(params);
    p.set('list', newList);
    p.delete('offset');
    setParams(p, { replace: true });
  }

  function nextPage() {
    const p = new URLSearchParams(params);
    p.set('offset', (offset + 20).toString());
    setParams(p);
  }
  function prevPage() {
    const p = new URLSearchParams(params);
    p.set('offset', Math.max(0, offset - 20).toString());
    setParams(p);
  }

  const displayName = data?.display_name ||
    listNames.find(l => l.list_name === listParam)?.display_name ||
    listParam;

  return (
    <div className="min-h-screen bg-[var(--gr-bg)] text-[var(--gr-text)] pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 space-y-3">
          <h1 className="font-serif text-2xl font-semibold">
            {displayName}
          </h1>
          <p className="text-sm text-[var(--gr-text-soft)]">
            Date: {data?.date || 'current'} {data?.updated ? `• Updated ${data.updated.toLowerCase()}` : ''}
          </p>
          <ListTabs
            active={listParam}
            onChange={changeList}
          />
        </header>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-3 shadow-sm">
                <div className="flex gap-3">
                  <div className="h-28 w-20 rounded bg-[var(--gr-bg)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-[var(--gr-bg)] animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-[var(--gr-bg)] animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-[var(--gr-bg)] animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <BestsellerList entries={entries} />
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={prevPage}
                disabled={offset === 0 || loading}
                className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] px-4 py-2 text-sm font-medium disabled:opacity-50 hover:border-emerald-600 transition"
              >
                Previous
              </button>
              <span className="text-xs text-[var(--gr-text-soft)]">
                Offset {offset}
              </span>
              <button
                onClick={nextPage}
                disabled={loading || entries.length === 0}
                className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] px-4 py-2 text-sm font-medium hover:border-emerald-600 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}