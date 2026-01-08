// src/App.tsx
import React from 'react';
import './App.scss';
import Chat from './components/chat/Chat';

const serega = "Seryojka"
function App() {
  return (
    <div className="App">
      <main className="App-main">
        <Chat />
      </main>
    </div>
  );
}

export default App;