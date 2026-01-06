// src/App.tsx
import React from 'react';
import './App.css';
import Chat from './components/chat/chat';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Chat Assistant</h1>
        <p>Общайтесь с искусственным интеллектом</p>
      </header>
      <main className="App-main">
        <Chat />
      </main>
    </div>
  );
}

export default App;