// components/features/blog/TrendingSection.tsx
'use client'

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { BlogPost } from '@/types/blog';

interface TrendingSectionProps {
  blogs: BlogPost[];
  onHover: () => void;
  onClick: () => void;
}

export default function TrendingSection({ blogs, onHover, onClick }: TrendingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Horizontal scroll animation
    if (cardsRef.current && sectionRef.current) {
      const cards = cardsRef.current.querySelectorAll('.trending-card');
      
      gsap.fromTo(cards, 
        { x: 100, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out"
        }
      );
    }
  }, []);
  
  return (
    <div ref={sectionRef} className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Trending Articles
        </motion.h2>
        <motion.div
          className="flex items-center text-purple-600 dark:text-purple-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            href="/blog/trending" 
            className="flex items-center hover:underline"
            onMouseEnter={onHover}
            onClick={onClick}
          >
            View All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
      
      <div 
        ref={cardsRef}
        className="flex space-x-6 overflow-x-auto hide-scrollbar pb-4"
      >
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            className="trending-card flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onMouseEnter={onHover}
          >
            <Link href={`/blog/${blog.slug}`} onClick={onClick}>
              <div className="relative h-40">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {blog.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
                  {blog.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{blog.readTime} min read</span>
                  <span className="mx-2">•</span>
                  <span>{blog.publishDate}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}