import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSun, FiMoon, FiMenu, FiX, FiMessageSquare } from 'react-icons/fi';
import { BsRobot, BsPerson } from 'react-icons/bs';
import useStore from '../store';
import { API_ENDPOINTS, PERSONAS } from '../config';
import LoadingDots from './LoadingDots';

const ChatInterface = () => {
  const {
    darkMode,
    toggleDarkMode,
    currentPersona,
    personas,
    setPersona,
    messages,
    addMessage,
    isSidebarOpen,
    toggleSidebar,
    settings
  } = useStore();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      persona: currentPersona
    };

    addMessage(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          tone: 'friendly', // Default tone, can be made configurable
          temperature: settings.temperature,
          persona: currentPersona
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        text: data.response || 'No response from the server',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        persona: currentPersona
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || 'Failed to get response from server'}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-4 right-4 z-20 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">PERSONA</h3>
              <div className="space-y-2">
                {Object.entries(personas).map(([id, persona]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setPersona(id);
                      if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left ${
                      currentPersona === id
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      currentPersona === id 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      <BsRobot size={16} />
                    </div>
                    <div>
                      <div className="font-medium">{persona.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{persona.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col md:ml-64 h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 dark:text-gray-400"
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full mb-4">
                  <FiMessageSquare size={32} className="text-purple-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Welcome to Xetra AI</h3>
                <p className="max-w-md">
                  Start a conversation with {personas[currentPersona]?.name || 'the AI'}. Ask questions, get help, or just chat!
                </p>
              </motion.div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] flex ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 ml-3'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3'
                    }`}>
                      {message.sender === 'user' ? <BsPerson size={16} /> : <BsRobot size={16} />}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                    }`}>
                      <div className="whitespace-pre-wrap break-words">{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                  <BsRobot size={16} />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-none px-4 py-3">
                  <LoadingDots />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${personas[currentPersona]?.name || 'AI'}...`}
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows="1"
              style={{ minHeight: '44px', maxHeight: '200px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`absolute right-2 bottom-2 p-2 rounded-lg ${
                inputValue.trim() && !isLoading
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'text-gray-400 dark:text-gray-500'
              } transition-colors`}
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
