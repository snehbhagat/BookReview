import React from 'react';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
// Removed: import FeaturedBooks from '@/components/home/FeaturedBooks';
import FeaturedBestSellers from '@/components/home/FeaturedBestSellers';
import GenresGrid from '@/components/home/GenresGrid';
import ReviewsFeed from '@/components/home/ReviewsFeed';
import SidebarWidgets from '@/components/home/SidebarWidgets';
import CTABanner from '@/components/home/CTABanner';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--gr-bg)] text-[var(--gr-text)]">
      <Navbar />
      <main id="main-content" className="pt-20">
        <div className="mx-auto max-w-7xl px-4">
          <Hero />
          <div className="mt-10 flex gap-10">
            <div className="flex-1">
              <FeaturedBestSellers layout="grid" />
              <GenresGrid />
              <ReviewsFeed />
              <CTABanner />
            </div>
            <SidebarWidgets />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}