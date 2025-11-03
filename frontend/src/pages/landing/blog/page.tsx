'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

import BlogCard from '@/components/landing/BlogCard';
import LANDING_ENDPOINTS from '@/constants/api/landing';
import { internalApi } from '@/lib/api/internal';
import type { IBlog } from '@/types/blog';
import { useQuery } from '@tanstack/react-query';

const categories = ['All', 'Web Development', 'Design', 'React', 'TypeScript'];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const blogList = { data: [] as IBlog[] };

  const handleSearch = () => {
    // Search functionality now runs on submit rather than real-time
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleResetSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Blog
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Thoughts, insights, and ideas on design, development, and
            technology.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 sm:mb-10 space-y-4">
          <div className="relative max-w-md mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {searchTerm && (
                <button
                  onClick={handleResetSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Reset search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm sm:text-base"
              >
                Search
              </button>
              <button
                onClick={handleResetSearch}
                className="flex-1 sm:flex-none px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {blogList?.data.map((post, index) => (
            <BlogCard key={post.slug} {...post} index={index} />
          ))}
        </motion.div>

        {blogList?.data.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-muted-foreground text-sm sm:text-base">
              No articles found. Try adjusting your search or category filter.
            </p>
          </div>
        )}

        {/* Pagination */}
        {/* {blogList?.length > 0 && (
            <div className="mt-8 sm:mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page and pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      // Show ellipsis for skipped pages
                      if (page === 2 && currentPage > 3) {
                        return (
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (
                        page === totalPages - 1 &&
                        currentPage < totalPages - 2
                      ) {
                        return (
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return null;
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )} */}
      </motion.div>
    </>
  );
}
