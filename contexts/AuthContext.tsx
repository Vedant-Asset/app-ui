import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getData, saveData, removeData } from '../utils/storage';

type User = {
  email: string;
  name: string;
  mobile: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app start
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await getData<User>(STORAGE_KEYS.USER_DATA);
      setUser(userData);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData: User) => {
    try {
      await saveData(STORAGE_KEYS.USER_DATA, userData);
      setUser(userData);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await removeData(STORAGE_KEYS.USER_DATA);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 