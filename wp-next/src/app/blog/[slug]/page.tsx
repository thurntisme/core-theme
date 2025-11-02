'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

import LandingWrapper from '@/components/layouts/LandingWrapper';
// import { CommentBox } from '@/components/ui/comment-box';
import LANDING_ENDPOINTS from '@/constants/api/landing';
import useScrollToTop from '@/hooks/useScrollToTop';
import { internalApi } from '@/lib/api/internal';
import { IBlog } from '@/types/blog';
import { useQuery } from '@tanstack/react-query';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery<IBlog>({
    queryKey: ['blog-detail', params.slug],
    queryFn: async () => {
      const res = await internalApi.get<IBlog>(
        LANDING_ENDPOINTS.RECENT_BLOG + '/' + params.slug
      );
      return res.data;
    },
  });

  useScrollToTop();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center">
          <p className="text-red-500">Error loading post</p>
        </div>
      );
    }
    if (blog) {
      return (
        <>
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-primary mb-6 sm:mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to all posts</span>
          </Link>

          {/* Featured image */}
          <div className="rounded-lg overflow-hidden mb-6 sm:mb-8 aspect-video">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm sm:text-base text-muted-foreground gap-3 sm:gap-4">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                <span>{blog.category}</span>
              </div>
            </div>
          </div>

          {/* Post content */}
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-12 sm:mb-16"
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />

          {/* Comments Section */}
          {/* <div className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
              Comments
            </h2>
            <CommentBox
              comments={[
                {
                  id: '1',
                  author: {
                    name: 'Jane Smith',
                    initials: 'JS',
                  },
                  date: 'April 2, 2023',
                  content:
                    "This was really insightful! I've been thinking about this topic a lot lately.",
                },
                {
                  id: '2',
                  author: {
                    name: 'Mark Johnson',
                    initials: 'MJ',
                  },
                  date: 'March 30, 2023',
                  content:
                    'Great article! I especially appreciated the part about performance optimization.',
                },
              ]}
            />
          </div> */}

          {/* Related Posts Section */}
          {/* {relatedPosts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                    <Card className="h-full transition-transform hover:translate-y-[-5px]">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold line-clamp-2 text-sm sm:text-base">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 text-xs sm:text-sm">
                          {relatedPost.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground pt-0">
                        {relatedPost.date} · {relatedPost.readTime}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
        </>
      );
    }
    return (
      <div className="text-center">
        <p className="text-red-500">Post not found</p>
      </div>
    );
  };

  return (
    <LandingWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        {renderContent()}
      </motion.div>
    </LandingWrapper>
  );
}
