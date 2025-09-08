import React from 'react';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import FeaturedBooks from '@/components/home/FeaturedBooks';
import GenresGrid from '@/components/home/GenresGrid';
import ReviewsFeed from '@/components/home/ReviewsFeed';
import SidebarWidgets from '@/components/home/SidebarWidgets';
import CTABanner from '@/components/home/CTABanner';
import Footer from '@/components/home/Footer';

/**
 * Home Page Layout
 * - Main column + optional sidebar (xl breakpoint)
 * - Scroll padding to account for fixed navbar
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#382110]">
      <Navbar />
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4">
          <Hero />
          <div className="mt-10 flex gap-10">
            <div className="flex-1">
              <FeaturedBooks />
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