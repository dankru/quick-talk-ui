// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useAuth } from '../contexts/AuthContext'; 
import './AuthPages.scss';

interface RegisterRequest {
  login: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const { login: authLogin } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Валидация
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Введите корректный email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Отправляем запрос на регистрацию
      const registerData: RegisterRequest = {
        login: login.trim(),
        email: email.trim(),
        password: password
      };
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/user/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Ошибка регистрации');
      }
      
      const result = await response.text();
      console.log('Успешная регистрация:', result);
      
      await authLogin(email, password);
      
      navigate('/chat');
      
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);
      
      let errorMessage = 'Ошибка при регистрации';
      
      if (err.message.includes('already exists') || err.message.includes('уже существует')) {
        errorMessage = 'Пользователь с таким email или логином уже существует';
      } else if (err.message.includes('invalid input')) {
        errorMessage = 'Некорректные данные для регистрации';
      } else if (err.response) {
        errorMessage = `Ошибка сервера: ${err.response.status}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Регистрация</h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              disabled={isLoading}
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            
            <input
              type="password"
              placeholder="Пароль (минимум 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
            
            <input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <p>
            Уже есть аккаунт?{' '}
            <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;