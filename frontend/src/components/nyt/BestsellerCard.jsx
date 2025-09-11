import React, { useEffect, useState } from 'react';
import StarRating from '@/components/common/StarRating';
import { searchGoogleBooks } from '@/api/googleBooks';

function useGooglePreviewByIsbn(isbn13) {
  const [previewLink, setPreviewLink] = useState(null);
  const [thumb, setThumb] = useState(null);
  useEffect(() => {
    let active = true;
    if (!isbn13) return;
    (async () => {
      try {
        const data = await searchGoogleBooks({ q: `isbn:${isbn13}`, maxResults: 1 });
        const item = data.items?.[0];
        if (item && active) {
          setPreviewLink(item.previewLink || null);
          if (item.thumbnail) setThumb(item.thumbnail);
        }
      } catch {
        /* silent */
      }
    })();
    return () => { active = false; };
  }, [isbn13]);
  return { previewLink, thumb };
}

export default function BestsellerCard({ entry }) {
  const { previewLink, thumb } = useGooglePreviewByIsbn(entry.primary_isbn13);

  const imageSrc = thumb || entry.book_image || null;

  return (
    <div
      className="relative flex gap-3 rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-3 shadow-sm hover:shadow transition focus-within:ring-2 focus-within:ring-emerald-600"
    >
      <div className="relative h-28 w-20 overflow-hidden rounded bg-[var(--gr-bg)] flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
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