// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired, parseJwt, DecodedToken } from '../utils/jwt';

interface User {
  id: string;
  email: string;
  login: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean; // ← добавляем
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ← добавляем

  // При загрузке приложения проверяем сохраненный токен
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken) {
        // Проверяем не истек ли токен
        if (isTokenExpired(savedToken)) {
          // Токен истек - очищаем
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          setToken(savedToken);
          setIsAuthenticated(true);
          
          // Если есть данные пользователя - парсим
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);
            } catch {
              // Если ошибка парсинга - создаем из токена
              const decoded = parseJwt(savedToken);
              if (decoded) {
                const userFromToken: User = {
                  id: decoded.user_id,
                  email: decoded.email,
                  login: decoded.login,
                };
                setUser(userFromToken);
              }
            }
          } else {
            // Если нет данных пользователя - создаем из токена
            const decoded = parseJwt(savedToken);
            if (decoded) {
              const userFromToken: User = {
                id: decoded.user_id,
                email: decoded.email,
                login: decoded.login,
              };
              setUser(userFromToken);
              localStorage.setItem('user', JSON.stringify(userFromToken));
            }
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных из localStorage:', error);
      // Если ошибка - очищаем всё
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/user/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка авторизации: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('Токен не получен от сервера');
      }
      
      // Парсим JWT чтобы получить данные пользователя
      const decoded = parseJwt(data.token);
      if (!decoded) {
        throw new Error('Невалидный токен');
      }
      
      // Проверяем не истек ли токен (на всякий случай)
      if (isTokenExpired(data.token)) {
        throw new Error('Токен истек');
      }
      
      const userFromToken: User = {
        id: decoded.user_id,
        email: decoded.email,
        login: decoded.login,
      };
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userFromToken));
      
      setToken(data.token);
      setUser(userFromToken);
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isLoading,
      isAuthenticated // ← добавляем в контекст
    }}>
      {children}
    </AuthContext.Provider>
  );
};