// components/features/blog/BlogHero.tsx
'use client'

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { BlogPost } from '@/types/blog';

interface BlogHeroProps {
  featuredBlog: BlogPost;
  onSoundToggle: () => void;
  soundEnabled: boolean;
}

export default function BlogHero({ featuredBlog, onSoundToggle, soundEnabled }: BlogHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
  // GSAP animations
  useEffect(() => {
    // Spotlight effect
    if (containerRef.current) {
      const spotlight = document.createElement('div');
      spotlight.className = 'absolute w-40 h-40 rounded-full opacity-30 pointer-events-none bg-white filter blur-xl';
      spotlight.style.display = 'none';
      containerRef.current.appendChild(spotlight);
      
      const moveSpotlight = (e: MouseEvent) => {
        const rect = containerRef.current!.getBoundingClientRect();
        spotlight.style.display = 'block';
        spotlight.style.left = `${e.clientX - rect.left - 80}px`;
        spotlight.style.top = `${e.clientY - rect.top - 80}px`;
      };
      
      containerRef.current.addEventListener('mousemove', moveSpotlight);
      containerRef.current.addEventListener('mouseleave', () => {
        spotlight.style.display = 'none';
      });
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', moveSpotlight);
          containerRef.current.removeEventListener('mouseleave', () => {});
          spotlight.remove();
        }
      };
    }
  }, []);
  
  return (
    <div ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Parallax background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <Image 
          src={featuredBlog.coverImage}
          alt={featuredBlog.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
      </motion.div>
      
      <div className="container relative z-20 mx-auto px-4 h-full flex items-center">
        <motion.div 
          ref={containerRef}
          className="relative max-w-3xl mx-auto bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl"
          style={{ opacity }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            delay: 0.2 
          }}
        >
          <span className="inline-block px-4 py-1 bg-purple-500 text-white rounded-full text-sm mb-6">
            Featured Article
          </span>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {featuredBlog.title}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {featuredBlog.excerpt}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              href={`/blog/${featuredBlog.slug}`}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Read Now
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image 
                  src={featuredBlog.author.avatar}
                  alt={featuredBlog.author.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <span className="text-white">{featuredBlog.author.name}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">{featuredBlog.readTime} min read</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Sound toggle button */}
      <motion.button
        className="absolute bottom-8 right-8 z-30 p-4 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors duration-300"
        onClick={onSoundToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={soundEnabled ? "Disable ambient sound" : "Enable ambient sound"}
      >
        {soundEnabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
          </svg>
        )}
      </motion.button>
    </div>
  );
}