'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  achievement: string;
  quote: string;
  category: string;
  rating: number;
  examYear?: string;
  currentRole?: string;
}

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ranjitha',
      location: 'Tamil Nadu',
      avatar: '/api/placeholder/80/80',
      achievement: 'Cleared Group 4 Exams',
      quote: 'Thanks to the free books and study materials, I was able to clear my Group 4 exams on the first attempt. The quality of content is excellent!',
      category: 'TNPSC',
      rating: 5,
      examYear: '2024',
      currentRole: 'Junior Assistant'
    },
    {
      id: 2,
      name: 'Ajay',
      location: 'Chennai',
      avatar: '/api/placeholder/80/80',
      achievement: 'Cracked IBPS PO',
      quote: 'Found a mentor who guided me from zero to cracking IBPS! The mentorship program completely transformed my preparation strategy.',
      category: 'Banking',
      rating: 5,
      examYear: '2023',
      currentRole: 'Probationary Officer at SBI'
    },
    {
      id: 3,
      name: 'Neha',
      location: 'Delhi',
      avatar: '/api/placeholder/80/80',
      achievement: 'Learned Python Programming',
      quote: 'I love the video section. Learning Python was never easier. The step-by-step tutorials helped me land my first tech job!',
      category: 'Programming',
      rating: 5,
      currentRole: 'Software Developer'
    },
    {
      id: 4,
      name: 'Priyanka Sharma',
      location: 'Mumbai',
      avatar: '/api/placeholder/80/80',
      achievement: 'UPSC Mains Qualified',
      quote: 'The comprehensive study materials and community support helped me qualify for UPSC Mains. The current affairs section is particularly helpful.',
      category: 'UPSC',
      rating: 5,
      examYear: '2024'
    },
    {
      id: 5,
      name: 'Rohit Kumar',
      location: 'Bangalore',
      avatar: '/api/placeholder/80/80',
      achievement: 'Got Placed in Microsoft',
      quote: 'The coding workshops and technical interview preparation materials were game-changers. Secured my dream job at Microsoft!',
      category: 'Tech Career',
      rating: 5,
      currentRole: 'Software Engineer at Microsoft'
    },
    {
      id: 6,
      name: 'Anita Patel',
      location: 'Gujarat',
      avatar: '/api/placeholder/80/80',
      achievement: 'Started Own Business',
      quote: 'The entrepreneurship workshops and business mentorship helped me start my own successful consultancy. Forever grateful!',
      category: 'Entrepreneurship',
      rating: 5,
      currentRole: 'Founder, TechConsult Solutions'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToPrev = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'TNPSC': 'from-blue-500 to-purple-500',
      'Banking': 'from-green-500 to-blue-500',
      'Programming': 'from-purple-500 to-pink-500',
      'UPSC': 'from-orange-500 to-red-500',
      'Tech Career': 'from-indigo-500 to-purple-500',
      'Entrepreneurship': 'from-yellow-500 to-orange-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const highlightKeywords = (text: string) => {
    const keywords = ['cleared', 'cracked', 'mentor', 'love', 'helped', 'successful', 'dream'];
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="text-yellow-300 font-semibold">${keyword}</span>`);
    });
    
    return highlightedText;
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Carousel */}
      <div 
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`bg-gradient-to-r ${getCategoryColor(testimonials[currentIndex].category)} p-8 md:p-12 text-white min-h-[400px] flex items-center`}
          >
            <div className="w-full">
              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <Quote className="w-12 h-12 text-white/30" />
              </motion.div>

              {/* Testimonial Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* User Info */}
                <motion.div 
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="relative inline-block mb-4">
                    <Image
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-white/20 shadow-lg"
                    />
                    {/* Achievement Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Star className="w-5 h-5 text-yellow-300 fill-current" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{testimonials[currentIndex].name}</h3>
                  <p className="text-white/80 mb-1">{testimonials[currentIndex].location}</p>
                  
                  {/* Category Tag */}
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {testimonials[currentIndex].category}
                  </span>
                  
                  {/* Achievement */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <h4 className="font-bold text-lg text-yellow-300 mb-1">
                      🏆 {testimonials[currentIndex].achievement}
                    </h4>
                    {testimonials[currentIndex].examYear && (
                      <p className="text-white/70 text-sm">Class of {testimonials[currentIndex].examYear}</p>
                    )}
                    {testimonials[currentIndex].currentRole && (
                      <p className="text-white/70 text-sm">{testimonials[currentIndex].currentRole}</p>
                    )}
                  </div>
                </motion.div>

                {/* Quote */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                    "<span 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightKeywords(testimonials[currentIndex].quote) 
                      }} 
                    />"
                  </blockquote>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                      ))}
                    </div>
                    <span className="text-white/80">({testimonials[currentIndex].rating}/5)</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center mt-6 space-x-4 overflow-x-auto pb-2">
        {testimonials.map((testimonial, index) => (
          <motion.button
            key={testimonial.id}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white shadow-lg scale-105'
                : 'bg-white/50 hover:bg-white/70 hover:scale-105'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-3 min-w-[200px]">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="text-left">
                <h4 className={`font-medium text-sm ${
                  index === currentIndex ? 'text-gray-800' : 'text-gray-600'
                }`}>
                  {testimonial.name}
                </h4>
                <p className={`text-xs ${
                  index === currentIndex ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {testimonial.achievement}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Auto-play Control */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isAutoPlaying
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isAutoPlaying ? '⏸️ Pause Auto-play' : '▶️ Resume Auto-play'}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">25,000+</div>
          <div className="text-gray-600">Success Stories</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
          <div className="text-gray-600">Success Rate</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
          <div className="text-gray-600">Average Rating</div>
        </motion.div>
      </div>
    </div>
  );
}