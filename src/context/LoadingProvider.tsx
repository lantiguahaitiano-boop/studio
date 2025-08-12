'use client';

import React, { createContext, useState, useMemo } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading?: (isLoading: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextType>({ isLoading: false });

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(() => ({
    isLoading,
    setIsLoading,
  }), [isLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
