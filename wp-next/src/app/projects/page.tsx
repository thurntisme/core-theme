'use client';

import { motion } from 'framer-motion';

import ProjectCard from '@/components/landing/ProjectCard';
import LandingWrapper from '@/components/layouts/LandingWrapper';
import { projects } from '@/mock/projects';

export default function Projects() {
  const list = projects.map((project) => {
    const slug = project.title.toLowerCase().replace(/\s+/g, '-');
    return { ...project, slug };
  });

  return (
    <LandingWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            Our Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
          >
            Explore our portfolio of web development and design projects.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {list.map((project) => (
            <ProjectCard {...project} />
          ))}
        </div>
      </motion.div>
    </LandingWrapper>
  );
}
