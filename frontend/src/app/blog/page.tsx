'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

// Components
import BlogHero from '@/components/features/blog/BlogHero';
import BlogCard from '@/components/features/blog/BlogCard';
import SearchBar from '@/components/features/blog/SearchBar';
import CategoryFilter from '@/components/features/blog/CategoryFilter';
import NewsletterSignup from '@/components/features/blog/NewsletterSignup';
import TrendingSection from '@/components/features/blog/TrendingSection';
import AudioPlayer from '@/components/features/blog/AudioPlayer';
import ThemeToggle from '@/components/ui/ThemeToggle';
import FloatingScrollIndicator from '@/components/ui/FloatingScrollIndicator';

// Hooks
import useLayout from '@/hooks/useLayout';
import useSoundEffects from '@/hooks/useSoundEffects';

// Types
import { BlogPost } from '@/types/blog';

// Data
import { featuredBlog, trendingBlogs, blogPosts } from '@/data/blogData';

export default function BlogPage() {
  // State
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  
  // Refs
  const blogGridRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { layout, setLayout } = useLayout();
  const { theme, setTheme } = useTheme();
  const { playHoverSound, playClickSound } = useSoundEffects(soundEnabled);
  
  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize animations
    const blogCards = document.querySelectorAll('.blog-card');
    
    gsap.fromTo(blogCards, 
      { y: 100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.15,
        scrollTrigger: {
          trigger: blogGridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
    
    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredPosts, layout]);
  
  // Scroll animation for progress indicator
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"]
  });
  
  // Filter blogs based on category and search query
  useEffect(() => {
    let results = blogPosts;
    
    if (category !== 'all') {
      results = results.filter(post => post.category === category);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(results);
  }, [category, searchQuery]);
  
  // Layout variants for container animation
  const containerVariants = {
    grid: { 
      transition: { staggerChildren: 0.1 }
    },
    list: {
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Hero Section with parallax effect */}
      <BlogHero 
        featuredBlog={featuredBlog} 
        onSoundToggle={() => setSoundEnabled(prev => !prev)}
        soundEnabled={soundEnabled}
      />
      
      {/* Main blog content */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        {/* Controls and filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              onHover={playHoverSound}
              onButtonClick={playClickSound}
            />
            <CategoryFilter 
              selectedCategory={category} 
              onSelectCategory={setCategory} 
              onHover={playHoverSound}
              onClick={playClickSound}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                className={`p-2 rounded ${layout === 'grid' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-500 dark:text-gray-300'}`}
                onClick={() => {
                  setLayout('grid');
                  playClickSound();
                }}
                onMouseEnter={playHoverSound}
                aria-label="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
              <button
                className={`p-2 rounded ${layout === 'list' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-500 dark:text-gray-300'}`}
                onClick={() => {
                  setLayout('list');
                  playClickSound();
                }}
                onMouseEnter={playHoverSound}
                aria-label="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Trending section */}
        <TrendingSection 
          blogs={trendingBlogs} 
          onHover={playHoverSound}
          onClick={playClickSound}
        />
        
        {/* Blog grid */}
        <motion.div
          ref={blogGridRef}
          className={`mt-16 ${
            layout === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'flex flex-col gap-8'
          }`}
          variants={containerVariants}
          initial="hidden"
          animate={layout === 'grid' ? 'grid' : 'list'}
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                layout={layout}
                index={index}
                onHover={playHoverSound}
                onClick={playClickSound}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full p-10 text-center bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4">No blog posts found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Newsletter Signup - Appears after scrolling 50% */}
        <NewsletterSignup scrollYProgress={scrollYProgress} />
      </section>
      
      {/* Audio player for ambient sound */}
      {soundEnabled && <AudioPlayer />}
      
      {/* Floating scroll indicator */}
      <FloatingScrollIndicator scrollYProgress={scrollYProgress} />
    </div>
  );
}