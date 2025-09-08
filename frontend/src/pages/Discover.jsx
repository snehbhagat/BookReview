import { useCallback, useEffect, useRef, useState } from 'react';
import { searchOpenLibrary, fetchOpenBookDetails } from '@/api/openLibrary';
import OpenWorkCard from '@/components/books/OpenWorkCard';

export default function Discover() {
  const [q, setQ] = useState('harry potter');
  const [inputQ, setInputQ] = useState('harry potter');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  const performSearch = useCallback(async (opts = {}) => {
    const { reset = false, pageOverride } = opts;
    if (!q.trim()) return;
    if (reset) {
      setItems([]);
      setPage(1);
    }
    const targetPage = pageOverride || (reset ? 1 : page);
    try {
      if (targetPage === 1 && !reset) { /* no-op */ }
      if (targetPage === 1 && reset) setLoading(true);
      else setLoadingMore(true);
      setError('');
      const data = await searchOpenLibrary({ q, page: targetPage, limit });
      setTotalPages(data.totalPages);
      if (targetPage === 1) {
        setItems(data.items);
      } else {
        setItems(prev => [...prev, ...data.items]);
      }
    } catch (e) {
      setError(e.message || 'Search failed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [q, page, limit]);

  // initial
  useEffect(() => {
    performSearch({ reset: true, pageOverride: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    setQ(inputQ);
  };

  const loadMore = () => {
    if (page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    performSearch({ pageOverride: next });
  };

  const openDetails = async (work) => {
    setSelected({ loading: true, work });
    try {
      // prefer isbn for details
      let details = null;
      if (work.isbn13) {
        details = await fetchOpenBookDetails({ isbn: work.isbn13 });
      } else if (work.olid) {
        details = await fetchOpenBookDetails({ olid: work.olid });
      }
      setSelected({ loading: false, work, details });
    } catch (e) {
      setSelected({ loading: false, work, error: e.message || 'Failed to load details' });
    }
    setTimeout(() => {
      dialogRef.current?.showModal();
    }, 0);
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#382110]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-serif font-semibold tracking-tight mb-4">
          Discover Books
        </h1>

        <form onSubmit={onSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputQ}
            onChange={e => setInputQ(e.target.value)}
            placeholder="Search Open Library..."
            className="flex-1 rounded-md border border-[#d6d0c4] bg-[#fffdfa] px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600 outline-none"
          />
          <button
            type="submit"
            className="rounded-md border border-[#d6d0c4] bg-[#f2f0e6] px-4 py-2 text-sm font-medium hover:bg-[#e9e4d8] transition"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-md h-60 bg-[#e8e2d4]" />
            ))}
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map(item => (
                <OpenWorkCard key={item.id + (item.isbn13 || item.olid || '')} work={item} onSelect={openDetails} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              {page < totalPages && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-md border border-[#d6d0c4] bg-[#fffdfa] px-5 py-2 text-sm font-medium hover:bg-[#f2f0e6] disabled:opacity-60"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              )}
              {page >= totalPages && items.length > 0 && (
                <p className="text-sm text-[#555]">No more results.</p>
              )}
            </div>
          </>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="rounded-md backdrop:bg-black/40 w-full max-w-xl p-0 overflow-hidden"
      >
        {selected && (
          <div className="bg-[#fefefe]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-[#d6d0c4]">
              <h2 className="text-lg font-semibold">
                {selected.work?.title}
              </h2>
              <button
                onClick={closeDialog}
                className="text-sm text-[#00635d] hover:underline"
              >
                Close
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm leading-relaxed">
              {selected.loading && <p>Loading details...</p>}
              {selected.error && <p className="text-red-600">{selected.error}</p>}
              {selected.details && (
                <>
                  <p className="font-medium">
                    Authors: <span className="font-normal">{selected.details.authors?.join(', ') || '—'}</span>
                  </p>
                  {selected.details.pages && (
                    <p className="font-medium">
                      Pages: <span className="font-normal">{selected.details.pages}</span>
                    </p>
                  )}
                  {selected.details.publishDate && (
                    <p className="font-medium">
                      Published: <span className="font-normal">{selected.details.publishDate}</span>
                    </p>
                  )}
                  {selected.details.subjects?.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.details.subjects.slice(0, 15).map(s => (
                          <span
                            key={s}
                            className="rounded bg-[#e8e2d4] px-2 py-0.5 text-[11px] text-[#382110]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.details.cover?.large && (
                    <img
                      src={selected.details.cover.large}
                      alt={selected.work.title}
                      className="mt-2 rounded border border-[#d6d0c4] max-h-80 object-contain"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}