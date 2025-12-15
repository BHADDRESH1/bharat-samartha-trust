'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';
import { safeFetch, FetchErrorFallback } from '@/lib/fetchUtils';

const WhyVolunteerSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from database
  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const result = await safeFetch('/api/vWhy');
        if (result.success && result.data) {
          setVolunteerData(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch volunteer data');
        }
      } catch (err) {
        console.error('Error fetching volunteer data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.current && volunteerData?.sectionSettings?.animationEnabled) {
      gsap.from('.benefit-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });
    }

    return () => {
      // Clean up ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [volunteerData]);

  const benefitCardVariants = {
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 }
    }
  };

  const iconAnimationVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.3, type: "spring" }
    }
  };

  // Function to get Lucide icon component by name
  const getIconComponent = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent || LucideIcons.Heart; // Fallback to Heart icon
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-white">
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

  // Don't render if section is not visible
  if (!volunteerData?.sectionSettings?.isVisible) {
    return null;
  }

  const { sectionSettings, benefitCards } = volunteerData;
  const activeCards = benefitCards?.filter(card => card.isActive)?.sort((a, b) => a.order - b.order) || [];

  return (
    <section 
      ref={sectionRef} 
      className={`py-20 ${sectionSettings.backgroundColor || 'bg-white'}`}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className={`mb-16 text-${sectionSettings.textAlignment || 'center'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            {sectionSettings.title || 'Why Become a Volunteer?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionSettings.subtitle || 'Be the change you wish to see in the world! Join a passionate community of changemakers dedicated to helping those in need.'}
          </p>
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${activeCards.length >= 4 ? 'lg:grid-cols-4' : `lg:grid-cols-${activeCards.length}`} gap-8`}>
          {activeCards.map((card, index) => {
            const IconComponent = getIconComponent(card.icon);
            
            return (
              <motion.div 
                key={index}
                className="benefit-card bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                variants={sectionSettings.animationEnabled ? benefitCardVariants : {}}
                whileHover={sectionSettings.animationEnabled ? "hover" : undefined}
              >
                <motion.div 
                  className={`w-16 h-16 ${card.bgColor || 'bg-red-100'} rounded-full flex items-center justify-center mb-6 mx-auto`}
                  variants={sectionSettings.animationEnabled ? iconAnimationVariants : {}}
                  whileHover={sectionSettings.animationEnabled ? "hover" : undefined}
                >
                  <IconComponent size={32} className={card.iconColor || 'text-red-500'} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Show message if no active cards */}
        {activeCards.length === 0 && (
          <div className="text-center text-gray-600">
            <p>No volunteer benefits configured yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyVolunteerSection;