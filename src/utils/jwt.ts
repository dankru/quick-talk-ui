// src/utils/jwt.ts
export interface DecodedToken {
  email: string;
  exp: number; // timestamp истечения
  login: string;
  user_id: string;
}

export const parseJwt = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка парсинга JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded) return true;
  
  // exp - timestamp в секундах, Date.now() - в миллисекундах
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};