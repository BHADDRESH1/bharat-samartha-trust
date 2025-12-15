'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Event } from '@/types/event';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock, FaShare } from 'react-icons/fa';
import confetti from 'canvas-confetti';

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    specialNeeds: '',
    dietaryRestrictions: ''
  });
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (timeString: string) => {
    return timeString;
  };
  
  // Format location
  const formatLocation = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object' && location !== null) {
      // Format the location object as a string
      return `${location.name}, ${location.address}, ${location.city}, ${location.state} ${location.zip}`;
    }
    
    return 'Location unavailable';
  };
  
  // Get days remaining
  const getDaysRemaining = () => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle registration submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registrationStep < 3) {
      setRegistrationStep(registrationStep + 1);
    } else {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Success step
      setRegistrationStep(4);
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {!isRegistering ? (
            <div className="flex flex-col md:flex-row h-full">
              {/* Event Details */}
              <div className="md:w-1/2 overflow-y-auto">
                <div className="relative h-64 md:h-80">
                  <Image 
                    src={event.imageUrl} 
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {event.category}
                    </span>
                    <h2 className="text-white text-2xl font-bold">{event.title}</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-purple-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2 text-purple-600" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-purple-600" />
                      <span>{formatLocation(event.location)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 text-purple-600" />
                      <span>{event.currentAttendees} attending</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">About This Event</h3>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                  
                  {event.schedule && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Event Schedule</h3>
                      <ul className="space-y-3">
                        {event.schedule.map((item, index) => (
                          <li key={index} className="flex">
                            <div className="mr-4 flex flex-col items-center">
                              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                              {index < event.schedule.length - 1 && (
                                <div className="w-0.5 h-full bg-purple-200"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.time}</p>
                              <p className="text-gray-600">{item.activity}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.organizer && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Organized By</h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative mr-3">
                          {event.organizer.avatar && (
                            <Image 
                              src={event.organizer.avatar} 
                              alt={event.organizer.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.organizer.name}</p>
                          <p className="text-gray-500 text-sm">{event.organizer.role}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Registration Details */}
              <div className="md:w-1/2 bg-gray-50 p-6 overflow-y-auto">
                <div className="sticky top-0">
                  <h3 className="text-xl font-bold mb-2">Registration Details</h3>
                  
                  {daysRemaining > 0 && (
                    <div className="mb-6">
                      <p className="text-lg font-medium mb-2">Event starts in</p>
                      <div className="flex gap-4">
                        <div className="bg-white px-4 py-3 rounded-lg shadow-sm text-center flex-1">
                          <div className="text-2xl font-bold text-purple-600">{Math.floor(daysRemaining)}</div>
                          <div className="text-xs text-gray-500">Days</div>
                        </div>
                        <div className="bg-white px-4 py-3 rounded-lg shadow-sm text-center flex-1">
                          <div className="text-2xl font-bold text-purple-600">{Math.floor((daysRemaining % 1) * 24)}</div>
                          <div className="text-xs text-gray-500">Hours</div>
                        </div>
                        <div className="bg-white px-4 py-3 rounded-lg shadow-sm text-center flex-1">
                          <div className="text-2xl font-bold text-purple-600">{Math.floor((daysRemaining % 1) * 24 * 60) % 60}</div>
                          <div className="text-xs text-gray-500">Minutes</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Available spots</span>
                      <span className="font-medium">{event.maxAttendees - event.currentAttendees} of {event.maxAttendees}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {event.maxAttendees - event.currentAttendees === 0 
                        ? "Sorry, this event is fully booked." 
                        : `Hurry! Only ${event.maxAttendees - event.currentAttendees} spots left.`}
                    </p>
                  </div>
                  
                  {event.price > 0 ? (
                    <div className="mb-6">
                      <h4 className="font-medium mb-1">Participation Fee</h4>
                      <p className="text-2xl font-bold text-purple-800">${event.price.toFixed(2)}</p>
                      {event.priceDetails && (
                        <p className="text-sm text-gray-500 mt-1">{event.priceDetails}</p>
                      )}
                    </div>
                  ) : (
                    <div className="mb-6">
                      <h4 className="font-medium mb-1">Participation Fee</h4>
                      <p className="text-2xl font-bold text-green-600">Free</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-4">
                    <motion.button
                      onClick={() => setIsRegistering(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={event.maxAttendees - event.currentAttendees === 0}
                    >
                      Register Now
                    </motion.button>
                    
                    <button className="flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 py-3 rounded-lg font-medium text-gray-600">
                      <FaShare className="text-purple-600" /> 
                      Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 overflow-y-auto">
              {registrationStep < 4 ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Event Registration</h2>
                      {registrationStep < 4 && (
                        <div className="text-sm text-gray-500">Step {registrationStep} of 3</div>
                      )}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(registrationStep / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {registrationStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {registrationStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                              Number of Participants *
                            </label>
                            <select
                              id="participants"
                              name="participants"
                              value={formData.participants}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              {[...Array(5)].map((_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700 mb-1">
                              Special Needs (Optional)
                            </label>
                            <textarea
                              id="specialNeeds"
                              name="specialNeeds"
                              value={formData.specialNeeds}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Any accessibility requirements or special needs?"
                            ></textarea>
                          </div>
                          
                          <div>
                            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
                              Dietary Restrictions (Optional)
                            </label>
                            <textarea
                              id="dietaryRestrictions"
                              name="dietaryRestrictions"
                              value={formData.dietaryRestrictions}
                              onChange={handleInputChange}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Any dietary restrictions or allergies?"
                            ></textarea>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {registrationStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <h4 className="font-medium text-lg mb-2">{event.title}</h4>
                          <div className="flex items-center text-gray-600 mb-1">
                            <FaCalendarAlt className="mr-2 text-purple-600" />
                            <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaMapMarkerAlt className="mr-2 text-purple-600" />
                            <span>{formatLocation(event.location)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between pb-2 border-b border-gray-200">
                            <span className="text-gray-600">Name</span>
                            <span className="font-medium">{formData.name}</span>
                          </div>
                          
                          <div className="flex justify-between pb-2 border-b border-gray-200">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium">{formData.email}</span>
                          </div>
                          
                          <div className="flex justify-between pb-2 border-b border-gray-200">
                            <span className="text-gray-600">Phone</span>
                            <span className="font-medium">{formData.phone}</span>
                          </div>
                          
                          <div className="flex justify-between pb-2 border-b border-gray-200">
                            <span className="text-gray-600">Participants</span>
                            <span className="font-medium">{formData.participants}</span>
                          </div>
                          
                          {formData.specialNeeds && (
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Special Needs</span>
                              <span className="font-medium">{formData.specialNeeds}</span>
                            </div>
                          )}
                          
                          {formData.dietaryRestrictions && (
                            <div className="flex justify-between pb-2 border-b border-gray-200">
                              <span className="text-gray-600">Dietary Restrictions</span>
                              <span className="font-medium">{formData.dietaryRestrictions}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex justify-between mt-8">
                    {registrationStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setRegistrationStep(registrationStep - 1)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Previous
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>)}
                    
                    <motion.button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {registrationStep < 3 ? 'Next' : 'Register'}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <motion.div
                  key="success"
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                  <p className="text-gray-600 mb-8">We've sent a confirmation email to <span className="font-medium">{formData.email}</span></p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-sm mx-auto">
                    <h3 className="font-medium mb-4">Event Details</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaCalendarAlt className="mr-2 text-purple-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaClock className="mr-2 text-purple-600" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-purple-600" />
                      <span>{formatLocation(event.location)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={onClose}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        navigator.share({
                          title: event.title,
                          text: `Join me at ${event.title}!`,
                          url: window.location.href
                        }).catch(err => console.error('Error sharing:', err));
                      }}
                      className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShare /> Share
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;