'use client';

import Footer from '../Footer';
import Navbar from '../Navbar';
import Providers from '../Providers';

import React from 'react';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import '@/index.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isFullWidth = pathname === '/';

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className={`mx-auto ${isFullWidth ? 'w-full' : 'max-w-7xl px-4 sm:px-6 lg:px-8'} py-8`}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </Providers>
  );
};

export default Layout;
