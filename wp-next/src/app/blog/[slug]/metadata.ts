import { Metadata } from 'next';

// Sample data (same as in the blog page)
const blogPosts = [
  {
    id: '1',
    title: 'The Future of Web Development',
    excerpt:
      'Exploring emerging trends and technologies that will shape the web in the coming years.',
    date: 'Apr 15, 2023',
    readTime: '5 min read',
    category: 'Web Development',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Designing for Accessibility',
    excerpt:
      "Why accessible design isn't just nice to have—it's essential for creating inclusive digital experiences.",
    date: 'Mar 28, 2023',
    readTime: '8 min read',
    category: 'Design',
    image:
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'How to Optimize React Applications',
    excerpt:
      'Practical strategies to improve the performance of React applications and components.',
    date: 'Mar 12, 2023',
    readTime: '10 min read',
    category: 'React',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'The Psychology of Color in Web Design',
    excerpt:
      'Understanding how colors affect user perception and behavior on the web.',
    date: 'Feb 20, 2023',
    readTime: '6 min read',
    category: 'Design',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Getting Started with TypeScript',
    excerpt:
      "A beginner's guide to using TypeScript in your JavaScript projects.",
    date: 'Feb 05, 2023',
    readTime: '7 min read',
    category: 'TypeScript',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'State Management in Modern Web Apps',
    excerpt:
      'Comparing different state management approaches and when to use each one.',
    date: 'Jan 18, 2023',
    readTime: '9 min read',
    category: 'Web Development',
    image:
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Thurntisme',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Thurntisme Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
      authors: ['Thurntisme'],
    },
  };
}
