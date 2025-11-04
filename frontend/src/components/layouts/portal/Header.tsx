'use client';

import { useLocation, useNavigate } from 'react-router-dom';

import { LogOut, Trophy } from 'lucide-react';

import ConfirmDialog from '@/components/common/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PORTAL_URL } from '@/constants/site';

type Props = {
  isAuthenticated: boolean;
};

const Header = ({ isAuthenticated }: Props) => {
  const totalPoints = 1500;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isShow = !pathname.startsWith(`${PORTAL_URL}/auth`) && isAuthenticated;

  const handleClickTitle = () => {
    if (isShow) {
      navigate(`${PORTAL_URL}/dashboard`);
    } else {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    document.cookie =
      'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate(`${PORTAL_URL}/auth/login`);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex justify-center items-center gap-4 flex-grow">
            <h1
              className="text-xl font-semibold text-gray-900 cursor-pointer"
              onClick={handleClickTitle}
            >
              <span className="font-bold text-xl">Freelancer Portal</span>
            </h1>
            {isShow && (
              <>
                <div className="flex items-center gap-2 ml-auto">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {totalPoints} points
                  </Badge>
                </div>
                <ConfirmDialog
                  title="Confirm logout"
                  description="Are you sure you want to log out?"
                  onConfirm={handleLogout}
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </ConfirmDialog>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
