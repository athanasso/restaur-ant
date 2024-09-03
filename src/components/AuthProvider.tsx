'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const result = await signIn('credentials', { username, password, redirect: false });
      if (result?.ok) {
        setIsAuthenticated(true);
        router.push('/');
      }
      return result;
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  };

  const logout = () => {
    signOut({ redirect: false }).then(() => {
      router.push('/login');
      setIsAuthenticated(false);
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
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