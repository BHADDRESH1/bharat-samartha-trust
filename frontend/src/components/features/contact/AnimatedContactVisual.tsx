'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import gsap from 'gsap'

// Define organization highlights
const HIGHLIGHTS = [
  { id: 1, title: 'Our Mission', description: 'Creating positive change through community engagement and sustainable practices.' },
  { id: 2, title: 'Our Impact', description: 'Transforming lives across India with innovative solutions and dedicated service.' },
  { id: 3, title: 'Join Our Cause', description: 'Be part of a movement that is making a difference in communities nationwide.' },
  { id: 4, title: 'Our Network', description: 'Connected across Mumbai, Delhi, Bangalore, Chennai, and beyond.' },
]

export default function AnimatedContactVisual() {
  const { theme } = useTheme()
  const containerRef = useRef(null)
  const [selectedHighlight, setSelectedHighlight] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    if (isLoaded && containerRef.current) {
      // Initialize animations
      gsap.to('.floating-circle', {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: 'sine.inOut'
      })
      
      gsap.to('.pulse-circle', {
        scale: 1.2,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'power1.out'
      })
      
      gsap.to('.rotating-element', {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: 'none'
      })
    }
  }, [isLoaded])
  
  const handleHighlightClick = (highlight) => {
    setSelectedHighlight(highlight)
    
    // Animate selection effect
    gsap.to('.highlight-element', {
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to('.highlight-element', {
          scale: 1,
          duration: 0.3,
          ease: 'power2.in'
        })
      }
    })
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}
    >
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Rotating Mesh */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rotating-element w-[150%] h-[150%] opacity-10">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke={theme === 'dark' ? '#4f88e5' : '#2563eb'} strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </div>
          
          {/* Flowing Circles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="floating-circle absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}rem`,
                height: `${Math.random() * 3 + 1}rem`,
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                opacity: Math.random() * 0.15 + 0.05,
                background: `${theme === 'dark' ? 
                  `radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0) 70%)` : 
                  `radial-gradient(circle, rgba(37, 99, 235, 0.6) 0%, rgba(37, 99, 235, 0) 70%)`
                }`,
                transformOrigin: 'center',
                zIndex: 1
              }}
            />
          ))}
          
          {/* Pulse Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <div className="pulse-circle absolute inset-0 rounded-full bg-blue-400 opacity-20"></div>
              <div className="pulse-circle absolute inset-0 rounded-full bg-blue-400 opacity-20" style={{ animationDelay: '0.5s' }}></div>
              <div className="pulse-circle absolute inset-0 rounded-full bg-blue-400 opacity-20" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
        
        {/* India Outline (stylized) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <svg width="60%" height="60%" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
            <path
              d="M150,50 C180,60 200,80 220,100 C240,120 250,150 240,180 C230,210 200,230 170,240 C140,250 110,240 90,220 C70,200 60,170 70,140 C80,110 110,80 150,50 Z"
              fill="none"
              stroke={theme === 'dark' ? '#4f88e5' : '#2563eb'}
              strokeWidth="2"
            />
          </svg>
        </div>
      </motion.div>
      
      {/* Highlight Elements */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-6"
        >
          <h2 className={`text-xl md:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Connecting Communities
            </span>
          </h2>
          <p className={`text-sm max-w-sm mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Touch an element to learn more about our organization
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 px-4 w-full max-w-md">
          {HIGHLIGHTS.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              className={`highlight-element p-4 rounded-lg cursor-pointer shadow-lg backdrop-blur-sm ${
                theme === 'dark' ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-white/80 hover:bg-blue-50/90'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleHighlightClick(highlight)}
            >
              <h3 className={`text-sm font-bold mb-1 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                {highlight.title}
              </h3>
              <div className={`w-8 h-1 mb-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Information Overlay */}
      <AnimatePresence>
        {selectedHighlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute bottom-4 left-4 right-4 p-4 rounded-lg shadow-lg z-20 ${
              theme === 'dark' ? 'bg-gray-800/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
            }`}
          >
            <h3 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {selectedHighlight.title}
            </h3>
            <p className={`text-sm opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {selectedHighlight.description}
            </p>
            <div className="flex gap-2 mt-2">
              <button className={`px-3 py-1 rounded-full text-xs ${
                theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                Learn More
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => setSelectedHighlight(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}