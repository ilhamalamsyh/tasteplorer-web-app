import React from 'react';

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category?: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  title?: string;
  className?: string;
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  title = 'Ingredientsx',
  className = '',
}) => {
  return (
    <section
      style={{ borderRadius: 20, overflow: 'hidden' }}
      className={`bg-white dark:bg-background-dark p-6 md:p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {ingredients.length} items
        </span>
      </div>

      {/* Ingredients List */}
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="font-medium text-gray-900 dark:text-white flex items-center gap-2"
          >
            {/* Inline SVG bullet icon with primary color */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6,6-2.69,6-6-2.69-6-6-6Zm0,9c-1.65,0-3-1.35-3-3s1.35-3,3-3,3,1.35,3,3-1.35,3-3,3Z"
                fill="#FF670E"
                className="text-primary"
              />
            </svg>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientsList;
