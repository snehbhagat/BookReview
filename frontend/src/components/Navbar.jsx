import { Link, NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Navbar({ isAuthenticated, user }) {
  const [open, setOpen] = useState(false);

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const linkInactive =
    "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800";
  const linkActive = "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>

          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            BookReview
          </Link>

          <div className="ml-2 hidden items-center gap-1 sm:flex">
            <NavLink end to="/" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
              Home
            </NavLink>
            <NavLink to="/books" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
              Books
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
                Hello, {user?.name || "Reader"}
              </span>
              <div className="h-8 w-8 rounded-full bg-indigo-600/10 ring-1 ring-indigo-600/30 dark:bg-indigo-400/10 dark:ring-indigo-400/30" />
            </div>
          )}
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 sm:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8">
            <NavLink
              end
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/books"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Books
            </NavLink>

            {!isAuthenticated && (
              <div className="mt-2 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}