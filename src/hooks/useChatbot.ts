import { useState, useCallback } from 'react';
import { chatbotService } from '../services/chatbotService';
import type { ChatMessage } from '../types';
import { useAuth } from './useAuth';

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      type: 'message',
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(message, user?.id);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        type: 'message',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const clearChat = useCallback(() => {
    chatbotService.clearChatHistory(user?.id);
    setMessages([]);
  }, [user?.id]);

  const loadHistory = useCallback(() => {
    const history = chatbotService.getChatHistory(user?.id);
    setMessages(history);
  }, [user?.id]);

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
    loadHistory,
  };
};

