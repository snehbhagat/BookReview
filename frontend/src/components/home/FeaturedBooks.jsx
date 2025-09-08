import React, { useCallback, useEffect, useRef, useState } from 'react';
import { searchOpenLibrary } from '@/api/openLibrary';
import StarRating from '../common/StarRating';
import BookCardSkeleton from './BookCardSkeleton';

const FEATURE_QUERY = 'bestseller';

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const loadPage = useCallback(async (p, append = false) => {
    if (p > totalPages && append) return;
    try {
      if (p === 1) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }
      const data = await searchOpenLibrary({ q: FEATURE_QUERY, page: p, limit: 12 });
      setTotalPages(data.totalPages);
      setBooks(prev => append ? [...prev, ...data.items] : data.items);
    } catch {
      // swallow for demo
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, [totalPages]);

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  // Horizontal infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const root = document.querySelector('#featured-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !loadingMore) {
            setPage(p => {
              const next = p + 1;
              if (next <= totalPages) loadPage(next, true);
              return next;
            });
          }
        });
      },
      { root, rootMargin: '0px 300px 0px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadingMore, loadPage, totalPages]);

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-[var(--gr-text)]">Trending Books</h2>
        <a
          href="/discover"
          className="text-sm font-medium text-[var(--gr-accent)] hover:underline"
        >
          View all
        </a>
      </div>

      {initialLoading && <BookCardSkeleton count={8} horizontal />}

      {!initialLoading && (
        <div
          id="featured-scroll"
          className="flex gap-4 overflow-x-auto pb-2 pr-2 [scrollbar-width:thin]"
          style={{ scrollSnapType: 'x proximity' }}
          aria-label="Trending books"
        >
          {books.map((b) => {
            const rating = 3 + (b.id.length % 20) / 10;
            return (
              <div
                key={b.id + (b.isbn13 || b.olid || '')}
                className="w-40 shrink-0 scroll-snap-align-start rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-2 shadow-sm hover:shadow transition"
                role="group"
                aria-label={b.title}
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded bg-[var(--gr-bg)] flex items-center justify-center">
                  {b.coverUrl ? (
                    <img
                      src={b.coverUrl}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[11px] text-[var(--gr-text-soft)]">
                      No Cover
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <p className="line-clamp-2 text-xs font-semibold text-[var(--gr-text)]">{b.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] uppercase tracking-wide text-[var(--gr-accent)]">
                    {b.authors?.[0] || 'Unknown'}
                  </p>
                  <StarRating value={rating} size="text-[10px]" className="mt-1" />
                </div>
              </div>
            );
          })}

          {/* Sentinel for infinite load */}
          {page < totalPages && (
            <div
              ref={sentinelRef}
              className="flex w-32 shrink-0 items-center justify-center text-xs text-[var(--gr-text-soft)]"
              aria-hidden="true"
            >
              {loadingMore ? 'Loading…' : '...'}
            </div>
          )}
        </div>
      )}
    </section>
  );
}