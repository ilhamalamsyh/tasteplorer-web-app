'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  previousPath: string | null;
}

const NavigationContext = createContext<NavigationContextType>({
  previousPath: null,
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setPreviousPath((prev) => {
        if (prev !== pathname) {
          return prev;
        }
        return null;
      });
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (pathname) {
        setPreviousPath(pathname);
      }
    };
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ previousPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
