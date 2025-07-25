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

  const register = ({ name, email, password, educationLevel }: RegisterCredentials): boolean => {
    const storedUsers = localStorage.getItem('lumenai_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.find((u: User) => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = { name, email, password, educationLevel };
    users.push(newUser);
    localStorage.setItem('lumenai_users', JSON.stringify(users));
    return true;
  };

  const login = ({ email, password }: LoginCredentials): boolean => {
    const storedUsers = localStorage.getItem('lumenai_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const foundUser = users.find((u: User) => u.email === email && u.password === password);

    if (foundUser) {
      const userData = { name: foundUser.name, email: foundUser.email, educationLevel: foundUser.educationLevel };
      localStorage.setItem('lumenai_user', JSON.stringify(userData));
      setUser(userData);
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

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextInstance = AuthContext;
