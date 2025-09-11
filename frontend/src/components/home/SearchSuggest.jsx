import React, { useEffect, useRef, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { searchGoogleBooks } from '@/api/googleBooks';
import { useNavigate } from 'react-router-dom';

export default function SearchSuggest({ term, open, onSelect }) {
  const debounced = useDebounce(term, 250);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        // Support operators like intitle:, inauthor:, subject:, isbn:
        const data = await searchGoogleBooks({ q: debounced, maxResults: 6 });
        if (active) setResults(data.items || []);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [debounced]);

  if (!open || !term.trim()) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 w-full rounded-md border border-[var(--gr-border)] bg-white dark:bg-[var(--gr-bg-alt)] shadow-md"
      role="listbox"
      aria-label="Search suggestions"
    >
      {loading && (
        <div className="p-3 text-xs text-[var(--gr-text-soft)]">Searching...</div>
      )}
      {!loading && results.length === 0 && (
        <div className="p-3 text-xs text-[var(--gr-text-soft)]">No quick matches</div>
      )}
      <ul className="max-h-80 overflow-y-auto text-sm">
        {results.map(r => (
          <li
            key={r.id}
            className="cursor-pointer px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            onClick={() => {
              onSelect?.(r.title);
              navigate(`/book/${encodeURIComponent(r.id)}`);
            }}
            role="option"
          >
            <div className="flex items-start gap-2">
              <div className="h-10 w-7 overflow-hidden rounded bg-[var(--gr-bg)] shrink-0">
                {r.thumbnail ? (
                  <img src={r.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 font-medium text-[var(--gr-text)]">{r.title}</p>
                <p className="text-[11px] uppercase tracking-wide text-[var(--gr-accent)]">
                  {r.authors?.[0] || 'Unknown'}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-[var(--gr-border)] p-2">
        <button
          className="w-full rounded bg-[var(--gr-bg-alt)] px-2 py-1 text-xs font-medium text-[var(--gr-accent)] hover:underline"
          onClick={() => navigate(`/discover?q=${encodeURIComponent(term)}`)}
        >
          See Open Library results
        </button>
      </div>
    </div>
  );
}