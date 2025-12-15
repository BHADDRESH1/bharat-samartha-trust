// components/features/blog/NewsletterSignup.tsx
'use client'

import { useState } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

interface NewsletterSignupProps {
  scrollYProgress: MotionValue<number>;
}

export default function NewsletterSignup({ scrollYProgress }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Transform the opacity based on scroll progress
  // Only show when user has scrolled 50% of the page
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6], [0, 0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0.4, 0.5], [0.8, 1]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && /^\S+@\S+\.\S+$/.test(email)) {
      setIsAnimating(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
        setIsAnimating(false);
      }, 1500);
    }
  };
  
  return (
    <motion.div 
      className="my-24 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-2xl shadow-xl"
      style={{ opacity, scale }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-xl mx-auto text-center"
      >
        {!isSubmitted ? (
          <>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Stay Updated with Our Latest Articles
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join our newsletter and get fresh content delivered weekly to your inbox.
              No spam, just pure insights to help you grow.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isAnimating}
              >
                {isAnimating ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe'
                )}
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Successfully Subscribed!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for subscribing to our newsletter. You'll receive our latest articles directly in your inbox.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}