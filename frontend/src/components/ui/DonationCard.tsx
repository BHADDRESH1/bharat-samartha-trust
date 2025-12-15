'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';

interface DonationCardProps {
  amount: number
  description: string
  icon: string
  selected: boolean
  onSelect: () => void
}

export default function DonationCard({ 
  amount, 
  description, 
  icon, 
  selected, 
  onSelect 
}: DonationCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        selected ? 'border-purple-600 bg-purple-50' : 'border-gray-200 bg-white'
      }`}
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      }}
      animate={selected ? {
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
      } : {
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
      }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <span className="text-2xl">{icon}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-1">₹{amount.toLocaleString()}</h3>
        
        <p className="text-gray-600 text-sm">{description}</p>
        
        {selected && (
          <motion.div
            className="mt-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <motion.div
              className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center"
              animate={isHovered ? {
                scale: [1, 1.2, 1],
                transition: { repeat: Infinity, repeatDelay: 1 }
              } : {}}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {isHovered && !selected && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ 
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%)',
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
      )}
    </motion.div>
  )
}