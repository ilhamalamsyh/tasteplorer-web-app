'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_RECIPE_MUTATION,
  UPDATE_RECIPE_MUTATION,
} from '@/features/recipe/services/mutation';
import { MY_RECIPE_DETAIL_QUERY } from '@/features/recipe/services/query';
import Modal from '@/core/components/modal/Modal';
import { HiOutlinePhoto, HiOutlineXMark, HiOutlinePlus } from 'react-icons/hi2';
import useSnackbar from '@/core/hooks/useSnackbar';
import Snackbar from '@/core/components/snackbar/Snackbar';
import { useAuth } from '@/context/AuthContext';
import { useImageUpload } from '@/core/hooks/useImageUpload';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface RecipeIngredient {
  id: string;
  ingredient: string;
}

interface RecipeInstruction {
  id: string;
  instruction: string;
}

interface RecipeFoodFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  recipeId?: string;
  mode?: 'create' | 'edit';
}

const RecipeFoodForm: React.FC<RecipeFoodFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  recipeId,
  mode = 'create',
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    error: snackbarError,
    showError,
    handleCloseSnackbar,
  } = useSnackbar();

  const { uploadImage } = useImageUpload('RECIPE');

  // Fetch recipe data for edit mode - use MY_RECIPE_DETAIL_QUERY for ownership validation
  const { data: recipeData, loading: recipeLoading } = useQuery(
    MY_RECIPE_DETAIL_QUERY,
    {
      variables: { id: Number(recipeId) },
      skip: !recipeId || mode !== 'edit',
      fetchPolicy: 'network-only',
    }
  );

  // GraphQL mutations
  const [createRecipe] = useMutation(CREATE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      console.log('✅ Recipe created successfully:', data);
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      }
      router.push(`/recipes/${data.createRecipe.id}`);
    },
    onError: (error) => {
      console.error('❌ Error creating recipe:', error);
      showError(error.message || 'Failed to create recipe');
      setIsSubmitting(false);
    },
  });

  const [updateRecipe] = useMutation(UPDATE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      console.log('✅ Recipe updated successfully:', data);
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      }
      router.push(`/recipes/${data.updateRecipe.id}`);
    },
    onError: (error) => {
      console.error('❌ Error updating recipe:', error);
      showError(error.message || 'Failed to update recipe');
      setIsSubmitting(false);
    },
  });

  // Load existing recipe data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && recipeData?.myRecipeDetail) {
      const recipe = recipeData.myRecipeDetail;
      setTitle(recipe.title || '');
      setDescription(recipe.description || '');
      setCookingTime(recipe.cookingTime || '');
      setServings(recipe.servings || '');
      setImageUrl(recipe.image?.url || '');
      setIngredients(
        recipe.ingredients?.map((ing: RecipeIngredient) => ing.ingredient) || [
          '',
        ]
      );
      setInstructions(
        recipe.instructions?.map(
          (ins: RecipeInstruction) => ins.instruction
        ) || ['']
      );
    }
  }, [recipeData, mode]);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCookingTime('');
    setServings('');
    setImageUrl('');
    setIngredients(['']);
    setInstructions(['']);
    setIsSubmitting(false);
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        showError('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      showError('Please enter a recipe title');
      return;
    }

    if (!description.trim()) {
      showError('Please enter a description');
      return;
    }

    if (!cookingTime.trim()) {
      showError('Please enter cooking time');
      return;
    }

    if (!servings.trim()) {
      showError('Please enter servings');
      return;
    }

    if (!imageUrl) {
      showError('Please upload a recipe image');
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.trim() !== '');
    if (validIngredients.length === 0) {
      showError('Please add at least one ingredient');
      return;
    }

    const validInstructions = instructions.filter((ins) => ins.trim() !== '');
    if (validInstructions.length === 0) {
      showError('Please add at least one instruction');
      return;
    }

    setIsSubmitting(true);

    try {
      const input = {
        title: title.trim(),
        description: description.trim(),
        cookingTime: cookingTime.trim(),
        servings: servings.trim(),
        image: imageUrl,
        ingredients: validIngredients,
        instructions: validInstructions,
      };

      if (mode === 'edit' && recipeId) {
        await updateRecipe({
          variables: {
            id: recipeId,
            input,
          },
        });
      } else {
        await createRecipe({
          variables: {
            input,
          },
        });
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    title.trim() &&
    description.trim() &&
    cookingTime.trim() &&
    servings.trim() &&
    imageUrl &&
    ingredients.some((ing) => ing.trim()) &&
    instructions.some((ins) => ins.trim()) &&
    !isSubmitting &&
    !imageUploading;

  const getInitials = () => {
    if (!user?.fullname) return 'U';
    return user.fullname
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (recipeLoading && mode === 'edit') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading recipe...</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto px-2 sm:px-4">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Recipe' : 'Create New Recipe'}
            </h2>
          </div>

          {/* User Info */}
          <div className="flex items-start gap-3 mb-6">
            {user?.image && user.image.trim() !== '' ? (
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={user.image}
                  alt={user.fullname}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40px, 48px"
                />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                {getInitials()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {user?.fullname}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {mode === 'edit' ? 'Editing recipe' : 'Creating a new recipe'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5 sm:space-y-6">
            {/* Recipe Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Recipe Image <span className="text-red-500">*</span>
              </label>
              {imageUrl ? (
                <div className="relative group">
                  <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center relative">
                    <Image
                      src={imageUrl}
                      alt="Recipe preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, 800px"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    type="button"
                  >
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:border-primary transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full"
                    type="button"
                    disabled={imageUploading}
                  >
                    {imageUploading ? (
                      <>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <HiOutlinePhoto className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">
                          Click to upload recipe image
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Recipe Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Nasi Goreng Kampung Sedap"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-sm sm:text-base"
                maxLength={100}
              />
              <p className="text-xs text-gray-400 text-right">
                {title.length}/100
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about this recipe..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-900 text-sm sm:text-base"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right">
                {description.length}/500
              </p>
            </div>

            {/* Cooking Time & Servings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Cooking Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  placeholder="e.g., 30 minutes"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Servings <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="e.g., 4 servings"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Ingredients <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleAddIngredient}
                  className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:text-orange-600 font-medium flex-shrink-0"
                  type="button"
                >
                  <HiOutlinePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-1.5 sm:gap-2">
                    <div className="flex-shrink-0 w-6 sm:w-8 h-10 sm:h-11 flex items-center justify-center text-gray-500 font-medium text-xs sm:text-sm">
                      {index + 1}.
                    </div>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                      placeholder="e.g., 3 cups cooked white rice"
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-xs sm:text-base"
                    />
                    {ingredients.length > 1 && (
                      <button
                        onClick={() => handleRemoveIngredient(index)}
                        className="flex-shrink-0 p-2 sm:p-3 text-gray-400 hover:text-red-500 transition-colors"
                        type="button"
                      >
                        <HiOutlineXMark className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Instructions <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleAddInstruction}
                  className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:text-orange-600 font-medium flex-shrink-0"
                  type="button"
                >
                  <HiOutlinePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Add Step
                </button>
              </div>
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-1.5 sm:gap-2">
                    <div className="flex-shrink-0 w-6 sm:w-8 h-10 sm:h-11 flex items-center justify-center pt-1">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    <textarea
                      value={instruction}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                      placeholder={`Step ${index + 1} instructions...`}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-900 text-xs sm:text-base"
                      rows={3}
                    />
                    {instructions.length > 1 && (
                      <button
                        onClick={() => handleRemoveInstruction(index)}
                        className="flex-shrink-0 p-2 sm:p-3 text-gray-400 hover:text-red-500 transition-colors"
                        type="button"
                      >
                        <HiOutlineXMark className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-5 sm:my-6" />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pb-4">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-all text-sm sm:text-base ${
                canSubmit
                  ? 'bg-primary text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              type="button"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Publishing...'}
                </span>
              ) : mode === 'edit' ? (
                'Update Recipe'
              ) : (
                'Publish Recipe'
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Snackbar
        variant="error"
        message={snackbarError}
        onClose={handleCloseSnackbar}
      />
    </>
  );
};

export default RecipeFoodForm;
