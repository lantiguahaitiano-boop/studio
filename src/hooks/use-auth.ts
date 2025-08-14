'use client';
import { useContext } from 'react';
import { AuthContextInstance } from '@/context/AuthProvider';
import type { AuthContextType } from '@/types/auth';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContextInstance);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
