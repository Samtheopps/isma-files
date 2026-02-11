'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser } from '@/types';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('[AuthContext] No token found in localStorage');
        setIsLoading(false);
        return;
      }

      console.log('[AuthContext] Checking auth with token...');
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[AuthContext] User authenticated:', data.user.email, 'role:', data.user.role);
        setUser(data.user);
      } else {
        console.warn('[AuthContext] Auth check failed:', response.status, await response.text());
        localStorage.removeItem('token');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('[AuthContext] Auth check aborted');
        return;
      }
      console.error('[AuthContext] Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      console.log('[AuthContext] Auth check complete, isLoading = false');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Logging in:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[AuthContext] Login failed:', error);
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      console.log('[AuthContext] Login successful:', data.user.email, 'role:', data.user.role);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const result = await response.json();
      localStorage.setItem('token', result.token);
      setUser(result.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
