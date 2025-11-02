import React from 'react';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/ui/theme-provider';
import { GTM_ID, MEASUREMENT_ID } from '@/constants/site';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Thurntisme',
    template: '%s | Thurntisme',
  },
  description:
    'Welcome to Thurntisme - A portfolio showcasing web development and design projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics gaId={MEASUREMENT_ID} />
        )}
        {process.env.NODE_ENV === 'production' && (
          <GoogleTagManager gtmId={GTM_ID} />
        )}
      </body>
    </html>
  );
}
