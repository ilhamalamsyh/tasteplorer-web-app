import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { GoHome, GoSearch } from 'react-icons/go';
import { LuUserRound, LuPlus } from 'react-icons/lu';
import { HiOutlinePencilSquare, HiOutlinePlusCircle } from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import FeedForm from '@/features/feed/components/FeedForm';

const MobileNavbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();
  const { setPreviousPath } = useNavigation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCreateMenu(false);
      }
    };

    if (showCreateMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateMenu]);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user && !loading) {
      setPreviousPath(pathname);
    }
    router.push('/profile');
  };

  const handleCreateClick = () => {
    if (!user && !loading) {
      setPreviousPath(pathname);
      router.push('/login');
      return;
    }
    setShowCreateMenu(!showCreateMenu);
  };

  const handleCreatePost = () => {
    setShowCreateMenu(false);
    setShowFeedForm(true);
  };

  const handleCreateRecipe = () => {
    setShowCreateMenu(false);
    router.push('/recipes/new');
  };

  const handleFeedFormSuccess = () => {
    // Refresh the feed page if we're on it
    if (pathname === '/feed') {
      router.refresh();
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
      {/* Create Menu Overlay */}
      {showCreateMenu && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-[95]" />
      )}

      {/* Create Menu Card */}
      {showCreateMenu && (
        <div
          ref={menuRef}
          className="md:hidden fixed bottom-20 right-4 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="py-2 min-w-[200px]">
            <button
              onClick={handleCreatePost}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <HiOutlinePencilSquare className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">
                Create a post
              </span>
            </button>
            <button
              onClick={handleCreateRecipe}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <HiOutlinePlusCircle className="w-6 h-6 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">
                Create a new recipe
              </span>
            </button>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-md p-2 border-t flex justify-around items-end z-[90] isolate">
        <Link href="/feed" className={getLinkStyle('/feed')}>
          <GoHome className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        {!loading && user && (
          <button
            onClick={handleCreateClick}
            className="flex flex-col items-center text-gray-600 hover:text-primary/80 relative -translate-y-0"
            aria-label="Create content"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center absolute -top-7 shadow-lg transition-all ${
                showCreateMenu
                  ? 'bg-primary text-white scale-110'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <LuPlus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-xs invisible">Create</span>
          </button>
        )}
        <Link href="/" className={getLinkStyle('/')}>
          <GoSearch className="w-6 h-6" />
          <span className="text-xs">Explore</span>
        </Link>
        <a
          href="/profile"
          className={getLinkStyle('/profile')}
          onClick={handleProfileClick}
        >
          <LuUserRound className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </a>
      </nav>

      {showFeedForm && (
        <FeedForm
          isOpen={showFeedForm}
          onClose={() => setShowFeedForm(false)}
          onSuccess={handleFeedFormSuccess}
        />
      )}
    </>
  );
};

export default MobileNavbar;
