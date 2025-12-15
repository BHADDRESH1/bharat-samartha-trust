'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Community Member',
    quote: 'The clean water initiative transformed our village. Our children are healthier, and we no longer have to walk miles for clean water. Thank you for changing our lives.',
    image: '/images/testimonials/person1.jpg',
  },
  {
    id: 2,
    name: 'Michael Osei',
    role: 'School Teacher',
    quote: 'The new school building and resources have made such a difference. Our students now have access to quality education and are excelling beyond our expectations.',
    image: '/images/testimonials/person2.jpg',
  },
  {
    id: 3,
    name: 'Aadhya Patel',
    role: 'Healthcare Recipient',
    quote: 'The mobile medical camp detected my condition early and provided treatment I could not afford. I am forever grateful for the care I received.',
    image: '/images/testimonials/person3.jpg',
  }
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  
  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prevCurrent => (prevCurrent + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setCurrent(prevCurrent => (prevCurrent + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setCurrent(prevCurrent => (prevCurrent - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl p-8 md:p-12 relative"
        >
          <Quote className="w-12 h-12 text-purple-400 opacity-30 mb-4" />
          
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            "{testimonials[current].quote}"
          </p>
          
          <div className="flex items-center">
            <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4">
              <Image
                src={testimonials[current].image}
                alt={testimonials[current].name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-white">{testimonials[current].name}</h4>
              <p className="text-gray-400">{testimonials[current].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation buttons */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                current === index ? 'bg-white w-4' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}