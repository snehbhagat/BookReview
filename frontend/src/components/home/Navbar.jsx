import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import SearchSuggest from './SearchSuggest';

export default function Navbar() {
  const [term, setTerm] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  useEffect(() => {
    // hide suggestions when route changes
    setShowSuggest(false);
  }, [location]);

  const onSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    navigate(`/discover?q=${encodeURIComponent(q)}`);
    setShowSuggest(false);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-[var(--gr-border)] bg-[var(--gr-bg-alt)]/95 backdrop-blur"
      role="banner"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-emerald-600 focus:px-3 focus:py-1 focus:text-white"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl font-semibold text-[var(--gr-text)]"
          aria-label="BookReview home"
        >
          <span className="inline-block rounded bg-emerald-600 px-2 py-1 text-sm font-bold tracking-wide text-white">
            BR
          </span>
          <span className="hidden sm:inline">BookReview</span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--gr-text)]"
          aria-label="Primary navigation"
        >
          <Link to="/" className="hover:text-emerald-700">Home</Link>
          <Link to="/discover" className="hover:text-emerald-700">Browse</Link>
          <Link to="/my-reviews" className="hover:text-emerald-700">My Reviews</Link>
          <Link to="/genres" className="hover:text-emerald-700">Genres</Link>
          <Link to="/login" className="hover:text-emerald-700">Login/Signup</Link>
        </nav>

        <form
          onSubmit={onSearch}
          className="ml-auto hidden lg:block w-full max-w-sm relative"
          role="search"
          aria-label="Quick book search"
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => { setTerm(e.target.value); setShowSuggest(true); }}
              onFocus={() => term && setShowSuggest(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowSuggest(false);
                  inputRef.current?.blur();
                }
              }}
              placeholder="Search books or authors..."
              className="w-full rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              aria-expanded={showSuggest}
              aria-controls="search-suggestions"
              aria-autocomplete="list"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-emerald-700 hover:underline"
            >
              Go
            </button>
            <SearchSuggest
              term={term}
              open={showSuggest}
              onSelect={(val) => {
                setTerm(val);
                setShowSuggest(false);
              }}
            />
          </div>
        </form>

        <div className="ml-auto lg:ml-0 flex items-center gap-3">
          <DarkModeToggle />
          {/* Accessible placeholder profile menu */}
          <div className="relative group">
            <button
              aria-haspopup="menu"
              aria-expanded="false"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-semibold text-emerald-700"
              title="User menu placeholder"
            >
              U
            </button>
            <div
              className="invisible absolute right-0 top-full mt-2 w-48 rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] p-2 text-sm opacity-0 shadow-md transition group-hover:visible group-hover:opacity-100"
              role="menu"
              aria-label="User menu"
            >
              <p className="px-2 py-1 text-[var(--gr-text-soft)]">Profile (placeholder)</p>
              <button className="w-full rounded px-2 py-1 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/30" role="menuitem">Dashboard</button>
              <button className="w-full rounded px-2 py-1 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/30" role="menuitem">Logout</button>
            </div>
          </div>
          <button
            className="md:hidden rounded-md border border-[var(--gr-border)] bg-[var(--gr-bg-alt)] px-3 py-1 text-sm font-medium text-[var(--gr-text)]"
            onClick={() => navigate('/discover')}
          >
            Browse
          </button>
        </div>
      </div>
    </header>
  );
}