'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Mic,
  MicOff
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function AICareerBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your AI Career Assistant. I can help you with job searches, resume tips, interview preparation, and career guidance. What would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'Help me find jobs',
        'Resume tips',
        'Interview questions',
        'Career guidance'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    if (lowerMessage.includes('job') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
      response = 'I can help you find the perfect job! Here are some options:\n\n• **Government Jobs**: SSC, UPSC, Banking, Railways\n• **Private Jobs**: IT, BPO, Retail, Manufacturing\n• **Remote Jobs**: Data entry, Content writing, Customer support\n\nWhat type of job interests you most?';
      suggestions = ['Government jobs', 'Private sector', 'Remote work', 'Entry level jobs'];
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      response = 'Great question! Here are my top resume tips:\n\n✅ **Keep it concise** - 1-2 pages maximum\n✅ **Use action verbs** - "Managed", "Developed", "Increased"\n✅ **Quantify achievements** - Use numbers and percentages\n✅ **Tailor for each job** - Match keywords from job description\n✅ **Professional format** - Clean, readable layout\n\nWould you like help with any specific resume section?';
      suggestions = ['Resume templates', 'ATS optimization', 'Cover letter', 'LinkedIn profile'];
    } else if (lowerMessage.includes('interview') || lowerMessage.includes('preparation')) {
      response = 'Interview preparation is key to success! Here\'s what you should focus on:\n\n🎯 **Common Questions**:\n• Tell me about yourself\n• Why do you want this job?\n• What are your strengths/weaknesses?\n\n🎯 **STAR Method**: Structure answers with Situation, Task, Action, Result\n\n🎯 **Research**: Company background, role requirements, recent news\n\nWhat specific interview aspect would you like to practice?';
      suggestions = ['Mock interview', 'Common questions', 'Technical questions', 'Salary negotiation'];
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn') || lowerMessage.includes('course')) {
      response = 'Skill development is crucial for career growth! Here are trending skills:\n\n💻 **Digital Skills**:\n• MS Office, Data entry, Digital marketing\n\n🔧 **Technical Skills**:\n• Programming, Web development, Data analysis\n\n🤝 **Soft Skills**:\n• Communication, Leadership, Problem-solving\n\n🏭 **Vocational Skills**:\n• Electrical, Plumbing, Tailoring, Beauty\n\nWhich area interests you most?';
      suggestions = ['Free courses', 'Certification programs', 'Government training', 'Online learning'];
    } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('money')) {
      response = 'Here\'s salary guidance for different job categories:\n\n💰 **Entry Level**:\n• Data Entry: ₹10,000-20,000\n• Customer Service: ₹15,000-25,000\n• Sales Executive: ₹12,000-22,000\n\n💰 **Skilled**:\n• IT Support: ₹20,000-35,000\n• Accountant: ₹18,000-30,000\n• Teacher: ₹15,000-28,000\n\n💰 **Professional**:\n• Software Developer: ₹30,000-80,000\n• Manager: ₹40,000-100,000\n\nSalaries vary by location and experience. Need specific role guidance?';
      suggestions = ['Salary negotiation', 'Benefits package', 'Career growth', 'Industry standards'];
    } else if (lowerMessage.includes('government') || lowerMessage.includes('ssc') || lowerMessage.includes('upsc')) {
      response = 'Government jobs offer great security and benefits! Popular options:\n\n🏛️ **Central Government**:\n• SSC CGL, CHSL, MTS\n• Banking: SBI, IBPS\n• Railways: RRB, NTPC\n• Defense: Army, Navy, Air Force\n\n🏛️ **State Government**:\n• State PSC exams\n• Police recruitment\n• Teaching jobs\n• Municipal jobs\n\nWhich government sector interests you?';
      suggestions = ['SSC preparation', 'Banking exams', 'Railway jobs', 'State PSC'];
    } else if (lowerMessage.includes('freelance') || lowerMessage.includes('work from home')) {
      response = 'Freelancing is a great way to earn! Popular freelance opportunities:\n\n💻 **Digital Services**:\n• Content writing: ₹200-800/hour\n• Graphic design: ₹300-1200/hour\n• Web development: ₹500-2000/hour\n• Data entry: ₹150-400/hour\n\n📱 **Top Platforms**:\n• Upwork, Fiverr, Freelancer\n• Local: WorkNest, Truelancer\n\nWhat skills do you have for freelancing?';
      suggestions = ['Freelance platforms', 'Skill development', 'Portfolio building', 'Client acquisition'];
    } else {
      response = 'I\'m here to help with your career questions! I can assist with:\n\n• **Job Search** - Find opportunities that match your skills\n• **Resume Building** - Create ATS-friendly resumes\n• **Interview Prep** - Practice common questions\n• **Skill Development** - Learn new skills for better jobs\n• **Career Planning** - Set and achieve career goals\n\nWhat specific career challenge are you facing?';
      suggestions = ['Find jobs', 'Improve resume', 'Practice interview', 'Learn skills'];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => sendMessage(), 100);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your AI Career Assistant. I can help you with job searches, resume tips, interview preparation, and career guidance. What would you like to know?',
      timestamp: new Date(),
      suggestions: [
        'Help me find jobs',
        'Resume tips',
        'Interview questions',
        'Career guidance'
      ]
    }]);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input logic would go here
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Ask AI Career Assistant
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`fixed z-50 ${
        isMinimized 
          ? 'bottom-6 right-6 w-80 h-16' 
          : 'bottom-6 right-6 w-80 md:w-96 h-96 md:h-[500px]'
      }`}
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">AI Career Assistant</h3>
              <p className="text-xs opacity-90">Online • Ready to help</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={clearChat}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              className="flex flex-col flex-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-xs ${message.type === 'user' ? 'order-1' : ''}`}>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-white border border-gray-200'
                      }`}>
                        <div className="text-sm whitespace-pre-line">{message.content}</div>
                        
                        {message.type === 'bot' && (
                          <div className="flex items-center gap-2 mt-2 opacity-50">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1 px-3">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    className="flex gap-2 justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask about jobs, resume, interviews..."
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isTyping}
                    />
                    <button
                      onClick={toggleVoiceInput}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                        isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                  {[
                    'Find jobs near me',
                    'Resume review',
                    'Salary guide',
                    'Interview tips'
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(action)}
                      className="flex-shrink-0 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}