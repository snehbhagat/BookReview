import React from 'react';
import { useNytListNames } from '@/hooks/nyt/useNytListNames';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ListTabs({ active, onChange }) {
  const { listNames, loading, error } = useNytListNames();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  if (loading) {
    return <div className="flex flex-wrap gap-2"><SkeletonChip count={6} /></div>;
  }
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  function select(name) {
    onChange?.(name);
    // Optionally sync query param
    const p = new URLSearchParams(params);
    p.set('list', name);
    navigate(`/best-sellers/list?${p.toString()}`, { replace: true });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {listNames.slice(0, 24).map(l => {
        const isActive = l.list_name === active;
        return (
          <button
            key={l.list_name}
            onClick={() => select(l.list_name)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              isActive
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-[var(--gr-border)] bg-[var(--gr-bg-alt)] text-[var(--gr-text)] hover:border-emerald-600'
            }`}
            aria-current={isActive ? 'true' : 'false'}
          >
            {l.display_name}
          </button>
        );
      })}
    </div>
  );
}

function SkeletonChip({ count = 5 }) {
  return Array.from({ length: count }).map((_, i) => (
    <span
      key={i}
      className="h-6 w-24 animate-pulse rounded-full bg-[var(--gr-bg)] border border-[var(--gr-border)]"
    />
  ));
}