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

interface RecipeDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Mock data dengan nilai yang konsisten untuk menghindari hydration error
const mockRecipeData = (baseRecipe: any, slug: string): Recipe => {
  // Generate consistent values based on slug to avoid hydration mismatch
  const seedValue = slug
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const totalRatings = 50 + (seedValue % 450); // Consistent between 50-500
  const relatedRatings = 50 + ((seedValue * 2) % 250); // Consistent between 50-300

  return {
    id: slug,
    title: baseRecipe.title,
    subtitle: `A delicious ${baseRecipe.title.toLowerCase()} recipe that will amaze your taste buds`,
    imageUrl: baseRecipe.img,
    prepTime: '15 mins',
    cookTime: baseRecipe.time,
    servings: 4,
    difficulty: 'Medium' as const,
    rating: baseRecipe.rating / 20, // Convert 0-100 to 0-5
    totalRatings: totalRatings,
    author: {
      name: baseRecipe.author,
      avatar: baseRecipe.authorAvatar,
    },
    ingredients: [
      {
        id: '1',
        name: 'Fresh tomatoes',
        amount: '4',
        unit: 'large',
        category: 'Vegetables',
      },
      {
        id: '2',
        name: 'Olive oil',
        amount: '2',
        unit: 'tbsp',
        category: 'Oils & Vinegars',
      },
      {
        id: '3',
        name: 'Garlic cloves',
        amount: '3',
        unit: 'cloves',
        category: 'Aromatics',
      },
      {
        id: '4',
        name: 'Salt',
        amount: '1',
        unit: 'tsp',
        category: 'Seasonings',
      },
      {
        id: '5',
        name: 'Black pepper',
        amount: '½',
        unit: 'tsp',
        category: 'Seasonings',
      },
    ],
    instructions: [
      {
        id: '1',
        stepNumber: 1,
        title: 'Prepare ingredients',
        description:
          'Gather all ingredients and wash the vegetables thoroughly. Dice the tomatoes and mince the garlic cloves.',
        duration: '5 mins',
        tips: [
          'Room temperature ingredients work better',
          'Use sharp knife for clean cuts',
        ],
      },
      {
        id: '2',
        stepNumber: 2,
        title: 'Heat the pan',
        description:
          'Heat olive oil in a large skillet over medium heat. Wait until the oil shimmers slightly.',
        duration: '2 mins',
        temperature: '350°F',
      },
      {
        id: '3',
        stepNumber: 3,
        title: 'Cook aromatics',
        description:
          'Add minced garlic to the heated oil and sauté until fragrant, about 30 seconds. Be careful not to burn.',
        duration: '1 min',
        tips: ['Keep stirring to prevent burning'],
      },
      {
        id: '4',
        stepNumber: 4,
        title: 'Add tomatoes',
        description:
          'Add diced tomatoes to the pan and cook until they start to break down and release their juices.',
        duration: '8 mins',
      },
      {
        id: '5',
        stepNumber: 5,
        title: 'Season and finish',
        description:
          'Season with salt and pepper to taste. Let it simmer for a few more minutes until the flavors meld together.',
        duration: '3 mins',
      },
    ],
    notes: [
      {
        id: '1',
        content:
          'This recipe turned out amazing! I added a bit of basil at the end and it made all the difference. Will definitely make again.',
        author: {
          name: 'Maria Rodriguez',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        createdAt: new Date('2024-12-15T10:30:00Z'), // Use ISO string with timezone
        rating: 5,
        isHelpful: true,
      },
      {
        id: '2',
        content:
          'Great recipe! I halved the ingredients since I was cooking for two people and it worked perfectly. The cooking times were spot on.',
        author: {
          name: 'John Smith',
        },
        createdAt: new Date('2024-12-10T15:45:00Z'), // Use ISO string with timezone
        rating: 4,
      },
      {
        id: '3',
        content:
          'Great recipe! I halved the ingredients since I was cooking for two people and it worked perfectly. The cooking times were spot on.',
        author: {
          name: 'John Smith',
        },
        createdAt: new Date('2024-12-10T15:45:00Z'), // Use ISO string with timezone
        rating: 4,
      },
      {
        id: '4',
        content:
          'Great recipe! I halved the ingredients since I was cooking for two people and it worked perfectly. The cooking times were spot on.',
        author: {
          name: 'John Smith',
        },
        createdAt: new Date('2024-12-10T15:45:00Z'), // Use ISO string with timezone
        rating: 4,
      },
      {
        id: '5',
        content:
          'Great recipe! I halved the ingredients since I was cooking for two people and it worked perfectly. The cooking times were spot on.',
        author: {
          name: 'John Smith',
        },
        createdAt: new Date('2024-12-10T15:45:00Z'), // Use ISO string with timezone
        rating: 4,
      },
      {
        id: '6',
        content:
          'Great recipe! I halved the ingredients since I was cooking for two people and it worked perfectly. The cooking times were spot on.',
        author: {
          name: 'John Smith',
        },
        createdAt: new Date('2024-12-10T15:45:00Z'), // Use ISO string with timezone
        rating: 4,
      },
      {
        id: '7',
        content:
          'Great recipe! I halved the ingredients since I was cooking for two people and it worked perfectly. The cooking times were spot on.',
        author: {
          name: 'John Smith',
        },
        createdAt: new Date('2024-12-10T15:45:00Z'), // Use ISO string with timezone
        rating: 4,
      },
    ],
    relatedRecipes: recipeData.slice(0, 4).map((recipe, index) => ({
      id: recipe.title.toLowerCase().replace(/\s+/g, '-'),
      title: recipe.title,
      imageUrl: recipe.img,
      prepTime: '15 mins',
      cookTime: recipe.time,
      difficulty: 'Medium' as const,
      rating: recipe.rating / 20,
      totalRatings: relatedRatings + index * 10, // Consistent calculation
      author: {
        name: recipe.author,
        avatar: recipe.authorAvatar,
      },
    })),
  };
};

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Unwrap params Promise using React.use()
  const resolvedParams = React.use(params);

  // Ensure we're on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Decode slug dan convert kembali ke title untuk mencari recipe
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  // Cari recipe berdasarkan title
  const foundRecipe = recipeData.find(
    (recipe) => recipe.title.toLowerCase().replace(/\s+/g, '-') === decodedSlug
  );

  if (!foundRecipe) {
    notFound();
  }

  // Convert ke format Recipe yang dibutuhkan component
  const recipe = mockRecipeData(foundRecipe, decodedSlug);

  // Handler functions
  const handleAddNote = async (content: string) => {
    console.log('Adding note:', content);
    // TODO: Implement API call to add note
  };

  const handleToggleHelpful = (noteId: string) => {
    console.log('Toggle helpful for note:', noteId);
    // TODO: Implement API call to toggle helpful
  };

  const handleRecipeClick = (recipeId: string) => {
    // Use Next.js router instead of direct window manipulation
    if (isClient) {
      router.push(`/recipes/${recipeId}`);
    }
  };

  const handleBookmark = (recipeId: string) => {
    console.log('Bookmark recipe:', recipeId);
    // TODO: Implement bookmark functionality
  };

  // Show loading state during hydration
  if (!isClient) {
    return <RecipeDetailSkeleton />;
  }

  return (
    <RecipeDetailComponent
      recipe={recipe}
      onAddNote={handleAddNote}
      onToggleHelpful={handleToggleHelpful}
      onRecipeClick={handleRecipeClick}
      onBookmark={handleBookmark}
    />
  );
}
