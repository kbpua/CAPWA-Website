import React from 'react';
import type { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 md:mb-4`}>
      <div
        className={`max-w-[85%] md:max-w-[80%] rounded-lg px-3 py-1.5 md:px-4 md:py-2 ${
          isUser
            ? 'bg-emerald-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="text-xs md:text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-[10px] md:text-xs mt-1 ${isUser ? 'text-emerald-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};




