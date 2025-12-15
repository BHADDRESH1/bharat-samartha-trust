'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [focused, setFocused] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  
  const formRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    subject: useRef(null),
    message: useRef(null)
  }

  // GSAP shake animation for errors
  const shakeElement = (element: any) => {
    gsap.to(element, {
      x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFocus = (name: string) => {
    setFocused(prev => ({ ...prev, [name]: true }))
  }

  const handleBlur = (name: string) => {
    setFocused(prev => ({ ...prev, [name]: false }))
    
    // Validate on blur
    validateField(name, formData[name as keyof FormData])
  }

  const validateField = (name: string, value: string) => {
    let error = ''
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required'
        break
      case 'email':
        if (!value.trim()) {
          error = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email'
        }
        break
      case 'message':
        if (!value.trim()) error = 'Message is required'
        break
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
      shakeElement(formRefs[name as keyof typeof formRefs].current)
      return false
    }
    
    return true
  }

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'message']
    let isValid = true
    
    requiredFields.forEach(field => {
      const fieldValid = validateField(field, formData[field as keyof FormData])
      if (!fieldValid) isValid = false
    })
    
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccessful(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        setIsSuccessful(false)
        setIsSubmitting(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
    }
  }

  // Input field styles
  const getInputClass = (field: string) => {
    const baseClass = `w-full bg-transparent border-b-2 px-4 py-3 text-lg transition-all duration-300 outline-none text-gray-800`
    
    if (errors[field]) {
      return `${baseClass} border-red-500`
    }
    
    if (focused[field]) {
      return `${baseClass} border-blue-600`
    }
    
    return `${baseClass} border-gray-300`
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
      
      <AnimatePresence mode="wait">
        {isSuccessful ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
            <p className="text-center">Thank you for reaching out. We'll get back to you shortly.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="relative" ref={formRefs.name}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  className={getInputClass('name')}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className={`absolute left-4 transition-all duration-300 ${
                    formData.name || focused.name
                      ? '-top-6 text-sm text-blue-500'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  Name
                </label>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative" ref={formRefs.email}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  className={getInputClass('email')}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-300 ${
                    formData.email || focused.email
                      ? '-top-6 text-sm text-blue-500'
                      : 'top-3 text-gray-500'
                  }`}
                >
                  Email
                </label>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Phone Input */}
            <div className="relative" ref={formRefs.phone}>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus('phone')}
                onBlur={() => handleBlur('phone')}
                className={getInputClass('phone')}
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className={`absolute left-4 transition-all duration-300 ${
                  formData.phone || focused.phone
                    ? '-top-6 text-sm text-blue-500'
                    : 'top-3 text-gray-500'
                }`}
              >
                Phone (Optional)
              </label>
            </div>

            {/* Subject Input */}
            <div className="relative" ref={formRefs.subject}>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => handleFocus('subject')}
                onBlur={() => handleBlur('subject')}
                className={getInputClass('subject')}
                placeholder=" "
              />
              <label
                htmlFor="subject"
                className={`absolute left-4 transition-all duration-300 ${
                  formData.subject || focused.subject
                    ? '-top-6 text-sm text-blue-500'
                    : 'top-3 text-gray-500'
                }`}
              >
                Subject
              </label>
            </div>

            {/* Message Input */}
            <div className="relative" ref={formRefs.message}>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus('message')}
                onBlur={() => handleBlur('message')}
                className={`${getInputClass('message')} min-h-[120px] resize-y`}
                placeholder=" "
              ></textarea>
              <label
                htmlFor="message"
                className={`absolute left-4 transition-all duration-300 ${
                  formData.message || focused.message
                    ? '-top-6 text-sm text-blue-500'
                    : 'top-3 text-gray-500'
                }`}
              >
                Message
              </label>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`w-full py-4 px-6 rounded-full font-bold text-white text-lg relative overflow-hidden ${
                isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              }}
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </motion.div>
              ) : (
                'Send Message'
              )}
            </motion.button>

            {/* Response Time Indicator */}
            <div className="text-center mt-4 text-sm opacity-80">
              <p>We typically respond within 24 hours</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}