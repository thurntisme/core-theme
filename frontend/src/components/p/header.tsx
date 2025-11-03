'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LogOut, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PORTAL_URL } from '@/constants/site';

type Props = {};

const Header = (props: Props) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie =
      'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate(`${PORTAL_URL}/login`);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 flex-grow">
            <h1 className="text-xl font-semibold text-gray-900">
              <Link to={PORTAL_URL} className="font-bold text-xl">
                Freelancer Portal
              </Link>
            </h1>
            <div className="flex items-center gap-2 ml-auto mr-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                {totalPoints} points
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
