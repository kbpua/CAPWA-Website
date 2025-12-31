import React, { useState, useEffect, useRef } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import { ChatMessage } from './ChatMessage';
import { Button } from '../common/Button';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, loadHistory, clearChat } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleQuickAction = async (message: string) => {
    setInput(message);
    await sendMessage(message);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center z-50 ring-4 ring-yellow-300/30 animate-pulse"
        aria-label="Open chatbot"
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    );
  }

  return (
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] max-w-sm md:max-w-md lg:max-w-96 md:h-[500px] lg:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-green-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 md:p-4 flex items-center justify-between shadow-md">
          <div>
            <h3 className="font-bold text-base md:text-lg">CAPWA Assistant</h3>
            <p className="text-xs md:text-sm text-green-100">How can I help you today? 🐾</p>
          </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 flex-shrink-0 ml-2"
          aria-label="Close chatbot"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4 md:mt-8">
            <p className="mb-3 md:mb-4 text-sm md:text-base">👋 Hello! I'm here to help with animal emergencies in the Philippines.</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('I found an injured animal')}
                className="text-xs md:text-sm"
              >
                🚑 Injured Animal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('I need emergency contacts')}
                className="text-xs md:text-sm"
              >
                📞 Emergency Contacts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('I found a stray animal')}
                className="text-xs md:text-sm"
              >
                🐾 Stray Animal
              </Button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-lg px-3 md:px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={loading}
          />
          <Button type="submit" variant="primary" disabled={loading || !input.trim()} className="text-xs md:text-sm px-3 md:px-4">
            Send
          </Button>
        </form>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Clear chat
          </button>
        )}
      </div>
    </div>
  );
};

