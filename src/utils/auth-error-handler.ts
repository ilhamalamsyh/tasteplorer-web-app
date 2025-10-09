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

  // Registration specific errors - Enhanced
  if (
    message.includes('email already exists') ||
    (message.includes('email') && message.includes('already')) ||
    (message.includes('duplicate') && message.includes('email'))
  ) {
    return 'This email is already registered. Please use a different email address.';
  }

  if (
    message.includes('username already exists') ||
    (message.includes('username') && message.includes('already')) ||
    (message.includes('duplicate') && message.includes('username'))
  ) {
    return 'This username is already taken. Please choose a different username.';
  }

  if (
    message.includes('invalid email') ||
    message.includes('email format') ||
    message.includes('email is not valid')
  ) {
    return 'Please enter a valid email address.';
  }

  if (
    message.includes('password too short') ||
    message.includes('weak password') ||
    message.includes('password must be')
  ) {
    return 'Password must be at least 10 characters long. Please use a stronger password.';
  }

  if (
    message.includes('username too short') ||
    message.includes('username must be')
  ) {
    return 'Username must be at least 8 characters long.';
  }

  if (message.includes('fullname') && message.includes('required')) {
    return 'Full name is required. Please enter your full name.';
  }

  if (message.includes('birthdate') || message.includes('birth date')) {
    return 'Please enter a valid birth date.';
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

  // Validation errors
  if (
    message.includes('validation failed') ||
    message.includes('invalid input')
  ) {
    return 'Please check your input and try again.';
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
