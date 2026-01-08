// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header';
import './AuthPages.scss';

const Register: React.FC = () => {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    // TODO: Здесь будет запрос к бэку
    console.log('Регистрация:', { login, email, password });
    
    // После успешной регистрации - в чат
    navigate('/chat');
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
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <button type="submit" className="btn-primary">
              Зарегистрироваться
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