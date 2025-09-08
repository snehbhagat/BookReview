import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#f4f1ea] via-[#ece6d9] to-[#e3dccd] border border-[#d6d0c4] p-8 md:p-12 shadow-sm">
      <div className="relative z-10 max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-[#382110]">
          Discover. Review. <span className="text-emerald-700">Share</span> your love for books.
        </h1>
        <p className="mt-4 text-[#5a4634] text-sm md:text-base leading-relaxed">
          Explore millions of titles, track what you read, and join a community of passionate readers.
          Your next favorite book is waiting.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/discover"
            className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700 transition"
          >
            Browse Books
          </Link>
          <Link
            to="/write-review"
            className="rounded-md border border-emerald-600 bg-white px-5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
          >
            Write a Review
          </Link>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(0,128,96,0.15), transparent 60%), radial-gradient(circle at 80% 60%, rgba(167,124,67,0.25), transparent 70%)'
        }}
      />
    </section>
  );
}