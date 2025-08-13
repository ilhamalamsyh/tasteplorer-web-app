'use client';

import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@/context/NavigationContext';
import { ReactNode, useEffect, useState } from 'react';
import LoginModal from '@/features/auth/components/LoginModal';
import { usePathname, useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { previousPath } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [loading, user]);

  const handleCloseLoginModal = () => {
    if (previousPath && previousPath !== pathname) {
      router.push(previousPath);
    } else {
      router.push('/');
    }
    setShowLoginModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user ? children : null}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        isMobileFullScreen={true}
      />
    </>
  );
}
