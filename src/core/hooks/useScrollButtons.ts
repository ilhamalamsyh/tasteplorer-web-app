import React from 'react';

function useScrollButtons(ref: React.RefObject<HTMLDivElement>) {
  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) {
      const amount = 220;
      ref.current.scrollBy({
        left: dir === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };
  return scroll;
}

export default useScrollButtons;
