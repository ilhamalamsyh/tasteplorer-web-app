'use client';

import { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  onClose: () => void;
  duration?: number; // Optional: duration in milliseconds (default 3000ms)
  variant?: string;
}

export default function Snackbar({
  message,
  onClose,
  duration = 3000, // Default duration is 3000ms (3 seconds)
  variant = 'info',
}: SnackbarProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);

      // Clear the timer if the component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  return message ? (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`${
          variant === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black'
        } p-4 rounded-lg shadow-lg border min-w-80 max-w-lg mx-4 transform transition-all duration-300 ease-in-out animate-fade-in`}
      >
        <div className="flex items-center justify-between gap-x-6">
          <p className="flex-1 text-sm">{message}</p>
          <button
            onClick={onClose}
            className={`${
              variant === 'error'
                ? 'text-white hover:text-gray-200'
                : 'text-primary hover:text-primary/80'
            } text-sm font-semibold focus:outline-none transition-colors duration-200 flex-shrink-0`}
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
}
