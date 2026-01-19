'use client';

import RecipeFoodForm from '@/features/recipe/components/RecipeFoodForm';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { MY_RECIPE_DETAIL_QUERY } from '@/features/recipe/services/query';
import useSnackbar from '@/core/hooks/useSnackbar';
import Snackbar from '@/core/components/snackbar/Snackbar';

interface EditRecipePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const resolvedParams = React.use(params);
  const recipeId = decodeURIComponent(resolvedParams.slug);
  const {
    error: snackbarError,
    showError,
    handleCloseSnackbar,
  } = useSnackbar();

  const [checkRecipeOwnership, { loading }] = useLazyQuery(
    MY_RECIPE_DETAIL_QUERY,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        console.log('✅ Recipe ownership check completed:', data);
        if (data?.myRecipeDetail) {
          // Recipe found and user is the owner, open the form
          console.log('✅ Setting isOpen to true');
          setIsOpen(true);
        } else {
          console.log('❌ No recipe data returned');
          showError('Recipe not found');
          setTimeout(() => {
            router.push(`/recipes/${recipeId}`);
          }, 2000);
        }
      },
      onError: (error) => {
        console.error('❌ Recipe ownership check failed:', error);
        showError(
          'Recipe not found or you do not have permission to edit this recipe'
        );
        // Redirect back to recipe detail page
        setTimeout(() => {
          router.push(`/recipes/${recipeId}`);
        }, 2000);
      },
    }
  );

  // Check ownership when component mounts
  useEffect(() => {
    console.log('🔍 Checking recipe ownership for ID:', recipeId);
    checkRecipeOwnership({
      variables: { id: Number(recipeId) },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const handleClose = () => {
    setIsOpen(false);
    router.push(`/recipes/${recipeId}`);
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  console.log('🎯 Current state - loading:', loading, 'isOpen:', isOpen);

  return (
    <ProtectedRoute>
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Checking recipe ownership...</p>
          </div>
        </div>
      )}

      {!loading && isOpen && (
        <RecipeFoodForm
          isOpen={isOpen}
          onClose={handleClose}
          onSuccess={handleSuccess}
          recipeId={recipeId}
          mode="edit"
        />
      )}

      {!loading && !isOpen && (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading recipe form...</p>
        </div>
      )}

      <Snackbar
        variant="error"
        message={snackbarError}
        onClose={handleCloseSnackbar}
      />
    </ProtectedRoute>
  );
}
