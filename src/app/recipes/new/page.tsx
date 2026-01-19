'use client';

import RecipeFoodForm from '@/features/recipe/components/RecipeFoodForm';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRecipePage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push('/recipes');
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <ProtectedRoute>
      <RecipeFoodForm
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        mode="create"
      />
    </ProtectedRoute>
  );
}
