/* eslint-disable @typescript-eslint/no-explicit-any */
// Utility functions for error handling
export const formatAuthErrorMessage = (error: string): string => {
  const message = error.toLowerCase();

  // Authentication specific errors
  if (
    message.includes('invalid credentials') ||
    message.includes('credential')
  ) {
    return 'Invalid username or password. Please check your credentials and try again.';
  }

  if (message.includes('user not found') || message.includes('not found')) {
    return 'User not found. Please check your username.';
  }

  if (message.includes('account disabled') || message.includes('disabled')) {
    return 'Your account has been disabled. Please contact support.';
  }

  if (message.includes('too many attempts') || message.includes('rate limit')) {
    return 'Too many login attempts. Please try again later.';
  }

  // Registration specific errors
  if (
    message.includes('email already exists') ||
    (message.includes('email') && message.includes('taken'))
  ) {
    return 'This email is already registered. Please use a different email.';
  }

  if (
    message.includes('username already exists') ||
    (message.includes('username') && message.includes('taken'))
  ) {
    return 'This username is already taken. Please choose a different username.';
  }

  if (message.includes('invalid email') || message.includes('email format')) {
    return 'Please enter a valid email address.';
  }

  if (
    message.includes('password too short') ||
    message.includes('weak password')
  ) {
    return 'Password is too weak. Please use a stronger password.';
  }

  // Network and server errors
  if (message.includes('server error') || message.includes('internal')) {
    return 'Server error. Please try again later.';
  }

  if (message.includes('network') || message.includes('connection')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Token related errors
  if (
    message.includes('token') &&
    (message.includes('expired') || message.includes('invalid'))
  ) {
    return 'Your session has expired. Please login again.';
  }

  // Default case - return original message if no specific pattern matches
  return error;
};

// Enhanced error logging for debugging
export const logAuthError = (context: string, error: any) => {
  console.group(`🔴 Auth Error - ${context}`);

  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    console.log(
      'GraphQL Errors:',
      error.graphQLErrors.map((err: any) => ({
        message: err.message,
        path: err.path ? JSON.stringify(err.path) : 'N/A',
        locations: err.locations ? JSON.stringify(err.locations) : 'N/A',
        extensions: err.extensions ? JSON.stringify(err.extensions) : 'N/A',
      }))
    );
  }

  if (error.networkError) {
    console.log('Network Error:', {
      name: error.networkError.name,
      message: error.networkError.message,
      statusCode: error.networkError.statusCode || 'N/A',
    });
  }

  if (error.message) {
    console.log('Error Message:', error.message);
  }

  console.groupEnd();
};
