import React from 'react';
import { useParams } from 'react-router-dom';
import { useGoogleVolume } from '@/hooks/googleBooks/useGoogleVolume';
import GoogleBooksPreview from '@/components/books/GoogleBooksPreview';

export default function BookDetail() {
  const { id } = useParams();
  const { data: v, loading, error } = useGoogleVolume(id);

  return (
    <div className="min-h-screen bg-[var(--gr-bg)] text-[var(--gr-text)] pt-20">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {loading && (
          <div className="rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-6 shadow-sm">
            <div className="h-6 w-1/2 skeleton-shimmer rounded mb-4" />
            <div className="flex gap-6">
              <div className="h-64 w-44 skeleton-shimmer rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-4/5 skeleton-shimmer rounded" />
                <div className="h-3 w-2/3 skeleton-shimmer rounded" />
                <div className="h-3 w-3/5 skeleton-shimmer rounded" />
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && v && (
          <article className="space-y-6">
            <header className="flex flex-col md:flex-row gap-6">
              <div className="h-64 w-44 overflow-hidden rounded border border-[var(--gr-border)] bg-[var(--gr-bg)] flex items-center justify-center">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-[var(--gr-text-soft)]">No Image</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-2xl font-semibold">{v.title}</h1>
                {v.subtitle && <p className="mt-1 text-[var(--gr-text-soft)]">{v.subtitle}</p>}
                <p className="mt-2 text-[11px] uppercase tracking-wide text-[var(--gr-accent)]">
                  {v.authors?.join(', ') || 'Unknown'}
                </p>
                <div className="mt-3 text-sm text-[var(--gr-text-soft)]">
                  {v.publisher && <span>Publisher: {v.publisher}</span>} {v.publishedDate && <span className="ml-3">Published: {v.publishedDate}</span>}
                  {v.pageCount && <span className="ml-3">{v.pageCount} pages</span>}
                  {v.industryIdentifiers?.isbn13 && <span className="ml-3">ISBN-13: {v.industryIdentifiers.isbn13}</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {v.previewLink ? (
                    <a href={v.previewLink} target="_blank" rel="noreferrer" className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                      View on Google Books
                    </a>
                  ) : (
                    <span className="text-sm text-[var(--gr-text-soft)]">No preview link</span>
                  )}
                </div>
              </div>
            </header>

            {v.description && (
              <section>
                <h2 className="font-serif text-lg font-semibold mb-2">Description</h2>
                <p className="text-sm leading-relaxed text-[var(--gr-text-soft)] whitespace-pre-line">
                  {v.description}
                </p>
              </section>
            )}

            <section>
              <h2 className="font-serif text-lg font-semibold mb-2">Read a sample</h2>
              <GoogleBooksPreview volumeId={v.id} isbn13={v.industryIdentifiers?.isbn13 || null} height={520} />
            </section>
          </article>
        )}
      </div>
    </div>
  );
}