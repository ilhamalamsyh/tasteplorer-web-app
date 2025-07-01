'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/core/components/section/Header';
import MobileNavbar from '@/core/components/section/MobileNavbar';
import LoginModal from '@/core/components/modal/LoginModal';

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
    <div className="min-h-screen flex flex-col">
      {!hideLayoutPages && (
        <>
          <Header />
          <div className="hidden:md:block h-16"></div>
        </>
      )}

      <main
        className={`flex-1 container mx-auto p-4${
          !hideLayoutPages && isMobile ? ' pb-16' : ''
        }`}
      >
        {children}
      </main>
      {!hideLayoutPages && isMobile && <MobileNavbar />}
      {modal === 'login' && !isMobile && (
        <LoginModal onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default ClientLayout;
