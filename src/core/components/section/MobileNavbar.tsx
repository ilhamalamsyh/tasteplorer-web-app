import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { GoHome, GoSearch } from 'react-icons/go';
import { LuUserRound } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/features/auth/components/LoginModal';

const MobileNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user && !loading) {
      e.preventDefault();
      handleLoginClick();
    }
  };

  const getLinkStyle = (path: string) => {
    if (!mounted) {
      return 'flex flex-col items-center text-gray-600';
    }
    return pathname === path
      ? 'flex flex-col items-center text-primary'
      : 'flex flex-col items-center text-gray-600 hover:text-primary/80';
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-md p-2 border-t flex justify-around">
        <Link href={'/'} className={getLinkStyle('/')}>
          <GoHome className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link href={'/explore'} className={getLinkStyle('/explore')}>
          <GoSearch className="w-6 h-6" />
          <span>Explore</span>
        </Link>
        <Link
          href={'/profile'}
          className={getLinkStyle('/profile')}
          onClick={handleProfileClick}
        >
          <LuUserRound className="w-6 h-6" />
          <span>Profile</span>
        </Link>
      </nav>
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
};

export default MobileNavbar;
