import React, { useEffect, useState } from 'react';
import StarRating from '@/components/common/StarRating';
import { searchGoogleBooks } from '@/api/googleBooks';

// Simple in-memory shared promise & result cache for ISBN lookups
const isbnPromiseCache = new Map();
const isbnResultCache = new Map();
const NEGATIVE_TTL_MS = 10 * 60 * 1000; // 10 min for negative/no-result caching
const negativeCache = new Map(); // isbn -> timestamp

function useGooglePreviewByIsbn(isbn13) {
  const [previewLink, setPreviewLink] = useState(null);
  const [thumb, setThumb] = useState(null);

  useEffect(() => {
    let active = true;
    if (!isbn13) return;

    // Negative cache (avoid retrying too soon after 429 or empty result)
    const negTs = negativeCache.get(isbn13);
    if (negTs && Date.now() - negTs < NEGATIVE_TTL_MS) {
      return;
    }

    // Already have result
    if (isbnResultCache.has(isbn13)) {
      const r = isbnResultCache.get(isbn13);
      setPreviewLink(r.previewLink || null);
      setThumb(r.thumb || null);
      return;
    }

    // In flight?
    if (isbnPromiseCache.has(isbn13)) {
      isbnPromiseCache.get(isbn13).then(r => {
        if (active && r) {
          setPreviewLink(r.previewLink || null);
          setThumb(r.thumb || null);
        }
      });
      return;
    }

    const p = (async () => {
      try {
        const data = await searchGoogleBooks({ q: `isbn:${isbn13}`, maxResults: 1 });
        const item = data.items?.[0];
        if (!item) {
          negativeCache.set(isbn13, Date.now());
          return null;
        }
        const r = { previewLink: item.previewLink || null, thumb: item.thumbnail || null };
        isbnResultCache.set(isbn13, r);
        return r;
      } catch (e) {
        // If rate-limited or other error, mark negative to pause retries
        negativeCache.set(isbn13, Date.now());
        return null;
      }
    })();

    isbnPromiseCache.set(isbn13, p);

    p.then(r => {
      if (active && r) {
        setPreviewLink(r.previewLink || null);
        setThumb(r.thumb || null);
      }
    }).finally(() => {
      isbnPromiseCache.delete(isbn13);
    });

    return () => { active = false; };
  }, [isbn13]);

  return { previewLink, thumb };
}

export default function BestsellerCard({ entry }) {
  const { previewLink, thumb } = useGooglePreviewByIsbn(entry.primary_isbn13);
  const imageSrc = thumb || entry.book_image || null;

  return (
    <div className="relative flex gap-3 rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-3 shadow-sm hover:shadow transition">
      <div className="relative h-28 w-20 overflow-hidden rounded bg-[var(--gr-bg)] flex items-center justify-center">
        {imageSrc ? (
          <img src={imageSrc} alt={entry.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] text-[var(--gr-text-soft)] px-1 text-center">No Image</span>
        )}
        <span className="absolute left-1 top-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
          #{entry.rank}
        </span>
        {previewLink && (
          <a
            href={previewLink}
            target="_blank"
            rel="noreferrer"
            title="Preview on Google Books"
            className="absolute bottom-1 right-1 rounded bg-emerald-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white hover:bg-emerald-700"
          >
            Preview
          </a>
        )}
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
          <StarRating
            value={3 + Math.min(2, (entry.weeks_on_list || 0) / 20)}
            size="text-[10px]"
          />
        </div>
      </div>
    </div>
  );
}