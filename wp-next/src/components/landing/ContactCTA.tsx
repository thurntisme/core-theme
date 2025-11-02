import React from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const ContactCTA = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4">
          Ready to Start Your Next Project?
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          Let's collaborate to create something amazing together. I'm currently
          available for freelance work and exciting opportunities.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
        >
          Get in Touch
        </Link>
      </motion.div>
    </section>
  );
};

export default ContactCTA;
