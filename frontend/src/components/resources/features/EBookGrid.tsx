'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Download, 
  Eye, 
  Filter, 
  Search, 
  Star,
  FileText,
  Code,
  Brain,
  Globe
} from 'lucide-react';
import Image from 'next/image';

interface EBook {
  id: number;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  downloads: number;
  rating: number;
  image: string;
  fileSize: string;
  language: string;
  tags: string[];
}

export default function EBookGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBooks, setFilteredBooks] = useState<EBook[]>([]);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'upsc', name: 'UPSC', icon: BookOpen },
    { id: 'ssc', name: 'SSC', icon: FileText },
    { id: 'banking', name: 'Banking', icon: Star },
    { id: 'coding', name: 'Programming', icon: Code },
    { id: 'skills', name: 'Life Skills', icon: Brain }
  ];

  const mockBooks: EBook[] = [
    {
      id: 1,
      title: 'UPSC Civil Services Complete Guide',
      author: 'Dr. Rajesh Kumar',
      category: 'upsc',
      description: 'Comprehensive guide covering all aspects of UPSC Civil Services examination with previous year questions and analysis.',
      pages: 450,
      downloads: 15420,
      rating: 4.8,
      image: '/api/placeholder/300/400',
      fileSize: '25.5 MB',
      language: 'English',
      tags: ['UPSC', 'Civil Services', 'Current Affairs']
    },
    {
      id: 2,
      title: 'SSC CGL Mathematics Mastery',
      author: 'Prof. Anita Sharma',
      category: 'ssc',
      description: 'Master mathematics for SSC CGL with step-by-step solutions and practice questions.',
      pages: 320,
      downloads: 12350,
      rating: 4.6,
      image: '/api/placeholder/300/400',
      fileSize: '18.2 MB',
      language: 'English',
      tags: ['SSC', 'Mathematics', 'Quantitative']
    },
    {
      id: 3,
      title: 'Banking Awareness 2024',
      author: 'Financial Academy',
      category: 'banking',
      description: 'Latest banking awareness questions and current affairs for all banking examinations.',
      pages: 280,
      downloads: 9840,
      rating: 4.7,
      image: '/api/placeholder/300/400',
      fileSize: '15.8 MB',
      language: 'English',
      tags: ['Banking', 'Current Affairs', 'Finance']
    },
    {
      id: 4,
      title: 'Python Programming Fundamentals',
      author: 'Tech Educators',
      category: 'coding',
      description: 'Learn Python from basics to advanced with practical examples and projects.',
      pages: 380,
      downloads: 18520,
      rating: 4.9,
      image: '/api/placeholder/300/400',
      fileSize: '22.1 MB',
      language: 'English',
      tags: ['Python', 'Programming', 'Web Development']
    },
    {
      id: 5,
      title: 'Communication Skills Excellence',
      author: 'Life Coach Institute',
      category: 'skills',
      description: 'Develop effective communication skills for personal and professional success.',
      pages: 240,
      downloads: 7650,
      rating: 4.5,
      image: '/api/placeholder/300/400',
      fileSize: '12.3 MB',
      language: 'English',
      tags: ['Communication', 'Soft Skills', 'Leadership']
    },
    {
      id: 6,
      title: 'JavaScript Complete Reference',
      author: 'Code Masters',
      category: 'coding',
      description: 'Complete JavaScript reference with ES6+ features, DOM manipulation, and modern frameworks.',
      pages: 520,
      downloads: 14200,
      rating: 4.8,
      image: '/api/placeholder/300/400',
      fileSize: '28.7 MB',
      language: 'English',
      tags: ['JavaScript', 'Web Development', 'ES6']
    }
  ];

  useEffect(() => {
    let filtered = mockBooks;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategory]);

  const downloadBook = (book: EBook) => {
    // Simulate download
    console.log(`Downloading ${book.title}`);
    // In real implementation, this would trigger actual download
  };

  const previewBook = (book: EBook) => {
    // Simulate preview
    console.log(`Previewing ${book.title}`);
    // In real implementation, this would open preview modal
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
          📚 Free eBooks & Study Materials
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access thousands of high-quality eBooks, PDFs, and study materials for competitive exams and skill development
        </p>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books, authors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
            onMouseEnter={() => setHoveredBook(book.id)}
            onMouseLeave={() => setHoveredBook(null)}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              {/* Book Cover */}
              <div className="relative overflow-hidden">
                <Image
                  src={book.image}
                  alt={book.title}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredBook === book.id ? 1 : 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4"
                >
                  <button
                    onClick={() => previewBook(book)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => downloadBook(book)}
                    className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors animate-pulse"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </motion.div>
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{book.rating}</span>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {book.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {book.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{book.pages} pages</span>
                  <span>{book.fileSize}</span>
                  <span>{book.downloads} downloads</span>
                </div>
                
                {/* Download Button */}
                <button
                  onClick={() => downloadBook(book)}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-full font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Free
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}