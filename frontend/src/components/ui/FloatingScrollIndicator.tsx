// components/ui/FloatingScrollIndicator.tsx
'use client'

import { useEffect, useState } from 'react';
import { motion, useTransform } from 'framer-motion';

interface FloatingScrollIndicatorProps {
  scrollYProgress: any; // Using any type for the framer-motion scrollYProgress
}

export default function FloatingScrollIndicator({ scrollYProgress }: FloatingScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Create a derived motion value for the stroke dash offset
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [150.8, 0]);
  
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Progress circle */}
        <svg width="60" height="60" className="transform -rotate-90">
          <circle
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            className="dark:stroke-gray-700"
          />
          <motion.circle
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="4"
            strokeDasharray="150.8"
            style={{ strokeDashoffset }}
            className="drop-shadow-lg"
          />
        </svg>
        
        {/* Scroll to top button */}
        <motion.button
          onClick={scrollToTop}
          className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-purple-600 dark:text-purple-400" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}