// components/features/blog/BlogCard.tsx
'use client'

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  layout: 'grid' | 'list';
  index: number;
  onHover: () => void;
  onClick: () => void;
}

export default function BlogCard({ post, layout, index, onHover, onClick }: BlogCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      
      // Calculate the mouse position relative to the center of the card
      const x = (e.clientY - rect.top - rect.height / 2) / 15;
      const y = -(e.clientX - rect.left - rect.width / 2) / 15;
      
      setRotation({ x, y });
      onHover();
    }
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  // Define different animations for grid and list layouts
  const gridCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1
      }
    }
  };
  
  const listCardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.05
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`blog-card relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-500 ${
        layout === 'grid' ? 'h-full' : 'flex flex-col md:flex-row w-full'
      }`}
      variants={layout === 'grid' ? gridCardVariants : listCardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -10 }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image container */}
      <div 
        className={`relative overflow-hidden ${
          layout === 'grid' 
            ? 'h-48 md:h-56' 
            : 'md:w-1/3 h-48 md:h-auto'
        }`}
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-110"
          sizes={layout === 'grid' ? '(max-width: 768px) 100vw, 33vw' : '(max-width: 768px) 100vw, 50vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category tag */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
          {post.category}
        </span>
      </div>
      
      {/* Content */}
      <div 
        className={`relative flex-1 ${
          layout === 'grid' ? 'p-6' : 'p-6 md:p-8'
        }`}
      >
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{post.publishDate}</span>
          <span>{post.readTime} min read</span>
        </div>
        
        <motion.h2 
          className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white"
          whileHover={{ scale: 1.02 }}
        >
          <Link 
            href={`/blog/${post.slug}`} 
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            onClick={onClick}
          >
            {post.title}
          </Link>
        </motion.h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {post.author.name}
            </span>
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
            onClick={onClick}
            onMouseEnter={onHover}
          >
            Read more
          </Link>
        </div>
        
        {/* Glassmorphism glow effect overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr from-purple-500/5 to-blue-500/10" />
      </div>
    </motion.div>
  );
}