// components/features/blog/SearchBar.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onHover: () => void;
  onButtonClick: () => void;
}

export default function SearchBar({ value, onChange, onHover, onButtonClick }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mock search suggestions based on input
  useEffect(() => {
    if (value.trim().length > 1) {
      // Simulated suggestions - in a real app, this would come from an API
      const mockSuggestions = [
        "Design trends",
        "Development tips",
        "Digital marketing",
        "UX research",
        "Tech news",
        "UI animations"
      ].filter(item => item.toLowerCase().includes(value.toLowerCase()));
      
      setSuggestions(mockSuggestions.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [value]);
  
  return (
    <div className="relative w-full md:w-64 lg:w-72">
      <motion.div
        className={`flex items-center bg-white dark:bg-gray-800 border-2 rounded-full overflow-hidden transition-all duration-300 ${
          isFocused ? 'border-purple-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'
        }`}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search articles..."
          className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800 dark:text-gray-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onMouseEnter={onHover}
        />
        <button
          className="p-2 m-1 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
          onClick={() => {
            onButtonClick();
            inputRef.current?.focus();
          }}
          onMouseEnter={onHover}
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </motion.div>
      
      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    onChange(suggestion);
                    onButtonClick();
                  }}
                  onMouseEnter={onHover}
                >
                  {suggestion}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}