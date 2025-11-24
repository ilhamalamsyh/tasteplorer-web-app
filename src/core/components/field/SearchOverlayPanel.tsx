import React from 'react';

const SearchOverlayPanel: React.FC = () => {
  // Dummy content for now
  return (
    <div className="absolute left-0 top-full z-20 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-200 overflow-y-auto mt-2">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base text-left">
            Riwayat Pencarian
          </h3>
          {/* Dummy list here */}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base text-left">
            Pencarian Populer
          </h3>
          {/* Dummy list here */}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base text-left">
            Destinasi Trending
          </h3>
          {/* Dummy list here */}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlayPanel;
