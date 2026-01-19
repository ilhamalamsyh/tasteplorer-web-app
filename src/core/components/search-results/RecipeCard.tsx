import React from 'react';
import Image from 'next/image';

export interface RecipeCardProps {
  title: string;
  img: string;
  author: string;
  time: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  img,
  author,
  time,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer transition hover:shadow-md">
    <div className="relative w-full aspect-[4/6] bg-gray-100">
      <Image
        src={img}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
    <div className="p-3 flex flex-col flex-1">
      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
        {title}
      </h3>
      <div className="text-xs text-gray-500 mb-2">{author}</div>
      <div className="text-xs text-gray-700 mt-auto">{time}</div>
    </div>
  </div>
);

export default RecipeCard;
