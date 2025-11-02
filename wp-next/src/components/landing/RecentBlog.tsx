'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import BlogCard from '@/components/landing/BlogCard';
import LANDING_ENDPOINTS from '@/constants/api/landing';
import { internalApi } from '@/lib/api/internal';
import { IBlog } from '@/types/blog';
import { useQuery } from '@tanstack/react-query';

const RecentBlog = () => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const res = await internalApi.get<IBlog[]>(LANDING_ENDPOINTS.RECENT_BLOG);
      return res.data;
    },
  });

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-red-500">Error loading posts</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold">
              Recent Blog Posts
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Thoughts, insights and ideas on design and development
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/blog"
              className="text-primary font-medium flex items-center hover:underline text-sm sm:text-base"
            >
              View all posts
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {data?.length &&
            data.map((post, index) => (
              <BlogCard key={post.slug} {...post} index={index} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBlog;
