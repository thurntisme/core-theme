'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from '@/components/p/header';
import { PORTAL_URL } from '@/constants/site';

import './app.css';

export default function PortalLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('auth-session=')
      );

      if (authCookie && authCookie.includes('authenticated')) {
        // Award daily login points (only once per day)
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = localStorage.getItem('freelancer-last-login');

        if (lastLogin !== today) {
          localStorage.setItem('freelancer-last-login', today);
        }
      } else {
        navigate(`${PORTAL_URL}/login`);
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
      <Header />
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
