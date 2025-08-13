'use client';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { AuthProvider } from '@/context/AuthContext';
import { NavigationProvider } from '@/context/NavigationContext';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <NavigationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NavigationProvider>
    </ApolloProvider>
  );
};

export default Providers;
