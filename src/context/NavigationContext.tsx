'use client';

import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  previousPath: string | null;
  setPreviousPath: (path: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  previousPath: null,
  setPreviousPath: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [previousPath, setPreviousPath] = useState<string | null>(null);

  return (
    <NavigationContext.Provider value={{ previousPath, setPreviousPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
