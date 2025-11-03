'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PORTAL_URL } from '@/constants/site';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth-session=')
    );

    if (authCookie && authCookie.includes('authenticated')) {
      navigate(`${PORTAL_URL}/dashboard`);
    } else {
      navigate(`${PORTAL_URL}/login`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
