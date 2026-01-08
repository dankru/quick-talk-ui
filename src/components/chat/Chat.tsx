// src/components/Chat/Chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { Message } from '../../types/message';
import './styles/Chat.scss';

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
  );
};

export default Chat;