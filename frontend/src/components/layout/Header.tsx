'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Globe } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Causes', href: '/causes' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled more than threshold
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide on scroll down, show menu icon instead
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Don't render animated components on server to prevent hydration errors
  if (!isClient) {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          false
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <div className="mr-3">
                <Globe 
                  size={36} 
                  className="text-white group-hover:text-violet-400 transition-colors" 
                />
              </div>
              <div>
                <span className="font-bold text-3xl text-white group-hover:text-violet-400 transition-colors">
                  Bharat Samarth Trust
                </span>
                <div className="text-sm font-medium text-violet-200 transition-colors">
                  Changing Lives Worldwide
                </div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 pr-8">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link 
                    href={item.href}
                    className="font-medium text-base text-white"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
              <div>
                <Link 
                  href="/donate"
                  className="ml-4 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-medium transition shadow-lg flex items-center gap-2"
                >
                  <Heart size={18} />
                  <span>Donate Now</span>
                </Link>
              </div>
            </nav>
            
            <button
              className="md:hidden p-3 rounded-lg"
            >
              <Menu className="text-white w-8 h-8" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Enhanced Floating Menu Button when navbar hides */}
      <motion.div 
        className={`fixed top-6 right-6 z-50 ${isVisible && !isScrolled ? 'hidden' : ''}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible || !isScrolled ? 0 : 1,
          scale: isVisible || !isScrolled ? 0.8 : 1,
          y: isVisible || !isScrolled ? -20 : 0
        }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          className="p-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl hover:shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500 transition-all"
          onClick={toggleMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={28} />
        </button>
      </motion.div>
      
      {/* Enhanced Main Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-6'
        }`}
        initial={{ y: 0 }}
        animate={{ 
          y: isVisible || !isScrolled ? 0 : -120
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo with Animation */}
            <Link href="/" className="flex items-center group">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="mr-3"
              >
                <Globe 
                  size={36} 
                  className={`${isScrolled ? 'text-violet-600' : 'text-white'} group-hover:text-violet-400 transition-colors`} 
                />
              </motion.div>
              <div>
                <motion.span 
                  className={`font-bold text-3xl ${isScrolled ? 'text-violet-600' : 'text-white'} group-hover:text-violet-400 transition-colors`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Bharat Samarth Trust
                </motion.span>
                <motion.div 
                  className={`text-sm font-medium ${isScrolled ? 'text-violet-400' : 'text-violet-200'} transition-colors`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Changing Lives Worldwide
                </motion.div>
              </div>
            </Link>
            
            {/* Desktop Navigation - Adjusted size and position, removed underline animation */}
            <nav className="hidden md:flex items-center gap-8 pr-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    href={item.href}
                    className={`font-medium text-base hover:text-violet-500 transition-colors ${
                      isScrolled ? 'text-gray-800' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/donate"
                  className="ml-4 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-full font-medium transition shadow-lg hover:shadow-violet-500/30 flex items-center gap-2"
                >
                  <Heart size={18} className="animate-pulse" />
                  <span>Donate Now</span>
                </Link>
              </motion.div>
            </nav>
            
            {/* Enhanced Mobile Menu Button */}
            <motion.button
              className="md:hidden p-3 rounded-lg"
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className={`${isScrolled ? 'text-gray-800' : 'text-white'} w-8 h-8`} />
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      {/* Enhanced Fullscreen Popup Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Enhanced Animated Background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Larger and more animated circles in background */}
              <motion.div 
                className="absolute w-96 h-96 rounded-full bg-violet-600/30 blur-3xl"
                initial={{ x: '-50%', y: '-50%', scale: 0 }}
                animate={{ 
                  x: ['0%', '80%', '20%', '50%'], 
                  y: ['0%', '40%', '80%', '30%'], 
                  scale: [0, 2, 2.5, 2.2],
                  transition: { 
                    duration: 12, 
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
              />
              <motion.div 
                className="absolute w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"
                initial={{ x: '100%', y: '100%', scale: 0 }}
                animate={{ 
                  x: ['100%', '30%', '70%', '20%'], 
                  y: ['100%', '30%', '10%', '70%'], 
                  scale: [0, 2.2, 1.8, 2.5],
                  transition: { 
                    duration: 15, 
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
              />
              <motion.div 
                className="absolute w-full h-full rounded-full bg-purple-500/20 blur-3xl"
                initial={{ x: '50%', y: '50%', scale: 0 }}
                animate={{ 
                  x: ['50%', '10%', '60%', '40%'], 
                  y: ['50%', '80%', '30%', '60%'], 
                  scale: [0, 1.8, 2.2, 2],
                  transition: { 
                    duration: 18, 
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
              />
            </motion.div>
            
            {/* Enhanced Close button with animation */}
            <motion.button
              className="absolute top-8 right-8 text-white p-3 z-10 bg-white/10 backdrop-blur-sm rounded-full"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={32} />
            </motion.button>
            
            {/* Enhanced Navigation links - Shifted left and removed donate button */}
            <motion.nav 
              className="flex flex-col items-center justify-center h-full relative z-10 pr-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ 
                    delay: 0.15 + index * 0.12,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 110
                  }}
                  whileHover={{ scale: 1.1, x: 10 }}
                >
                  <Link 
                    href={item.href}
                    className="font-medium text-white text-3xl sm:text-4xl hover:text-violet-300 transition-colors block py-4 tracking-wide"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}