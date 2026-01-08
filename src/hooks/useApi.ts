// src/hooks/useApi.ts
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { token } = useAuth();

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Добавляем токен если он есть
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  return { apiFetch };
};