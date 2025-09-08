import { useState, memo, useCallback } from 'react';

const fallbackColor = 'bg-amber-100';
const goodreadsBorder = 'border-[#d6d0c4]';

function classNames(...c) {
  return c.filter(Boolean).join(' ');
}

export default memo(function OpenWorkCard({ work, onSelect }) {
  const [errored, setErrored] = useState(false);
  const handleError = useCallback(() => setErrored(true), []);
  const firstAuthor = work.authors?.[0] || 'Unknown author';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(work)}
      className={classNames(
        'group text-left rounded-md border shadow-sm hover:shadow-md transition',
        goodreadsBorder,
        'bg-[#fefefe] overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-600/60'
      )}
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-[#f4f1ea] flex items-center justify-center">
        {work.coverUrl && !errored ? (
          <img
            src={work.coverUrl}
            alt={work.title}
            loading="lazy"
            onError={handleError}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[#382110]/70 font-medium uppercase tracking-wide bg-[#f4f1ea]">
            No Cover
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="line-clamp-2 font-semibold text-sm text-[#382110] group-hover:text-emerald-700">
          {work.title}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-[#00635d] font-medium line-clamp-1">
          {firstAuthor}
        </p>
        {work.year && (
          <p className="mt-0.5 text-[11px] text-[#555]">
            {work.year}
          </p>
        )}
      </div>
    </button>
  );
});