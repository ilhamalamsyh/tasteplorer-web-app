/* eslint-disable @next/next/no-page-custom-font */
'use client';
import React, { ReactNode } from 'react';
import '../styles/tailwind.css';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import Footer from '@/core/components/section/Footer';
import { AuthProvider } from '@/context/AuthContext';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
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
            <div
              className="min-h-screen flex flex-col bg-bgcolor"
              suppressHydrationWarning
            >
              <header className="bg-[#FF670E] text-white p-4">
                <h1 className="text-3xl font-bold text-center">Tasteplorer</h1>
              </header>
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </body>
        </html>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default Layout;
