'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  Mail, 
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff
} from 'lucide-react';
import { Shield } from 'lucide-react';  // Add this import

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'lawyer';
  timestamp: Date;
  type: 'text' | 'file' | 'audio';
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  lawyer: string;
  specialization: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface LawyerProfile {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  avatar: string;
  isOnline: boolean;
  languages: string[];
}

export default function LawyerConsultation() {
  const [activeTab, setActiveTab] = useState<'chat' | 'email' | 'appointment'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI legal assistant. How can I help you today? You can ask about property disputes, family law, consumer rights, or any other legal matter.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    description: '',
    urgency: 'normal'
  });

  const lawyers: LawyerProfile[] = [
    {
      id: '1',
      name: 'Adv. Priya Sharma',
      specialization: ['Family Law', 'Divorce', 'Child Custody'],
      experience: 8,
      rating: 4.8,
      avatar: '/api/placeholder/64/64',
      isOnline: true,
      languages: ['Hindi', 'English']
    },
    {
      id: '2',
      name: 'Adv. Rajesh Kumar',
      specialization: ['Property Law', 'Real Estate', 'Civil Disputes'],
      experience: 12,
      rating: 4.9,
      avatar: '/api/placeholder/64/64',
      isOnline: true,
      languages: ['Hindi', 'English', 'Punjabi']
    },
    {
      id: '3',
      name: 'Adv. Meera Patel',
      specialization: ['Consumer Rights', 'Corporate Law', 'Contract Disputes'],
      experience: 6,
      rating: 4.7,
      avatar: '/api/placeholder/64/64',
      isOnline: false,
      languages: ['English', 'Gujarati']
    }
  ];

  const quickQuestions = [
    'How to file RTI application?',
    'Property dispute with neighbor',
    'Divorce procedure in India',
    'Consumer complaint process',
    'Employment termination rights',
    'Domestic violence help'
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('rti') || lowerQuery.includes('information')) {
      return 'To file an RTI application: 1) Write a simple application mentioning the information you need, 2) Pay ₹10 fee (₹2 for BPL), 3) Submit to the concerned PIO (Public Information Officer), 4) You should get a response within 30 days. Would you like me to help you draft an RTI application?';
    } else if (lowerQuery.includes('property') || lowerQuery.includes('dispute')) {
      return 'For property disputes, you can: 1) Try mediation first, 2) File a civil suit in the appropriate court, 3) Gather all property documents, 4) Consider alternative dispute resolution. I can connect you with a property law specialist. Would you like me to schedule a consultation?';
    } else if (lowerQuery.includes('divorce')) {
      return 'Divorce in India can be filed under: 1) Hindu Marriage Act, 2) Special Marriage Act, 3) Indian Christian Marriage Act, or 4) Parsi Marriage and Divorce Act. The process involves filing a petition, serving notice, and court proceedings. Would you like to speak with a family law expert?';
    } else if (lowerQuery.includes('consumer')) {
      return 'For consumer complaints: 1) Approach the District Consumer Forum for claims up to ₹1 crore, 2) File within 2 years of the cause of action, 3) Pay nominal court fees, 4) Gather purchase receipts and communication records. I can help you prepare your complaint. What product/service is your complaint about?';
    } else {
      return 'I understand your concern. This seems like a matter that would benefit from professional legal advice. Let me connect you with one of our verified lawyers who can provide personalized guidance. Would you prefer a chat consultation, email consultation, or a scheduled video call?';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', emailForm);
    alert('Your query has been submitted. You will receive a response within 24-48 hours.');
    setEmailForm({
      name: '',
      email: '',
      subject: '',
      category: '',
      description: '',
      urgency: 'normal'
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you'd implement actual voice recording here
  };

  const toggleVideoCall = () => {
    setIsVideoCall(!isVideoCall);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Ask a Lawyer - Free Consultation
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get free legal advice from verified lawyers and AI-powered assistance available 24/7
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { id: 'chat', label: 'Live Chat', icon: <MessageCircle className="w-5 h-5" /> },
          { id: 'email', label: 'Email Lawyer', icon: <Mail className="w-5 h-5" /> },
          { id: 'appointment', label: 'Book Appointment', icon: <Calendar className="w-5 h-5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">AI Legal Assistant</h3>
                  <p className="text-sm opacity-90">Online • Responds instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-full transition-colors ${
                    isRecording ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleVideoCall}
                  className={`p-2 rounded-full transition-colors ${
                    isVideoCall ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {isVideoCall ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-blue-100' 
                      : message.sender === 'bot' 
                      ? 'bg-gray-100' 
                      : 'bg-green-100'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-blue-600" />
                    ) : message.sender === 'bot' ? (
                      <Bot className="w-5 h-5 text-gray-600" />
                    ) : (
                      <User className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-xs md:max-w-md ${
                    message.sender === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-gray-100 rounded-full">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
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

          {/* Quick Questions */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1 bg-white border rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your legal question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Consultation */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Email a Lawyer</h3>
              <p className="text-gray-600">Get detailed legal advice via email within 24-48 hours</p>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={emailForm.name}
                  onChange={(e) => setEmailForm({...emailForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Category</label>
                <select
                  value={emailForm.category}
                  onChange={(e) => setEmailForm({...emailForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="family">Family Law</option>
                  <option value="property">Property Law</option>
                  <option value="consumer">Consumer Rights</option>
                  <option value="employment">Employment Law</option>
                  <option value="civil">Civil Disputes</option>
                  <option value="criminal">Criminal Law</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <select
                  value={emailForm.urgency}
                  onChange={(e) => setEmailForm({...emailForm, urgency: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal (48 hours)</option>
                  <option value="urgent">Urgent (24 hours)</option>
                  <option value="emergency">Emergency (Same day)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your legal issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea
                value={emailForm.description}
                onChange={(e) => setEmailForm({...emailForm, description: e.target.value})}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe your legal situation in detail. Include relevant dates, documents, and any actions you've already taken."
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Query
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Attach documents (optional)</span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Appointment Booking */}
      {activeTab === 'appointment' && (
        <div className="space-y-8">
          {/* Available Lawyers */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Book Free Appointment</h3>
                <p className="text-gray-600">Schedule a video call with verified lawyers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers.map((lawyer) => (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedLawyer(lawyer)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={lawyer.avatar}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {lawyer.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{lawyer.name}</h4>
                      <p className="text-sm text-gray-600">{lawyer.experience} years experience</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{lawyer.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Specializations:</p>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Languages:</p>
                      <p className="text-sm text-gray-600">{lawyer.languages.join(', ')}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {lawyer.isOnline ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600">Available Now</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Next available: Tomorrow</span>
                          </>
                        )}
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Calendar */}
          {selectedLawyer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedLawyer.avatar}
                    alt={selectedLawyer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedLawyer.name}</h3>
                    <p className="text-gray-600">{selectedLawyer.specialization.join(', ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Time Slots */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Available Time Slots</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Today */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Today</h5>
                      <div className="space-y-2">
                        {['2:00 PM', '3:30 PM', '5:00 PM'].map((time, idx) => (
                          <button
                            key={idx}
                            className="w-full p-3 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{time}</span>
                              <span className="text-sm text-green-600">Available</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tomorrow */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Tomorrow</h5>
                      <div className="space-y-2">
                        {['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'].map((time, idx) => (
                          <button
                            key={idx}
                            className="w-full p-3 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{time}</span>
                              <span className="text-sm text-green-600">Available</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Legal Category</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Select category</option>
                        {selectedLawyer.specialization.map((spec, idx) => (
                          <option key={idx} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Briefly describe your legal issue"
                    />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                      Confirm Appointment
                    </button>
                    <button
                      onClick={() => setSelectedLawyer(null)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Conversation Archive */}
      <div className="bg-gray-50 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-purple-600" />
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Your Consultation History</h3>
            <p className="text-gray-600">Access your previous conversations and appointments</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              id: '1',
              type: 'chat',
              title: 'Property Dispute Consultation',
              date: '2024-01-15',
              status: 'completed',
              lawyer: 'Adv. Rajesh Kumar'
            },
            {
              id: '2',
              type: 'email',
              title: 'Divorce Procedure Query',
              date: '2024-01-10',
              status: 'replied',
              lawyer: 'Adv. Priya Sharma'
            },
            {
              id: '3',
              type: 'appointment',
              title: 'Consumer Rights Discussion',
              date: '2024-01-20',
              status: 'scheduled',
              lawyer: 'Adv. Meera Patel'
            }
          ].map((consultation) => (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    consultation.type === 'chat' ? 'bg-blue-100' :
                    consultation.type === 'email' ? 'bg-purple-100' :
                    'bg-green-100'
                  }`}>
                    {consultation.type === 'chat' ? (
                      <MessageCircle className={`w-5 h-5 ${
                        consultation.type === 'chat' ? 'text-blue-600' : ''
                      }`} />
                    ) : consultation.type === 'email' ? (
                      <Mail className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Video className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{consultation.title}</h4>
                    <p className="text-sm text-gray-600">
                      {consultation.lawyer} • {consultation.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    consultation.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                    consultation.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h4 className="font-bold text-blue-800 mb-2">Privacy & Confidentiality</h4>
            <p className="text-blue-700 text-sm">
              All conversations are encrypted and confidential. Our lawyers follow strict ethical guidelines 
              and attorney-client privilege. Your personal information and legal discussions are secure and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}