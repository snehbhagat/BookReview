import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#d6d0c4] bg-[#fefefe] py-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4">
        <div>
          <h4 className="font-serif text-lg font-semibold text-[#382110]">BookReview</h4>
          <p className="mt-2 text-sm leading-relaxed text-[#5a4634]">
            A community platform to discover, track, and review books you love.
          </p>
        </div>
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-[#382110]">Platform</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/discover" className="hover:underline text-[#00635d]">Browse Books</a></li>
            <li><a href="/genres" className="hover:underline text-[#00635d]">Genres</a></li>
            <li><a href="/my-reviews" className="hover:underline text-[#00635d]">My Reviews</a></li>
            <li><a href="/write-review" className="hover:underline text-[#00635d]">Write a Review</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-[#382110]">Company</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/about" className="hover:underline text-[#00635d]">About</a></li>
            <li><a href="/contact" className="hover:underline text-[#00635d]">Contact</a></li>
            <li><a href="/privacy" className="hover:underline text-[#00635d]">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline text-[#00635d]">Terms</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wide text-[#382110]">Connect</h5>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://twitter.com" className="hover:underline text-[#00635d]">Twitter</a></li>
              <li><a href="https://github.com" className="hover:underline text-[#00635d]">GitHub</a></li>
              <li><a href="https://instagram.com" className="hover:underline text-[#00635d]">Instagram</a></li>
            </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-[#d6d0c4] pt-6 text-center text-xs text-[#5a4634]">
        © {new Date().getFullYear()} BookReview. All rights reserved.
      </div>
    </footer>
  );
}