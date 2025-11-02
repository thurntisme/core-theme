'use client';

import React from 'react';

import ContactCTA from '@/components/landing/ContactCTA';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import Hero from '@/components/landing/Hero';
import RecentBlog from '@/components/landing/RecentBlog';
import LandingLayout from '@/components/layouts/Landing';

export default function Home() {
  return (
    <LandingLayout>
      <Hero />

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Recent Blog Posts Section */}
      <RecentBlog />

      {/* Contact CTA Section */}
      <ContactCTA />
    </LandingLayout>
  );
}
