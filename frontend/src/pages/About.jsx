import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="bg-white py-12 dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Discover, review, and share your favorite books.
          </h1>
          <p className="mt-4 text-lg leading-7 text-slate-600 dark:text-slate-300">
            Join a community of readers. Track progress, write honest reviews, and find your next great read.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Get Started
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Browse Books
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <dt className="font-semibold text-slate-900 dark:text-white">Personalized picks</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">See books tailored to your taste.</dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <dt className="font-semibold text-slate-900 dark:text-white">Community reviews</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">Learn from fellow readers.</dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <dt className="font-semibold text-slate-900 dark:text-white">Reading tracker</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">Stay on top of your goals.</dd>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <dt className="font-semibold text-slate-900 dark:text-white">Accessible & fast</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">Responsive, keyboard-friendly UI.</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-700/10" />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Clean, modern interface with light and dark themes.
          </p>
        </div>
      </div>
    </section>
  );
}