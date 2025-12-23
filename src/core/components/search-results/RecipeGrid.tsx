import React from 'react';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';

interface RecipeGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recipes: any[];
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    {recipes.map((recipe, idx) => (
      <div key={recipe.title + idx} className="w-[100%] md:w-[100%] mx-auto">
        <RecipeCard {...recipe} />
      </div>
    ))}
  </div>
);

export default RecipeGrid;
