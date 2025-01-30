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
    <div
      className={`fixed bottom-4 right-4 ${
        variant === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black'
      }  p-4 rounded-lg shadow-md`}
    >
      <div className="flex items-center justify-around gap-x-20">
        <p>{message}</p>
        <button
          onClick={onClose}
          className={`${
            variant === 'error' ? 'text-white' : 'text-primary'
          } text-md font-bold focus:outline-none`}
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
}
