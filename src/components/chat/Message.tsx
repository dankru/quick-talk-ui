// src/components/Chat/Message.tsx
import React from 'react';
import { Message as MessageType } from '../../types/message';
import './styles/Message.scss';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      <div className="message-sender">
        {message.sender === 'user' ? 'Вы' : 'AI'}
      </div>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
};

export default Message;