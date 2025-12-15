'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Briefcase, 
  FileText, 
  MessageCircle, 
  Globe, 
  GraduationCap,
  Target,
  Users,
  TrendingUp,
  Star,
  Award
} from 'lucide-react';

// Components
import JobListings from '@/components/job-guidance/features/JobListings';
import ResumeBuilder from '@/components/job-guidance/features/ResumeBuilder';
import SkillTraining from '@/components/job-guidance/features/SkillTraining';
import FreelanceOpportunities from '@/components/job-guidance/features/FreelanceOpportunities';
import CommunicationCoach from '@/components/job-guidance/features/CommunicationCoach';
import AICareerBot from '@/components/job-guidance/features/AICareerBot';
import ProgressTracker from '@/components/ui/ProgressTracker';
import StatsCard from '@/components/ui/StatsCard';

export default function JobGuidancePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero animation
    gsap.from('.hero-element', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });
    
    // Stats animation
    if (statsRef.current) {
      gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
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
    { id: 'jobs', label: 'Job Openings', icon: Briefcase },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'skills', label: 'Skill Training', icon: GraduationCap },
    { id: 'freelance', label: 'Freelancing', icon: Globe },
    { id: 'communication', label: 'Communication', icon: MessageCircle }
  ];

  const stats = [
    { icon: Users, value: '50,000+', label: 'Youth Placed', color: 'text-blue-500' },
    { icon: Briefcase, value: '15,000+', label: 'Job Openings', color: 'text-green-500' },
    { icon: Award, value: '25,000+', label: 'Certifications', color: 'text-purple-500' },
    { icon: TrendingUp, value: '85%', label: 'Success Rate', color: 'text-orange-500' }
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="hero-element"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Empowering India's
                <span className="block text-yellow-300">Youth Workforce</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="hero-element text-xl md:text-2xl mb-8 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Free job guidance, skill development, and career opportunities for graduates, 
              dropouts, and skilled workers across India
            </motion.p>
            
            <motion.div
              className="hero-element flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button 
                onClick={() => setActiveTab('jobs')}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Find Jobs Now
              </button>
              <button 
                onClick={() => setActiveTab('resume')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Build Resume
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating icons animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <div className="p-3 bg-white/10 rounded-full">
                {i % 3 === 0 && <Briefcase className="w-6 h-6" />}
                {i % 3 === 1 && <GraduationCap className="w-6 h-6" />}
                {i % 3 === 2 && <Target className="w-6 h-6" />}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <StatsCard 
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  iconColor={stat.color}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'jobs' && <JobListings />}
            {activeTab === 'resume' && <ResumeBuilder />}
            {activeTab === 'skills' && <SkillTraining />}
            {activeTab === 'freelance' && <FreelanceOpportunities />}
            {activeTab === 'communication' && <CommunicationCoach />}
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from youth who transformed their careers through our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Software Developer",
                company: "Tech Mahindra",
                story: "From unemployment to landing my dream job in just 3 months!",
                image: "/api/placeholder/80/80"
              },
              {
                name: "Rahul Kumar",
                role: "Digital Marketer",
                company: "Freelancer",
                story: "Now earning ₹40,000/month through freelancing projects.",
                image: "/api/placeholder/80/80"
              },
              {
                name: "Anjali Patel",
                role: "Customer Service",
                company: "Amazon",
                story: "Improved my communication skills and got hired immediately.",
                image: "/api/placeholder/80/80"
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.role} at {story.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{story.story}"</p>
                <div className="flex mt-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Transform Your Career?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of successful youth who found their dream jobs through our platform
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button 
              onClick={() => setActiveTab('jobs')}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Job Search
            </button>
            <button 
              onClick={() => setActiveTab('skills')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Learn New Skills
            </button>
          </motion.div>
        </div>
      </section>

      {/* AI Career Bot */}
      <AICareerBot />
      
      {/* Progress Tracker for logged-in users */}
      <ProgressTracker />
    </main>
  );
}