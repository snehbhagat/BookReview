import React, { useEffect, useRef, useState } from 'react';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.google && window.google.books) resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

/**
 * Props:
 *  volumeId?: string
 *  isbn13?: string
 *  height?: number (default 500)
 */
export default function GoogleBooksPreview({ volumeId, isbn13, height = 500 }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | no-preview | error

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus('loading');
        await loadScript('https://www.google.com/books/jsapi.js');
        // eslint-disable-next-line no-undef
        window.google.books.load();
        // eslint-disable-next-line no-undef
        window.google.books.setOnLoadCallback(() => {
          if (cancelled) return;
          try {
            // eslint-disable-next-line no-undef
            const viewer = new window.google.books.DefaultViewer(containerRef.current);
            const idOrIsbn = volumeId ? volumeId : (isbn13 ? `ISBN:${isbn13}` : null);
            if (!idOrIsbn) {
              setStatus('no-preview');
              return;
            }
            viewer.load(idOrIsbn, () => {
              setStatus('ready');
            }, () => {
              setStatus('no-preview');
            });
          } catch {
            setStatus('error');
          }
        });
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [volumeId, isbn13]);

  if (status === 'no-preview') {
    return <div className="text-sm text-[var(--gr-text-soft)]">No preview available.</div>;
  }
  if (status === 'error') {
    return <div className="text-sm text-red-600">Failed to load preview.</div>;
  }

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height }}
      className="rounded border border-[var(--gr-border)] bg-[var(--gr-bg-alt)]"
      aria-label="Book preview"
    />
  );
}