// src/components/Chat/SendButton.tsx
import React from 'react';
import './styles/SendButton.scss';

interface SendButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

const SendButton: React.FC<SendButtonProps> = ({
  isLoading,
  disabled,
  onClick,
  type = 'submit',
  className = ''
}) => {
  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`send-button ${className}`}
      aria-label="Отправить сообщение"
    >
      {isLoading ? (
        <span className="spinner"></span>
      ) : (
        <svg 
          className="send-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

export default SendButton;