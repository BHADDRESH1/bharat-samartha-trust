'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'bot', message: 'Hi there! 👋 How can I help you with your donation today?' }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { role: 'user', message }]);
    
    // Clear input
    setMessage('');
    
    // Simulate bot response (in reality, this would be an API call)
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Would you like information about our current causes?",
        "I'd be happy to help you with making a donation. What cause interests you most?",
        "Our team is making a big impact in communities around the world. How would you like to get involved?",
        "Every donation makes a difference, no matter the size. Would you like to learn more about how we use funds?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setConversation(prev => [...prev, { role: 'bot', message: randomResponse }]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 left-6 z-50 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="font-bold">Charity Assistant</h3>
              <p className="text-sm text-white/80">We're here to help</p>
            </div>
            
            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
              {conversation.map((item, index) => (
                <div
                  key={index}
                  className={`max-w-3/4 p-3 rounded-lg ${
                    item.role === 'user'
                      ? 'bg-purple-100 ml-auto'
                      : 'bg-gray-100 mr-auto'
                  }`}
                >
                  {item.message}
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}