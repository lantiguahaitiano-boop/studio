'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthContextType, RegisterCredentials, LoginCredentials } from '@/types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('lumenai_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('lumenai_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserInStorage = (updatedUser: User) => {
    // Update the active user session
    setUser(updatedUser);
    localStorage.setItem('lumenai_user', JSON.stringify(updatedUser));
    
    // Persist changes to the main user list
    const storedUsers = localStorage.getItem('lumenai_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = users.findIndex((u: User) => u.email === updatedUser.email);

    if (userIndex !== -1) {
      // Update only the fields that can change (name, level, xp, etc.), preserving the password
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem('lumenai_users', JSON.stringify(users));
    }
  }

  const register = ({ name, email, password, educationLevel }: RegisterCredentials): boolean => {
    const storedUsers = localStorage.getItem('lumenai_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = { name, email, password, educationLevel, xp: 0, level: 1 };
    users.push(newUser);
    localStorage.setItem('lumenai_users', JSON.stringify(users));
    return true;
  };

  const login = ({ email, password }: LoginCredentials): boolean => {
    const storedUsers = localStorage.getItem('lumenai_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const foundUser = users.find((u: User) => u.email === email && u.password === password);

    if (foundUser) {
      const userData: User = { 
        name: foundUser.name, 
        email: foundUser.email, 
        educationLevel: foundUser.educationLevel,
        xp: foundUser.xp || 0,
        level: foundUser.level || 1,
      };
      updateUserInStorage(userData);
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('lumenai_user');
    setUser(null);
    router.push('/login');
  };

  const addXP = (amount: number) => {
    if (!user) return;

    const newXP = (user.xp || 0) + amount;
    const currentLevel = user.level || 1;
    const xpToNextLevel = currentLevel * 100;

    let newLevel = currentLevel;
    let xpForNext = newXP;

    if (xpForNext >= xpToNextLevel) {
        newLevel += 1;
        xpForNext -= xpToNextLevel;
    }
    
    const updatedUser: User = {
        ...user,
        xp: xpForNext,
        level: newLevel,
    };
    updateUserInStorage(updatedUser);
  };

  const updateUser = (newDetails: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newDetails };
    updateUserInStorage(updatedUser);
  };


  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, addXP, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextInstance = AuthContext;
