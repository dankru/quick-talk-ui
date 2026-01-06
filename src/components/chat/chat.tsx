import React, { useState, useRef, useEffect } from 'react';
import './chat.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я ваш AI-ассистент. Чем могу помочь?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Авто-размер textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150 // Максимальная высота
      )}px`;
    }
  }, [input]);

  // Фокус на поле ввода после загрузки
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  // Обработка отправки сообщения
// Замени handleSendMessage в React компоненте на это:
const handleSendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content: input,
    sender: 'user',
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  const messageToSend = input;
  setInput('');
  setIsLoading(true);

  // Сброс высоты textarea
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
  }

  try {
    const response = await fetch('http://localhost:8000/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5vaWFmdWdhY2VAZ21haWwuY29tIiwiZXhwIjoxNzY3NzA1MzMzLCJpYXQiOjE3Njc3MDM1MzMsImxvZ2luIjoiZGFua3J1IiwidXNlcl9pZCI6ImRmYzY2YzA5LWZiMmQtNGZkZC04Y2EyLWMyNTU2ZGU0NGU0MCJ9.HwiEtdU5ZiJytZlh28gUYRi8Rc9t9LDF4CTGWtBjYbE'
      },
      body: JSON.stringify({
        message: messageToSend,
        history: messages.slice(-10).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Преобразуем JSON в строку для отображения
    const replyText = `Ваши колоды: ${JSON.stringify(data, null, 2)}`;
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: replyText,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Ошибка:', error);
    
    const errorMessage: Message = {
      id: Date.now().toString(),
      content: `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      sender: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

  // Обработка нажатия клавиш - РАБОЧИЙ ВАРИАНТ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCtrlEnter = e.key === 'Enter' && e.ctrlKey && !e.shiftKey;
    const isShiftEnter = e.key === 'Enter' && e.shiftKey && !e.ctrlKey;
    const isPlainEnter = e.key === 'Enter' && !e.shiftKey && !e.ctrlKey;
    
    if (isPlainEnter) {
      // Обычный Enter - отправка
      e.preventDefault();
      handleSendMessage();
      return;
    }
    
    if (isCtrlEnter || isShiftEnter) {
      // Ctrl+Enter или Shift+Enter - перенос строки
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Вставляем новую строку
      const newValue = 
        input.substring(0, start) + '\n' + input.substring(end);
      
      setInput(newValue);
      
      // Обновляем курсор и высоту
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        // Обновляем высоту
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
      }, 0);
      
      return;
    }
    
    // Escape - очистка поля
    if (e.key === 'Escape') {
      e.preventDefault();
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      return;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            <div className="message-sender">
              {message.sender === 'user' ? 'Вы' : 'AI'}
            </div>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-form">
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите ваше сообщение... (Enter - отправить, Ctrl+Enter/Shift+Enter - новая строка)"
              disabled={isLoading}
              rows={1}
              className="message-input"
            />
            <div className="textarea-hint">
              Enter - отправить • Ctrl+Enter или Shift+Enter - новая строка
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Отправка...
              </>
            ) : (
              <>
                <svg className="send-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Отправить
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;