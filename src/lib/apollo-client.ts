// src/graphql/apollo-client.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiUrl) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_API_BASE_URL is not defined.'
  );
}

// Define the URI for your GraphQL API endpoint (replace with your API endpoint)
const httpLink = createHttpLink({
  uri: apiUrl, // Change this to your GraphQL API endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize the Apollo Client
export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(), // Cache configuration for client-side caching
});
