'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  gif?: string;
  category: string;
  isActive: boolean;
  order: number;
  createdDate: string;
  lastModified: string;
  views: number;
}

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch FAQ data from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/faq');
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch FAQs');
        }
        
        const data = result.data;
        
        // Filter active FAQs and sort by order
        const activeFaqs = data
          .filter((faq: FAQItem) => faq.isActive)
          .sort((a: FAQItem, b: FAQItem) => a.order - b.order);
        
        setFaqs(activeFaqs);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!loading && faqs.length > 0) {
      gsap.registerPlugin(ScrollTrigger);

      if (sectionRef.current) {
        gsap.from('.faq-header', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });

        gsap.from('.faq-item', {
          y: 50,
          opacity: 0,
          stagger: 0.15,
          duration: 0.6,
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    }

    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, faqs]);

  const toggleFAQ = async (index: number, faqId: string) => {
    setActiveIndex(activeIndex === index ? null : index);
    
    // Track view count when FAQ is opened
    if (activeIndex !== index) {
      try {
        await fetch(`/api/faq/${faqId}/view`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Error tracking FAQ view:', err);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FetchErrorFallback 
            message={error} 
            onRetry={() => window.location.reload()} 
            showRetry={true} 
          />
        </div>
      </section>
    );
  }

  // Empty state
  if (faqs.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">No FAQs available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="faq-header text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about volunteering with us
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="faq-list space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq._id} 
                className={`faq-item bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${activeIndex === index ? 'shadow-lg' : ''}`}
              >
                <button
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleFAQ(index, faq._id)}
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                    {faq.category && (
                      <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-purple-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 mb-4">{faq.answer}</p>
                        
                        {/* Optional GIF illustration */}
                        {faq.gif && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <Image 
                              src={faq.gif} 
                              alt="FAQ illustration" 
                              width={600} 
                              height={300} 
                              className="w-full h-auto"
                            />
                          </div>
                        )}
                        
                        {/* FAQ metadata */}
                        <div className="mt-4 text-xs text-gray-400 flex justify-between items-center">
                          <span>Views: {faq.views}</span>
                          {faq.lastModified && (
                            <span>Last updated: {new Date(faq.lastModified).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600 mb-6">Still have questions? We're here to help!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="mailto:volunteer@example.org"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </motion.a>
              <motion.a 
                href="#chat-bot"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Live Chat
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;