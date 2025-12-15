'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from '@/components/features/contact/ContactForm';
import AnimatedContactVisual from '@/components/features/contact/AnimatedContactVisual';
import SocialLinks from '@/components/features/contact/SocialLinks';
import ContactInfo from '@/components/features/contact/ContactInfo';
import FloatingDonateButton from '@/components/ui/FloatingDonateButton';
import ChatbotButton from '@/components/features/ChatbotButton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize GSAP animations
  useGSAP(() => {
    // Create a timeline for staggered entrance animations
    const tl = gsap.timeline();
    
    tl.from('.fade-in-element', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
    
    // Animate the heading with a special effect
    tl.from('.heading-animation', {
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'elastic.out(1, 0.3)'
    }, '-=0.5');
  }, []);

  useEffect(() => {
    // Set loaded state after a short delay to trigger animations
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-gray-900">
      {/* Page Content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-12 max-w-7xl"
          >
            {/* Header */}
            <motion.div 
              className="text-center mb-16 fade-in-element"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="heading-animation text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
                We'd love to hear from you. Reach out and let's make a difference together.
              </p>
            </motion.div>

            {/* Main Content - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Animated Visual (replacing Interactive Map) */}
              <motion.div
                className="fade-in-element"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px]">
                  <AnimatedContactVisual />
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="fade-in-element"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-md">
                  <ContactForm />
                </div>
              </motion.div>
            </div>

            {/* Contact Info & Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Contact Information */}
              <motion.div
                className="fade-in-element"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <ContactInfo />
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="fade-in-element"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <SocialLinks />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating UI Elements */}
      <FloatingDonateButton />
      <ChatbotButton />
    </main>
  );
}