'use client';

import React from 'react';

interface TogglePasswordIconButtonProps {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

const TogglePasswordIconButton: React.FC<TogglePasswordIconButtonProps> = ({
  showPassword,
  togglePasswordVisibility,
}) => {
  return (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute top-8 right-3 transform -translate-y-1/2 z-10"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#455A64"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#455A64"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.96 10.96 0 0112 20c-7 0-11-8-11-8a16.73 16.73 0 014.72-5.94m3.87-2.05a10.97 10.97 0 017.69 0A16.73 16.73 0 0123 12s-1.45 3.07-4.72 5.94M1 1l22 22" />
        </svg>
      )}
    </button>
  );
};

export default TogglePasswordIconButton;
