// src/types/chat.ts

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface MessageInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export interface SendButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export interface MessagesListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export interface MessageProps {
  message: Message;
}