/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-page-custom-font */
'use client';
import React, { useEffect, useState } from 'react';
import '../styles/tailwind.css';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import Footer from '@/core/components/section/Footer';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/core/components/section/Header';
import MobileNavbar from '@/core/components/section/MobileNavbar';
import LoginModal from '@/core/components/modal/LoginModal';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  isLoggedIn: boolean;
  avatar: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [modal, setModal] = useState<'login' | null>(null);

  // simulating user auth (Replace with actual logic)
  const [user, setUser] = useState<User>({
    isLoggedIn: true,
    avatar:
      'https://i.pinimg.com/736x/d3/51/84/d351847348dd0dabeac308be8e2bb072.jpg',
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width:767px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const handleLoginClick = () => {
    isMobile ? router.push('/login') : setModal('login');
  };

  const hideLayoutPages = ['/login', '/register'].includes(pathname);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <html lang="en">
          <head>
            {/* Google Fonts Link for Poppins */}
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
              rel="stylesheet"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Tasteplorer</title>
          </head>
          <body>
            {/* <div
              className="min-h-screen flex flex-col bg-bgcolor"
              suppressHydrationWarning
            >
              <header className="bg-[#FF670E] text-white p-4">
                <h1 className="text-3xl font-bold text-center">Tasteplorer</h1>
              </header>
              <main className="flex-grow">{children}</main>
              <Footer />
            </div> */}
            <div className="min-h-screen flex flex-col">
              {!hideLayoutPages && (
                <>
                  <Header user={user} onLoginClick={handleLoginClick} />
                  <div className="hidden:md:block h-16"></div>
                </>
              )}

              <main className="flex-1 container mx-auto p-4">{children}</main>
              {!hideLayoutPages && <Footer />}
              {!hideLayoutPages && isMobile && <MobileNavbar />}
              {modal === 'login' && !isMobile && (
                <LoginModal onClose={() => setModal(null)} />
              )}
            </div>
          </body>
        </html>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default Layout;
