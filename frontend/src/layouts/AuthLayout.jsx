import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-[#0f1714] dark:via-[#0d1211] dark:to-[#0a0f0e]">
      {/* Decorative Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="w-full max-w-lg relative">
        <Link
          to="/"
          className="group mb-8 flex items-center gap-2 justify-center text-base font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition"
        >
          <svg
            className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 12l6 6m-6-6l6-6" />
          </svg>
          Back Home
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            className="w-full relative rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-[0_8px_40px_-10px_rgba(16,185,129,0.25)] dark:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.25)] px-10 py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, type: 'spring', bounce: 0.18 } }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.25 } }}
          >
            <div className="mb-10 text-center space-y-3">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="space-y-8">{children}</div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-14 text-center text-[12px] tracking-wide text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} BookReview. All rights reserved.
        </p>
      </div>
    </div>
  );
}