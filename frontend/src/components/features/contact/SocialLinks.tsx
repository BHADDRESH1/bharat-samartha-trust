'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react'
import gsap from 'gsap'

export default function SocialLinks() {
  const { theme } = useTheme()
  const socialLinksRef = useRef(null)

  useEffect(() => {
    if (socialLinksRef.current) {
      // Create hover animations for social icons
      const icons = socialLinksRef.current.querySelectorAll('.social-icon')
      
      icons.forEach((icon) => {
        icon.addEventListener('mouseenter', () => {
          gsap.to(icon, {
            scale: 1.2,
            duration: 0.3,
            ease: 'back.out(1.7)'
          })
          
          gsap.to(icon.querySelector('.icon-glow'), {
            opacity: 0.8,
            duration: 0.3
          })
        })
        
        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
          
          gsap.to(icon.querySelector('.icon-glow'), {
            opacity: 0,
            duration: 0.3
          })
        })
      })
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const socialIcons = [
    { icon: Facebook, color: 'bg-blue-500', name: 'Facebook' },
    { icon: Twitter, color: 'bg-sky-400', name: 'Twitter' },
    { icon: Instagram, color: 'bg-pink-500', name: 'Instagram' },
    { icon: Linkedin, color: 'bg-blue-600', name: 'LinkedIn' },
    { icon: Youtube, color: 'bg-red-500', name: 'YouTube' },
    { icon: MessageCircle, color: 'bg-green-500', name: 'WhatsApp' }
  ]

  return (
    <div className={`rounded-2xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Connect With Us
      </h2>
      
      <div className="mb-8">
        <p className="opacity-80">Follow us on social media and join our community to stay updated with our latest initiatives and events.</p>
      </div>
      
      <motion.div 
        ref={socialLinksRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4"
      >
        {socialIcons.map((social, index) => (
          <motion.a
            key={index}
            href="#"
            variants={itemVariants}
            className={`social-icon flex flex-col items-center justify-center p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'} relative overflow-hidden`}
          >
            <div className={`icon-glow absolute inset-0 opacity-0 ${social.color} blur-xl`}></div>
            <div className={`relative z-10 p-3 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-2`}>
              <social.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
            </div>
            <span className="text-sm font-medium relative z-10">{social.name}</span>
          </motion.a>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`mt-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-blue-800' : 'border-blue-100'}`}
      >
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} mr-2`}></div>
          <p className="text-sm font-medium">We typically respond within 30 minutes</p>
        </div>
      </motion.div>
    </div>
  )
}