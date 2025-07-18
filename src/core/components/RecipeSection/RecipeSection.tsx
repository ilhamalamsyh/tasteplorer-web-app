import React from 'react';
import RecipeCard from '@/core/components/RecipeCard/RecipeCard';
import HorizontalScrollSection from '@/core/components/HorizontalScrollSection/HorizontalScrollSection';

interface Recipe {
  title: string;
  img: string;
  rating: number;
  ingredients: number;
  author: string;
  authorAvatar: string;
  isBookmarked: boolean;
  time: string;
}

interface RecipeSectionProps {
  recipes: Recipe[];
  onCardClick: (title: string) => void;
  onBookmark: (idx: number, e: React.MouseEvent) => void;
  onMenu: (idx: number, e: React.MouseEvent) => void;
  openMenuIndex: number | null;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({
  recipes,
  onCardClick,
  onBookmark,
  onMenu,
  openMenuIndex,
}) => (
  <section className="px-2 md:px-0 bg-white py-10 max-w-5xl mx-auto">
    <div className="flex items-center justify-between mb-0 px-4">
      <h2 className="text-2xl font-semibold font-poppins text-gray-800 text-left">
        Discover recipes
      </h2>
      <a
        href="#"
        className="text-sm text-gray-400 font-semibold hover:underline"
      >
        See All
      </a>
    </div>
    <p className="text-gray-500 text-sm mb-2 px-4">
      Find and share everyday cooking inspiration with ratings and reviews you
      can trust. Recipes for easy dinners, healthy eating, fast and cheap,
      kid-friendly, and more.
    </p>
    <HorizontalScrollSection title="" sectionWidth="max-w-5xl">
      {recipes.map((rec, idx) => (
        <RecipeCard
          key={rec.title}
          title={rec.title}
          img={rec.img}
          rating={rec.rating}
          ingredients={rec.ingredients}
          author={rec.author}
          authorAvatar={rec.authorAvatar}
          isBookmarked={rec.isBookmarked}
          time={rec.time}
          onClick={() => onCardClick(rec.title)}
          onBookmark={(e) => onBookmark(idx, e)}
          onMenu={(e) => onMenu(idx, e)}
          menuOpen={openMenuIndex === idx}
        />
      ))}
    </HorizontalScrollSection>
  </section>
);

export default RecipeSection;
