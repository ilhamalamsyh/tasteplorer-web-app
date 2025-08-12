import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { GoHome, GoSearch } from 'react-icons/go';
import { LuUserRound } from 'react-icons/lu';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/features/auth/components/LoginModal';

const MobileNavbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
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
    e.preventDefault();
    if (!user && !loading) {
      handleLoginClick();
    } else if (user) {
      router.push('/profile');
    }
  };

  const getLinkStyle = (path: string) => {
    if (!mounted) {
      return 'flex flex-col items-center text-gray-600';
    }

    const isActive = pathname === path;
    return isActive
      ? 'flex flex-col items-center text-primary'
      : 'flex flex-col items-center text-gray-600 hover:text-primary/80';
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-md p-2 border-t flex justify-around z-[90] isolate">
        <Link href="/" className={getLinkStyle('/')}>
          <GoHome className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link href="/explore" className={getLinkStyle('/explore')}>
          <GoSearch className="w-6 h-6" />
          <span>Explore</span>
        </Link>
        <a
          href="/profile"
          className={getLinkStyle('/profile')}
          onClick={handleProfileClick}
        >
          <LuUserRound className="w-6 h-6" />
          <span>Profile</span>
        </a>
      </nav>
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        isMobileFullScreen={true}
      />
    </>
  );
};

export default MobileNavbar;
