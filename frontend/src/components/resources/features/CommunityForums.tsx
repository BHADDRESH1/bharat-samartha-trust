'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Search, 
  Plus,
  User,
  Clock,
  ArrowUp,
  ArrowDown,
  Star,
  Badge,
  Filter,
  Eye,
  Reply,
  Heart,
  Share2
} from 'lucide-react';
import Image from 'next/image';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    badge: 'Top Helper' | 'Volunteer Mentor' | 'Newbie' | 'Expert';
    points: number;
  };
  category: string;
  tags: string[];
  replies: number;
  views: number;
  likes: number;
  createdAt: string;
  isHelpful: boolean;
  isPinned?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  color: string;
}

export default function CommunityForums() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const categories: ForumCategory[] = [
    {
      id: 'all',
      name: 'All Discussions',
      description: 'Browse all forum topics',
      icon: '💬',
      posts: 1250,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'exams',
      name: 'Competitive Exams',
      description: 'UPSC, SSC, Banking, Railway discussions',
      icon: '📚',
      posts: 456,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'careers',
      name: 'Career Guidance',
      description: 'Job search, interviews, career advice',
      icon: '💼',
      posts: 234,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'skills',
      name: 'Skill Development',
      description: 'Programming, communication, technical skills',
      icon: '🛠️',
      posts: 189,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      description: 'Study motivation, stress management',
      icon: '🧠',
      posts: 167,
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'study-groups',
      name: 'Study Groups',
      description: 'Find study partners and groups',
      icon: '👥',
      posts: 203,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const mockPosts: ForumPost[] = [
    {
      id: 1,
      title: 'Best Strategy for UPSC Prelims 2024 - Need Guidance',
      content: 'I\'m preparing for UPSC 2024 and confused about the strategy for prelims. Should I focus more on current affairs or static portions? Any toppers here who can guide?',
      author: {
        name: 'Priya Sharma',
        avatar: '/api/placeholder/40/40',
        badge: 'Newbie',
        points: 125
      },
      category: 'exams',
      tags: ['UPSC', 'Prelims', 'Strategy'],
      replies: 23,
      views: 456,
      likes: 34,
      createdAt: '2 hours ago',
      isHelpful: true,
      isPinned: true
    },
    {
      id: 2,
      title: 'Python vs Java for Beginners - Which to Choose?',
      content: 'I\'m new to programming and want to start my coding journey. Everyone suggests different languages. What would be better for a complete beginner?',
      author: {
        name: 'Rahul Kumar',
        avatar: '/api/placeholder/40/40',
        badge: 'Top Helper',
        points: 2450
      },
      category: 'skills',
      tags: ['Programming', 'Python', 'Java', 'Beginner'],
      replies: 18,
      views: 289,
      likes: 27,
      createdAt: '4 hours ago',
      isHelpful: false
    },
    {
      id: 3,
      title: 'Dealing with Exam Anxiety - Your Tips?',
      content: 'I get really nervous during exams even though I prepare well. This affects my performance badly. How do you all manage exam stress?',
      author: {
        name: 'Anjali Patel',
        avatar: '/api/placeholder/40/40',
        badge: 'Volunteer Mentor',
        points: 1890
      },
      category: 'mental-health',
      tags: ['Stress', 'Anxiety', 'Mental Health'],
      replies: 31,
      views: 578,
      likes: 45,
      createdAt: '6 hours ago',
      isHelpful: true
    },
    {
      id: 4,
      title: 'SSC CGL Math Section - Shortcuts and Tricks',
      content: 'Sharing some amazing math shortcuts that helped me solve SSC CGL quant section faster. These tricks can save you 30-40 minutes in the exam!',
      author: {
        name: 'Vikash Singh',
        avatar: '/api/placeholder/40/40',
        badge: 'Expert',
        points: 3200
      },
      category: 'exams',
      tags: ['SSC', 'Mathematics', 'Shortcuts'],
      replies: 42,
      views: 1200,
      likes: 89,
      createdAt: '1 day ago',
      isHelpful: true
    },
    {
      id: 5,
      title: 'Looking for Study Group - Banking Exams 2024',
      content: 'Hi everyone! I\'m preparing for SBI PO and IBPS PO 2024. Looking for serious study partners to form a study group. Daily discussion and mock tests.',
      author: {
        name: 'Meera Reddy',
        avatar: '/api/placeholder/40/40',
        badge: 'Newbie',
        points: 87
      },
      category: 'study-groups',
      tags: ['Banking', 'Study Group', 'SBI PO'],
      replies: 15,
      views: 234,
      likes: 19,
      createdAt: '2 days ago',
      isHelpful: false
    }
  ];

  useEffect(() => {
    let filtered = mockPosts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort posts
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies));
        break;
      case 'helpful':
        filtered.sort((a, b) => Number(b.isHelpful) - Number(a.isHelpful));
        break;
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Top Helper':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Volunteer Mentor':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Expert':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Newbie':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const toggleExpansion = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const likePost = (postId: number) => {
    console.log(`Liked post ${postId}`);
    // In real implementation, this would update the like count
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          💬 Community Forums & Discussion
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Connect with fellow learners, ask questions, share knowledge, and build meaningful relationships
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`cursor-pointer bg-gradient-to-r ${category.color} p-6 rounded-2xl text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              selectedCategory === category.id ? 'ring-4 ring-white ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{category.icon}</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {category.posts} posts
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
            <p className="text-white/80 text-sm">{category.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl shadow-lg">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search discussions, topics, or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="helpful">Most Helpful</option>
          </select>

          <button
            onClick={() => setShowNewPostModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Forum Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
              post.isPinned ? 'border-l-4 border-yellow-400' : ''
            }`}
          >
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">{post.author.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getBadgeColor(post.author.badge)}`}>
                        {post.author.badge}
                      </span>
                      {post.isPinned && (
                        <span className="text-yellow-500">📌</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{post.author.points} points</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>
                
                {post.isHelpful && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Helpful
                  </span>
                )}
              </div>

              {/* Post Title and Content */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Stats and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedPost === post.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100 bg-gray-50 p-6"
                >
                  <h4 className="font-medium text-gray-800 mb-3">Recent Replies</h4>
                  <div className="space-y-4">
                    {/* Sample replies */}
                    {[1, 2, 3].map((reply) => (
                      <div key={reply} className="flex gap-3">
                        <Image
                          src="/api/placeholder/32/32"
                          alt="User"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="bg-white p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">User {reply}</span>
                              <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              This is a sample reply to demonstrate the expanded view functionality.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => toggleExpansion(post.id)}
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Hide Replies
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No discussions found</h3>
          <p className="text-gray-500 mb-6">Be the first to start a conversation in this category!</p>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300"
          >
            Start Discussion
          </button>
        </motion.div>
      )}

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        {[
          { icon: Users, label: 'Active Members', value: '25,000+', color: 'text-blue-500' },
          { icon: MessageCircle, label: 'Total Posts', value: '1,250+', color: 'text-green-500' },
          { icon: Star, label: 'Helpful Answers', value: '890+', color: 'text-yellow-500' },
          { icon: TrendingUp, label: 'Daily Active', value: '2,500+', color: 'text-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl border border-blue-100"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Community Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Be Respectful</h4>
            <p className="text-gray-600 text-sm">Treat all community members with respect and kindness</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Stay On Topic</h4>
            <p className="text-gray-600 text-sm">Keep discussions relevant to the chosen category</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Help Others</h4>
            <p className="text-gray-600 text-sm">Share your knowledge and help fellow learners</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">No Spam</h4>
            <p className="text-gray-600 text-sm">Avoid promotional content and repetitive posts</p>
          </div>
        </div>
      </motion.div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Start New Discussion</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Enter a descriptive title for your post"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    rows={6}
                    placeholder="Describe your question or topic in detail..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    placeholder="Add tags separated by commas (e.g., UPSC, Strategy, Tips)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300"
                  >
                    Post Discussion
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}