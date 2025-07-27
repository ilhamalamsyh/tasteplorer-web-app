'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/core/components/section/Header';
import MobileNavbar from '@/core/components/section/MobileNavbar';
import LoginModal from '@/features/auth/components/LoginModal';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [modal, setModal] = useState<'login' | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width:767px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const hideLayoutPages = ['/login', '/register'].includes(pathname);

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {!hideLayoutPages && (
        <>
          <Header />
          <div className="h-16" /> {/* Spacer for fixed header */}
        </>
      )}

      <main
        className={`flex-1 w-full mx-auto ${
          !hideLayoutPages && isMobile ? 'pb-16' : ''
        }`}
      >
        {children}
      </main>

      {!hideLayoutPages && isMobile && <MobileNavbar />}
      <LoginModal
        isOpen={modal === 'login' && !isMobile}
        onClose={() => setModal(null)}
      />
    </div>
  );
};

export default ClientLayout;
