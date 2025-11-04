'use client';

import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import LoadingScreen from '@/components/common/loading-screen';
import Header from '@/components/p/header';
import { PORTAL_URL } from '@/constants/site';
import { isLoggedIn } from '@/lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './app.css';

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = new QueryClient();

  useEffect(() => {
    const checkAuth = () => {
      if (isLoggedIn() && pathname.startsWith(`${PORTAL_URL}/auth/login`)) {
        navigate(`${PORTAL_URL}/dashboard`);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div id="portal-app">
      <Header isAuthenticated={false} />
      <div className="min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    </div>
  );
}
