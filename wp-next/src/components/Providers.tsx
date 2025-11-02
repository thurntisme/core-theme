'use client';

import React from 'react';

import { AnimatePresence } from 'framer-motion';

import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </TooltipProvider>
  );
}
