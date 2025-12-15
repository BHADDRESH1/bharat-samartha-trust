'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Award, Send } from 'lucide-react';

const DiscussionForum = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState('');

  const forumTabs = [
    { id: 'general', name: 'General Discussion', icon: <MessageSquare className="mr-2" size={18} /> },
    { id: 'study-groups', name: 'Study Groups', icon: <Users className="mr-2" size={18} /> },
    { id: 'expert-advice', name: 'Expert Advice', icon: <Award className="mr-2" size={18} /> }
  ];

  const messages = [
    { id: 1, user: 'Priya Singh', avatar: '/images/avatars/avatar-1.jpg', message: 'Can someone explain the new pattern for UPSC Prelims 2025?', time: '2 hours ago', replies: 3, likes: 12 },
    { id: 2, user: 'Rahul Verma', avatar: '/images/avatars/avatar-2.jpg', message: 'Looking for study partners for Banking exams in Delhi NCR region.', time: '5 hours ago', replies: 8, likes: 5 },
    { id: 3, user: 'Anjali Gupta', avatar: '/images/avatars/avatar-3.jpg', message: 'I found this amazing resource for Indian History. Sharing the link here.', time: '1 day ago', replies: 14, likes: 32 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Logic to send message would go here
    setMessage('');
  };

  return (
    <motion.section 
      id="discussion-forum"
      className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Discussion Forum</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          Join our community of aspirants to discuss exam topics, share resources, and get your doubts cleared.
        </p>

        {/* Forum Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {forumTabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-full ${
                activeTab === tab.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              } transition duration-300`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Forum Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Forum Header */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Recent Discussions</h3>
              <div className="flex items-center gap-2">
                <button className="text-sm bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full transition">
                  New Topic
                </button>
                <select className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1">
                  <option>Sort by: Latest</option>
                  <option>Sort by: Popular</option>
                  <option>Sort by: Unanswered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                      {/* Replace with actual image if available */}
                      <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                        {msg.user.charAt(0)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{msg.user}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{msg.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-primary transition">
                        <MessageSquare size={14} /> {msg.replies} Replies
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"></path>
                          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg> {msg.likes} Likes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Send Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message or question..."
                className="flex-grow px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full transition"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* AI Helper Callout */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">AI Study Assistant</h4>
            <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
              Get instant answers to your exam-related queries with our AI-powered chatbot. Available 24/7 to help you with your preparation.
            </p>
            <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded-full transition">
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DiscussionForum;