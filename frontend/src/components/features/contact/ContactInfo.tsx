'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Phone, Mail, MapPin, Clock, QrCode } from 'lucide-react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

// Register TextPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin)
}

export default function ContactInfo() {
  const { theme } = useTheme()
  const phoneRef = useRef(null)
  const emailRef = useRef(null)
  const addressRef = useRef(null)
  const qrCodeRef = useRef(null)

  useEffect(() => {
    // Animate contact details with typing effect
    const textElements = [phoneRef, emailRef, addressRef]
    const textValues = ['+91 90803 81686', 'bharatsamarthatrust@gmail.com', 'Chennai']
    
    textElements.forEach((ref, index) => {
      if (ref.current) {
        gsap.to(ref.current, {
          duration: 1.5,
          text: textValues[index],
          delay: 0.5 + (index * 0.5),
          ease: 'none',
        })
      }
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}
    >
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        Contact Information
      </h2>
      
      <div className="space-y-6">
        {/* Phone */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Phone className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="opacity-80" ref={phoneRef}></p>
          </div>
        </motion.div>
        
        {/* Email */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Mail className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="opacity-80" ref={emailRef}></p>
          </div>
        </motion.div>
        
        {/* Address */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <MapPin className={`w-6 h-6 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="opacity-80" ref={addressRef}></p>
          </div>
        </motion.div>
        
        {/* Hours */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
            <Clock className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`} />
          </div>
          <div>
            <h3 className="font-medium">Hours</h3>
            <p className="opacity-80">Mon-Fri: 9am - 5pm</p>
            <p className="opacity-80">Sat: 10am - 2pm</p>
          </div>
        </motion.div>
        
        {/* QR Code */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
            <QrCode className={`w-6 h-6 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`} />
          </div>
          <div>
            <h3 className="font-medium">Scan QR Code</h3>
            <p className="opacity-80">Scan to save our contact info</p>
          </div>
          <div className="ml-auto" ref={qrCodeRef}>
            <div className={`w-16 h-16 border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg p-1`}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 grid grid-cols-3 grid-rows-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`${Math.random() > 0.5 ? 'bg-current' : 'bg-transparent'} ${i === 0 || i === 2 || i === 6 || i === 8 ? 'bg-current' : ''}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}