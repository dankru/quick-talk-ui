// src/components/Header/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          MyChat
        </div>
        
        <nav className="nav">
          {isAuthenticated ? (
            // Если пользователь залогинен и токен актуален
            <>
              <span className="user-info">
                <span className="user-email">{user?.email}</span>
                <span className="user-login">({user?.login})</span>
              </span>
              <Link to="/chat" className="nav-link">Чат</Link>
              <button 
                onClick={handleLogout} 
                className="nav-link logout-btn"
              >
                Выйти
              </button>
            </>
          ) : (
            // Если пользователь НЕ залогинен
            <>
              <Link to="/login" className="nav-link">Войти</Link>
              <Link to="/register" className="nav-link register-btn">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;