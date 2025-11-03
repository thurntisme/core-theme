import React from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -z-10 right-1/4 bottom-1/3 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1,
          }}
          className="inline-block mb-4"
        >
          <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
            Welcome to my portfolio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2,
          }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-balance mb-4 sm:mb-6 leading-tight"
        >
          Creating digital <span className="text-gradient">experiences</span>{' '}
          that matter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.3,
          }}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto sm:mx-0 leading-relaxed"
        >
          A passionate designer and developer focused on crafting beautiful,
          functional websites and applications that help businesses grow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.4,
          }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start"
        >
          <Link
            to="/projects"
            className="inline-flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
          >
            View Projects <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center h-11 sm:h-12 px-4 sm:px-6 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md"
          >
            Contact Me <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
