// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.scss';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/chat');
    } catch {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Вход</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              required
            />
            <button disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p>
            Нет аккаунта? <Link to="/register">Регистрация</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;