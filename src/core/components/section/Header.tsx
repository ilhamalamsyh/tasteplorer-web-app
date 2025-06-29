import Link from 'next/link';
import React from 'react';

interface HeaderProps {
  user: { isLoggedIn: boolean; avatar: string };
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick }) => {
  return (
    <header className="hidden md:flex bg-white shadow-md p-4 fixed top-0 w-full z-50">
      <div className="flex justify-between items-center w-full px-12">
        <h1 className="text-xl font-bold">Tasteplorer</h1>

        <nav className="flex space-x-4">
          <Link href={'/'} className="text-gray-700 hover:text-black">
            Home
          </Link>
          <Link href={'/about'} className="text-gray-700 hover:text-black">
            About
          </Link>
        </nav>

        <div>
          {user.isLoggedIn ? (
            <Link href="/profile">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border cursor-pointer"
              />
            </Link>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
