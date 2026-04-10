import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { chatPublic, chatAuthenticated } from '../api/aiApi';
import { getAccessToken } from '../utils/tokenStorage';

import { API_BASE_URL } from '../config/api';

const Chatbot = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamConnecting, setIsStreamConnecting] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Safe session ID generation
  const getSessionId = () => {
    try {
      return crypto.randomUUID();
    } catch (e) {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  };
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'Hi! I am the Upgradon AI Assistant. How can I help you with your career journey today?' 
        }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom whenever messages change OR when input/loading state suggests a layout shift
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading, isStreamConnecting]);

  // Special scroll-to-bottom when opening or typing to ensure visibility
  const handleInputFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    // New messages go at the START of the array for flex-col-reverse
    setMessages(prev => [{ role: 'user', content: userMessage }, ...prev]);
    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        setIsStreamConnecting(true);
        const response = await chatPublic(userMessage, sessionId.current);
        const reply = response?.data?.reply || response?.reply || 'No response';
        setIsStreamConnecting(false);
        setMessages(prev => [{ role: 'assistant', content: reply }, ...prev]);
      } else {
        // Authenticated users get a streaming assistant message placeholder at the start
        setMessages(prev => [{ role: 'assistant', content: '' }, ...prev]);
        
        const token = getAccessToken();
        setIsStreamConnecting(true);
        const streamResponse = await fetch(`${API_BASE_URL}/api/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message: userMessage })
        });
        
        if (!streamResponse.ok) {
          throw new Error('Stream request failed');
        }

        const reader = streamResponse.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        
        let firstChunk = true;
        
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            if (firstChunk) {
              setIsStreamConnecting(false);
              firstChunk = false;
            }
            let rawChunk = decoder.decode(value, { stream: true });
            
            // CLEANING LOGIC: SSE chunks often come prefixed with "data: " 
            // We split by newline and strip the prefix from every line to handle multi-line events
            let cleanParts = rawChunk.split('\n').map(line => {
              // Strip "data: " or "data:" at the start of any line
              return line.replace(/^data:\s*/, '').trim();
            }).filter(Boolean); // Remove empty resulting lines

            let chunk = cleanParts.join('\n');
            if (!chunk) continue;

            setMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[0]; // messages[0] is the latest because of flex-col-reverse
              newMessages[0] = {
                ...lastMsg,
                content: lastMsg.content + (lastMsg.content ? '\n' : '') + chunk
              };
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [{ 
        role: 'assistant', 
        content: 'Oops! I encountered an error. Please try again in a moment.' 
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all z-50 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transform transition-all animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Upgradon AI</h3>
                <p className="text-xs text-emerald-100">Career Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages Container (Flexible and Scrollable) */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
            {/* Inner wrapper with flex-col-reverse pins content to the bottom */}
            <div className="flex flex-col-reverse p-4 min-h-full">
              {/* Anchor for scroll is now at the top of the reversed list (which is the bottom of the view) */}
              <div ref={messagesEndRef} />

              {isStreamConnecting && (
                <div className="flex gap-3 justify-start mb-4">
                   <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-cyan-400" />
                   </div>
                   <div className="px-4 py-3 rounded-2xl glass text-cyan-400 rounded-tl-none flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mr-2">Thinking</span>
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ 
                              scale: [1, 1.4, 1],
                              opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ 
                              duration: 1, 
                              repeat: Infinity, 
                              delay: i * 0.2 
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          />
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {/* Render messages: flex-col-reverse means messages[0] is at the bottom */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'}`}>
                    {msg.content}
                  </div>
  
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-gray-900 dark:text-white"
                onFocus={handleInputFocus}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-center mt-2 text-[10px] text-gray-400 capitalize tracking-wider">
              Free AI Career Assistant
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
