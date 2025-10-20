/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecipeHero from './RecipeHero';
import IngredientsList, { Ingredient } from './IngredientsList';
import InstructionsList, { Instruction } from './InstructionsList';
import NotesSection, { RecipeNote } from './NotesSection';
import { RelatedRecipe } from './RelatedRecipes';
import SectionDivider from '../../core/components/SectionDivider/SectionDivider';
import RecipeSection from '../../core/components/RecipeSection/RecipeSection';
import { recipes as recipesData } from '@/core/data/recipes';

// Add id to each recipe for compatibility with RecipeSection
const recipesWithId = recipesData.map((r, idx) => ({
  id: `recipe-${idx + 1}`,
  ...r,
}));

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  totalRatings: number;
  author: {
    name: string;
    avatar?: string;
  };
  ingredients: Ingredient[];
  instructions: Instruction[];
  notes: RecipeNote[];
  relatedRecipes: RelatedRecipe[];
}

interface RecipeDetailPageProps {
  recipe: Recipe;
  className?: string;
  onAddNote?: (content: string) => void;
  onToggleHelpful?: (noteId: string) => void;
  onRecipeClick?: (recipeId: string) => void;
  onBookmark?: (recipeId: string) => void;
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  recipe,
  className = '',
  onAddNote,
  onToggleHelpful,
  onRecipeClick,
  onBookmark,
}) => {
  const [relatedRecipesState, setRelatedRecipesState] = useState(recipesWithId);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const router = useRouter();

  const handleRelatedCardClick = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/recipes/${encodeURIComponent(slug)}`);
  };

  const handleRelatedBookmark = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRelatedRecipesState((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, isBookmarked: !r.isBookmarked } : r
      )
    );
  };

  const handleRelatedMenu = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuIndex(idx === openMenuIndex ? null : idx);
  };

  // Wrapper for RecipeSection props (title: string)
  const handleRelatedRecipeClick = (title: string) => {
    if (onRecipeClick) onRecipeClick(title);
  };
  const handleRelatedRecipeBookmark = (idx: number, e: React.MouseEvent) => {
    if (onBookmark) onBookmark(recipe.relatedRecipes[idx].id);
  };

  return (
    <div className={`min-h-screen w-full ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <RecipeHero
          title={recipe.title}
          subtitle={recipe.subtitle}
          imageUrl={recipe.imageUrl}
          prepTime={recipe.prepTime}
          cookTime={recipe.cookTime}
          servings={recipe.servings}
          difficulty={recipe.difficulty}
          rating={recipe.rating}
          totalRatings={recipe.totalRatings}
          authorName={recipe.author.name}
          authorAvatar={recipe.author.avatar}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Left Column - Ingredients */}
          <div>
            <IngredientsList
              ingredients={recipe.ingredients}
              className="sticky top-8"
            />
          </div>

          {/* Right Column - Instructions */}
          <div>
            <InstructionsList instructions={recipe.instructions} />
          </div>
        </div>

        {/* Notes & Tips Section - di bawah ingredients & instructions */}
        <div className="mt-4 mb-4">
          <NotesSection
            notes={recipe.notes}
            onAddNote={onAddNote}
            onToggleHelpful={onToggleHelpful}
          />
        </div>

        {/* Related Recipes */}
        {relatedRecipesState.length > 0 && (
          <div className="mt-4">
            <RecipeSection
              recipes={relatedRecipesState}
              onCardClick={handleRelatedCardClick}
              onBookmark={handleRelatedBookmark}
              onMenu={handleRelatedMenu}
              openMenuIndex={openMenuIndex}
              sectionTitle="You may also like"
            />
          </div>
        )}

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Back to top"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
