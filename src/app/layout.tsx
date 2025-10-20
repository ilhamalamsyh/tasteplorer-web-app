/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-page-custom-font */
import React from 'react';
import '../styles/tailwind.css';
import Providers from '@/core/components/providers/Providers';
import ClientLayout from '@/core/components/layout/ClientLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google Fonts Link for Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tasteplorer</title>
      </head>
      <body className="h-full font-inter scrollbar-hide bg-[#f6f6f6]">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
