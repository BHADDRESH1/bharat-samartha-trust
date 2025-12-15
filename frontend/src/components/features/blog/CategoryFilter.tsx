// components/features/blog/CategoryFilter.tsx
'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onHover: () => void;
  onClick: () => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory, onHover, onClick }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sample categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'design', name: 'Design' },
    { id: 'development', name: 'Development' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'technology', name: 'Technology' }
  ];
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onClick();
  };
  
  const handleCategorySelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
    onClick();
  };
  
  // Get the name of the selected category
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Categories';
  
  return (
    <div className="relative w-full md:w-48">
      <motion.button
        className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full text-gray-800 dark:text-gray-200"
        onClick={toggleDropdown}
        onMouseEnter={onHover}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <span className="truncate">{selectedCategoryName}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              {categories.map((category) => (
                <motion.li
                  key={category.id}
                  className={`px-4 py-2 cursor-pointer ${
                    selectedCategory === category.id
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  whileHover={{ x: 5 }}
                  onClick={() => handleCategorySelect(category.id)}
                  onMouseEnter={onHover}
                >
                  {category.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}