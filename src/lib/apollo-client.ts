// src/graphql/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// Initialize the Apollo Client
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(), // Cache configuration for client-side caching
});
