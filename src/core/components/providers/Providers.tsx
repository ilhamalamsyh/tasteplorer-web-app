'use client';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { AuthProvider } from '@/context/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
};

export default Providers;
