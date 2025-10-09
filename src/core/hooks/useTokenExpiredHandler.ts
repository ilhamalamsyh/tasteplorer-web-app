import { useEffect } from 'react';

export const useTokenExpiredHandler = (
  showError: (message: string) => void
) => {
  useEffect(() => {
    const handleTokenExpired = (event: CustomEvent<{ message: string }>) => {
      showError(event.detail.message);
    };

    // Listen for the custom token expired event
    window.addEventListener(
      'tokenExpired',
      handleTokenExpired as EventListener
    );

    return () => {
      window.removeEventListener(
        'tokenExpired',
        handleTokenExpired as EventListener
      );
    };
  }, [showError]);

  return null;
};
