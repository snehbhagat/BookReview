import React from 'react';
import StarRating from '../common/StarRating';

const TOP_RATED = [
  { id: '1', title: 'The Way of Kings', author: 'Brandon Sanderson', rating: 4.8 },
  { id: '2', title: 'The House in the Cerulean Sea', author: 'TJ Klune', rating: 4.6 },
  { id: '3', title: 'Atomic Habits', author: 'James Clear', rating: 4.5 }
];

const ACTIVE_REVIEWERS = [
  { id: 'u1', name: 'BookNerd42', reviews: 241 },
  { id: 'u2', name: 'LitLover', reviews: 198 },
  { id: 'u3', name: 'StorySeeker', reviews: 173 }
];

export default function SidebarWidgets() {
  return (
    <aside className="hidden xl:block w-80 shrink-0 space-y-8">
      <div className="rounded-lg border border-[#d6d0c4] bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-serif text-lg font-semibold text-[#382110]">Top Rated (Mock)</h3>
        <ul className="space-y-3">
          {TOP_RATED.map(b => (
            <li key={b.id}>
              <p className="text-sm font-medium text-[#382110] line-clamp-1">{b.title}</p>
              <p className="text-[11px] uppercase tracking-wide text-[#00635d]">{b.author}</p>
              <StarRating value={b.rating} size="text-[10px]" />
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-[#d6d0c4] bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-serif text-lg font-semibold text-[#382110]">Active Reviewers (Mock)</h3>
        <ul className="space-y-2 text-sm">
          {ACTIVE_REVIEWERS.map(u => (
            <li key={u.id} className="flex items-center justify-between">
              <span className="font-medium text-[#382110]">{u.name}</span>
              <span className="text-[11px] text-[#555]">{u.reviews} reviews</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-[#d6d0c4] bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-serif text-lg font-semibold text-[#382110]">Recommended for You</h3>
        <p className="text-xs text-[#382110]/70 leading-relaxed">
          Sign in to see personalized recommendations based on your reading history.
        </p>
        <button className="mt-3 w-full rounded-md border border-emerald-600 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
          Sign In
        </button>
      </div>
    </aside>
  );
}