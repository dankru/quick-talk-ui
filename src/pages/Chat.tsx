// src/pages/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header/Header';
import MessagesList from '../components/chat/MessagesList';
import MessageInput from '../components/chat/MessageInput';
import { Message } from '../types/message';
import { useAuth } from '../contexts/AuthContext';
import '../components/chat/styles/Chat.scss';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'TODO: Store message history',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);
  const { token } = useAuth(); 

  // Прокрутка к последнему сообщению
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  // Авто-размер textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  // Фокус на поле ввода после загрузки
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Добавляем токен в заголовки
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        headers,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCtrlEnter = e.key === 'Enter' && e.ctrlKey && !e.shiftKey;
    const isShiftEnter = e.key === 'Enter' && e.shiftKey && !e.ctrlKey;
    const isPlainEnter = e.key === 'Enter' && !e.shiftKey && !e.ctrlKey;
    
    if (isPlainEnter) {
      e.preventDefault();
      handleSendMessage();
      return;
    }
    
    if (isCtrlEnter || isShiftEnter) {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = 
        input.substring(0, start) + '\n' + input.substring(end);
      
      setInput(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
      }, 0);
      
      return;
    }
    
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
    <>
      <Header />
      <div className="chat-container">
        <MessagesList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          textareaRef={textareaRef}
        />
      </div>
    </>
  );
};

export default Chat;