'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';

// Components
import HeroSection from '@/components/features/volunteers/HeroSection';
import WhyVolunteerSection from '@/components/features/volunteers/WhyVolunteerSection';
import VolunteerRolesSection from '@/components/features/volunteers/VolunteerRolesSection';
import TestimonialsSection from '@/components/features/volunteers/TestimonialsSection';
import SignupFormSection from '@/components/features/volunteers/SignupFormSection';
import ImpactTrackerSection from '@/components/features/volunteers/ImpactTrackerSection';
import TrustSection from '@/components/features/volunteers/TrustSection';
import FAQSection from '@/components/features/volunteers/FAQSection';
import FloatingDonateButton from '@/components/ui/FloatingDonateButton';
import ChatbotButton from '@/components/features/ChatbotButton';
import ConfettiEffect from '@/components/animations/ConfettiEffect';

export default function VolunteersPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  // Function to trigger confetti animation
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation for stats section
    if (statsRef.current) {
      gsap.from('.stat-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    // Animation for CTA section
    if (ctaRef.current) {
      gsap.from('.cta-element', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    }

    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // For parallax effect in CTA section
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });

  const ctaScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);

  return (
    <main className="overflow-hidden">
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
      </AnimatePresence>

      {/* Hero Section */}
      <HeroSection />

      {/* Why Volunteer Section */}
      <WhyVolunteerSection />

      {/* Impact Stats */}
      <section ref={statsRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Your Impact Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the difference our volunteers make every single day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="stat-item bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">50,000+</h3>
              <p className="text-gray-700">Volunteers Worldwide</p>
            </div>
            <div className="stat-item bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">10,000+</h3>
              <p className="text-gray-700">Hours of Service This Year</p>
            </div>
            <div className="stat-item bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-green-600 mb-2">100+</h3>
              <p className="text-gray-700">Active Projects</p>
            </div>
            <div className="stat-item bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-amber-600 mb-2">25+</h3>
              <p className="text-gray-700">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Roles Section */}
      <VolunteerRolesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Signup Form Section */}
      <SignupFormSection onSubmitSuccess={triggerConfetti} />

      {/* Impact Tracker Section */}
      <ImpactTrackerSection />

      {/* Trust & Transparency Section */}
      <TrustSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section with Parallax Effect */}
      <section ref={ctaRef} className="relative py-24 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-700 z-0"
          style={{ scale: ctaScale, opacity: ctaOpacity }}
        />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="cta-element text-4xl md:text-6xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="cta-element text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Join our global community of volunteers and be part of something bigger than yourself.
          </p>

          <div className="cta-element flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="#volunteer-signup" 
                className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg inline-block"
              >
                Become a Volunteer
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/donate" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-xl hover:bg-white/10 transition-all duration-300 inline-block"
              >
                Support Our Mission
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating UI Elements */}
      <FloatingDonateButton />
      <ChatbotButton />
    </main>
  );
}