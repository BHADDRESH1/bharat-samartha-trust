'use client'

import { useState } from 'react'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet'

interface PaymentOptionsProps {
  onSelectMethod: (method: PaymentMethod) => void
  selectedMethod: PaymentMethod
}

export default function PaymentOptions({ onSelectMethod, selectedMethod }: PaymentOptionsProps) {
  const methods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'upi', name: 'UPI', icon: 'upi' },
    { id: 'netbanking', name: 'Net Banking', icon: 'bank' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'wallet' }
  ]
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  }
  
  // For the wallet options
  const walletOptions = [
    { id: 'googlepay', name: 'Google Pay', logo: '/icons/google-pay.svg' },
    { id: 'phonepe', name: 'PhonePe', logo: '/icons/phonepe.svg' },
    { id: 'paytm', name: 'Paytm', logo: '/icons/paytm.svg' }
  ]
  
  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'credit-card':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'upi':
        return (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 5L5 19" />
            <path d="M7 5h12v12" />
          </svg>
        )
      case 'bank':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        )
      case 'wallet':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {methods.map((method) => (
          <motion.button
            key={method.id}
            className={`py-4 px-3 rounded-lg border-2 flex flex-col items-center justify-center transition duration-300 ${
              selectedMethod === method.id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectMethod(method.id as PaymentMethod)}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              selectedMethod === method.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {renderIcon(method.icon)}
            </div>
            <span className="text-sm font-medium">{method.name}</span>
          </motion.button>
        ))}
      </motion.div>
      
      {/* Render additional payment options based on selected method */}
      <AnimatePresence>
        {selectedMethod === 'wallet' && (
          <motion.div
            className="mt-6 grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {walletOptions.map((wallet) => (
              <motion.button
                key={wallet.id}
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 relative">
                    {/* Placeholder for wallet logo - in a real app, use actual logos */}
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">{wallet.name.charAt(0)}</div>
                  </div>
                  <span className="text-sm font-medium">{wallet.name}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {selectedMethod === 'upi' && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              {/* Placeholder for QR code - in a real app, generate actual QR code */}
              <div className="w-48 h-48 bg-white p-2 flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-200 rounded-md grid grid-cols-5 grid-rows-5 gap-1">
                  {Array.from({ length: 25 }).map((_, index) => (
                    <div key={index} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}></div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">Scan with any UPI app to donate</p>
            <p className="text-sm font-semibold">UPI ID: donate@yourorg</p>
          </div>
        </motion.div>
      )}
      
      {selectedMethod === 'card' && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input 
                type="text" 
                id="cardNumber" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input 
                  type="text" 
                  id="expiryDate" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input 
                  type="text" 
                  id="cvv" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
              <input 
                type="text" 
                id="cardName" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="John Doe"
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {selectedMethod === 'netbanking' && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB', 'BOI'].map((bank) => (
              <motion.button
                key={bank}
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs mr-2">{bank.charAt(0)}</div>
                  <span className="text-sm font-medium">{bank} Bank</span>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="otherBank" className="block text-sm font-medium text-gray-700 mb-1">Other Banks</label>
            <select 
              id="otherBank" 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            >
              <option value="">Select your bank</option>
              <option value="yes">Yes Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="idfc">IDFC First Bank</option>
              <option value="federal">Federal Bank</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  )
}