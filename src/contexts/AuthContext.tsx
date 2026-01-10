// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseJwt, isTokenExpired } from '../utils/jwt';

interface User {
  id: string;
  email: string;
  login: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(email: string, password: string): Promise<void>;
  register(login: string, email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // init
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken || isTokenExpired(savedToken)) {
      cleanup();
      setIsLoading(false);
      return;
    }

    const decoded = parseJwt(savedToken);
    if (!decoded) {
      cleanup();
      setIsLoading(false);
      return;
    }

    setToken(savedToken);
    setUser({
      id: decoded.user_id,
      email: decoded.email,
      login: decoded.login,
    });
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/user/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Auth failed');
    }

    const { token } = await res.json();
    const decoded = parseJwt(token);

    if (!decoded || isTokenExpired(token)) {
      throw new Error('Invalid token');
    }

    const user: User = {
      id: decoded.user_id,
      email: decoded.email,
      login: decoded.login,
    };

    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const register = async (login: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/user/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Register failed');
    }

    // ВАЖНО: ничего не логиним
  };

  const logout = () => {
    cleanup();
  };

  const cleanup = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};