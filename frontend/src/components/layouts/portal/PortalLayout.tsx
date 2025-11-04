'use client';

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import LoadingScreen from '@/components/common/loading-screen';
import Header from '@/components/layouts/portal/Header';
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
      if (!isLoggedIn()) {
        navigate(`${PORTAL_URL}/auth/login`);
      } else {
        setIsAuthenticated(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading || !isAuthenticated) {
    return <LoadingScreen />;
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
