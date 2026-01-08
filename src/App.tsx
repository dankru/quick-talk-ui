// src/App.tsx
import React from 'react';
import './App.scss';
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Главная страница ведет на логин */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Страница логина */}
        <Route path="/login" element={<Login />} />
        
        {/* Страница регистрации */}
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute> {/* ← оберни Chat в ProtectedRoute */}
              <Chat />
            </ProtectedRoute>
          } 
        />
        
        {/* Если страница не найдена */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;