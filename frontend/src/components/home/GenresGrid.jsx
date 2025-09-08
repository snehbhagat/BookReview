import React from 'react';
import { useNavigate } from 'react-router-dom';

const GENRES = [
  { name: 'Fiction', icon: '📖', q: 'fiction' },
  { name: 'Mystery', icon: '🕵️', q: 'mystery' },
  { name: 'Fantasy', icon: '🐉', q: 'fantasy' },
  { name: 'Romance', icon: '💖', q: 'romance' },
  { name: 'Sci-Fi', icon: '🚀', q: 'science fiction' },
  { name: 'Non-Fiction', icon: '📘', q: 'non fiction' },
  { name: 'History', icon: '🏛️', q: 'history' },
  { name: 'Thriller', icon: '😱', q: 'thriller' }
];

export default function GenresGrid() {
  const navigate = useNavigate();
  return (
    <section className="mt-14">
      <h2 className="font-serif text-xl font-semibold text-[#382110] mb-4">Browse by Genre</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {GENRES.map(g => (
          <button
            key={g.name}
            onClick={() => navigate(`/discover?q=${encodeURIComponent(g.q)}`)}
            className="group flex flex-col items-center justify-center rounded-lg border border-[#d6d0c4] bg-white px-3 py-4 text-center shadow-sm hover:border-emerald-600 hover:shadow transition"
          >
            <span className="text-2xl">{g.icon}</span>
            <span className="mt-2 text-xs font-medium text-[#382110] group-hover:text-emerald-700">{g.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}