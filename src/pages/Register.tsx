// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.scss';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      await register(login.trim(), email.trim(), password);
      navigate('/login');
    } catch (e: any) {
      setError(e.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Регистрация</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={submit}>
            <input value={login} onChange={e => setLogin(e.target.value)} placeholder="Логин" required />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Повторите пароль" required />

            <button disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;