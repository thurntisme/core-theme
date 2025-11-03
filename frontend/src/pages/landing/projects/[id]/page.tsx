'use client';

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Sample project data (in a real app, this would come from an API or CMS)
const project = {
  id: '1',
  title: 'E-commerce Platform',
  description:
    'A modern e-commerce platform built with Next.js and Stripe integration.',
  content: `
    <p>This e-commerce platform was built with modern web technologies and best practices in mind. The project features a seamless shopping experience, secure payment processing, and an intuitive admin dashboard.</p>

    <h2>Key Features</h2>
    <ul>
      <li>Responsive design that works on all devices</li>
      <li>Secure payment processing with Stripe</li>
      <li>Real-time inventory management</li>
      <li>User authentication and authorization</li>
      <li>Admin dashboard for order management</li>
    </ul>

    <h2>Technical Stack</h2>
    <ul>
      <li>Next.js for the frontend and API routes</li>
      <li>TypeScript for type safety</li>
      <li>Tailwind CSS for styling</li>
      <li>Stripe for payment processing</li>
      <li>PostgreSQL for the database</li>
    </ul>
  `,
  image:
    'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  category: 'Web Development',
  tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
  date: 'March 2024',
  client: 'Example Client',
  role: 'Lead Developer',
};

export default function ProjectDetail({ params }: { params: { id: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
    >
      {/* Back button */}
      <Link
        to="/projects"
        className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-primary mb-6 sm:mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back to all projects</span>
      </Link>

      {/* Featured image */}
      <div className="rounded-lg overflow-hidden mb-6 sm:mb-8 aspect-video">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Project header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
          {project.title}
        </h1>
        <div className="flex flex-wrap items-center text-sm sm:text-base text-muted-foreground gap-3 sm:gap-4">
          <div>{project.category}</div>
          <div>{project.date}</div>
          <div>Client: {project.client}</div>
          <div>Role: {project.role}</div>
        </div>
      </div>

      {/* Project content */}
      <div
        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-12 sm:mb-16"
        dangerouslySetInnerHTML={{ __html: project.content }}
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
