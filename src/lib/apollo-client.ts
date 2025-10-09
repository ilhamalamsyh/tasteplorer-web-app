/* eslint-disable @typescript-eslint/no-unused-vars */
// src/graphql/apollo-client.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiUrl) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_API_BASE_URL is not defined.'
  );
}

// Define the URI for your GraphQL API endpoint
const httpLink = createHttpLink({
  uri: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth link to add authorization header
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

// Error link to handle global errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        // Only log errors in development mode, and only for debugging purposes
        if (process.env.NODE_ENV === 'development') {
          console.debug(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
              locations
            )}, Path: ${JSON.stringify(path)}`
          );
        }

        // Handle token expired errors
        const errorMessage = message.toLowerCase();
        if (
          errorMessage.includes('token') &&
          (errorMessage.includes('expired') ||
            errorMessage.includes('invalid') ||
            errorMessage.includes('unauthorized'))
        ) {
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Dispatch custom event for global handling
            window.dispatchEvent(
              new CustomEvent('tokenExpired', {
                detail: { message: 'Token expired. Please login again.' },
              })
            );

            // Redirect to home after a short delay
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
        }
      });
    }

    if (networkError) {
      // Only log network errors as they are more critical
      console.error(`[Network error]: ${networkError.message}`);

      // Handle specific network errors with proper type checking
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        // Unauthorized - likely token expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          window.dispatchEvent(
            new CustomEvent('tokenExpired', {
              detail: { message: 'Session expired. Please login again.' },
            })
          );

          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      }
    }
  }
);

// Initialize the Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    // Configure cache policies
    typePolicies: {
      Query: {
        fields: {
          // Add any specific cache policies here if needed
        },
      },
    },
  }),
  // Default options for queries
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
