import React from 'react';

const FEATURES = [
  {
    title: 'Curated Best Sellers',
    desc: 'Daily New York Times list ingestion with enrichment from Google Books.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M10 14h10M10 18h10M4 14h.01M4 18h.01" />
      </svg>
    )
  },
  {
    title: 'Unified Search',
    desc: 'Operator-aware search (intitle:, inauthor:, subject:, isbn:) across millions of volumes.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
      </svg>
    )
  },
  {
    title: 'Live Previews',
    desc: 'Embedded Google Books previews where regionally available, boosting retention.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 19h16M4 5v14M20 5v14M9 9h6v6H9z" />
      </svg>
    )
  },
  {
    title: 'Smart Caching',
    desc: 'Redis edge caching & stale-fallback ensure resilience under upstream rate limits.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
      </svg>
    )
  }
];

const TIMELINE = [
  { date: 'Phase 1', label: 'Core scaffold', text: 'Initial React + Express + MongoDB architecture.' },
  { date: 'Phase 2', label: 'NYT Integration', text: 'Best seller overview & list detail with rank metadata.' },
  { date: 'Phase 3', label: 'Google Books Enrichment', text: 'Search, previews, ISBN-based enrichment & cover fallback.' },
  { date: 'Phase 4', label: 'Resilience & Caching', text: 'Redis TTL layers, stale strategy, rate-limit backoff.' },
  { date: 'Phase 5', label: 'Experience Polish', text: 'Accessible UI, responsive grid refactors, performance tuning.' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--gr-bg,#ffffff)] text-[var(--gr-text,#1f2937)] pt-20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mx-auto max-w-3xl text-center space-y-6">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
            The Platform for Intelligent Book Discovery
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            BookReview merges curated authority (NYT), comprehensive metadata (Google Books),
            and reliable cover fallbacks (Open Library) into a seamless browsing, preview, and tracking experience.
          </p>
        </header>

        <section className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-md transition p-6 flex flex-col"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:scale-105 transition">
                {f.icon}
              </div>
              <h3 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 flex-1">
                {f.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="font-serif text-2xl font-semibold mb-6 tracking-tight">
            Evolution Timeline
          </h2>
          <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
            {TIMELINE.map((t, i) => (
              <li key={i} className="mb-10 ml-4">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-emerald-600 bg-white dark:bg-gray-900" />
                <time className="mb-1 block text-[11px] uppercase tracking-wide font-medium text-emerald-600 dark:text-emerald-400">
                  {t.date}
                </time>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {t.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-semibold tracking-tight">
                Architecture Pillars
              </h2>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Multi-source enrichment via normalized proxy endpoints (NYT, Google Books, Open Library).
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Resilient data layer: Redis caching + stale-while-rate-limited strategies.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Progressive enhancement: previews, operator search, accessible interactions.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Performance: skeleton loaders, lazy images, batched enrichment.
                </li>
              </ul>
            </div>
            <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-900 p-8">
              <div className="grid grid-cols-2 gap-6">
                <Stat label="Best Seller Lists" value="30+" />
                <Stat label="Volume Metadata" value="Millions" />
                <Stat label="Avg Preview Latency" value="<1s" />
                <Stat label="Cache Hit Rate" value="~85%" />
              </div>
            </div>
        </section>

        <section className="mt-24 text-center">
          <h2 className="font-serif text-2xl font-semibold mb-4">
            The Road Ahead
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Upcoming enhancements include personalized shelves via Google OAuth, review curation,
            semantic similarity clustering, and notification-based list movement tracking.
          </p>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-semibold font-mono text-gray-900 dark:text-gray-100">
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-500">
        {label}
      </p>
    </div>
  );
}