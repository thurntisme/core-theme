'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ThemeProviderProps {
  children: ReactNode;
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </QueryClientProvider>
  );
}
