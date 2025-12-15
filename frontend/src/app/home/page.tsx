'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Components
import HeroVideo from '@/components/features/HeroVideo';
import FloatingDonateButton from '@/components/ui/FloatingDonateButton';
import ChatbotButton from '@/components/features/ChatbotButton';

// Home Components
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import EventsSection from '@/components/home/EventsSection';
import DailyActivitiesSection from '@/components/home/DailyActivitiesSection';
import VolunteerOpportunities from '@/components/home/VolunteerOpportunities';
import ImpactSection from '@/components/home/ImpactSection';
import FeaturedCauses from '@/components/home/FeaturedCauses';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Register ScrollTrigger plugin
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
    
    // Animation for events section
    if (eventsRef.current) {
      gsap.from('.event-card', {
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
          trigger: eventsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  if (!mounted) return null;

  return (
    <main className="overflow-hidden">
      <HeroSection />
      
      {/* Featured Upcoming Event Alert Banner - Now positioned after Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium">Next Event: Annual Charity Gala - April 15, 2025</span>
            </div>
            <Link 
              href="/events/charity-gala" 
              className="flex items-center text-white hover:text-blue-100 transition"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      <StatsSection ref={statsRef} />
      <EventsSection eventsRef={eventsRef as React.RefObject<HTMLDivElement>} />
      <DailyActivitiesSection />
      <VolunteerOpportunities />
      <ImpactSection />
      <FeaturedCauses />
      <TestimonialsSection />
      <CallToAction />
      <NewsletterSection />
      
      {/* Floating Donation Button & AI Chatbot */}
      <FloatingDonateButton />
      <ChatbotButton />
    </main>
  );
}