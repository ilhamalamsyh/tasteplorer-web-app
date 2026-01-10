import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import LoginModal from '@/features/auth/components/LoginModal';

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { previousPath, setPreviousPath } = useNavigation();

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return `relative py-2 text-gray-700 font-medium transition ${
      isActive
        ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
        : 'hover:text-primary'
    }`;
  };

  const handleLoginClick = () => {
    setPreviousPath(pathname);
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    if (previousPath) {
      router.push(previousPath);
      setPreviousPath(null);
    } else {
      router.push('/');
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user && !loading) {
      setPreviousPath(pathname);
    }
    router.push('/profile');
  };

  // Helper for fallback initials
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <>
      <header className="flex bg-white shadow-sm h-16 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto px-8 h-full">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary font-poppins tracking-tight cursor-pointer">
              Tasteplorer
            </h1>
          </Link>
          {/* Nav */}
          <nav className="hidden md:flex flex-1 justify-center space-x-8">
            <Link href="/feed" className={getLinkStyle('/feed')}>
              Home
            </Link>
            <Link href="/" className={getLinkStyle('/')}>
              Explore
            </Link>
            <a
              href="/profile"
              className={getLinkStyle('/profile')}
              onClick={handleProfileClick}
            >
              Profile
            </a>
          </nav>
          {/* User */}
          <div className="flex items-center">
            {!loading && user ? (
              <a href="/profile" onClick={handleProfileClick}>
                {user.image && user.image.trim() !== '' ? (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    style={{ boxShadow: 'none', border: 'none' }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                    {getInitials(user.fullname)}
                  </div>
                )}
              </a>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-none"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal isOpen={showLoginModal} onClose={handleCloseLoginModal} />
    </>
  );
};

export default Header;
