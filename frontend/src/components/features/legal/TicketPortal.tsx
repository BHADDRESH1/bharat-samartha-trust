'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Clock,
  User,
  Search,
  Plus,
  X,
  Loader,
  ArrowUp
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'resolved' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  userId: string;
  userName: string;
  userEmail: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  sentAt: Date;
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  url: string;
  type: string;
}

const TicketPortal = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Mock data initialization
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        subject: 'Property dispute with neighbor',
        category: 'property',
        status: 'open',
        priority: 'high',
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        userId: 'user1',
        userName: 'Rahul Sharma',
        userEmail: 'rahul@example.com',
        messages: [
          {
            id: '1-1',
            text: 'Hello, I have a property dispute with my neighbor regarding boundary walls. They have encroached on my land by about 2 feet. What legal options do I have?',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 2),
          },
          {
            id: '1-2',
            text: 'Dear Rahul, Thank you for reaching out. Property boundary disputes are common under Section 38 of the Specific Relief Act. You may consider sending a legal notice first. Could you share any documents like property papers or survey maps?',
            sender: 'support',
            sentAt: new Date(Date.now() - 86400000 * 1),
          },
        ],
      },
      {
        id: '2',
        subject: 'Consumer complaint against appliance company',
        category: 'consumer',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
        updatedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        userId: 'user2',
        userName: 'Priya Patel',
        userEmail: 'priya@example.com',
        messages: [
          {
            id: '2-1',
            text: 'I purchased a refrigerator that stopped working after 2 months. The company is refusing to honor the warranty. Please advise how to file a consumer complaint.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 5),
          },
          {
            id: '2-2',
            text: 'Under the Consumer Protection Act 2019, you can file a complaint within 2 years. We need details of your purchase and warranty documents. Please attach copies.',
            sender: 'support',
            sentAt: new Date(Date.now() - 86400000 * 3),
          },
          {
            id: '2-3',
            text: 'I have attached the invoice and warranty card. What should be my next step?',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 1),
            attachments: [
              {
                name: 'invoice.pdf',
                url: '#',
                type: 'pdf',
              },
              {
                name: 'warranty.jpg',
                url: '#',
                type: 'image',
              },
            ],
          },
        ],
      },
      {
        id: '3',
        subject: 'Domestic violence case assistance',
        category: 'family',
        status: 'urgent',
        priority: 'high',
        createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
        updatedAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
        userId: 'user3',
        userName: 'Anonymous',
        userEmail: 'anonymous@example.com',
        messages: [
          {
            id: '3-1',
            text: 'I need immediate help regarding domestic violence. My husband has been physically abusive and I fear for my safety. What legal protections are available?',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 1),
          },
          {
            id: '3-2',
            text: 'We take this very seriously. Under the Protection of Women from Domestic Violence Act 2005, you can file for immediate protection. A lawyer will contact you within 1 hour. Please share your contact number privately.',
            sender: 'support',
            sentAt: new Date(Date.now() - 3600000 * 1),
          },
        ],
      },
      {
        id: '4',
        subject: 'RTI application guidance',
        category: 'general',
        status: 'resolved',
        priority: 'low',
        createdAt: new Date(Date.now() - 86400000 * 10), // 10 days ago
        updatedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        userId: 'user4',
        userName: 'Amit Kumar',
        userEmail: 'amit@example.com',
        messages: [
          {
            id: '4-1',
            text: 'I need help drafting an RTI application to get information about a road construction project in my area.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 10),
          },
          {
            id: '4-2',
            text: 'Here is a sample RTI format you can use. Make sure to address it to the PIO of the concerned department and pay the ₹10 fee.',
            sender: 'support',
            sentAt: new Date(Date.now() - 86400000 * 8),
            attachments: [
              {
                name: 'RTI_sample.docx',
                url: '#',
                type: 'document',
              },
            ],
          },
          {
            id: '4-3',
            text: 'Thank you! I successfully filed the RTI using your template.',
            sender: 'user',
            sentAt: new Date(Date.now() - 86400000 * 2),
          },
        ],
      },
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    // Apply status filter
    if (activeFilter !== 'all' && ticket.status !== activeFilter && ticket.status !== 'urgent') {
      return false;
    }
    
    // Apply search query
    if (searchQuery && 
        !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.userName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedMessage: Message = {
        id: `${selectedTicket.id}-${selectedTicket.messages.length + 1}`,
        text: newMessage,
        sender: 'user',
        sentAt: new Date(),
      };

      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              messages: [...ticket.messages, updatedMessage],
              updatedAt: new Date(),
            }
          : ticket
      );

      setTickets(updatedTickets);
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, updatedMessage],
        updatedAt: new Date(),
      });
      setNewMessage('');
      setIsSubmitting(false);
    }, 800);
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const ticket: Ticket = {
        id: `ticket-${tickets.length + 1}`,
        subject: newTicket.subject,
        category: newTicket.category,
        status: 'open',
        priority: newTicket.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'current-user',
        userName: 'Current User',
        userEmail: 'user@example.com',
        messages: [
          {
            id: `ticket-${tickets.length + 1}-1`,
            text: newTicket.description,
            sender: 'user',
            sentAt: new Date(),
          },
        ],
      };

      setTickets([ticket, ...tickets]);
      setSelectedTicket(ticket);
      setNewTicket({
        subject: '',
        category: 'general',
        description: '',
        priority: 'medium',
      });
      setShowNewTicketForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
  return 'just now';
};

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Legal Support Ticket Portal</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Submit and track your legal queries with our expert support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 sticky top-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">My Tickets</h3>
                  <button
                    onClick={() => setShowNewTicketForm(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    New Ticket
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      activeFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Tickets
                  </button>
                  <button
                    onClick={() => setActiveFilter('open')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      activeFilter === 'open' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setActiveFilter('pending')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      activeFilter === 'pending' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveFilter('resolved')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      activeFilter === 'resolved' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Resolved
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Tickets</span>
                    <span className="font-medium">{tickets.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Open</span>
                    <span className="font-medium">
                      {tickets.filter(t => t.status === 'open' || t.status === 'urgent').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pending</span>
                    <span className="font-medium">{tickets.filter(t => t.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Resolved</span>
                    <span className="font-medium">{tickets.filter(t => t.status === 'resolved').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {showNewTicketForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Create New Ticket</h3>
                    <button
                      onClick={() => setShowNewTicketForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Briefly describe your legal issue"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Category</label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={newTicket.category}
                          onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        >
                          <option value="general">General Legal Query</option>
                          <option value="property">Property Law</option>
                          <option value="family">Family Law</option>
                          <option value="consumer">Consumer Rights</option>
                          <option value="employment">Employment Law</option>
                          <option value="criminal">Criminal Law</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Priority</label>
                        <select
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={newTicket.priority}
                          onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High (Urgent)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={6}
                        placeholder="Provide detailed information about your legal issue..."
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setShowNewTicketForm(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateTicket}
                        disabled={!newTicket.subject || !newTicket.description || isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" />
                            Submit Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : selectedTicket ? (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{selectedTicket.subject}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                        </span>
                        <span className="text-gray-500">
                          {formatDate(selectedTicket.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="space-y-6">
                      {selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-3xl rounded-lg p-4 ${
                              message.sender === 'user'
                                ? 'bg-blue-50 text-blue-900'
                                : 'bg-gray-50 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {message.sender === 'user' ? (
                                <User className="h-4 w-4 text-blue-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-gray-600" />
                              )}
                              <span className="text-xs font-medium">
                                {message.sender === 'user' ? 'You' : 'Legal Support'} • {formatTimeAgo(message.sentAt)}
                              </span>
                            </div>
                            <p className="whitespace-pre-line">{message.text}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded border border-gray-200 text-sm"
                                  >
                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                    <a
                                      href={attachment.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline truncate"
                                    >
                                      {attachment.name}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <div className="relative">
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                          rows={3}
                          placeholder="Type your reply..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || isSubmitting}
                          className={`absolute right-3 bottom-3 p-2 rounded-full ${
                            !newMessage.trim()
                              ? 'text-gray-400'
                              : 'text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          {isSubmitting ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <ArrowUp className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Press Enter to send, Shift+Enter for a new line
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchQuery ? 'No tickets match your search' : 'No tickets found'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchQuery
                          ? 'Try different search terms'
                          : activeFilter === 'all'
                            ? 'You have no tickets yet'
                            : `You have no ${activeFilter} tickets`}
                      </p>
                      <button
                        onClick={() => setShowNewTicketForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create New Ticket
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTickets.map((ticket) => (
                        <motion.div
                          key={ticket.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
                            selectedTicket?.id === ticket.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800 mb-1">{ticket.subject}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {ticket.messages[0].text}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500 mt-2">
                                {formatTimeAgo(ticket.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <MessageSquare className="h-3 w-3" />
                              {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <User className="h-3 w-3" />
                              {ticket.userName}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPortal;