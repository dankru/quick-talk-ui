// src/components/Chat/MessageInput.tsx
import React, { RefObject } from 'react';
import SendButton from './SendButton';
import './styles/MessageInput.scss';

interface MessageInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onKeyDown,
  onSubmit,
  textareaRef,
}) => {
  return (
    <div className="input-container">
      <form onSubmit={onSubmit} className="input-form">
        <div className="textarea-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            // placeholder="Введите ваше сообщение... (Enter - отправить, Ctrl+Enter/Shift+Enter - новая строка)"
            disabled={isLoading}
            rows={1}
            className="message-input"
          />
          <SendButton
            isLoading={isLoading}
            disabled={isLoading || !input.trim()}
          />
        </div>
        <div className="textarea-hint">
          Enter - отправить • Ctrl+Enter или Shift+Enter - новая строка
        </div>
      </form>
    </div>
  );
};

export default MessageInput;