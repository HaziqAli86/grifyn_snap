"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import api from '@/utils/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for user in localStorage on mount
    const storedUser = localStorage.getItem('grifyn_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user: loggedInUser } = response.data;
      
      setUser(loggedInUser);
      localStorage.setItem('grifyn_user', JSON.stringify(loggedInUser));
      localStorage.setItem('access_token', access_token);
      
      showSuccess("Signed in successfully!");
      return true;
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.detail || "Invalid email or password.";
      showError(message);
      return false;
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. Register
      await api.post('/auth/register', { email, password });
      
      // 2. Login immediately to get token
      const success = await signIn(email, password);
      
      if (success) {
         showSuccess("Account created and signed in!");
         return true;
      }
      return false;

    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.detail || "Registration failed.";
      showError(message);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('grifyn_user');
    localStorage.removeItem('access_token');
    showSuccess("Signed out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
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