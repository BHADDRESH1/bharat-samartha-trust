'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Scale, 
  MessageCircle, 
  Shield, 
  FileText, 
  Home, 
  Users,
  BookOpen,
  Search,
  Calendar,
  AlertCircle,
  Download,
  Bot
} from 'lucide-react';

// Import components
import LegalRightsSection from '@/components/features/legal/LegalRightsSection';
import LawyerConsultation from '@/components/features/legal/LawyerConsultation';
import LegalAidSection from '@/components/features/legal/LegalAidSection';
import ConsumerRightsSection from '@/components/features/legal/ConsumerRightsSection';
import PropertyLawSection from '@/components/features/legal/PropertyLawSection';
import CaseTracker from '@/components/features/legal/CaseTracker';
import TicketPortal from '@/components/features/legal/TicketPortal';
import DocumentGenerator from '@/components/features/legal/DocumentGenerator';
import LawFinder from '@/components/features/legal/LawFinder';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export default function LegalPortalPage() {
  const [activeSection, setActiveSection] = useState<string>('rights');
  const [mounted, setMounted] = useState(false);

  const sections: Section[] = [
    {
      id: 'rights',
      title: 'Legal Rights & Schemes',
      icon: <Scale className="w-6 h-6" />,
      description: 'Know your rights and government welfare schemes',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'consultation',
      title: 'Ask a Lawyer',
      icon: <MessageCircle className="w-6 h-6" />,
      description: 'Free legal consultation and AI-powered assistance',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'legal-aid',
      title: 'Legal Aid',
      icon: <Shield className="w-6 h-6" />,
      description: 'Support for women, seniors & underprivileged groups',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'consumer',
      title: 'Consumer Rights & RTI',
      icon: <FileText className="w-6 h-6" />,
      description: 'Consumer protection and RTI filing guides',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'property',
      title: 'Property Law',
      icon: <Home className="w-6 h-6" />,
      description: 'Land ownership, inheritance & property rights',
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 'case-tracker',
      title: 'Case Tracker',
      icon: <Search className="w-6 h-6" />,
      description: 'Track your legal case progress',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'tickets',
      title: 'Query Portal',
      icon: <Users className="w-6 h-6" />,
      description: 'Submit and track legal queries',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'documents',
      title: 'Document Generator',
      icon: <Download className="w-6 h-6" />,
      description: 'Generate legal documents automatically',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'law-finder',
      title: 'Law Finder',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Find applicable laws using keywords',
      color: 'from-cyan-500 to-teal-500'
    }
  ];

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    // Animate hero section
    gsap.from('.hero-content', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    // Animate section cards
    gsap.from('.section-card', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.sections-grid',
        start: 'top 80%'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'rights':
        return <LegalRightsSection />;
      case 'consultation':
        return <LawyerConsultation />;
      case 'legal-aid':
        return <LegalAidSection />;
      case 'consumer':
        return <ConsumerRightsSection />;
      case 'property':
        return <PropertyLawSection />;
      case 'case-tracker':
        return <CaseTracker />;
      case 'tickets':
        return <TicketPortal />;
      case 'documents':
        return <DocumentGenerator />;
      case 'law-finder':
        return <LawFinder />;
      default:
        return <LegalRightsSection />;
    }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Scale className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Free Legal Consultation Portal
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                Empowering every citizen with access to justice, awareness, and legal resources
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4" />
                  <span>Civil Services Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Shield className="w-4 h-4" />
                  <span>Women & Elderly Care</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <Bot className="w-4 h-4" />
                  <span>AI-Powered Assistance</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-4"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Legal Consultations</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-4"
            >
              <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600">Cases Resolved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-4"
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Legal Documents</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-4"
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Legal Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive legal support designed for civil services aspirants and citizens from all walks of life
            </p>
          </div>

          <div className="sections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                className={`section-card p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  activeSection === section.id 
                    ? 'border-blue-500 transform scale-105' 
                    : 'border-transparent hover:border-gray-200'
                }`}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${section.color} text-white mb-4`}>
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600">
                  {section.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 font-medium">
                  <span>Explore</span>
                  <motion.div
                    animate={{ x: activeSection === section.id ? 5 : 0 }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Section Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderActiveSection()}
          </motion.div>
        </div>
      </section>

      {/* Emergency Legal Help Banner */}
      <section className="py-12 bg-red-50 border-l-4 border-red-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="text-xl font-bold text-red-800">Emergency Legal Help</h3>
                <p className="text-red-700">Need immediate legal assistance? Contact our emergency hotline.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="tel:+911800-xxx-xxxx"
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Call Now: 1800-XXX-XXXX
              </a>
              <button className="px-6 py-3 bg-white text-red-600 font-bold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-colors">
                WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}