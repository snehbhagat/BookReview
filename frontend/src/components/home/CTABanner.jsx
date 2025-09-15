import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="mt-16 overflow-hidden rounded-xl border border-[#d6d0c4] bg-[#fffefa] shadow-sm">
      <div className="relative px-6 py-10 md:px-12 md:py-16">
        <div className="max-w-2xl">
          <h3 className="font-serif text-2xl font-bold text-[#382110]">
            Join thousands of book lovers.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#5a4634]">
            Track what you read, rate books, share reviews, and discover your next favorite story with a vibrant community.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-emerald-600 bg-white px-6 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(125deg, rgba(0,99,93,0.15), rgba(148,123,67,0.15)), repeating-linear-gradient(-45deg, rgba(56,33,16,0.05), rgba(56,33,16,0.05) 6px, transparent 6px, transparent 12px)'
          }}
        />
      </div>
    </section>
  );
}