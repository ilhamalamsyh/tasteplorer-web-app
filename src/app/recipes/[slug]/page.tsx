/* eslint-disable @typescript-eslint/prefer-as-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import RecipeDetailComponent, {
  Recipe,
} from '@/components/recipes/RecipeDetailPage';
import { recipes as recipeData } from '@/core/data/recipes';
import RecipeDetailSkeleton from '@/components/recipes/RecipeDetailSkeleton';
import { useQuery, gql } from '@apollo/client';
import { RECIPE_DETAIL_QUERY } from '@/features/recipe/services/query';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface RecipeDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const resolvedParams = React.use(params);
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const { user } = useAuth();

  // Fetch recipe detail from API
  const { data, loading, error } = useQuery(RECIPE_DETAIL_QUERY, {
    variables: { id: Number(decodedSlug) }, // ensure id is number
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !isClient) {
    return <RecipeDetailSkeleton />;
  }
  if (error || !data?.recipeDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/images/broken-image.png"
            alt="Not found"
            width={128}
            height={128}
            className="opacity-60"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-700">
          Recipe Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          Sorry, the recipe you are looking for does not exist or has been
          removed.
        </p>
        <a href="/explore" className="text-primary font-semibold">
          Back to Explore
        </a>
      </div>
    );
  }

  // Map API response to Recipe type
  const api = data.recipeDetail;
  const recipe = {
    id: api.id,
    title: api.title,
    subtitle: api.description ?? '',
    imageUrl: api.image?.url ?? '/default-recipe.jpg',
    prepTime: '10 mins', // dummy
    cookTime: api.cookingTime ?? '',
    servings: api.servings ?? '',
    difficulty: 'Medium' as 'Medium', // fix: ensure union type
    rating: 4.5, // dummy
    totalRatings: 123, // dummy
    author: {
      id: api.author?.id ?? '',
      name: api.author?.username ?? '',
      image: api.author?.image ?? '',
    },
    ingredients: (api.ingredients ?? []).map((ing: any) => ({
      id: ing.id,
      name: ing.ingredient,
      amount: '', // dummy
      unit: '', // dummy
    })),
    instructions: (api.instructions ?? []).map((ins: any, idx: number) => ({
      id: ins.id,
      stepNumber: idx + 1,
      description: ins.instruction,
    })),
    notes: [], // dummy
    relatedRecipes: [], // dummy
  };

  // Get current user ID from auth context
  const currentUserId = user?.id?.toString() ?? '';

  // Handler functions
  const handleAddNote = async (content: string) => {
    // TODO: Implement API call to add note
  };
  const handleToggleHelpful = (noteId: string) => {
    // TODO: Implement API call to toggle helpful
  };
  const handleRecipeClick = (recipeId: string) => {
    if (isClient) {
      router.push(`/recipes/${recipeId}`);
    }
  };
  const handleBookmark = (recipeId: string) => {
    // TODO: Implement bookmark functionality
  };

  return (
    <RecipeDetailComponent
      recipe={recipe}
      onAddNote={handleAddNote}
      onToggleHelpful={handleToggleHelpful}
      onRecipeClick={handleRecipeClick}
      onBookmark={handleBookmark}
      currentUserId={currentUserId}
    />
  );
}
