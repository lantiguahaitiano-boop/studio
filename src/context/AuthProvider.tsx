'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, AuthContextType, RegisterCredentials, LoginCredentials, Suggestion, SuggestionStatus } from '@/types/auth';
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
            // This case handles users created via Google Sign-In for the first time
            const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                name: firebaseUser.displayName!,
                educationLevel: 'No especificado',
                xp: 0,
                level: 1,
                toolUsage: {},
                achievements: [],
                favoriteResources: [],
                role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async ({ name, email, password, educationLevel }: RegisterCredentials): Promise<boolean> => {
    if (!password) return false;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const newUser: Omit<User, 'uid'> = {
        name,
        email,
        educationLevel,
        xp: 0,
        level: 1,
        toolUsage: {},
        achievements: [],
        favoriteResources: [],
        role: email === ADMIN_EMAIL ? 'admin' : 'user',
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return true;
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast({
          variant: "destructive",
          title: "Error de registro",
          description: error.code === 'auth/email-already-in-use' 
              ? "Este correo electrónico ya está en uso."
              : "Ocurrió un error inesperado.",
      });
      return false;
    }
  };

  const login = async ({ email, password }: LoginCredentials): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore, if not create a new document
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUser: Omit<User, 'uid'> = {
            email: firebaseUser.email!,
            name: firebaseUser.displayName!,
            educationLevel: 'No especificado',
            xp: 0,
            level: 1,
            toolUsage: {},
            achievements: [],
            favoriteResources: [],
            role: firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
        };
        await setDoc(userDocRef, newUser);
      }
      
      router.push('/dashboard');
      return true;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const forceRoleSync = async () => {
      if (!user || !user.uid) return;
      const userRole = user.email === ADMIN_EMAIL ? 'admin' : 'user';
      if (user.role !== userRole) {
        await updateUser({ role: userRole });
      }
  };

  const addXP = async (amount: number, toolId?: string) => {
    if (!user || !user.uid) return;

    // We fetch the latest user data to avoid race conditions
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return;

    let updatedUser = userDoc.data() as User;
    
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
    
    // Persist changes to Firestore
    await updateDoc(userDocRef, updatedUser);
    setUser({...updatedUser, uid: user.uid }); // Update local state
  };

  const updateUser = async (newDetails: Partial<User>) => {
    if (!user || !user.uid) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, newDetails);
    setUser(prevUser => prevUser ? ({ ...prevUser, ...newDetails }) : null);
  };

  const toggleFavoriteResource = async (resourceId: string) => {
    if (!user || !user.uid) return;
    const favorites = user.favoriteResources || [];
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(id => id !== resourceId)
      : [...favorites, resourceId];
    
    await updateUser({ favoriteResources: newFavorites });
  };
  
  const getAllUsers = async (): Promise<User[]> => {
    if (user?.role !== 'admin') return [];
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
    return userList;
  };
  
  const submitSuggestion = async (text: string) => {
    if (!user) return;
    const newSuggestion = {
        text,
        userEmail: user.email,
        userName: user.name,
        timestamp: Timestamp.now(),
        status: 'Pendiente',
    };
    await addDoc(collection(db, 'suggestions'), newSuggestion);
  };
  
  const getAllSuggestions = async (): Promise<Suggestion[]> => {
     if (user?.role !== 'admin') return [];
     const suggestionsCol = collection(db, 'suggestions');
     const q = query(suggestionsCol, orderBy('timestamp', 'desc'));
     const suggestionSnapshot = await getDocs(q);
     const suggestionList = suggestionSnapshot.docs.map(doc => {
         const data = doc.data();
         return {
             ...data,
             id: doc.id,
             timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
         } as Suggestion;
     });
     return suggestionList;
  };
  
  const updateSuggestionStatus = async (suggestionId: string, status: SuggestionStatus) => {
    if (user?.role !== 'admin') return;
    const suggestionDocRef = doc(db, 'suggestions', suggestionId);
    await updateDoc(suggestionDocRef, { status });
  };


  return (
    <AuthContext.Provider value={{ user, loading, register, login, signInWithGoogle, logout, addXP, updateUser, toggleFavoriteResource, forceRoleSync, getAllUsers, submitSuggestion, getAllSuggestions, updateSuggestionStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextInstance = AuthContext;
