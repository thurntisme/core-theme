'use client';

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

import type { IBlog } from '@/types/blog';

export default function BlogPost() {
  const blog: IBlog = {
    id: '1',
    title: 'Understanding React Hooks: A Comprehensive Guide',
    slug: 'understanding-react-hooks',
    image:
      'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1470&q=80',
    date: 'March 15, 2023',
    readTime: '8 min read',
    category: 'React',
    excerpt:
      'An in-depth look at React Hooks, their benefits, and how to use them effectively in your applications.',
    content: `<p>React Hooks have revolutionized the way we build components in React. They allow us to use state and other React features without writing a class. In this comprehensive guide, we'll explore the most commonly used hooks and how to leverage them in your applications.</p>
    <h2>useState</h2>
    <p>The useState hook is used to add state to functional components. It returns a stateful value and a function to update it.</p>
    <pre><code>const [count, setCount] = useState(0);</code></pre>
    <h2>useEffect</h2>
    <p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.</p>
    <pre><code>useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]);</code></pre>
    <h2>Conclusion</h2>
    <p>React Hooks provide a powerful way to manage state and side effects in functional components. By understanding and utilizing hooks like useState and useEffect, you can write cleaner and more efficient React code.</p>`,
  };

  const renderContent = () => {
    if (blog) {
      return (
        <>
          {/* Back button */}
          <Link
            to="/blog"
            className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-primary mb-6 sm:mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to all posts</span>
          </Link>

          {/* Featured image */}
          <div className="rounded-lg overflow-hidden mb-6 sm:mb-8 aspect-video">
            <img
              src={blog?.image}
              alt={blog?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
              {blog?.title}
            </h1>
            <div className="flex flex-wrap items-center text-sm sm:text-base text-muted-foreground gap-3 sm:gap-4">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{blog?.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{blog?.readTime}</span>
              </div>
              <div className="flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                <span>{blog?.category}</span>
              </div>
            </div>
          </div>

          {/* Post content */}
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-12 sm:mb-16"
            dangerouslySetInnerHTML={{ __html: blog?.content || '' }}
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
      >
        {renderContent()}
      </motion.div>
    </>
  );
}
