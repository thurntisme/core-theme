'use client';

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from '@/components/p/header';
import { PORTAL_URL } from '@/constants/site';
import { isLoggedIn } from '@/lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './app.css';

export default function PortalLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const queryClient = new QueryClient();

  useEffect(() => {
    const checkAuth = () => {
      if (isLoggedIn()) {
        setIsAuthenticated(true);
      } else {
        navigate(`${PORTAL_URL}/auth/login`);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="portal-app">
      <Header isAuthenticated={isAuthenticated} />
      <div className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    </div>
  );
}
