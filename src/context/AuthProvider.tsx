'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthContextType, RegisterCredentials, LoginCredentials } from '@/types/auth';
import { achievementsList, checkAchievements } from '@/lib/achievements';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'lantiguayordaly76@gmail.com';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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
      // Update only the fields that can change, preserving the password
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

    const newUser: User = { 
      name, 
      email, 
      password, 
      educationLevel, 
      xp: 0, 
      level: 1,
      toolUsage: {},
      achievements: [],
      favoriteResources: [],
      role: email === ADMIN_EMAIL ? 'admin' : 'user',
    };
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
        toolUsage: foundUser.toolUsage || {},
        achievements: foundUser.achievements || [],
        favoriteResources: foundUser.favoriteResources || [],
        role: foundUser.role || 'user',
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

  const addXP = (amount: number, toolId?: string) => {
    if (!user) return;

    let updatedUser = { ...user };
    
    // Update tool usage
    if (toolId) {
      const toolUsage = { ...updatedUser.toolUsage };
      toolUsage[toolId] = (toolUsage[toolId] || 0) + 1;
      updatedUser.toolUsage = toolUsage;
    }

    // Check for new achievements
    const unlockedAchievements = checkAchievements(updatedUser);
    let newAchievementsXP = 0;
    
    unlockedAchievements.forEach(achId => {
      const achievement = achievementsList.find(a => a.id === achId);
      if (achievement) {
        toast({
          title: `🏆 ¡Logro Desbloqueado!`,
          description: `Has ganado la insignia "${achievement.name}". ¡+50 XP extra!`,
        });
        newAchievementsXP += 50;
      }
    });

    if (unlockedAchievements.length > 0) {
        updatedUser.achievements = [...(updatedUser.achievements || []), ...unlockedAchievements];
    }
    
    // Update XP and Level
    const totalNewXP = amount + newAchievementsXP;
    const newXP = (updatedUser.xp || 0) + totalNewXP;
    const currentLevel = updatedUser.level || 1;
    const xpToNextLevel = currentLevel * 100;

    let newLevel = currentLevel;
    let xpForNext = newXP;

    if (xpForNext >= xpToNextLevel) {
        newLevel += 1;
        xpForNext -= xpToNextLevel;
        toast({
            title: `🎉 ¡Has subido de Nivel!`,
            description: `¡Felicidades! Has alcanzado el Nivel ${newLevel}.`,
        });
    }
    
    updatedUser.xp = xpForNext;
    updatedUser.level = newLevel;

    updateUserInStorage(updatedUser);
  };

  const updateUser = (newDetails: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...newDetails };
    updateUserInStorage(updatedUser);
  };

  const toggleFavoriteResource = (resourceId: string) => {
    if (!user) return;
    const favorites = user.favoriteResources || [];
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(id => id !== resourceId)
      : [...favorites, resourceId];
    
    const updatedUser = { ...user, favoriteResources: newFavorites };
    updateUserInStorage(updatedUser);
  };


  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, addXP, updateUser, toggleFavoriteResource }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextInstance = AuthContext;
