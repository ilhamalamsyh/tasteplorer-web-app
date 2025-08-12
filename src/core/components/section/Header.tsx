import Link from 'next/link';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/features/auth/components/LoginModal';

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

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
            <Link
              href="/"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-gray-700 hover:text-primary font-medium transition"
            >
              Explore
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 hover:text-primary font-medium transition"
              onClick={handleProfileClick}
            >
              Profile
            </Link>
          </nav>
          {/* User */}
          <div className="flex items-center">
            {!loading && user ? (
              <Link href="/profile">
                {user.image ? (
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
              </Link>
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
