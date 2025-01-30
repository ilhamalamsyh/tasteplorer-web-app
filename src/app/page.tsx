// src/app/index.tsx
'use-client';

import React from 'react';
import '../styles/tailwind.css';

const Home = () => {
  return (
    <main className="flex-grow">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Recipe List Page
        </h1>
      </div>
    </main>
  );
};

export default Home;
