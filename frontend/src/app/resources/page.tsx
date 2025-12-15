'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  BookOpen, 
  Video, 
  Download, 
  Users, 
  Calendar,
  UserPlus,
  Search,
  Filter,
  Star,
  MessageCircle
} from 'lucide-react';

// Components
import EBookGrid from '@/components/resources/features/EBookGrid';
import VideoLectureGrid from '@/components/resources/features/VideoLectureGrid';
import CommunityForums from '@/components/resources/features/CommunityForums';
import WorkshopsSection from '@/components/resources/features/WorkshopsSection';
import MentorshipProgram from '@/components/resources/features/MentorshipProgram';
import TestimonialsCarousel from '@/components/resources/features/TestimonialsCarousel';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('ebooks');
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animation
    if (heroRef.current) {
      gsap.from('.hero-item', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
    
    // Stats animation
    if (statsRef.current) {
      gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const tabs = [
    { id: 'ebooks', label: 'Free eBooks', icon: BookOpen },
    { id: 'videos', label: 'Video Lectures', icon: Video },
    { id: 'forums', label: 'Community Forums', icon: Users },
    { id: 'workshops', label: 'Workshops', icon: Calendar },
    { id: 'mentorship', label: 'Mentorship', icon: UserPlus }
  ];

  const stats = [
    { number: '10,000+', label: 'Free Resources', icon: BookOpen, color: 'text-blue-500' },
    { number: '5,000+', label: 'Video Lectures', icon: Video, color: 'text-green-500' },
    { number: '25,000+', label: 'Active Learners', icon: Users, color: 'text-purple-500' },
    { number: '500+', label: 'Expert Mentors', icon: Star, color: 'text-orange-500' }
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section ref={heroRef} className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            className="hero-item mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-6">
              🌍 Free Resources & Community Portal
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-8">
              India's largest open platform for learning, sharing, and supporting individuals preparing for competitive exams, careers, or personal development
            </p>
          </motion.div>
          
          <motion.div
            className="hero-item flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {['UPSC', 'SSC', 'RRB', 'Bank', 'TNPSC', 'Coding', 'Life Skills'].map((tag, index) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activeTab === 'ebooks' && <EBookGrid />}
          {activeTab === 'videos' && <VideoLectureGrid />}
          {activeTab === 'forums' && <CommunityForums />}
          {activeTab === 'workshops' && <WorkshopsSection />}
          {activeTab === 'mentorship' && <MentorshipProgram />}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Hear from learners who transformed their lives through our platform
            </p>
          </motion.div>
          
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Start Your Learning Journey Today
          </motion.h2>
          
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of learners who are achieving their dreams with our free resources and community support
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-full text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              Join Community
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
              Browse Resources
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}