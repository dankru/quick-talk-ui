// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useAuth } from '../contexts/AuthContext'; 
import './AuthPages.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Используем функцию из контекста
      await login(email, password);
      navigate('/chat');
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Вход</h2>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <p>
            Нет аккаунта?{' '}
            <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;