'use client';
import React from 'react';
import '@/styles/tailwind.css';
import { useRouter } from 'next/navigation';
import { categories } from '@/core/data/categories';
import { creators } from '@/core/data/creators';
import { ingredients } from '@/core/data/ingredients';
import { recipes as recipesData } from '@/core/data/recipes';
import SectionDivider from '@/core/components/SectionDivider/SectionDivider';
import RecipeSection from '@/core/components/RecipeSection/RecipeSection';
import HorizontalScrollSection from '@/core/components/HorizontalScrollSection/HorizontalScrollSection';

const ExplorePage = () => {
  const router = useRouter();
  const [recipesState, setRecipesState] = React.useState(recipesData);
  const [openMenuIndex, setOpenMenuIndex] = React.useState<number | null>(null);

  const handleCardClick = (title: string) => {
    router.push(
      `/recipes/${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`
    );
  };

  const handleBookmark = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecipesState((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, isBookmarked: !r.isBookmarked } : r
      )
    );
  };

  const handleMenu = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuIndex(idx === openMenuIndex ? null : idx);
  };

  return (
    <main className="flex-grow bg-white min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-primary text-white py-16 px-4 md:px-0 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins">
          Food Your Way
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Welcome to Tasteplorer, your go-to app for recipe saving, shopping,
          and meal planning. Discover, save, and share your favorite recipes!
        </p>
        <div className="w-full max-w-lg flex items-center bg-white rounded-full shadow-sm overflow-hidden border border-gray-200 mx-auto">
          <input
            type="text"
            placeholder="Search recipes, ingredients, creators..."
            className="flex-1 px-6 py-3 text-gray-700 outline-none font-poppins rounded-l-full bg-transparent"
          />
          <button className="bg-primary text-white px-6 py-3 font-semibold rounded-r-full hover:bg-orange-600 transition">
            Search
          </button>
        </div>
      </section>
      <div className="max-w-5xl mx-auto w-full bg-white">
        {/* Categories */}
        <SectionDivider />
        <HorizontalScrollSection
          title="Recipe Categories"
          sectionWidth="max-w-5xl"
        >
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center min-w-[110px] bg-white rounded-xl shadow-sm p-5 hover:bg-primary hover:text-white transition cursor-pointer border border-gray-100"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="font-semibold text-center">{cat.name}</span>
            </div>
          ))}
        </HorizontalScrollSection>
        {/* Creators */}
        <SectionDivider />
        <HorizontalScrollSection
          title="Popular Creators"
          sectionWidth="max-w-5xl"
        >
          {creators.map((creator) => (
            <div
              key={creator.name}
              className="flex flex-col items-center min-w-[130px] bg-white rounded-xl shadow-sm p-5 hover:bg-primary hover:text-white transition cursor-pointer border border-gray-100"
            >
              {creator.avatar && creator.avatar.trim() !== '' ? (
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full mb-2 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg mb-2">
                  {creator.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-center">{creator.name}</span>
            </div>
          ))}
        </HorizontalScrollSection>
        {/* Ingredients */}
        <SectionDivider />
        <HorizontalScrollSection
          title="Popular Ingredients"
          sectionWidth="max-w-5xl"
        >
          {ingredients.map((ing) => (
            <div
              key={ing.name}
              className="flex flex-col items-center min-w-[110px] bg-white rounded-xl shadow-sm p-5 hover:bg-primary hover:text-white transition cursor-pointer border border-gray-100"
            >
              <span className="text-3xl mb-2">{ing.icon}</span>
              <span className="font-semibold text-center">{ing.name}</span>
            </div>
          ))}
        </HorizontalScrollSection>
        {/* Recipes */}
        <RecipeSection
          recipes={recipesState}
          onCardClick={handleCardClick}
          onBookmark={handleBookmark}
          onMenu={handleMenu}
          openMenuIndex={openMenuIndex}
        />
      </div>
    </main>
  );
};

export default ExplorePage;
