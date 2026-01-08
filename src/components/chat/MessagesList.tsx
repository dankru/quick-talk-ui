// src/components/Chat/MessagesList.tsx
import React, { RefObject } from 'react';
import { Message as MessageType } from '../../types/message';
import Message from './Message';
import './styles/Chat.scss';

interface MessagesListProps {
  messages: MessageType[];
  messagesEndRef: RefObject<HTMLDivElement>;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="messages-container">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;