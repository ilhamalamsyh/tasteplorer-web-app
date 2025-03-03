import { useState } from 'react';

const useSnackbar = () => {
  const [error, setError] = useState<string>('');

  const showError = (message: string) => {
    setError(message);
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  return { error, showError, handleCloseSnackbar };
};

export default useSnackbar;
